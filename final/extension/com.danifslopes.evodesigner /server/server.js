/*var seedrandom = require('seedrandom');
seedrandom('d5', {
  global: true
});*/

var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.json());
var FormData = require('form-data');

/*var socketExtension = require('socket.io')();
socketExtension.listen(3200);
var ss = require('socket.io-stream');*/

var http = require('http');
const ioclient = require("socket.io-client");
var fetch = require("node-fetch");
const path = require('path');
const math = require('mathjs')

const ssim2 = require("image-ssim");
const mse = require("image-mse");
const {
  channel
} = require('diagnostics_channel');

const PNG = require('pngjs').PNG;
const {
  resolve
} = require('path/posix');

var saved_elite = [];
var elite_size;
var fitnessWaitingToBeSent = false;
var connected = false;
var repeatEvaluation = false;
var fstConnection = true;

var gen = 1;
var imgIndex = 0;
var evaluationInProgress = false;
var global_res;

var metricWeights = {
  novelty: 1,
  balance: 1,
  legibility: 1,
  std: .1
}

app.use(express.static('public')); //app.use(express.static(__dirname + 'public'));

app.get('/', function (req, res) {
  res.send('Extension Server Running')
})

app.post('/fromExtension', function (req, res) {
  global_res = res;
  //res.status(200).send({status: 0, message: "Messages available"});
  //res.send(req.body);
  var msg = req.body;
  if (msg.type == "onPopExported") sendExportedPopToFitnessServer(msg, res);
  else if (msg.type == "checkNumPNGsInPopFolder") checkNumPNGsInPopFolder(msg, res);
  else if (msg.type == "clearPopFolder") clearPopFolder(msg, res);
})





/*function forEachPNGInDir(directory, callback) {
  let i = 0;
  for (const file of fs.readdirSync(directory))
    if (!fs.lstatSync(path.resolve(directory, file)).isDirectory()) { //se nao for uma pasta
      let fileName = file.split(".");
      let ext = fileName[fileName.length - 1].toLowerCase();
      if (ext === 'png') callback(file, i);
      i++
    }
}*/
function forEachPNGInDir(directory, callback) {
  let i = 0;
  for (const fileName of fs.readdirSync(directory)) {
    if (!fs.lstatSync(path.resolve(directory, fileName)).isDirectory()) {
      if (path.extname(fileName).toLowerCase() === '.png') {
        callback(fileName, i);
        i++;
      }
    }
  }
}

/*
function clearPopFolder(msg, res) { //acho que isto ainda nao da porque ele morre quando evolui com coisas na pasta
  console.log("server: clearPopFolder")
  var directory = __dirname + "/public/current_pop";
  var promisses = [];

  forEachPNGInDir(directory, file => {
    fs.unlinkSync(directory + "/" + file, err => {
      if (err) throw err
      //else console.log("Deleted " + file + " before init")
    });
  });

  res.send({
    content: "OK"
  });

  gen = 1;
}*/
function clearPopFolder(msg, res) {
  console.log("server: clearPopFolder");
  var directory = path.join(__dirname, "/public/current_pop");

  forEachPNGInDir(directory, file => {
    let filePath = path.join(directory, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        // console.log("Deleted " + file + " before init")
      } catch (err) {
        console.error("Error deleting file: " + err.message);
      }
    } else {
      console.log("File does not exist: " + filePath);
    }
  });

  res.send({
    content: "OK"
  });

  gen = 1;
}

/*
function checkNumPNGsInPopFolder(msg, res) {
  console.log("3.2 - Server: Checking that all file are in folder");

  var directory = __dirname + "/public/current_pop";
  var numPNGS = 0;
  var promisses = [];

  forEachPNGInDir(directory, file => {
    promisses.push(new Promise(function (resolve) {
      fs.access(directory + "/" + file, fs.constants.R_OK, (err) => {
        if (err) console.log(err)
        else numPNGS++;
        resolve();
      });
    }))
  });

  Promise.all(promisses).then(function (r) {
    res.send({
      numPNGs: numPNGS
    });
  })
}*/
function checkNumPNGsInPopFolder(msg, res) {
  console.log("3.2 - Server: Checking that all file are in folder");

  var directory = path.join(__dirname, "/public/current_pop");
  var numPNGS = 0;

  var promises = [];

  forEachPNGInDir(directory, file => {
    promises.push(new Promise((resolve, reject) => {
      fs.access(path.join(directory, file), fs.constants.R_OK, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          numPNGS++;
          resolve();
        }
      });
    }));
  });

  Promise.all(promises)
    .then(() => res.send({ numPNGs: numPNGS }))
    .catch(console.error);
}


function fetchWithTimeout(url, options, timeout = 20000) {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) =>
      setTimeout(() => {
        reject(new Error('ExtServer says: EvalServer taking too long'))
      }, timeout)
    )
  ]);
}

function fetchFitnessServer(form, callback, res) {
  //let url = "http://localhost:9001";
  let url = "http://bumblebee.dei.uc.pt:9001";
  console.log("fetchFitnessServer");

  fetch(url + "/fromExtensionServer", {
    method: 'POST',
    body: form
  })
    .then(r => r.json())
    .then(r => {
      if (r && r.content) {
        console.log("r && r.content")
        callback(r.content);
      } else {
        console.log("r && r.content is false!!!")
        logToUser('r && r.content is false');
        callback(null);
      }
    })
    .catch(error => {
      logToUser(error);
      console.log(error);
      callback(null);
    });
}



/*
function fetchFitnessServer(form, resolve, res) {
  //console.log("fetchFitnessServer");
  //let url = "http://codes.dei.uc.pt:9001"; 
  let url = "http://localhost:9001";

  console.log("fetchFitnessServer");
  console.log(form);

  fetch(url + "/fromExtensionServer", {
    method: 'POST',
    body: form //JSON.stringify(form)
  }).then(r => r.json()).then(r => {
    console.log("got a result...")
    resolve(r.content);
  }).catch(error => {
    console.log('An error occurred in the server:', error);
    res.send({
      type: 'cancel',
      content: { msg: 'An error occurred in the server: ' + error.message }
    })
  });

}*/

function sendExportedPopToFitnessServer(msg, res) {
  console.log("5 - Server: Classifying pop");

  fitnessWaitingToBeSent = true;
  evaluationInProgress = true;

  var msg_content = msg.content;
  var current_pop_dir = msg_content.curr_pop_dir;
  elite_size = msg_content.elite_size;

  var pop_size = msg_content.pop_size;
  var fst_pop_pag = msg_content.fst_pop_pag;

  //ir buscar as imagens à pasta current_pop_dir
  current_pop_dir = current_pop_dir.replace("%20", " ");
  var directory = __dirname + "/public/current_pop";

  //ler ficheiro com texto original dos posters
  let rawdata = fs.readFileSync(directory + '/origText.json');
  let origText = JSON.parse(rawdata);
  //console.log(origText)

  //FORM
  let data = [];
  var form = new FormData({
    //maxDataSize: 4294967296 //4G in bytes
  });

  forEachPNGInDir(directory, (file, i) => {
    //File name / number
    let fileName = file.replace(".png", "");
    let fileNumber = fileName.replace("e_", "").replace("o_", "");
    fileNumber = Number(fileNumber);

    if (fileNumber === 0) fileNumber = 1;
    if (file.indexOf("o_") > -1) fileNumber += elite_size;
    var pag = Number(fst_pop_pag) + (fileNumber - 1)

    //file stream
    let stream = fs.createReadStream(directory + "/" + file);
    stream.on("error", err => console.log(err));
    stream.on("end", (v) => { });
    form.append('imgFile', stream);

    if (fileNumber <= pop_size) { //para nao avaliar pngs que estejam pasta por causa de evoluções anteriores p.e. o_23.png
      let imgData = {
        fileName: file,
        fileNameWithoutExt: fileName,
        fileNumber: fileNumber,
        pag: pag,
        index: i,
        gen: msg_content.gen,
        //origText: origText[pag]
      }

      data.push(imgData);
    }
  });

  form.append('origText', origText.all);
  form.append('directory', directory);
  form.append('imgsInfo', JSON.stringify(data));

  fetchFitnessServer(form, fitnesses => {
    if (fitnesses != null) {
      treatFitnessValues(fitnesses, res);
    } else {
      console.log("send cancel")
      res.send({
        type: 'cancel',
        content: { msg: 'An error occurred :s' }
      });
    }
  }, res);
}

function sendExportedPopToFitnessServer_mse(msg, res) {
  console.log("5 - Server: Classifying pop");

  fitnessWaitingToBeSent = true;
  evaluationInProgress = true;

  var msg_content = msg.content;
  var current_pop_dir = msg_content.curr_pop_dir;
  var elite_size = msg_content.elite_size;
  var pop_size = msg_content.pop_size;
  var fst_pop_pag = msg_content.fst_pop_pag;

  //ir buscar as imagens à pasta current_pop_dir
  current_pop_dir = current_pop_dir.replace("%20", " ");
  var directory = __dirname + "/public/current_pop";
  var recordDirectory = __dirname + "/records";
  var streams = [];
  var fitnesses = [];
  var promisses = [];


  //send images to classification
  forEachPNGInDir(directory, file => {

    console.log("evaluating " + file);
    /*//criar stream para cada imagem 
    var stream = ss.createStream();
    streams.push({ stream: stream, metadata: { name: file } });
    let rs = fs.createReadStream(directory + "/" + file).pipe(stream);
    //eliminar a imagem depois de enviada
    rs.on('end', () => {
      fs.unlink(directory + "/" + file, err => {
        if (err) throw err; else console.log("Deleted " + file)
      });
    })*/

    //Files in folder:
    //e_01.png //(elite)
    //e_02.png
    //o_01.png //(other; not elite)
    //o_02.png
    //o_03.png

    //File name / number
    let fileName = file.replace(".png", "");
    let fileNumber = fileName.replace("e_", "").replace("o_", "");
    fileNumber = Number(fileNumber);
    if (fileNumber === 0) fileNumber = 1;
    if (file.indexOf("o_") > -1) fileNumber += elite_size;
    var pag = Number(fst_pop_pag) + (fileNumber - 1)


    if (fileNumber <= pop_size) { //para nao avaliar pngs que estejam pasta por causa de evoluções anteriores p.e. o_23.png
      promisses.push(new Promise(function (resolve) {
        //MSE
        loadIM(__dirname + "/targets_mse/ref.png", directory + "/" + file, function (images) {
          var res = mse.compare(images[0], images[1]);
          var res2 = ssim2.compare(images[0], images[1]);
          fitnesses.push({
            imgName: file,
            fileNameWithoutExt: fileName,
            fileNumber: fileNumber,
            //mse: res.mse,
            //psnr: res.psnr,
            //ssim: res2.ssim,
            //mcs: res2.mcs,
            fitness: -res.mse,
            pag: pag
          });
          resolve(res);
        });

      }));
    }
  });

  //after all are classified
  Promise.all(promisses).then(function (r) {
    console.log("promissed all");
    console.log("elite_size " + elite_size);
    console.log("fitnesses " + fitnesses.length);

    //SORT POP BY FITNESS
    //primeiro a fitness maior
    fitnesses.sort(function (a, b) {
      return a.fitness < b.fitness ? 1 : -1
    });
    saved_elite = [];
    if (fitnesses.length < elite_size) {
      console.error("fitnesses.length<elite_size");
      res.send({
        type: 'cancel',
        content: { msg: "fitnesses.length<elite_size" }
      });
      return
    }
    for (let i = 0; i < elite_size; i++) {
      saved_elite.push(fitnesses[i].fileNameWithoutExt)
    }

    //DELETE / RENAME FILES
    forEachPNGInDir(directory, file => {
      let fileName = file.replace(".png", "");

      //delete if not elite
      if (!saved_elite.includes(fileName)) {
        try {
          fs.unlinkSync(directory + "/" + fileName + ".png");
          console.log("Deleted " + fileName + ".png")
        } catch (e) {
          console.error("Could not delete file " + fileName + ".png. Error:" + e);
          res.send({
            type: 'cancel',
            content: { msg: "Could not delete file " + fileName + ".png. Error:" + e }
          });
          return
        };

        //temporary name is elite
      } else {
        //save a copy
        fs.copyFileSync(
          directory + "/" + fileName + ".png",
          recordDirectory + "/" + Date.now() + "_" + imgIndex + "_gen" + gen + ".png"
        );
        imgIndex++;

        //rename
        try {
          fs.renameSync(directory + "/" + fileName + ".png", directory + "/" + fileName + "_temp.png");
          console.log("Renamed " + fileName + ".png")
        } catch (e) {
          console.error("Could not rename file " + fileName + ".png. Error:" + e);
          res.send({
            type: 'cancel',
            content: { msg: "Could not rename file " + fileName + ".png. Error:" + e }
          });
          return
        };

      }
    });

    //rename elite to match the pop to come
    for (var i = 0; i < saved_elite.length; i++) {
      var j = i + 1;
      var n = j == 1 ? 0 : j;
      var newName = "e_" + n;
      try {
        fs.renameSync(directory + "/" + saved_elite[i] + "_temp.png", directory + "/" + newName + ".png");
        console.log("renamed: " + saved_elite[i] + "_temp.png" + " to " + newName + ".png");
      } catch (e) {
        console.error("Could not rename file " + fileName + ".png. Error:" + e);
        res.send({
          type: 'cancel',
          content: { msg: "Could not delete file " + fileNameWithoutExt + ".png. Error:" + e }
        });
        return
      };

    }

    //SEND FITNESS BACK
    console.log("server: trying to send fitness values back to extension");

    sendFitnessValuesToBackExtension(fitnesses, res);

    /*if (connected) {
      sendFitnessValuesToBackExtension(fitnesses);
      fitnessWaitingToBeSent = false;
      console.log("server: fitness has been sent");
    } else {
      repeatEvaluation = true;
      console.log("server: Not connected. Could not send fitness back. Waiting connection to repeat.")
    }*/

    evaluationInProgress = false;
    gen++;
  })

}

function treatFitnessValues(fitnesses, res) {
  console.log("fitnesses received all");

  logToUser("Evaluation values received. Processing values...");

  console.log(fitnesses)
  console.log("elite_size " + elite_size);
  console.log("fitnesses " + fitnesses.length);


  //CALC FINAL FITNESSES

  //FITNESS TARGETs: target_novelty, target_balance... if at least that value, equals 1 for that metric... 
  /*fitnesses.map(a => {
    //totalWeights é para o total ser sempre 100% (se uma metrica tem menos importancia, as outras ficam com a importancia dela)
    let soma = (a.novelty * metricWeights.novelty) + (a.balance * metricWeights.balance) + (a.legibility * metricWeights.legibility);
    let totalWeights = metricWeights.novelty + metricWeights.balance + metricWeights.legibility;
    let avg = 1;
    if (totalWeights > 0) avg = soma / totalWeights;

    //para penalisar se diferença entre metricas é muita
    let target_novelty = Math.min(a.novelty / metricWeights.novelty, 1); //se novelty so for 30% importante, de 30 para cima o fitness é 1
    let target_balance = Math.min(a.balance / metricWeights.balance, 1);
    let target_legibility = Math.min(a.legibility / metricWeights.legibility, 1);
    let std = math.std(target_novelty, target_balance, target_legibility);

    a.fitness = avg - (std * metricWeights.std);
  });*/

  //SORT POP BY FITNESS
  //primeiro a fitness maior
  fitnesses.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });

  saved_elite = [];
  if (fitnesses.length < elite_size) {
    console.error("fitnesses.length<elite_size");
    res.send({
      type: 'cancel',
      content: { msg: 'fitnesses.length<elite_size' }
    });
    return
  }
  for (let i = 0; i < elite_size; i++) {
    saved_elite.push(fitnesses[i].fileNameWithoutExt)
  }

  //DELETE / RENAME FILES
  var directory = __dirname + "/public/current_pop";
  var recordDirectory = __dirname + "/records";
  forEachPNGInDir(directory, fileName => {
    let fileNameWithoutExt = fileName.replace(".png", ""); //remove extension from file name

    //delete if not elite...
    if (!saved_elite.includes(fileNameWithoutExt)) {
      try {
        fs.unlinkSync(directory + "/" + fileNameWithoutExt + ".png");
        console.log("Deleted " + fileNameWithoutExt + ".png")
      } catch (e) {
        console.error("Could not delete file " + fileNameWithoutExt + ".png. Error:" + e);
        res.send({
          type: 'cancel',
          content: { msg: "Could not delete file " + fileNameWithoutExt + ".png. Error:" + e }
        });
        return
      };
    }

    //if it's elite...
    else {
      //save a copy in another folder
      /*fs.copyFileSync(
        directory + "/" + fileNameWithoutExt + ".png",
        recordDirectory + "/" + imgIndex + "_gen" + gen + ".png"
      );*/
      imgIndex++; //just for images in the records folder not to have same name

      //rename to temp just to rename back to e_xx without name colisions
      try {
        fs.renameSync(directory + "/" + fileNameWithoutExt + ".png", directory + "/" + fileNameWithoutExt + "_temp.png");
        console.log("Renamed " + fileNameWithoutExt + ".png to " + fileNameWithoutExt + "_temp.png")
      } catch (e) {
        console.error("Could not rename file " + fileNameWithoutExt + ".png. Error:" + e);
        res.send({
          type: 'cancel',
          content: { msg: "Could not rename file " + fileNameWithoutExt + ".png. Error:" + e }
        });
        return
      };
    }
  });

  //rename current elite to match the pop to come
  let eliteCounter = 0;
  for (var i = 0; i < saved_elite.length; i++) {
    var num = eliteCounter == 0 ? eliteCounter : String(eliteCounter + 1).padStart(2, '0'); // 0 , 01, 02, 03
    var newName = "e_" + num;

    try {
      fs.renameSync(directory + "/" + saved_elite[i] + "_temp.png", directory + "/" + newName + ".png");
      console.log("renamed: " + saved_elite[i] + "_temp.png" + " to " + newName + ".png");
      eliteCounter++;
    } catch (e) {

      console.error("Could not rename file " + saved_elite[i] + ".png. Error:" + e);
      res.send({
        type: 'cancel',
        content: { msg: "Could not rename file " + saved_elite[i] + ".png. Error:" + e }
      });
      return
    };
  }
  /*for (var i = 0; i < saved_elite.length; i++) {
    var j = i + 1;
    var n = j == 1 ? 0 : j;
    var newName = "e_" + n;
    try {
      fs.renameSync(directory + "/" + saved_elite[i] + "_temp.png", directory + "/" + newName + ".png");
      console.log("renamed: " + saved_elite[i] + "_temp.png" + " to " + newName + ".png");
    } catch (e) {
      console.error("Could not rename file " + fileName + ".png. Error:" + e);
    };

  }*/

  //SEND FITNESS BACK
  console.log("final fitness");
  console.log(fitnesses);

  console.log("server: trying to send fitness values back to extension");
  sendFitnessValuesToBackExtension(fitnesses, res);
  gen++;
}

function sendFitnessValuesToBackExtension(values, res) {
  console.log("6 - Server: Sending fitness values back to  extension");

  logToUser("Sending fitness values back to extension")

  res.send({
    type: 'fitness',
    content: values
  })
  console.log("Sent fitnesses to extension")
}

function loadImage(imgDir) {
  const desk = fs.readFileSync(imgDir);
  const buf = Buffer.from(desk);
  //const imageArray = new Uint8Array(buf);
  return buf;
}

function loadImage2(imgDir) {
  const desk = fs.readFileSync(imgDir);
  const buf = Buffer.from(desk);
  const imageArray = new Uint8ClampedArray(buf);
  return {
    data: imageArray,
    width: 595,
    height: 842,
  };
}

function loadImage3(imgDir) {
  const desk = fs.readFileSync(imgDir);
  const buf = Buffer.from(desk);
  const imageArray = new Uint8Array(buf);
  return {
    data: imageArray,
    width: 595,
    height: 842,
    channels: 3
  };
}

function loadAllImagesInDir(directory) {
  var images = [];

  for (const file of fs.readdirSync(directory)) {
    if (!fs.lstatSync(path.resolve(directory, file)).isDirectory()) { //se nao foruma pasta
      let fileName = file.split(".");
      let ext = fileName[fileName.length - 1].toLowerCase();
      if (['png'].includes(ext)) //se a extenção for png
        images.push({
          'name': file,
          'buffer': loadImage(directory + "/" + file)
        });
    }
  }

  return images;
}

function loadIM(file1, file2, done) {
  var images = [];

  function loaded(img) {
    images.push(img);

    if (images.length === 2) {
      done(images)
    }
  }

  function load(filePath, done) {
    fs.createReadStream(filePath)
      .pipe(new PNG())
      .on('parsed', function () {
        done({
          data: this.data,
          width: this.width,
          height: this.height,
          channels: 4
        });
      });
  }

  load(file1, loaded);
  load(file2, loaded);
};

app.listen(8088);