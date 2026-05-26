var labelsArr = [
    "all",
    "color",
    "basic",
    "red",
    "fire",
    "apple",
    "strawberry",
    "love",
    "orange",
    "brown",
    "wood",
    "yellow",
    "sun",
    "green",
    "grass",
    "tree",
    "enviroment",
    "forest",
    "plant",
    "blue",
    "water",
    "sky",
    "sad",
    "sea",
    "fish",
    "purple",
    "wine",
    "violet",
    "pink",
    "random",
    "low",
    "gray",
    "colorful",
    "happy",
    "aggressive",
    "saturation",
    "high",
    "very",
    "super",
    "extreme",
    "west",
    "east",
    "south",
    "north",
    "total",
    "black",
    "white",
    "old",
    "neutral",
    "dark",
    "fear",
    "surprise",
    "night",
    "bright",
    "sunny",
    "light",
    "peace",
    "day",
    "meaningful",
    "gradient",
    "progressive",
    "smooth",
    "transition",
    "merge",
    "linear",
    "forward",
    "straight",
    "radial",
    "around",
    "circle",
    "ring",
    "two",
    "simple",
    "balance",
    "half",
    "split",
    "unbalance",
    "different",
    "multiple",
    "complex",
    "equaly",
    "uniform",
    "achor",
    "reference",
    "point",
    "top",
    "left",
    "center",
    "right",
    "midle",
    "bottom",
    "remove",
    "duplicated",
    "missing",
    "cut",
    "one",
    "several",
    "group",
    "together",
    "united",
    "margin",
    "border",
    "frame",
    "none",
    "no",
    "small",
    "thin",
    "bold",
    "medium",
    "normal",
    "big",
    "airline",
    "large",
    "spacy",
    "oversized",
    "huge",
    "much",
    "over",
    "equal",
    "vertical",
    "tall",
    "horizontal",
    "short",
    "base",
    "long",
    "fly",
    "up",
    "land",
    "heavy",
    "terrain",
    "down",
    "side",
    "corner",
    "trapped",
    "guide",
    "conductor",
    "align",
    "y",
    "column",
    "x",
    "row",
    "horizonal",
    "grid",
    "order",
    "close",
    "near",
    "stroke",
    "arc",
    "moon",
    "ellipse",
    "deformed",
    "mini",
    "spike",
    "third",
    "quarter",
    "pizza",
    "cone",
    "divide",
    "bit",
    "open",
    "slice",
    "curve",
    "chord",
    "pie",
    "egg",
    "ball",
    "round",
    "rect",
    "box",
    "four",
    "square",
    "line",
    "dot",
    "quad",
    "shape",
    "triangle",
    "three",
    "hierarchy",
    "text",
    "size",
    "body",
    "separated",
    "apart",
    "font",
    "delete",
    "clean",
    "empty",
    "minimal",
    "less",
    "space",
    "breathe",
    "clear",
    "empy",
    "void",
    "minimum",
    "minus",
    "modest",
    "raw",
    "static",
    "star",
    "still",
    "form",
    "geometric",
    "repeat",
    "duplicate",
    "copy",
    "replica",
    "many",
    "fit",
    "beveled",
    "rectangle",
    "detail",
    "closed",
    "path",
    "inverse",
    "rounded",
    "concave",
    "negative",
    "table",
    "string",
    "rope",
    "broken",
    "gap",
    "oval",
    "bird",
    "chicken",
    "polygon",
    "pentagon",
    "hexagon",
    "octahedron",
    "4",
    "90",
    "child",
    "kid",
    "children",
    "3",
    "sharp",
    "beak",
    "tip",
    "careful",
    "warning",
    "sign",
    "attention",
    "horizont",
    "lay",
    "platform",
    "tower",
    "build",
    "building",
    "diagonal",
    "drunk",
    "slide",
    "stretch",
    "increment",
    "increasing",
    "wider",
    "taller",
    "jump",
    "skyscraper",
    "launch",
    "throw",
    "fall",
    "drop",
    "tilt",
    "matrix",
    "brick",
    "wall",
    "polar",
    "waves",
    "snake",
    "wire",
    "road",
    "track",
    "dance",
    "movement",
    "curly",
    "espiral",
    "rotate",
    "middle",
    "framed",
    "focus",
    "proportional",
    "move",
    "z",
    "depth",
    "back",
    "leaning",
    "front",
    "backward",
    "flip",
    "mirror",
    "invert",
    "contrary",
    "shift",
    "translate",
    "displace",
    "both",
    "default",
    "upside",
    "by",
    "offset",
    "to",
    "blend",
    "opacity",
    "effects",
    "natural",
    "multiply",
    "screen",
    "overlay",
    "soft",
    "hard",
    "dodge",
    "burn",
    "darken",
    "lighten",
    "difference",
    "contrast",
    "exclusion",
    "hue",
    "luminosity",
    "fill",
    "nofill",
    "plane",
    "hairline",
    "tint",
    "transparency",
    "full",
    "vivid",
    "autumn",
    "nostroke",
    "transparent",
    "translucid",
    "glass",
    "through",
    "hide",
    "invisible",
    "few",
    "little",
    "scale",
    "dimension",
    "shear",
    "justify",
    "away",
    "from",
    "binding",
    "tight",
    "traditional",
    "floor",
    "tracking",
    "letter",
    "join",
    "leading",
    "read",
    "title",
    "subtitle",
    "important",
    "head",
    "note",
    "nothing",
    "info",
    "partners",
    "authors",
    "label",
    "hierachy",
    "level",
    "snap",
    "more",
    "organized",
    "outline",
];


var learnedKeywords = false;
var l = {};

function createLabel(w) {
    //$.writeln("createLabel: " + w)
    if (!l[w]) {
        l[w] = {
            name: w,
            probToRun: defaultProbToRun,
            allScores: {
                all: [defaultProbToRun]
            }
        }
    }
    return w //l[w];
}

function initLabelList() {
    start = millis();

    //limpar labels
    l = {};
    //iniciar tudo default
    for (var i = 0; i < labelsArr.length; i++) {
        l[labelsArr[i]] = {
            name: labelsArr[i],
            probToRun: defaultProbToRun,
            allScores: {
                all: [defaultProbToRun]
            }
        };
    }
    $.writeln("initLabelList toke " + (millis() - start) + " ms to load.");
}

function isPlainObject(value) {
    return typeof value === 'object' &&
        value !== null &&
        value.constructor === Object &&
        Object.prototype.toString.call(value) === '[object Object]';
}

function updateProbsToRun() {
    l = {}
    start = millis();

    var conceptURL = "http://bumblebee.dei.uc.pt:9002/similarity"
    if (interfaceSettings.conceptAlgorithm == "GPT") {
        conceptURL = 'http://bumblebee.dei.uc.pt:9003/similarity_gpt';
    }

    //pedir todas as combinações label, keyword ao ConceptNet
    if (interfaceSettings.keywords.length > 0) {
        var data = $http({
            method: 'POST',
            payload: {
                "labels": labelsArr,
                //GPT: From 0 to 1, how much is "dark" related to "love"? please respond only with a number with 3 decimals
                //GPT: how much are the  following words "yellow, rect, green, bottom, top" related to "saint patricks day". please,  answer only with a json object conecting each word with a value from 0 to 1 with 3 decimals. say nothing else
                "keywords": [interfaceSettings.keywords.join(" ")] //estou a passar tudo como uma unica frase porque funcniona melhor
            },
            url: conceptURL //9002/similarity' -> conceptnet | 9003/similarity_gpt -> gpt
        });
        l = data.payload;
        if (!isPlainObject(l)) {
            alert("An error occured in the keywords server.")
            return "[]";
        }

    }
    //se nao ha keywords, é tudo default
    else {
        for (var i = 0; i < labelsArr.length; i++) {
            l[labelsArr[i]] = {
                name: labelsArr[i],
                probToRun: defaultProbToRun,
                allScores: {
                    all: [defaultProbToRun]
                }
            };
        }
    }

    //ir a todos os metodos e calcular a probToRun outra vez
    initMethodsProbToRun(pageItemMethods)
    initMethodsProbToRun(pageMethods)
    initMethodsProbToRun(docMethods)

    //saveJSON("allLabels.json", l)
    //saveJSON("allMeths.json", pageMethods)

    initSwatches();

    $.writeln("updateProbsToRun toke " + (millis() - start) + " ms to load.");

    learnedKeywords = true;

    //return "Keywords '" + interfaceSettings.keywords.join(", ") + "' were learned."
    return JSON.stringify(interfaceSettings.keywords);
}

function initMethodsProbToRun(meths) {
    var start = millis();

    meths = meths.methods;
    for (var k in meths) {
        var m = meths[k];
        //method's original
        var maxProb = getProbToRun(m); //prob apenas com labels do metodo
        //constants
        if (m.constants) {
            var constsMaxProb = initSubsProbToRun(m, "constants");
            if (constsMaxProb > maxProb) maxProb = constsMaxProb; //se houver uma prob maior nas constantes, atualiza 
        }
        //sub methods
        if (m.subMethods) {
            var subsMaxProb = initSubsProbToRun(m, "subMethods");
            if (subsMaxProb > maxProb) maxProb = subsMaxProb; //se houver uma prob maior nos submetodos, atualiza 
        }
        //method's final
        m.probToRun = maxProb;
    }
    $.writeln("     initMethods toke " + (millis() - start) + " ms to load.");
}

function initSubsProbToRun(m, sub) {
    var msub = m[sub] || {};

    var maxProb = Number.NEGATIVE_INFINITY;

    for (var key in msub) {
        var c = msub[key];
        //KEYWORDS
        c.probToRun = getProbToRun(c);
        if (c.probToRun > maxProb) maxProb = c.probToRun;

        //for font weights 
        if (c.hasOwnProperty("weights")) {
            var fontweightsMaxProb = initSubsProbToRun(c, "weights");
            if (fontweightsMaxProb > maxProb) maxProb = fontweightsMaxProb;
        }
    }

    return maxProb;
}