const fs = require('fs')
//https://flaviocopes.com/canvas-node-generate-image/
const {createCanvas, loadImage} = require('canvas')
let canvas = createCanvas(200, 200)
let context = canvas.getContext('2d')

function saveImageToDisk(file, filename) {
    //console.log("canvasLibrary -> saveImageToDisk");
    let base64Image = file.split(';base64,').pop();

    fs.writeFileSync(filename, base64Image, {encoding: 'base64'}, function (err) {
        if (err) console.log(err);
        //else console.log('File created');
    });
}

async function ImgToSquaredPNG(image) {
    //https://stackoverflow.com/questions/50537735/convert-blob-to-image-file
    //http://bl.ocks.org/biovisualize/8187844
    let png;

    let relation, newH, newW;
    if (image.height > image.width) {
        relation = image.width / image.height;
        newH = canvas.height * 0.9;
        newW = newH * relation;
    } else {
        relation = image.height / image.width;
        newW = canvas.width * 0.9;
        newH = newW * relation;
    }

    context.fillStyle = '#000000'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, (canvas.width / 2) - (newW / 2), (canvas.height / 2) - (newH / 2), newW, newH)
    png = canvas.toDataURL("image/png");

    //console.log("Created images on canvas");
    return png;
}

async function SquaredImgToPNG(image) {
    let png;
    context.fillStyle = '#000000'
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    png = canvas.toDataURL("image/png");
    //console.log("Created images on canvas");
    return png;
}



function randomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function randomFloat(min, max) {
    return (Math.random() * (max - min)) + min;
}

function renderTensor(imageArray) {
    let image = imageArray.dataSync();

    let i = 0;
    let imgWidth = canvas.width, imgHeight = canvas.height;
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
        context.fillStyle = 'rgb(' + image[i] + ',' + image[i + 1] + ',' + image[i + 2] + ')';
        context.fillRect(y, x, 1, 1)
        i += 3;
    }

    let png = context.getImageData(0, 0, 200, 200);
    return png;
}

function randomMutation(imageArray) {
    let image = imageArray.dataSync();

    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height)

    //transform
    let prob = .75;
    if (Math.random() < prob) {
        let t = 2;
        context.translate(randomInt(-t, t), randomInt(-t, t));
    }
    if (Math.random() < prob) {
        let scale = randomFloat(0.95, 1);
        context.translate(canvas.width / 2, canvas.height / 2);
        context.scale(scale, scale);
        context.translate(-canvas.width / 2, -canvas.height / 2);
    }
    if (Math.random() < prob) {
        let ang = randomFloat(-Math.PI / 64, Math.PI / 64)
        context.translate(canvas.width / 2, canvas.height / 2);
        context.rotate(ang);
        context.translate(-canvas.width / 2, -canvas.height / 2);
    }

    //draw img
    let i = 0;
    let imgWidth = canvas.width, imgHeight = canvas.height;
    for (let x = 0; x < imgWidth; x++) for (let y = 0; y < imgHeight; y++) {
        context.fillStyle = 'rgb(' + image[i] + ',' + image[i + 1] + ',' + image[i + 2] + ')';
        context.fillRect(y, x, 1, 1)
        i += 3;
    }

    //export png
    //pngfile = canvasLibrary.toDataURL("image/png")
    //saveImageToDisk(pngfile, "../autoencoder/saved/aug_png/aug_" + Date.now() + ".png")

    //return Uint8Array
    let png = context.getImageData(0, 0, 200, 200);
    let rgbpng = [];
    for (i = 0; i < png.data.length; i += 4) { //tirar o alpha
        rgbpng.push(png.data[i]);
        rgbpng.push(png.data[i + 1]);
        rgbpng.push(png.data[i + 2]);
    }
    const buf = Buffer.from(rgbpng);
    let newpng = new Uint8Array(buf);

    context.resetTransform();
    return newpng;
}

/*ImgToSquaredPNG('./images/15.jpg').then(png => {
    saveImageToDisk(png, "./downloads/nova.png")
});*/

module.exports = {ImgToSquaredPNG, saveImageToDisk, randomMutation, renderTensor, SquaredImgToPNG};