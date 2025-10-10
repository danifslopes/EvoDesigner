const tf = require('@tensorflow/tfjs-node');
const imgWidth = 200, imgHeight = 200, channels = 3;

//posters 200,200
let archis = {};

//performs better than 4
archis[3] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}));
    //para poder mapear em 2d posso fazer flatten e meter uma dense layer como em:
    // https://towardsdatascience.com/one-class-learning-in-manufacturing-autoencoder-and-golden-units-baselining-4c910038a4b3

    //DECODE
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 8, activation: 'relu'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 3, activation: 'relu'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//lixo - performs worst than 3
archis[4] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 32, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}));
    //para poder mapear em 2d posso fazer flatten e meter uma dense layer como em:
    // https://towardsdatascience.com/one-class-learning-in-manufacturing-autoencoder-and-golden-units-baselining-4c910038a4b3

    //DECODE
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 8, activation: 'relu'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//lixo - aprendeu a mapear os pixels (multiplicar por 1)
archis[5] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    //model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}));
    //model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu'}));
    //para poder mapear em 2d posso fazer flatten e meter uma dense layer como em:
    // https://towardsdatascience.com/one-class-learning-in-manufacturing-autoencoder-and-golden-units-baselining-4c910038a4b3

    //DECODE
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 8, activation: 'relu'}));
    //model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 3, activation: 'relu'}));
    //model.add(tf.layers.upSampling2d({size: [2, 2]}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//lixo - aprendeu a mapear os pixels, nao tao bem como achi5 mas mesmo assim muito bem
archis[6] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 32, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 128, activation: 'relu'}));
    //para poder mapear em 2d posso fazer flatten e meter uma dense layer como em:
    // https://towardsdatascience.com/one-class-learning-in-manufacturing-autoencoder-and-golden-units-baselining-4c910038a4b3

    //DECODE
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 64, activation: 'relu'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2dTranspose({kernelSize: 3, filters: 3, activation: 'relu'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//nice mas precisa de renderizar melhor os conhecidos. faster than 8
archis[7] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//niceer mas precisa de renderizar melhor os conhecidos. slower than 7
archis[8] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 2 * 2, activation: 'relu'}));
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

archis[9] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 64, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

archis[10] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 64, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'}));
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

archis[11] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro // https://stats.stackexchange.com/questions/296679/what-does-kernel-size-mean/296701
        filters: 64, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
        //kernelInitializer: "randomNormal",
        //biasInitializer: "ones"
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    // model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 25 * 25 * 16, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 16]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));

    //model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: imgWidth * imgHeight * channels}));
    //model.add(tf.layers.reshape({targetShape: [imgWidth, imgHeight, channels]}));
}

//2 melhor melhor até agora
archis[12] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 8, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 8]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[13] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 4, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 4]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

//pequena adaptação da 12 para ser simetrica
archis[14] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 8, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 8]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
}

//MELHOR até agora!!!
archis[15] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[16] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

//passar pro servidor porque nao aguenta o tamnho da layer dense
archis[17] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    //model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    //model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 100 * 100 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [100, 100, 2]}));

    //DECODE
    //model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    //model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[18] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 4, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    //model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    //model.add(tf.layers.dense({units: 2}));
    model.add(tf.layers.dense({units: 50 * 50 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[19] = function (model) { //mais filtros menos bottle neck
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    //model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));

    //DECODE
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[20] = function (model) { //mais filtros menos bottle neck
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    //model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    /*model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 2]}));*/

    //DECODE
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[21] = function (model) {
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //LATENT SPACE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25}));
    model.add(tf.layers.dense({units: 50 * 50 * 2, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
}

archis[22] = function (model) { //mais poolings
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //---

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 1, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 1]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))
}

archis[23] = function (model) { //mais poolings e mais filtros
    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //---

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 1, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 1, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 1]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))
}

archis[24] = function (model) { //saltos maiores

    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 8, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 4, strides: 4})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 4, strides: 4}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [4, 4]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 50 * 50 * 3, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [50, 50, 3]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [4, 4]}));
}





archis[25] = function (model) { //mais poolings e mais filtros

    //ENCODE

    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 32, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //---

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 8, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 8]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))
} //CONSEGUI COM OS 4000!!!!

archis[26] = function (model) { //mais poolings e mais filtros

    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 64, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //---

    model.add(tf.layers.conv2d({name: "up", kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 8, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 8]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 32, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 64, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}))

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
} //testar com esta mas demora miuto tempo

archis[27] = function (model) { //mais poolings e mais filtros

    //ENCODE
    model.add(tf.layers.conv2d({
        kernelSize: 3,  //aprender features de bocados de 3x3 pixels. kernel = filtro
        filters: 16, //quantos filtros (sao aprendidos, sao casa casa do filtro é um neuronio, penso eu)
        activation: 'relu',
        padding: 'same',
        batchInputShape: [null, imgWidth, imgHeight, channels], //numImagens a passar de cada vez, width, height, canais
    }));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2})); //padding: "same" = fill the input so the output has the same length as the original input
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    //---

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 2, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.maxPooling2d({poolSize: 2, strides: 2}));

    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({units: 25 * 25 * 4, activation: 'relu'})); //25 25 2 é a shape da camada antes do flatten
    model.add(tf.layers.reshape({targetShape: [25, 25, 4]}));

    //DECODE
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 4, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 8, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));
    model.add(tf.layers.conv2d({kernelSize: 3, filters: 16, activation: 'relu', padding: 'same'}));
    model.add(tf.layers.upSampling2d({size: [2, 2]}));

    model.add(tf.layers.conv2d({kernelSize: 3, filters: 3, activation: 'relu', padding: 'same'}));
} //testar com esta tb

module.exports = {archis};
