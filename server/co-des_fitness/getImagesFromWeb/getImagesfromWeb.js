'use strict';

const dictionary = require("./dictionary.json"); //uso para pesquisar todas a palabras do docionario no site do typographic posters
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const fs = require('fs')
const {ImgToSquaredPNG, saveImageToDisk} = require('./canvasLibrary');
const webp = require('webp-converter');
webp.grant_permission(); // this will grant 755 permission to webp executables
const {loadImage} = require('canvas')
const imagesDir = "/Applications/MAMP/htdocs/tenserflow/10_autoencoder/server/trainingVis/public/images/";

let link = "https://www.typographicposters.com/archive";
//let link = "https://www.pinterest.pt/danielopesdesign/danielopes-design/";

//puppeter
async function instance() {
    const browser = await puppeteer.launch({headless: true})
    const page = await browser.newPage()
    return {page, browser}
}

let wordIndex = 11690;

function nextWord() {
    let word = Object.keys(dictionary)[wordIndex];
    console.log("wordIndex: " + wordIndex);
    wordIndex++;
    return word;
}

//pesquisar palavras no  site e ir buscar links dos posters
async function extractImageLinks() {
    const {page, browser} = await instance()
    let baseURL = process.argv[2] ? process.argv[2] : link + "?q=" + nextWord();
    console.log(baseURL);

    try {
        await page.goto(baseURL, {waitUntil: 'networkidle0'})
        await page.waitForSelector('body')
        let imageLinks = await page.evaluate(() => {

            let imageArray = [];
            console.log(document.images.length + "images found.")
            let imgTags = Array.from(document.images).map(img => {
                let src = img.currentSrc;
                let srcArray = src.split('/');
                let pos = srcArray.length - 1;
                let filename = srcArray[pos];
                imageArray.push({src, filename});
            })

            return imageArray;

        })
        await browser.close()
        return imageLinks

    } catch (err) {
        console.log(err)
    }
}

async function getConvertAndSaveImage(url, filename) {
    console.log("url:", url);
    let lowerCaseFileName = filename.toLowerCase();

    if (filename.indexOf(".webp") > -1) { //
        console.log("downloading webp file");
        let newFileName = filename.replace("webp", "png");

        //webpmux_getframe(input,ouput,frame number)
        /*webp.webpmux_getframe(url, newFileName, "1").then(response => {
            saveFileToDisk(response, newFileName);
        });*/

        //webp to png
        webp.cwebp(url, newFileName).then(img => {
            //console.log("response", img);
            //const dest = fs.createWriteStream(newFileName);
            //response.body.pipe(dest)
            ImgToSquaredPNG(img).then(png => {
                saveImageToDisk(png, filename)
            });
        });

    }
    else if (lowerCaseFileName.includes(".png") || lowerCaseFileName.includes(".jpg") || lowerCaseFileName.includes(".jpeg")) {
        console.log("downloading png/jpg file");

        await loadImage(url).then(img => {
            //const dest = fs.createWriteStream(filename);
            //res.body.pipe(dest)
            ImgToSquaredPNG(img).then(png => {
                saveImageToDisk(png, filename)
            });
        }).catch(err => {
            console.log("getConvertAndSaveImage -> Error on loading image:", err)
        })
    }
}


async function downloadImages() {
    console.log("Counting files in folder...")
    let maxFilesInFolder = 10000;

    //contar ficheiros na pasta
    await fs.readdir(imagesDir, async (err, files) => {
        if (files.length < maxFilesInFolder) {
            console.log("Downloading images...")

            let imageLinks = await extractImageLinks()
            imageLinks.map((image) => {
                let filename = imagesDir + image.filename;
                getConvertAndSaveImage(image.src, filename)
            })

            console.log("Download complete, check the images folder")
            await downloadImages();

        } else console.log("folder has " + maxFilesInFolder + " or more files already")
    });


}

downloadImages();




