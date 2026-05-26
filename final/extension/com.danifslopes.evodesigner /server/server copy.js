var seedrandom = require('seedrandom');
seedrandom('d30', {
  global: true
});

var fs = require('fs');
var express = require('express');
var app = express();
app.use(express.json());
var FormData = require('form-data');

var socketExtension = require('socket.io')();
socketExtension.listen(3200);
var ss = require('socket.io-stream');

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

function forEachPNGInDir(directory, callback) {
  let i = 0;
  for (const file of fs.readdirSync(directory))
    if (!fs.lstatSync(path.resolve(directory, file)).isDirectory()) { //se nao for uma pasta
      let fileName = file.split(".");
      let ext = fileName[fileName.length - 1].toLowerCase();
      if (ext === 'png') callback(file, i);
      i++
    }
}

function clearPopFolder(msg, res) { //acho que isto ainda nao da porque lee morre quando evolui com coisas na pasta
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
}

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
}

function fetchFitnessServer(i, resolve) {
  //console.log("fetchFitnessServer");

  var form = new FormData({
    //maxDataSize: 4294967296 //4G in bytes
  });

  form.append('gen', i.gen);
  form.append('fileName', i.fileName);
  form.append('fileNameWithoutExt', i.fileNameWithoutExt);
  form.append('fileNumber', i.fileNumber);
  form.append('pag', i.pag);
  form.append('origText', i.origText);

  let stream = fs.createReadStream(i.directory + "/" + i.fileName);
  stream.on("error", err => reject(err));
  stream.on("end", (v) => {});
  form.append('imgFile', stream);

  console.log("fetchFitnessServer");
  fetch("http://localhost:5001/fromExtensionServer", {
    method: 'POST',
    body: form
  }).then(function (res) {
    res.json().then(function (json) {
      //console.log(json);
      //treatFitnessValues(json.content, extension_res);
      resolve(json.content[0]);
    }).catch((error) => {
      console.log(error)
    });
  }).catch((error) => {
    console.log(error)
  });;

}

/*
function fetchFitnessServer(imgs, extension_res) {
  console.log("fetchFitnessServer imgleng " + imgs.length);
  
  var form = new FormData({
    //maxDataSize: 4294967296 //4G in bytes
  });

  form.append('gen', imgs[0].gen);
  for (let i of imgs) {
    form.append('fileName', i.fileName);
    form.append('fileNameWithoutExt', i.fileNameWithoutExt);
    form.append('fileNumber', i.fileNumber);
    form.append('pag', i.pag);

    let stream = fs.createReadStream(i.directory + "/" + i.fileName);
    stream.on("error", err => reject(err));
    stream.on("end", (v) => {
      console.log("end")
      resolve()
    });
    form.append('imgFile', stream);
  }

  console.log("fetchFitnessServer");
  fetch("http://localhost:5001/fromExtensionServer", {
    method: 'POST',
    body: form
  }).then(function (res) {
    res.json().then(function (json) {
      console.log(json);
      treatFitnessValues(json.content, extension_res);

    }).catch((error) => {
      console.log(error)
    });
  }).catch((error) => {
    console.log(error)
  });;

}
*/

function sendExportedPopToFitnessServer(msg, res) {
  console.log("5 - Server: Classifying pop");

  fitnessWaitingToBeSent = true;
  evaluationInProgress = true;

  var msg_content = msg.content;
  var current_pop_dir = msg_content.curr_pop_dir;
  var elite_size = msg_content.elite_size;
  var pop_size = msg_content.pop_size;
  var fst_pop_pag = msg_content.fst_pop_pag;
  var orig_text = msg_content.orig_text;

  //ir buscar as imagens à pasta current_pop_dir
  current_pop_dir = current_pop_dir.replace("%20", " ");
  var directory = __dirname + "/public/current_pop";
  var recordDirectory = __dirname + "/records";
  var streams = [];
  var fitnesses = [];
  var promisses = [];

  let proms = [];

  //ler ficheiro com texto original dos posters
  let rawdata = fs.readFileSync(directory + '/origText.json');
  let origText = JSON.parse(rawdata);
  console.log(origText)

  //send images to classification
  forEachPNGInDir(directory, (file, i) => {
    //console.log("evaluating " + file);

    //File name / number
    let fileName = file.replace(".png", "");
    let fileNumber = fileName.replace("e_", "").replace("o_", "");
    fileNumber = Number(fileNumber);
    if (fileNumber === 0) fileNumber = 1;
    if (file.indexOf("o_") > -1) fileNumber += elite_size;
    var pag = Number(fst_pop_pag) + (fileNumber - 1)

    if (fileNumber <= pop_size) { //para nao avaliar pngs que estejam pasta por causa de evoluções anteriores p.e. o_23.png
      let imgData = {
        directory: directory,
        fileName: file,
        fileNameWithoutExt: fileName,
        fileNumber: fileNumber,
        pag: pag,
        index: i,
        gen: msg_content.gen,
        origText: origText["12"]
      }

      proms.push(new Promise((resolve, reject) => {
        fetchFitnessServer(imgData, fitness => {
          resolve(fitness);
        })
      }))

    }
  });

  Promise.all(proms).then(values => {
    console.log(values);
    treatFitnessValues(values, res);
  });
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
    if (fitnesses.length < elite_size) console.error("fitnesses.length<elite_size");
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
        };

        //temporary name is elite
      } else {
        //save a copy
        fs.copyFileSync(
          directory + "/" + fileName + ".png",
          recordDirectory + "/" + imgIndex + "_gen" + gen + ".png"
        );
        imgIndex++;

        //rename
        try {
          fs.renameSync(directory + "/" + fileName + ".png", directory + "/" + fileName + "_temp.png");
          console.log("Renamed " + fileName + ".png")
        } catch (e) {
          console.error("Could not rename file " + fileName + ".png. Error:" + e);
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
  console.log("elite_size " + elite_size);
  console.log("fitnesses " + fitnesses.length);

  //CALC FINAL FITNESSES
  fitnesses.map(a => {

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
  });

  //SORT POP BY FITNESS
  //primeiro a fitness maior
  fitnesses.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });

  saved_elite = [];
  if (fitnesses.length < elite_size) console.error("fitnesses.length<elite_size");
  for (let i = 0; i < elite_size; i++) {
    saved_elite.push(fitnesses[i].fileNameWithoutExt)
  }

  //DELETE / RENAME FILES
  var directory = __dirname + "/public/current_pop";
  var recordDirectory = __dirname + "/records";
  forEachPNGInDir(directory, file => {
    let fileName = file.replace(".png", "");
    //delete if not elite
    if (!saved_elite.includes(fileName)) {
      try {
        fs.unlinkSync(directory + "/" + fileName + ".png");
        //console.log("Deleted " + fileName + ".png")
      } catch (e) {
        console.error("Could not delete file " + fileName + ".png. Error:" + e);
      };

      //temporary name is elite
    } else {
      //save a copy
      fs.copyFileSync(
        directory + "/" + fileName + ".png",
        recordDirectory + "/" + imgIndex + "_gen" + gen + ".png"
      );
      imgIndex++;
      //rename
      try {
        fs.renameSync(directory + "/" + fileName + ".png", directory + "/" + fileName + "_temp.png");
        console.log("Renamed " + fileName + ".png")
      } catch (e) {
        console.error("Could not rename file " + fileName + ".png. Error:" + e);
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
    };

  }

  //SEND FITNESS BACK
  console.log("server: trying to send fitness values back to extension");
  sendFitnessValuesToBackExtension(fitnesses, res);
  gen++;
}

function sendFitnessValuesToBackExtension(values, res) {
  console.log("6 - Server: Sending fitness values back to  extension");

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