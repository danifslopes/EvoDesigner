const p5 = require('node-p5');
let canvas, p;

function sketch(p_, preloaded) {
    p = p_;
    p.setup = () => {
        canvas = p.createCanvas(100, 100);
    }

}

async function evaluateBalance(path, name) {
    let img = await p.loadImage(path);

    let count = 0;
    img.resize(400, 0);

    p.resizeCanvas(img.width, img.height);
    p.background(0);
    img.loadPixels();

    let massCenter = p.createVector(img.width / 2, img.height / 2);
    let force = p.createVector();

    let isDark = false;

    //V2
    for (let y = 0; y < img.height; y++)
        for (let x = 0; x < img.width; x++) {
            let index = (x + y * img.width) * 4,
                r = img.pixels[index + 0],
                g = img.pixels[index + 1],
                b = img.pixels[index + 2],
                bw = isDark ? 255 - (r + g + b) / 3 : (r + g + b) / 3,
                dir = p.createVector(x - massCenter.x, y - massCenter.y),
                f = 1 - bw / 255;

            f = p.pow(f, 2);

            img.pixels[index + 0] = bw;
            img.pixels[index + 1] = bw;
            img.pixels[index + 2] = bw;

            dir.mult(f);
            force.add(dir);
            count += f;
        }

    force.div(count);
    massCenter.add(force);
    img.updatePixels();

    p.image(img, 0, 0);
    p.fill(255, 0, 0);
    p.ellipse(massCenter.x, massCenter.y, 20, 20);
    p.stroke(0, 255, 0);
    p.line(p.width / 2, p.height / 2, massCenter.x, massCenter.y);

    //SET POSSIBLE AXIS
    let axisXCenter = img.width / 2;
    let axisYCenter = img.height / 2;
    let axisXLeft = 0;
    let axisYBottom = img.height;

    //DIST TO AXIS
    let balanceXCenter = p.abs(massCenter.x - axisXCenter);
    let balanceYCenter = p.abs(massCenter.y - axisYCenter);
    let balanceXLeft = p.abs(massCenter.x - axisXLeft);
    let balanceYBottom = p.abs(massCenter.y - axisYBottom);

    //SET DEFAUL AXEX
    let axisXName = "x_center";
    let axisYName = "y_center";
    let balanceX = balanceXCenter;
    let balanceY = balanceYCenter;
    let maxDistX = axisXCenter; //metade da width
    let maxDistY = axisYCenter; //metade da height

    //SET FINAL AXES (FINIAL = CLOSER ONES)
    if (balanceXLeft < balanceXCenter) { //se o eixo left for mais proximo
        axisXName = "x_left";
        balanceX = balanceXLeft;
        maxDistX = img.width;
    }
    if (balanceYBottom < balanceYCenter) {//se o eixo bottom for mais proximo
        axisYName = "y_bottom";
        balanceY = balanceYBottom;
        maxDistY = img.height;
    }

    //NORM
    balanceX = 1 - balanceX / maxDistX;
    balanceY = 1 - balanceY / maxDistY;
    //POW
    balanceX = p.pow(balanceX, 2);
    balanceY = p.pow(balanceY, 2);

    let fitness50_50 = balanceX * 0.5 + balanceY * 0.5;
    let fitness25_75 = balanceX * 0.25 + balanceY * 0.75;
    let fitness75_25 = balanceX * 0.75 + balanceY * 0.25;

    // RESULTS
    let result = {
        name: name,
        balanceX: balanceX,
        balanceY: balanceY,
        axisXName: axisXName,
        axisYName: axisYName,
        fitness50_50: fitness50_50,
        fitness25_75: fitness25_75,
        fitness75_25: fitness75_25
    }

    return result;
}

let p5Instance = p5.createSketch(sketch);

module.exports = {
    'evaluateBalance': evaluateBalance
}
