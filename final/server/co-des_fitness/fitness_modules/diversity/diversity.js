const math = require('mathjs');
const fs = require('fs');
const path = require('path');
const { Image } = require('image-js');

function meanSquaredError(image1, image2) {
    if (image1.width !== image2.width || image1.height !== image2.height) {
        throw new Error('Images must be the same size');
    }

    let sumOfSquares = 0;
    let pixelCount = 0;

    for (let y = 0; y < image1.height; y++) {
        for (let x = 0; x < image1.width; x++) {
            const pixel1 = image1.getPixelXY(x, y);
            const pixel2 = image2.getPixelXY(x, y);

            if (pixel1 && pixel2) {
                const diffR = pixel1[0] - pixel2[0];
                const diffG = pixel1[1] - pixel2[1];
                const diffB = pixel1[2] - pixel2[2];

                sumOfSquares += diffR * diffR + diffG * diffG + diffB * diffB;
                pixelCount++;
            }
        }
    }

    const mse = sumOfSquares / pixelCount;
    //console.log('mse:', mse);
    return mse;
}

async function calculateRmseMatrix(imageDir) {
    // Load all images into memory
    let filenames = fs.readdirSync(imageDir).filter(fileName => fileName.endsWith('.png'));
    let images = await Promise.all(filenames.map(fileName => Image.load(path.join(imageDir, fileName))));

    // Calculate RMSE between all pairs of images
    let n = images.length;
    let rmseMatrix = math.zeros(n, n);
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            let mse = meanSquaredError(images[i], images[j]);
            let rmse = Math.sqrt(mse);
            //console.log('rmse:', rmse);
            rmseMatrix.set([i, j], rmse);
            rmseMatrix.set([j, i], rmse);
        }
    }

    return { filenames, rmseMatrix };
}

function calculatePenalty(targetFileName, filenames, rmseMatrix) {
    return new Promise((resolve, reject) => {
        // Find the index of the target image
        let targetIndex = filenames.indexOf(targetFileName);
        if (targetIndex === -1) {
            reject(new Error(`File not found: ${targetFileName}`));
            return;
        }

        // Extract RMSE values for all to all images
        let fullRmseArray = rmseMatrix.toArray().flat();
        // Calculate penalty
        let threshold = math.quantileSeq(fullRmseArray, 0.2, true);
        //console.log('threshold:', threshold);

        // Extract RMSE values for target image
        let rmseArray = rmseMatrix.toArray()[targetIndex];
        //array of penalties for the current individual according to its neibours
        let penaltisMatrix = rmseArray.map(d => d <= threshold ? 1 - d / (threshold + Number.EPSILON) : 0); //Number.EPSILON is the smallest positive number that JavaScript
        //sum them all
        let penalty = penaltisMatrix.reduce((a, b) => a + b, 0); //sum all up

        console.log("calculatePenalty finished " + targetFileName)
        resolve(penalty);
    });
}


module.exports = {
    'calculateRmseMatrix': calculateRmseMatrix,
    'calculatePenalty': calculatePenalty,
}