const express = require('express')
const app = express()
const multer = require('multer');
const path = require('path');
const fs = require("fs");

const novelty = require("../fitness_modules/novelty/autoencoder/autoencoder");
novelty.loadModel();
const balance = require("../fitness_modules/balance/sketch");
const diversity = require("../fitness_modules/diversity/diversity");

const imgsFolder = path.join(__dirname, '/receivedImgs');

//TO UPLOAD IMAGES TO FOLDER
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, imgsFolder)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
//const upload = multer({ dest: 'receivedImgs/' })
const upload = multer({
    limits: { fieldSize: 1e9 }, // 1 GB
    storage: storage
})

//HTTP SERVER
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile('./index.html');
});

/*Multer does not support streaming uploads.
You might need to use a different library,
such as busboy or formidable,
which do support streaming uploads.*/
app.post('/fromExtensionServer', upload.any(), function (req, res, next) {
    console.log("files received");
    var files = req.files;
    var body = req.body
    classifyPop(body, res);

}, function (err, req, res, next) { // error handling middleware
    console.error(err);
    res.status(500).send('An error occurred');
});


app.listen(9001, async () => {
    console.log('Example app listening at http://localhost:9001')
});

//IMAGE EVALUATION

async function classifyPop(body, res) {
    console.log("classifyPop...");

    let fitnesses = [];
    var imgsInfo = JSON.parse(body.imgsInfo);
    var origText = body.origText;

    //calculate the differences between all to all images ans save them in a matrix
    //(to avoid loading all the images each time later)
    
    let rmseMatrix = await diversity.calculateRmseMatrix(imgsFolder);

    //fitnesses
    for (let i = 0; i < imgsInfo.length; i++) {
        let fileName = imgsInfo[i].fileName;
        //let origText = imgsInfo[i].origText;

        fitnesses.push(new Promise(async resolve => {
            let fitnessMetrics = [
                classifyNovelty(fileName),
                classifyBalance(fileName),
                classifyLegibility(fileName, origText),
                diversity.calculatePenalty(fileName, rmseMatrix.filenames, rmseMatrix.rmseMatrix),
                classifyAllWithGPT(fileName, origText) // GPT evaluation
            ];
            await Promise.all(fitnessMetrics).then(values => {
                fs.unlink(imgsFolder + "/" + fileName, err => { if (err) throw err; });
                resolve({
                    imgName: fileName,
                    novelty: values[0],
                    balance: values[1],
                    legibility: values[2],
                    fileNameWithoutExt: imgsInfo[i].fileNameWithoutExt,
                    fileNumber: imgsInfo[i].fileNumber,
                    pag: imgsInfo[i].pag,
                    diversityPenalty: values[3],
                    allWithGPT: values[4], 
                });
            }).catch((error) => {
                console.error(error.message);
                res.status(500).send({ error: error.message });
            });
        }));
    }

    //console.log("Promise.all(fitnesses)")
    Promise.all(fitnesses).then(values => {
        console.log("");
        console.log("Finished evalution of all posters");

        res.send({
            type: 'fitness',
            content: values,
        })
    }).catch((error) => {
        console.error(error.message);
        res.status(500).send({ error: error.message });
    });

    console.log("")
}

function classifyNovelty(fileName) {
    return new Promise((resolve, reject) => {
        novelty.classify(imgsFolder + "/" + fileName).then(r => {
            let MSE = r.fitness;
            let maxMSE = Math.pow(255, 2);
            let nomalizedMSE = MSE / maxMSE

            console.log("classifyNovelty finished: " + fileName, nomalizedMSE);
            resolve(nomalizedMSE);
        }).catch(error => {
            console.error("Error in classifyNovelty for file: " + fileName, error);
            reject(error);
        });
    })
}

function classifyBalance(FileName) {
    return new Promise(async (resolve, reject) => {
        let val = await balance.evaluateBalance(imgsFolder + "/" + FileName, FileName);

        if (!val || !val.fitness75_25) {
            reject(new Error("Invalid value in classifyBalance for file: " + FileName));
        } else {
            console.log("classifyBalance finished " + FileName, val.fitness75_25)
            resolve(val.fitness75_25);
        }
    })
}

function classifyLegibility(fileName, origText) {
    return new Promise((resolve, reject) => {
        let data = {
            fileName: fileName,
            orig_text: origText
        }
        fetch("http://127.0.0.1:5001/legibility", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(r => {
            if (!r.ok) {
                throw new Error(`HTTP error! status: ${r.status}`);
            }
            return r.json();
        }).then(r => {
            console.log("classifyLegibility finished " + fileName, r.result)
            //resolve(r.result.perc); //string_distance
            resolve(r.result); //string_distance2
        }).catch(error => {
            console.error("Error in classifyLegibility for file: " + fileName, error);
            reject(error);
        });
    })
}

function classifyAllWithGPT(fileName, origText) {
    return 
    return new Promise((resolve, reject) => {
        fetch('http://localhost:9004/classify_poster', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName, origText })
        }).then(r => r.json()).then(data => {
            console.log("classifyAllWithGPT finished " + fileName, data)
            resolve(data)
        })
    })
}   