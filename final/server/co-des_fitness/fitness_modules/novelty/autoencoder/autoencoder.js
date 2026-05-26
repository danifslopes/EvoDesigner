const a = require("./architectures.js"), tf = require('@tensorflow/tfjs-node'),
    path = require('path'), fs = require('fs'), c = require('../../../getImagesFromWeb/canvasLibrary'),
    chart = require('asciichart');
//let bestmodelpath = 'file://model_16_1613262686980/model.json';
let bestmodelpath = 'file://../fitness_modules/novelty/autoencoder/saved/ijcai_model/model.json';


const {loadImage} = require('canvas');
let io;

async function setIO(io_socket) {
    io = io_socket;
}

let autoencoder, dataNames = [], testdataNames = [], data = [], testdata = [];
let numDataFiles, numTrainDataFiles;

const architectureName = 25,
    architecture = a.archis[architectureName],
    numEpochs = 10000, batchSize = 100,
    defaultKnown = 2, defaultUnknown = 0,
    dataFolder = "../trainingVis/public/images/", //"../trainingVis/public/images/",
    testDataFolder = "../trainingVis/public/images/test/";

//P5
let img, predictedKnown = [], predictedUnknown = [], pixelW;

async function loadImagem(imgName) {

    const desk = fs.readFileSync(imgName);
    //return await tf.node.decodeJpeg(desk, 3);
    const buf = Buffer.from(desk);
    const imageArray = new Uint8Array(buf);

    /*let ext = imgName.split(".");
    ext = ext[ext.length - 1].toLowerCase();

    return ext === "jpg" ?
        await tf.node.decodeJpeg(imageArray, 3) :
        await tf.node.decodePng(imageArray, 3);*/

    //o canvas esta a exportar png. a extenção das imagens é que esta errada
    return await tf.node.decodePng(imageArray, 3);
}

async function loadAllImagesInDir(directory, dataType) {
    for (const file of fs.readdirSync(directory)) {
        if (fs.lstatSync(path.resolve(directory, file)).isDirectory()) {
            console.log('Directory: ' + file);
        } else {
            console.log('File: ' + file);
            let ext = file.split(".");
            ext = ext[ext.length - 1].toLowerCase();
            if (['jpg', 'png'].includes(ext)) {
                let array, arrayName;
                if (dataType === "data") {
                    array = data;
                    arrayName = dataNames;
                } else {
                    array = testdata;
                    arrayName = testdataNames;
                }

                array.push(await loadImagem(directory + file));
                arrayName.push(file);
            }
        }
    }

    numDataFiles = data.length;
    numTrainDataFiles = testdata.length;
}

async function loadData() {
    console.log("loading data auto");
    await io.emit("log", "loading data auto");
    data = [];
    testdata = [];

    //data
    await loadAllImagesInDir(dataFolder, "data");
    //test data
    await loadAllImagesInDir(testDataFolder, "testdata");

    console.log("datalength:", data.length);
    console.log("testdatalength:", testdata.length);

    return await Promise.all([...data, testdata]).then(() => {
        return data;
    })
}

//create model
async function createAutoencoder() {
    console.log("creating autoencoder model");
    await io.emit("log", "creating autoencoder model");
    const model = tf.sequential();

    console.log("   defining architecture");
    await io.emit("log", "   defining architecture");
    architecture(model);

    console.log("   compiling model");
    await io.emit("log", "   compiling model");
    model.compile({optimizer: 'adam', loss: 'meanSquaredError'});
    /*model.compile({
        optimizer: 'adam', loss: function (img1, img2) {
            img1 = c.renderTensor(img1);
            img2 = c.renderTensor(img2);
            const {mssim, performance} = s.ssim(img1, img2);
            return mssim;
        }
    });*/

    await io.emit("log", "model ready");
    model.summary();
    autoencoder = model;
}

async function augmentBatch(batch) {
    let newBatch = [];
    for (let i of batch) {
        let img = await tf.node.encodePng(i);
        let int8img = c.randomMutation(i);
        const t = tf.tensor3d(int8img, [200, 200, 3])
        newBatch.push(t)
    }
    return newBatch;
}

function saveTrainingFiles() {
    let lossCSV = JSON.stringify(history).replace(/,/g, "\n").replace(/[ \[\] ]/g, "");
    fs.writeFile(newfolder + '/loss_model' + architectureName + '_' + Date.now() + '.csv', lossCSV, err => {
        if (err) return console.log(err);
        console.log('Created loss.csv');
    });
    saveModel(newfolder);
}

//train
let newfolder, history, thisEpoch = 0;

async function train() {
    console.log("training");
    await io.emit('log', "training");
    newfolder = '../autoencoder/saved/model' + architectureName + '_' + Date.now();
    if (!fs.existsSync(newfolder)) fs.mkdirSync(newfolder);

    const dataTensor = tf.stack(data);
    let result, history = [];
    const summaryWriter = tf.node.summaryFileWriter(newfolder);

    result = await autoencoder.model.fit(dataTensor, dataTensor, {
            epochs: numEpochs, //vezes que treina no data set inteiro
            batchSize: batchSize, //Number of samples per gradient update -> calcula o erro a partir da media de x samples
            shuffle: true,
            callbacks: [
                /*tf.callbacks.earlyStopping({
                    monitor: 'loss',
                    minDelta: 0, //Minimum change to qualify as improvement
                    patience: 20, //Number of epochs with no improvement after which training will be stopped
                    mode: 'auto' //min -> stopped decreasing, max stopped increasing, auto -> any
                }),*/
                //tf.node.tensorBoard('../autoencoder/logs'),
                new tf.CustomCallback({
                    onEpochEnd: (epoch, logs) => {
                        console.log("onEpochEnd", epoch, logs);

                        //chart
                        thisEpoch = epoch;
                        history.push(logs.loss);
                        let h2 = history.length > 100 ? history.filter((v, i) => {
                            return i > history.length - 1 - 100
                        }) : history;
                        console.log(chart.plot(h2, {height: 15}));

                        predictDefaults();
                    }
                })
            ]
            //validationSpit: 0.1 //parte do batch que vai ser usado para ver se a rede consegue generalizar.
            // a rede nao é treinada com este bocado. a valudação nao faz nada aos pesos nem a nada.
            //é so para sabermos de a rede é capaz de generalizar.
        }
    );

    //log
    console.log("loss:", result.history.loss);
    await io.emit('loss', result.history.loss);

    //save training files
    summaryWriter.scalar('loss', 10, 0);
    let lossCSV = JSON.stringify(result.history.loss).replace(/,/g, "\n").replace(/[ \[\] ]/g, "");
    fs.writeFile(newfolder + '/loss_model' + architectureName + '_' + Date.now() + '.csv', lossCSV, function (err) {
        if (err) return console.log(err);
        console.log('Created loss.csv');
    });

    fs.writeFile(newfolder + '/settings' + architectureName + '_' + Date.now() + '.txt',
        "EpochsRun: " + thisEpoch + " batchSize: " + batchSize + " dataSize: " + data.length,
        function (err) {
            if (err) return console.log(err);
            console.log('Created settings.txt');
        });

    tf.dispose(dataTensor);
    return result;
}

async function trainWithAug() {
    console.log("training");
    await io.emit('log', "training");
    newfolder = '../autoencoder/saved/model' + architectureName + '_' + Date.now();
    if (!fs.existsSync(newfolder)) fs.mkdirSync(newfolder);

    //const dataTensor = tf.stack(data);
    history = [];
    let result;
    const summaryWriter = tf.node.summaryFileWriter(newfolder);

    let h = 0;
    for (let i = 0; i < numEpochs; i++) {
        let dataTemp = data.slice(), j = 0;
        while (dataTemp.length > 0) {
            let batch = dataTemp.splice(0, batchSize);
            let augmentedBatch = await augmentBatch(batch);

            const dataTensor = tf.stack(batch);
            const augmentedDataTensor = tf.stack(augmentedBatch);

            result = await autoencoder.model.trainOnBatch(augmentedDataTensor, dataTensor);
            console.log("Epoch " + i + " batch " + j + " loss: " + result);
            history.push(result);
            tf.dispose(dataTensor);
            j++;

            let h2 = history.length > 100 ? history.filter((v, i) => {
                return i > history.length - 1 - 100
            }) : history;
            console.log(chart.plot(h2, {height: 15}));
        }

        await io.emit('log', result);
        await predictDefaults();

    }

    console.log("loss:", history);
    await io.emit('loss', history);

    /*result = await autoencoder.model.fit(dataTensor, dataTensor, {
         epochs: numEpochs, //vezes que treina no data set inteiro
         batchSize: batchSize, //Number of samples per gradient update -> calcula o erro a partir da media de x samples
         shuffle: true,
         callbacks: [
             tf.callbacks.earlyStopping({
                 monitor: 'loss',
                 minDelta: 10, //Minimum change to qualify as improvement
                 patience: 5, //Number of epochs with no improvement after which training will be stopped
                 mode: 'auto' //min -> stopped decreasing, max stopped increasing, auto -> any
             }),
             tf.node.tensorBoard('../autoencoder/logs'),
             new tf.CustomCallback({
                 onEpochEnd: (epoch, logs) => {
                     console.log("onEpochEnd", epoch, logs);
                     io.emit('log', "loss: " + logs.loss);
                     predictDefaults();
                 }
             })
         ]
         //validationSpit: 0.1 //parte do batch que vai ser usado para ver se a rede consegue generalizar.
         // a rede nao é treinada com este bocado. a valudação nao faz nada aos pesos nem a nada.
         //é so para sabermos de a rede é capaz de generalizar.
     }
 );*/
    /*console.log("loss:", result.history.loss);
    await io.emit('loss', result.history.loss);
    summaryWriter.scalar('loss', 10, 0);

    let lossCSV = JSON.stringify(result.history.loss).replace(/,/g, "\n").replace(/[ \[\] ]/g, "");
    fs.writeFile('public/loss_' + Date.now() + '.csv', lossCSV, function (err) {
        if (err) return console.log(err);
        console.log('Created loss.csv');
    });

        tf.dispose(dataTensor);
    */

    saveTrainingFiles();

    return result;
}

function retrain() {
    createAutoencoder.then(train);
}

function stopTraining() {
    autoencoder.model.stopTraining_ = true;
    io.emit("log", "stopped training");
}

async function loadModel() {
    console.log("loadModel");
    autoencoder = await tf.loadLayersModel(bestmodelpath);
}

//predict
async function predict(xs) {
    let outputs = await autoencoder.model.predict(xs); //let outputs = model.predict(xs).dataSync();
    let results = await outputs.dataSync();
    return results;
}

/*async function classify(url) {
    let r = -1;

    await loadImage(url).then(img => {
        //meter imagem em fundo preto
        c.ImgToSquaredPNG(img).then(async png => {

            //passar imagem para tensor
            const buf = Buffer.from(png);
            const imageArray = new Uint8Array(buf);
            let xs = await tf.node.decodePng(imageArray, 3);

            //classificar
            let ys = await await predict(xs);
            r = await model.evaluate(xs, ys);

        });
    }).catch(err => {
        console.log("classify(url) -> Error on loading image:", err)
    })

    return r;
}*/

async function classify(url) {
    //await loadModel();
    let r = -1;

    await loadImage(url).then(async img => {
        //meter imagem em fundo preto
        await c.ImgToSquaredPNG(img).then(async png => {

            url = url.replace(".png", "_framed.png");

            await c.saveImageToDisk(png, url);

            //passar imagem para tensor
            const desk = fs.readFileSync(url);

            // Delete the file after reading
            try {
                await fs.promises.unlink(url);
            } catch (err) {
                console.error("Error deleting file:", err);
            }

            const buf = Buffer.from(desk);
            const imageArray = new Uint8Array(buf);
            let xs = await tf.node.decodePng(imageArray, 3);

            //classificar
            xs = tf.stack([xs]);
            let outputs = await autoencoder.predict(xs); //let outputs = model.predict(xs).dataSync();
            let results = await outputs; //.dataSync();

            let lastXs = xs.reshape([120000]);
            let lastYs = results.reshape([120000]);

            //r = await autoencoder.evaluate(lastXs, lastYs); //loss

            const mse = tf.metrics.meanSquaredError(lastXs, lastYs);
            r = mse.dataSync()
        });
    }).catch(err => {
        console.log("classify(url) -> Error on loading image:", err)
    })

    return {fitness:r[0], imgURL: url};
}

//para classificar as imagens ja quadradas, colocadas manuualmente em:
// /Applications/MAMP/htdocs/tenserflow/co-des_fitness/api/receivedImgs
async function classifySquared(url) {
    //await loadModel();
    let r = -1;
    await loadImage(url).then(async img => {
        //meter imagem em fundo preto
        await c.SquaredImgToPNG(img).then(async png => {

            await c.saveImageToDisk(png, url);

            //passar imagem para tensor
            const desk = fs.readFileSync(url);
            const buf = Buffer.from(desk);
            const imageArray = new Uint8Array(buf);
            let xs = await tf.node.decodePng(imageArray, 3);

            //classificar
            xs = tf.stack([xs]);
            let outputs = await autoencoder.predict(xs); //let outputs = model.predict(xs).dataSync();
            let results = await outputs; //.dataSync();

            let lastXs = xs.reshape([120000]);
            let lastYs = results.reshape([120000]);

            //r = await autoencoder.evaluate(lastXs, lastYs); //loss
            const mse = tf.metrics.meanSquaredError(lastXs, lastYs);
            r = mse.dataSync()
        });
    }).catch(err => {
        console.log("classify(url) -> Error on loading image:", err)
    })
    return {fitness:r, imgURL: url};
}

async function predictKnown(i, doemit = true) {
    knownIndex = i;
    let xs = tf.stack([data[i]]);
    predictedKnown = await predict(xs);
    tf.dispose(xs);

    if (doemit) await io.emit('predictedKnown', {fileName: dataNames[i], prediction: predictedKnown});
}

async function predictImgURL(url) {

    let img = await loadImagem(url);
    let xs = tf.stack([img]);
    let fitness = await predict(xs);
    tf.dispose(xs);

    return fitness;
}

async function predictUnknown(i, doemit = true) {
    unknownIndex = i;
    let xs = tf.stack([testdata[i]]);
    predictedUnknown = await predict(xs);
    tf.dispose(xs);

    if (doemit) await io.emit('predictedUnknown', {fileName: testdataNames[i], prediction: predictedUnknown});
}

async function predictKnownAndSave(i) {
    await predictKnown(i);
    requestAnimationFrame(saveCanvasAsJPG);
}

async function predictUnknownAndSave(i) {
    await predictUnknown(i);
    requestAnimationFrame(saveCanvasAsJPG);
}

async function predictDefaults() {
    await predictKnown(defaultKnown, false);
    await predictUnknown(defaultUnknown, false);
    await io.emit('prediction', [
        {fileName: dataNames[defaultKnown], prediction: predictedKnown},
        {fileName: testdataNames[defaultUnknown], prediction: predictedUnknown}
    ]);
}

//not working
async function predictAndSaveAll() {
    for (let i = 0; i < numDataFiles; i++) {
        await predictKnownAndSave(i);
    }
    for (let i = 0; i < numTrainDataFiles; i++) {
        await predictUnknownAndSave(i);
    }
}

async function saveModel(folder = "../autoencoder/saved") {
    await autoencoder.save('file://' + folder + '/model_' + architectureName + '_' + Date.now());
    await io.emit("log", "model saved");
}

//loadData().then(createAutoencoder)
/*.then(train).then(async (r) => {
    await autoencoder.save('downloads://noveltyAutoencoder_' + architectureName);

    //predictKnown(0);
    //predictUnknown(0);
    saveCanvasAsJPG();

    //await predictAndSaveAll();
});*/

module.exports = {
    'setIO': setIO,
    'loadData': loadData,
    'createAutoencoder': createAutoencoder,
    'train': train,
    'stopTraining': stopTraining,
    'predictKnown': predictKnown,
    'predictUnknown': predictUnknown,
    'predictKnownAndSave': predictKnownAndSave,
    'predictUnknownAndSave': predictUnknownAndSave,
    'saveModel': saveModel,
    'predictDefaults': predictDefaults,
    'retrain': retrain,
    'loadModel': loadModel,
    'classify': classify,
    'classifySquared': classifySquared,
    'loadImagem': loadImagem,
    'predictImgURL': predictImgURL
};