/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

var probConceptNumbers = 0.9;
var defaultProbToRun = 0.01;
var conceptNumbers = [];
var copyIndex = 0;
var colorIndex = 0;
var textBodySize = 12;
var textHierachyRel = 1.5;
var minObjSize;
var colorList = [];
var probToRunMethodsExponent = 1; // 1 || 3
var probToRunPropertiesExponent = 3; //3 || 5
var allMeths;
var itemMinVisible = 2 / 3;
var pageGutter = null;
var myFonts = [];
var minVisibleRatio_textboxes = 0.9;
var minVisibleRatio_all = 2 / 3;

var lastMutationAsset = null; //submethod of constant

var commonProps = [];
var commonRandomNum = null;

function initCommonVars() {
    commonProps = [];
    commonRandomNum = null;
}

//PageItem methods
var pageItemMethods;
var initPageItemMethods = function(fontConstants) {
    var pim = {
        methods: {
            //style
            blendMode: {
                minProbToRun: 0.2,
                type: "style",
                labels: ["blend", "opacity", "effects", "color", "surprise", "colorful", "random", "super", "very", "sunny", "different", "complex", "many", "detail", "kid", "child", "increment", "dance", "glass", "binding", "join"],
                constants: {
                    normal: {
                        labels: ["normal", "default", "natural"],
                        value: BlendMode.NORMAL,
                    },
                    multiply: {
                        labels: ["multiply", "both"],
                        value: BlendMode.MULTIPLY,
                    },
                    screen: {
                        labels: ["screen"],
                        value: BlendMode.SCREEN,
                    },
                    overlay: {
                        labels: ["overlay"],
                        value: BlendMode.OVERLAY,
                    },
                    softLight: {
                        labels: ["soft", "light"],
                        value: BlendMode.SOFT_LIGHT,
                    },
                    hardLight: {
                        labels: ["hard", "light"],
                        value: BlendMode.HARD_LIGHT,
                    },
                    colorDodge: {
                        labels: ["color", "dodge"],
                        value: BlendMode.COLOR_DODGE,
                    },
                    colorBurn: {
                        labels: ["color", "burn"],
                        value: BlendMode.COLOR_BURN,
                    },
                    darken: {
                        labels: ["darken", "dark"],
                        value: BlendMode.DARKEN,
                    },
                    lighten: {
                        labels: ["lighten", "light"],
                        value: BlendMode.LIGHTEN,
                    },
                    difference: {
                        labels: ["difference", "contrast"],
                        value: BlendMode.DIFFERENCE,
                    },
                    exclusion: {
                        labels: ["exclusion", "contrast"],
                        value: BlendMode.EXCLUSION,
                    },
                    hue: {
                        labels: ["hue"],
                        value: BlendMode.HUE,
                    },
                    saturation: {
                        labels: ["saturation"],
                        value: BlendMode.SATURATION,
                    },
                    color: {
                        labels: ["color"],
                        value: BlendMode.COLOR,
                    },
                    luminosity: {
                        labels: ["luminosity", "gray", "black", "white"],
                        value: BlendMode.LUMINOSITY,
                    }
                },
                //here -- meter os constants como submethods.
                //nos que ja existe, filtrar por tipo para ir buscar constants.
                subMethods: {
                    noBlend: {
                        type: "function",
                        ignoreInEvolution: true,
                        labels: ["normal", "simple", "clean"],
                        run: function() {
                            blendMode(selectedItem, BlendMode.NORMAL);
                            if (selectedItem.hasOwnProperty("images") && selectedItem.images.length > 0)
                                blendMode(selectedItem.images[0], BlendMode.NORMAL);
                        }
                    },
                    random: {
                        minProbToRun: 0.5, //^3 = 0.1
                        type: "function",
                        hideFromUser: true,
                        labels: ["blend", "random"],
                        run: function(value) {
                            var it = selectedItem;
                            //50% chance de aplicar na imagem em vez de na box
                            if (selectedItem.hasOwnProperty("images") && selectedItem.images.length > 0 && randomFloat(0, 1) < 0.5)
                                it = selectedItem.images[0];
                            blendMode(it, value);
                        }
                    },
                    randomtoBox: {
                        minProbToRun: 0.5, //^3 = 0.1
                        type: "function",
                        ignoreInEvolution: true,
                        labels: ["blend"],
                        run: function(value) {
                            blendMode(selectedItem, value);
                        }
                    },
                    randomToImage: {
                        minProbToRun: 0.5, //^3 = 0.1
                        type: "function",
                        ignoreInEvolution: true,
                        labels: ["blend"],
                        run: function(value) {
                            var it = selectedItem;
                            //if item é a box (e nao a imagem), it passa a ser a imagm
                            if (selectedItem.hasOwnProperty("images") && selectedItem.images.length > 0)
                                it = selectedItem.images[0];
                            blendMode(it, value);
                        }
                    },
                    //type value:
                    //tudo o que sao constantes
                    /*normal: {
                        type: "value",
                        labels: ["normal", "default", "natural"],
                        run: function() {
                            return BlendMode.NORMAL;
                        }
                    },
                    multiply: {
                        type: "value",
                        labels: ["multiply", "both"],
                        run: function() {
                            return BlendMode.MULTIPLY;
                        }
                    },
                    screen: {
                        type: "value",
                        labels: ["screen"],
                        run: function() {
                            return BlendMode.SCREEN;
                        }
                    },
                    overlay: {
                        type: "value",
                        labels: ["overlay"],
                        run: function() {
                            return BlendMode.OVERLAY;
                        }
                    },
                    softLight: {
                        labels: ["soft", "light"],
                        run: function() {
                            return BlendMode.SOFT_LIGHT;
                        }
                    },
                    hardLight: {
                        type: "value",
                        labels: ["hard", "light"],
                        run: function() {
                            return BlendMode.HARD_LIGHT;
                        }
                    },
                    colorDodge: {
                        type: "value",
                        labels: ["color", "dodge"],
                        run: function() {
                            return BlendMode.COLOR_DODGE;
                        }
                    },
                    colorBurn: {
                        type: "value",
                        labels: ["color", "burn"],
                        run: function() {
                            return BlendMode.COLOR_BURN;
                        }
                    },
                    darken: {
                        type: "value",
                        labels: ["darken", "dark"],
                        run: function() {
                            return BlendMode.DARKEN;
                        }
                    },
                    lighten: {
                        type: "value",
                        labels: ["lighten", "light"],
                        run: function() {
                            return BlendMode.LIGHTEN;
                        }
                    },
                    difference: {
                        type: "value",
                        labels: ["difference", "contrast"],
                        run: function() {
                            return BlendMode.DIFFERENCE;
                        }
                    },
                    exclusion: {
                        type: "value",
                        labels: ["exclusion", "contrast"],
                        run: function() {
                            return BlendMode.EXCLUSION;
                        }
                    },
                    hue: {
                        type: "value",
                        labels: ["hue"],
                        run: function() {
                            return BlendMode.HUE;
                        }
                    },
                    saturation: {
                        type: "value",
                        labels: ["saturation"],
                        run: function() {
                            return BlendMode.SATURATION;
                        }
                    },
                    color: {
                        type: "value",
                        labels: ["color"],
                        run: function() {
                            return BlendMode.COLOR;
                        }
                    },
                    luminosity: {
                        type: "value",
                        labels: ["luminosity", "gray", "black", "white"],
                        run: function() {
                            return BlendMode.LUMINOSITY;
                        }
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var constants = pageItemMethods.methods.blendMode.constants;
                    var randomConst = rouletteFromProbToRun(constants);
                    randomSubMethod.run(randomConst.value);
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            fillColor: {
                minProbToRun: 0.2,
                type: "style",
                labels: ["fill"],
                subMethods: {
                    noFill: {
                        ignoreInEvolution: true,
                        labels: ["nofill", "empy"],
                        run: function() {
                            return "None"
                        }
                    },
                    randomColor: {
                        minProbToRun: 0.6, //isto tem expoennte 3 por isso é sempre muito menos que isto. 0.8 = 0.2
                        labels: ["random", "color", "plane", "simple" /*adiciona aqui todas as labels das cores*/ ],
                        run: function(opts) {
                            var group = doc().colorGroups.itemByName("eD.colors");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre uma cor, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    },
                    randomGradient: {
                        labels: ["random", "gradient", "smooth", "complex", /*adiciona aqui todas as labels dos gradientes*/ ],
                        run: function(opts) {
                            var group = doc().colorGroups.itemByName("eD.gradients");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre um gradiente, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    }
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var it = selectedItem;
                    var c = randomSubMethod.run(opts);

                    var user = (opts && opts.subMethod); //i.e. triggered in playground
                    var isTextBox = selectedItem instanceof TextFrame;
                    var sameTextColor = c && it.hasOwnProperty("texts") && it.texts[0].fillColor.id == c.id;

                    if (user || !isTextBox) //in evo mode, will not fill textboxes. remove this condition if reconsider
                        if (c && !sameTextColor) it.fillColor = c;

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            strokeColor: {
                type: "style",
                labels: ["stroke", "frame", "around", "box", "border"],
                subMethods: {
                    /*noStroke: {
                        labels: ["nostroke", "no"],
                        run: function () {
                            //$.writeln("2.1")
                            return "None"
                        }
                    },*/
                    randomColor: {
                        labels: ["random", "color", "plane"],
                        run: function() {
                            var group = doc().colorGroups.itemByName("eD.colors");
                            var c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            return c;
                        }
                    },
                    randomGradient: {
                        labels: ["random", "gradient", "smooth", "complex"],
                        run: function(opts) {
                            var group = doc().colorGroups.itemByName("eD.gradients");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre um gradiente, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    }
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                    if (!(selectedItem instanceof Image)) {
                        var c = randomSubMethod.run();
                        var w = selectedItem.strokeWeight;
                        selectedItem.strokeColor = c
                        selectedItem.strokeWeight = w;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            strokeWeight: {
                type: "style",
                labels: ["stroke", "border", "outline", "frame"],
                subMethods: {
                    none: {
                        labels: ["none", "no", "basic", "clean", "minimum", "less", "clear", "modest", "minus", "minimal"],
                        run: function() {
                            return -1;
                        }
                    },
                    small: {
                        labels: ["small", "thin"],
                        run: function() {
                            return [595, 198]
                        }
                    },
                    medium: {
                        labels: ["medium", "normal"],
                        run: function() {
                            return [197, 59]
                        }
                    },
                    big: {
                        labels: ["big", "spacy", "bold"],
                        run: function() {
                            return [58, 39]
                        }
                    },
                    /*veryBig: {
                        labels: ["oversized", "huge", "extreme", "much", "over"],
                        run: function () {
                            [38, 10]
                        }
                    }*/
                },
                run: function(opts) {
                    if (!(selectedItem instanceof Image)) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var possibleDivisors = randomSubMethod.run();

                        var w = 0;
                        if (possibleDivisors != -1) {
                            var divisor = randomFloat(possibleDivisors[0], possibleDivisors[1]);
                            var smallerSide = width;
                            if (height < width) smallerSide = height;
                            w = smallerSide / divisor;
                        }

                        selectedItem.strokeWeight = w;

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            fillTint: {
                type: "style",
                labels: ["fill", "tint", "opacity", "transparency"],
                subMethods: {
                    fullTint: {
                        labels: ["full", "vivid"],
                        run: function() {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: ["high"],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: ["medium"],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*lowTint: {
                        labels: ["low", "sad", "autumn"],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },
                    randomTint: {
                        labels: ["random"],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var tone = randomSubMethod.run();
                    selectedItem.fillTint = tone;

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            strokeTint: {
                type: "style",
                labels: ["stroke", "tint", "opacity", "transparency"],
                subMethods: {
                    fullTint: {
                        labels: ["full", "vivid"],
                        run: function() {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: ["high"],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: ["medium"],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*lowTint: {
                        labels: ["low", "sad", "autumn"],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },
                    randomTint: {
                        labels: ["random"],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    if (!(selectedItem instanceof Image)) {
                        selectedItem.strokeTint = randomSubMethod.run();
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            opacity: {
                type: "style",
                labels: ["opacity", "transparent", "translucid", "glass", "through"],
                subMethods: {
                    full: {
                        labels: ["full", "vivid"],
                        run: function() {
                            return 100;
                        }
                    },
                    hight: {
                        labels: ["high"],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    medium: {
                        labels: ["medium"],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*low: {
                        labels: ["low", "sad", "autumn"],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },*/
                    /*none: { //TODO: nao usar nos mandatorios
                        labels: ["remove", "hide", "invisible"],
                        run: function() {
                            return 0;
                        }
                    },*/
                    /*random: {
                        labels: ["random"],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var v = randomSubMethod.run();
                    opacity(selectedItem, v);

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },

            //transform
            convertShape: {
                //minProbToRun: 0.2,
                type: "transform",
                labels: ["shape", "form", "geometric"],
                subMethods: {
                    convertToBeveledRectangle: {
                        labels: ["beveled", "rectangle", "corner", "cut", "box", "detail"],
                        run: function(it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_BEVELED_RECTANGLE);
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToToClosedPath: {
                        labels: ["closed", "path"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_CLOSED_PATH)
                        }
                    },*/
                    convertToInverseRoundedRectangle: {
                        labels: ["inverse", "rectangle", "concave", "cut", "corner", "negative", "detail", "box", "table", "spike"],
                        run: function(it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_INVERSE_ROUNDED_RECTANGLE)
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToLine: {
                        labels: ["line", "stroke", "string", "rope", "chord"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_LINE)
                        }
                    },*/
                    /*convertToOpenPath: {
                        labels: ["open", "path", "broken", "gap"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_OPEN_PATH)
                        }
                    },*/
                    convertToOval: {
                        labels: ["oval", "egg", "ellipse", "bird", "chicken", "circle"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_OVAL)
                        }
                    },
                    convertToPentagon: {
                        labels: ["pentagon", "polygon"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 5, 0)
                        }
                    },
                    convertToHexagon: {
                        labels: ["hexagon", "polygon"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 6, 0)
                        }
                    },
                    convertToOctahedron: {
                        labels: ["octahedron", "polygon"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 8, 0)
                        }
                    },
                    convertToRectangle: {
                        labels: ["rectangle", "4", "four", "box", "table", "90"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_RECTANGLE)
                        }
                    },
                    convertToRoundedRectangle: {
                        labels: ["rectangle", "rounded", "box", "smooth", "child", "kid", "children", "detail", "table"],
                        run: function(it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_ROUNDED_RECTANGLE);
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToStraightLine: {
                        labels: ["line", "straight", "stroke", "string", "rope", "chord"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_STRAIGHT_LINE)
                        }
                    },*/
                    convertToTriangle: {
                        labels: ["triangle", "3", "three", "sharp", "corner", "beak", "tip", "careful", "warning", "sign", "attention", "aggressive", "tree", "natural"],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_TRIANGLE)
                        }
                    },
                    //todo: dividir este metodo por varios tipos de estrela
                    convertToStar: {
                        labels: ["complex", "fire", "star"],
                        run: function(it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, p.polygonSides, p.starInsetPercentage);
                        }
                    }
                },
                run: function(opts) {
                    //se nao for uma linha, path ou imagem
                    if (
                        selectedItem.hasOwnProperty("convertShape") &&
                        !(selectedItem instanceof GraphicLine) &&
                        !(selectedItem instanceof Image)
                    ) {

                        //escolhe o metodo a usar
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        //se for texto, nao pode transformar em linha
                        var convertingToLineOrPath = ["convertToLine", "convertToStraightLine", "convertToOpenPath", "convertToToClosedPath"].indexOf(randomSubMethod.name) > -1;
                        if (selectedItem instanceof TextFrame && convertingToLineOrPath) {
                            $.writeln("cannot convert textFrame to line or path");
                            return "Ups... Cannot convert a text frame to a line or path.";
                        }

                        var convertShapeParams = {
                            polygonSides: Math.round(semiConceptualRandomBetween(3, 100)),
                            starInsetPercentage: Math.round(semiConceptualRandomBetween(5, 100)),
                            rectCornerRadius: semiConceptualRandomBetween(maxItemWidth() / 128, maxItemWidth())
                        }

                        //correr
                        var error = tryMutation(function(it) {
                            randomSubMethod.run(it, convertShapeParams);
                            if (selectedItem instanceof TextFrame) expandTextBox(it);
                        });
                        if (error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot convert this item to shape.";
                },
            },
            move: {
                minProbToRun: 0.2,
                type: "transform",
                labels: ["move", "translate", "displace"],
                //TODO: change position  with another item
                subMethods: {
                    //fully random
                    randomPos: {
                        type: "random",
                        labels: ["random"],
                        run: function(p, limit_dist) {
                            var b = p.b;

                            var minVisibleInsidePageW = b.width * p.minVisibleRatio;
                            var minVisibleInsidePageH = b.height * p.minVisibleRatio;

                            //move x
                            var maxDistLeft;
                            if (p.dir == "randomRight") maxDistLeft = b.right - (width / 2) - minVisibleInsidePageW;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterVert") maxDistLeft = b.right - (width / 3) - minVisibleInsidePageW;
                            else maxDistLeft = b.right - minVisibleInsidePageW;
                            if (limit_dist) maxDistLeft = min(b.width / 2, maxDistLeft); //max que pode andar para a esquerda //anda no maximo metade da sua largura

                            var maxDistRight;
                            if (p.dir == "randomLeft") maxDistRight = ((width / 2) - b.left) - minVisibleInsidePageW;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterVert") maxDistRight = ((width / 3 * 2) - b.left) - minVisibleInsidePageW;
                            else maxDistRight = (width - b.left) - minVisibleInsidePageW;
                            if (limit_dist) maxDistRight = min(b.width / 2, maxDistRight); //max que pode andar para a direita //anda no maximo metade da sua largura

                            //move y
                            var maxDistTop;
                            if (p.dir == "randomBottom") maxDistTop = b.bottom - (height / 2) - minVisibleInsidePageH;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterHoriz") maxDistTop = b.bottom - (height / 3) - minVisibleInsidePageH;
                            else maxDistTop = b.bottom - minVisibleInsidePageH;
                            if (limit_dist) maxDistTop = min(b.height / 2, maxDistTop); //max que pode andar para cima //anda no maximo metade da sua altura

                            var maxDistBottom;
                            if (p.dir == "randomTop") maxDistBottom = ((height / 2) - b.top) - minVisibleInsidePageH;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterHoriz") maxDistBottom = ((height / 3 * 2) - b.top) - minVisibleInsidePageH;
                            else maxDistBottom = (height - b.top) - minVisibleInsidePageH;
                            if (limit_dist) maxDistBottom = min(b.height / 2, maxDistBottom); //max que pode andar para baixo //anda no maximo metade da sua altura

                            //move
                            var offset = [randomFloat(-maxDistLeft, maxDistRight), randomFloat(-maxDistTop, maxDistBottom)];
                            var error = tryMutation(function(it) {
                                it.move([0, 0], offset);
                            });
                            if (error) return "Ups, " + error;
                        }
                    },
                    randomOffset: { //anda no maximo metade da sua largura/altura
                        type: "random",
                        labels: ["random"],
                        run: function(p) {
                            pageItemMethods.methods.move.subMethods.randomPos.run(p, true);
                        }
                    },

                    //smart placing
                    leftZone: {
                        type: "random",
                        labels: ["random", "left"],
                        run: function(p) {
                            p.dir = "randomLeft";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p); //(p, true) faz com que avance um pouco nessa direção (offset)
                        }
                    },
                    rightZone: {
                        type: "random",
                        labels: ["random", "right"],
                        run: function(p) {
                            p.dir = "randomRight";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    topZone: {
                        type: "random",
                        labels: ["random", "top"],
                        run: function(p) {
                            p.dir = "randomTop";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    bottomZone: {
                        type: "random",
                        labels: ["random", "bottom"],
                        run: function(p) {
                            p.dir = "randomBottom";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerZone: { //todo: pode ser melhorado
                        type: "random",
                        labels: ["random", "center"],
                        run: function(p) {
                            p.dir = "randomCenter";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerVertZone: {
                        type: "random",
                        labels: ["random", "center", "vertical"],
                        run: function(p) {
                            p.dir = "randomCenterVert";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerHorizZone: {
                        type: "random",
                        labels: ["random", "center", "horizonal"],
                        run: function(p) {
                            p.dir = "randomCenterHoriz";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },

                    //align //may be align should be a separate tool TODO
                    alignCenterVertical: {
                        type: "align",
                        labels: ["center", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                it.move([b.left, height / 2 - b.height / 2]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    alignCenterHorizontal: {
                        type: "align",
                        labels: ["center", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                it.move([width / 2 - b.width / 2, b.top]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    alignLeftMargin: {
                        type: "align",
                        labels: ["left", "inside", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                var marginLeft = page().marginPreferences.left;
                                it.move([marginLeft, b.top]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    alignRightMargin: {
                        type: "align",
                        labels: ["right", "inside", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                var marginRight = width - page().marginPreferences.right;
                                it.move([marginRight - b.width, b.top]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    alignTopMargin: {
                        type: "align",
                        labels: ["top", "fly", "sky", "inside", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                var marginTop = page().marginPreferences.top;
                                it.move([b.left, marginTop]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    alignBottomMargin: {
                        type: "align",
                        labels: ["bottom", "floor", "inside", "organized", "important", "read", "traditional", "tight", "default", "framed", "focus", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral"],
                        run: function(p) {
                            //move
                            var error = tryMutation(function(it) {
                                var b = bounds(it);
                                var marginBottom = height - page().marginPreferences.bottom;
                                it.move([b.left, marginBottom - b.height]);
                            });

                            if (error) return "Ups, " + error;
                        }
                    },
                    //TODO: align to page margins
                    //TODO: align to a random item

                },
                run: function(opts) {
                    opts = opts || {};
                    //é aqui que esta o erro: meter prints a ver onde

                    if (!(selectedItem instanceof Image)) { //todo: se for imagem, seleciona a frame.
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        referencePoint(TOP_LEFT);

                        var xAnchor = "left",
                            yAnchor = "top";

                        var b = getBounds(selectedItem); //quanto do item fica dentro da pagina, no minimo

                        var minVisibleRatio;
                        if (selectedItem instanceof TextFrame) minVisibleRatio = minVisibleRatio_textboxes; //se for texto, fica tudo dentro //todo: rever decisão
                        else minVisibleRatio = minVisibleRatio_all;

                        var defaultAxes = true;
                        if (opts.defaultAxes) defaultAxes = opts.defaultAxes;

                        randomSubMethod.run({
                            b: b,
                            minVisibleRatio: minVisibleRatio,
                            xAnchor: xAnchor,
                            yAnchor: yAnchor,
                            defaultAxes: defaultAxes
                        });

                        //snap to grid
                        if (randomSubMethod.type != "align") {
                            var moveToGridMethod = pageItemMethods.methods.moveToGrid;
                            if (randomFloat(0, 1) < moveToGridMethod.probToRun) {
                                moveToGridMethod.run({
                                    subMethod: "closestGuidesEitherSides"
                                });
                            }
                        }

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot move images, just their frames.";
                },
            },
            moveToGrid: {
                minProbToRun: 0.90,
                ignoreInEvolution: true,
                type: "transform",
                labels: ["organized", "important", "read", "traditional", "tight", "default", "proportional", "framed", "focus", "brick", "matrix", "stretch", "attention", "sharp", "closed", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral", ],

                constants: {
                    //direction
                    //random: {labels: []},
                    left: {
                        type: "x",
                        labels: ["left", "west", "back", "leaning", "balance", "side"]
                    },
                    right: {
                        type: "x",
                        labels: ["right", "east", "front", "fall", "unbalance", "side"]
                    },
                    bottom: {
                        type: "y",
                        labels: ["bottom", "down", "south", "fall", "sad", "low", "balance", "short", "base", "terrain", "small", "floor"]
                    },
                    top: {
                        type: "y",
                        labels: ["top", "up", "north", "sky", "happy", "high", "super", "extreme", "unbalance", "tall", "increment", "increasing", "big", "hairline", "huge", "oversized", "over", "much", "fly"]
                    },

                    /*topLeft: {labels:[], value: ""},
                    topRight: {labels:[], value: ""},
                    bottomLeft: {labels:[], value: ""},
                    bottomRight: {labels:[], value: ""},*/
                },
                subMethods: {
                    randomGridPos: {
                        type: "grid",
                        labels: ["align", "grid", "snap"],
                        run: function(p) {
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                            pageItemMethods.methods.moveToGrid.run({
                                subMethod: "closestGuides"
                            });
                        }
                    },
                    neighbourGuides: {
                        type: "grid",
                        labels: ["align", "grid", "snap"],
                        run: function(p) {
                            var b = p.b;

                            //not finished. snap to grid does not cooncern about the items leaving thr screen!!! TODO:
                            //to do so, use these vars to shoose the cols ans rows
                            var minVisibleInsidePageW = b.width * p.minVisibleRatio;
                            var minVisibleInsidePageH = b.height * p.minVisibleRatio;
                            //

                            var marginLeft = page().marginPreferences.left;
                            var marginTop = page().marginPreferences.top;
                            var cols = page().marginPreferences.columnsPositions; //array
                            var consts = pageItemMethods.methods.moveToGrid.constants;
                            var finalX, finalY;

                            //set achor and reference rulers
                            var xStart = 0, //index da 1º coluna para a qual pode fazer snap
                                yStart = 0; //index da 1º linha para a qual pode fazer snap
                            var xRef = b.left,
                                yRef = b.top;
                            if (p.xAnchor == "right") {
                                xStart = 1;
                                xRef = b.right;
                            }
                            if (p.yAnchor == "bottom") {
                                yStart = 1;
                                yRef = b.bottom;
                            }

                            //----------------------COLS
                            var chosenDistC = {};
                            if (p.dir == "snapToRow") {
                                finalX = 0;
                            } else {
                                var colDist = {
                                    left: Number.POSITIVE_INFINITY,
                                    right: Number.POSITIVE_INFINITY
                                }

                                //escolhe direção
                                var dir = consts.left;
                                if (consts.right.probToRun == consts.left.probToRun) {
                                    if (randomFloat(0, 1) > .5) dir = consts.right;
                                } else if (consts.right.probToRun > consts.left.probToRun) {
                                    dir = consts.right;
                                }

                                //definir default                                  
                                var chosenCol = {
                                    left: cols[0] + marginLeft,
                                    right: cols[1] + marginLeft
                                }
                                if (dir.name == "right")
                                    if (cols.length >= 2) {
                                        chosenCol.left = cols[cols.length - 2] + marginLeft;
                                        chosenCol.right = cols[cols.length - 1] + marginLeft;
                                    }

                                chosenDistC.left = chosenCol.left - b.left;
                                chosenDistC.right = chosenCol.right - b.right;
                                colDist.left = abs(chosenDistC.left);
                                colDist.right = abs(chosenDistC.right);

                                for (var i = 0; i < cols.length; i++) {
                                    var ref, refColDist;
                                    if (i % 2 === 0) {
                                        ref = b.left;
                                        refColDist = "left";
                                    } else {
                                        ref = b.right;
                                        refColDist = "right";
                                    }

                                    var d = (cols[i] + marginLeft) - ref;
                                    var correctDir = (dir.name == "left" && d <= 0) || (dir.name == "right" && d >= 0);
                                    if (p.around || p.close) correctDir = true;
                                    var md = abs(d);

                                    if (md < colDist[refColDist] && correctDir) {
                                        colDist[refColDist] = md;
                                        chosenCol[refColDist] = cols[i];
                                        chosenDistC[refColDist] = d;
                                    }

                                }

                                //se "p.around" fica com o eixo esclolhido antes, aleatoriamnete.
                                //$.writeln(p.xAnchor);
                                finalX = chosenDistC[p.xAnchor];
                                //se closer
                                if (p.close) {
                                    finalX = chosenDistC["left"];
                                    if (!p.defaultAxes && colDist["right"] < colDist["left"]) finalX = chosenDistC["right"];
                                }
                            }

                            //-----------------ROWS
                            var chosenDistR = {};
                            if (p.dir == "snapToColumn") {
                                finalY = 0;
                            } else {
                                var rows = objPropsToArray(page().guides, "location");
                                if (rows.length <= 0) alert("Err: page without guides (rows)");
                                rows.sort(function(a, b) {
                                    return a - b;
                                });

                                var rowDist = { // para guardar as distancias...
                                    top: Number.POSITIVE_INFINITY, //da margin-top à raw mais proxima dela
                                    bottom: Number.POSITIVE_INFINITY //e da margin-bottom à row mais proxima dela
                                }
                                //escolhe direção para se mover de acordo com a probToRun da constante top e bottom
                                var dirR = consts.top;
                                if (consts.bottom.probToRun == consts.top.probToRun) { //se for igual prob, escolhe random
                                    if (randomFloat(0, 1) > .5) dirR = consts.bottom;
                                } else if (consts.bottom.probToRun > consts.top.probToRun) {
                                    dirR = consts.bottom;
                                }
                                //definir raw default para onde mover
                                var chosenRow = { //para dir top
                                    top: rows[0], //se margem é top, a linha é a primeira
                                    bottom: rows[1] //se margem é bootom, a linha é a segunda
                                }
                                if (dirR.name == "bottom") {
                                    if (rows.length >= 2) {
                                        chosenRow.top = rows[rows.length - 2];
                                        chosenRow.bottom = rows[rows.length - 1];
                                    }
                                }

                                chosenDistR.top = chosenRow.top - b.top;
                                chosenDistR.bottom = chosenRow.bottom - b.bottom;
                                rowDist.top = abs(chosenDistR.top);
                                rowDist.bottom = abs(chosenDistR.bottom);

                                for (var i = 0; i < rows.length; i++) {
                                    var ref, refRowDist;
                                    if (i % 2 == 0) {
                                        ref = b.top;
                                        refRowDist = "top";
                                    } else {
                                        ref = b.bottom;
                                        refRowDist = "bottom";
                                    }

                                    var d = rows[i] - ref;
                                    var correctDir = (dirR.name == "top" && d <= 0) || (dirR.name == "bottom" && d >= 0);
                                    if (p.around || p.close) correctDir = true;
                                    var md = abs(d);

                                    if (md < rowDist[refRowDist] && correctDir) {
                                        rowDist[refRowDist] = md;
                                        chosenRow[refRowDist] = rows[i];
                                        chosenDistR[refRowDist] = d;
                                    }
                                }

                                finalY = chosenDistR[p.yAnchor];
                                if (p.close) {
                                    finalY = chosenDistR["top"];
                                    if (!p.defaultAxes && rowDist["bottom"] < rowDist["top"]) finalY = chosenDistR["bottom"]
                                }
                            }

                            //move para lá
                            var error = tryMutation(function(it) {
                                transform(it, "translate", [finalX, finalY]);
                            });
                            if (error) {
                                return "Ups, " + error;
                            }
                        }
                    },
                    closestGuides: {
                        type: "grid",
                        labels: ["align", "grid", "snap", "close"],
                        run: function(p) {
                            p.close = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p);
                        }
                    },
                    closestColumn: {
                        type: "grid",
                        labels: ["align", "grid", "snap", "close", "column"],
                        run: function(p) {
                            p.dir = "snapToColumn";
                            p.close = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p, true);
                        }
                    },
                    closestRow: {
                        type: "grid",
                        labels: ["align", "grid", "snap", "close", "row"],
                        run: function(p) {
                            p.dir = "snapToRow";
                            p.close = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p, true);
                        }
                    },
                    closestGuidesEitherSides: {
                        type: "grid",
                        labels: ["align", "grid", "snap", "close", "around"],
                        run: function(p) {
                            p.around = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p);
                        }
                    },
                    closestColsEitherSides: {
                        type: "grid",
                        labels: [
                            //"snap", "grid", "organized",
                            "align", "around"
                        ],
                        run: function(p) {
                            p.dir = "snapToColumn";
                            p.around = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p);
                        }
                    },
                    closestRowsEitherSides: {
                        type: "grid",
                        labels: [
                            //"snap","grid","organized",
                            "align", "around"
                        ],
                        run: function(p) {
                            p.dir = "snapToRow";
                            p.around = true;
                            pageItemMethods.methods.moveToGrid.subMethods.neighbourGuides.run(p);
                        }
                    }
                },
                run: function(opts) {
                    opts = opts || {};
                    //é aqui que esta o erro: meter prints a ver onde

                    if (!(selectedItem instanceof Image)) { //todo: se for imagem, seleciona a frame.
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        //Se nao ha guides, cria-las
                        var cols = page().marginPreferences.columnsPositions;
                        var rows = objPropsToArray(page().guides, "location");
                        if (cols.length < 2 || rows.length < 2) pageMethods.methods.createGrid.run({});

                        //achor
                        referencePoint(TOP_LEFT);

                        var xAnchor = "left",
                            yAnchor = "top";

                        if (!opts.defaultAxes) { //o snap pode usar diferentes eixos
                            var cons = pageItemMethods.methods.moveToGrid.constants;
                            var xAs = filterSubObjsByType(cons, "x");
                            var yAs = filterSubObjsByType(cons, "y");
                            xAnchor = rouletteFromProbToRun(xAs).name;
                            yAnchor = rouletteFromProbToRun(yAs).name;
                        }

                        //quanto do item fica dentro da pagina, no minimo
                        var b = getBounds(selectedItem);

                        var minVisibleRatio;
                        if (selectedItem instanceof TextFrame) minVisibleRatio = minVisibleRatio_textboxes; //se for texto, fica tudo dentro //todo: rever decisão
                        else minVisibleRatio = minVisibleRatio_all;

                        var defaultAxes = true;
                        if (opts.defaultAxes) defaultAxes = opts.defaultAxes;

                        randomSubMethod.run({
                            b: b,
                            minVisibleRatio: minVisibleRatio,
                            xAnchor: xAnchor,
                            yAnchor: yAnchor,
                            defaultAxes: defaultAxes
                        });

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot move images, just their frames.";
                },
            },
            moveZ: {
                type: "transform",
                labels: ["move", "z", "depth"],
                subMethods: {
                    front: {
                        labels: ["front"],
                        run: function() {
                            arrange(selectedItem, FRONT);
                        }
                    },
                    back: {
                        labels: ["back"],
                        run: function() {
                            arrange(selectedItem, BACK);
                        }
                    },
                    forward: {
                        labels: ["forward"],
                        run: function() {
                            arrange(selectedItem, FORWARD);
                        }
                    },
                    backward: {
                        labels: ["backward"],
                        run: function() {
                            arrange(selectedItem, BACKWARD);
                        }
                    }
                },
                run: function(opts) {
                    if (!(selectedItem instanceof Image)) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        randomSubMethod.run();
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "It's an image. did not movez"
                }
            },
            size: {
                minProbToRun: 0.2,
                type: "transform",
                labels: ["size"],
                //constants: big, small, medium....
                subMethods: {
                    //1.1 random
                    //1.3 random defined-ranges (uma função; varias constantes)
                    /*veryBig: {
                        labels: ["big", "very"],
                        run: function() {
                            return [
                                randomFloat(width, width * 2),
                                randomFloat(height, height * 2)
                            ]
                        }
                    },*/
                    big: {
                        labels: ["big", "large", "heavy",
                            /*depois trocar para o verybig: */
                            "very", "super", "extreme", "huge", "oversized", "much", "long", "full", "important"
                        ],
                        run: function() {
                            return [
                                randomFloat(width / 2, width),
                                randomFloat(height / 2, height)
                            ]
                        }
                    },
                    medium: {
                        labels: ["medium", "normal", "default", "half", "uniform", "reference"],
                        run: function() {
                            return [
                                randomFloat(width / 4, width / 2),
                                randomFloat(height / 4, height / 2)
                            ]
                        }
                    },
                    small: {
                        labels: ["small", "mini",
                            /*depois trocar para o verysmall: */
                            "spike", "mini", "divide", "bit", "slice", "breathe", "clear", "empy", "void", "minimum", "minus", "modest", "detail", "nothing"
                        ],
                        run: function() {
                            return [
                                randomFloat(width / 6, width / 4), //todo, trocar de volta para / 8, 
                                randomFloat(height / 6, height / 4) //todo, trocar de volta para / 8, 
                            ]
                        }
                    },
                    /*verySmall: {
                        labels: ["big"],
                        run: function() {
                            return [
                                randomFloat(width / 64, width / 8),
                                randomFloat(height / 64, height / 8)
                            ]
                        }
                    }*/

                    //TODO: horizontal, vertical...
                    //TODO: tamanho de x colunas/linhas (nao importa se esta alinhado)
                    //TODO: size proportionaly

                    //2.4 text related
                    adjustToText: {
                        type: "text",
                        labels: [],
                        run: function(p) {
                            expandTextBox(selectedItem);
                            return null;
                        }
                    }
                },
                run: function(opts) {
                    var snapedToGrid = false;
                    if (!(selectedItem instanceof Image)) {

                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts, true);
                        var p = getTransformationProperties(randomSubMethod, opts);
                        //$.writeln(randomSubMethod.name);
                        var size = randomSubMethod.run(p);

                        if (size != null) {
                            sizeHelper(p, size);

                            //snap to grid
                            var sizeGridRel = pageItemMethods.methods.sizeGridRelative;
                            if (randomFloat(0, 1) < sizeGridRel.probToRun) {
                                sizeGridRel.run({
                                    subMethod: "closestGuides",
                                    adjust: false,
                                    defaultAxes: true
                                });
                                snapedToGrid = true;
                            }

                            //fit images
                            if (selectedItem.hasOwnProperty("fit")) {
                                if (selectedItem.hasOwnProperty("images"))
                                    if (selectedItem.images.length > 0) {
                                        selectedItem.fit(FitOptions.CONTENT_AWARE_FIT);
                                    }
                            }

                            //fit texts
                            fitTextToTextBox(selectedItem) //expandTextBox(selectedItem);

                        } else return "Sorry, something went wrong...";

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod. Snaped to grid? " + snapedToGrid;

                    } else return "Sorry, cannot resize images, just their frames.";
                }
            },
            sizeGridRelative: {
                minProbToRun: 0.90,
                ignoreInEvolution: true,
                type: "transform",
                labels: ["organized", "important", "read", "traditional", "tight", "default", "proportional", "framed", "focus", "brick", "matrix", "stretch", "attention", "sharp", "closed", "geometric", "form", "static", "modest", "clear", "minimal", "clean", "shape", "quad", "square", "box", "divide", "order", "base", "normal", "uniform", "balance", "straight", "neutral", ],
                subMethods: {
                    //2.1 grid random
                    randomColumn: {
                        type: "grid",
                        labels: ["medium", "normal"],
                        run: function(p) {
                            var b = p.b;
                            var marginLeft = page().marginPreferences.left;
                            //escolhe uma coluna random, maior que X (coluna ímpar)
                            var cols = page().marginPreferences.columnsPositions; //array
                            var rightCols = [];
                            var xStart = 1;
                            if (p.xAnchor == "right") xStart = 0

                            //get possible columns
                            for (var i = xStart; i < cols.length; i += 2) {
                                var colX = cols[i] + marginLeft;
                                if (p.xAnchor == "left" && colX - b.left > p.minObjSize) rightCols.push(colX);
                                else if (p.xAnchor == "right" && b.right - colX > p.minObjSize) rightCols.push(colX);
                            }

                            //size
                            var finalWidth = b.right - b.left;
                            var finalHeight = b.bottom - b.top;
                            var finalColX = b.right;
                            if (p.xAnchor == "right") finalColX = b.left;

                            if (rightCols.length > 0) {
                                finalColX = rightCols[randomIndex(rightCols)];
                                if (p.xAnchor == "left") finalWidth = finalColX - b.left;
                                else if (p.xAnchor == "right") finalWidth = b.right - finalColX;
                            }
                            return [finalWidth, finalHeight];
                        }
                    },
                    randomRow: {
                        type: "grid",
                        labels: [],
                        run: function(p) {
                            var b = p.b;
                            //escolhe a posição y mais proxima (linha ímpar)
                            var rows = objPropsToArray(page().guides, "location");
                            rows.sort(function(a, b) {
                                return a - b;
                            });
                            var rightRows = [];
                            var yStart = 1;
                            if (p.yAnchor == "bottom") yStart = 0

                            //get possible rows
                            for (var i = yStart; i < rows.length; i += 2) {
                                if (p.yAnchor == "top" && rows[i] - b.top > p.minObjSize) rightRows.push(rows[i]); //para nao fazer tamanho negativo, só ajusta de fr uma guia depois do y do item
                                else if (p.yAnchor == "bottom" && b.bottom - rows[i] > p.minObjSize) rightRows.push(rows[i]);
                            }

                            //size
                            var finalWidth = b.right - b.left;
                            var finalHeight = b.bottom - b.top;
                            var finalRowY = b.bottom;
                            if (p.yAnchor == "bottom") finalColX = b.top;

                            if (rightRows.length > 0) {
                                var finalRowY = rightRows[randomIndex(rightRows)];
                                if (p.yAnchor == "top") finalHeight = finalRowY - b.top;
                                else if (p.yAnchor == "bottom") finalHeight = b.bottom - finalRowY;
                            }

                            return [finalWidth, finalHeight];
                        }

                    },
                    randomGuides: {
                        type: "grid",
                        labels: [],
                        run: function(p) {
                            var finalWidth = pageItemMethods.methods.sizeGridRelative.subMethods.randomColumn.run(p);
                            var finalHeight = pageItemMethods.methods.sizeGridRelative.subMethods.randomRow.run(p);
                            return [finalWidth[0], finalHeight[1]]; //w, h
                        }
                    },
                    //2.2 grid closer
                    closestColumn: {
                        type: "grid",
                        labels: [],
                        run: function(p) {
                            var b = p.b;

                            var marginLeft = page().marginPreferences.left;
                            //escolhe a posição x mais proxima (coluna ímpar)
                            var cols = page().marginPreferences.columnsPositions; //array
                            var closerCol = null;
                            var colDist = Number.POSITIVE_INFINITY;
                            var xStart = 1;
                            var movingAxis = b.right;
                            if (p.xAnchor == "right") {
                                xStart = 0;
                                movingAxis = b.left;
                            }

                            for (var i = xStart; i < cols.length; i += 2) {
                                var colX = cols[i] + marginLeft;

                                var rightCol =
                                    (p.xAnchor == "left" && colX - b.left > p.minObjSize) ||
                                    (p.xAnchor == "right" && b.right - colX > p.minObjSize);
                                if (rightCol) {
                                    var d = abs(colX - movingAxis);
                                    if (d < colDist) {
                                        colDist = d;
                                        closerCol = colX;
                                    }
                                }
                            }

                            //size
                            var finalWidth = b.right - b.left;
                            var finalHeight = b.bottom - b.top;
                            if (closerCol != null) {
                                if (p.xAnchor == "left") finalWidth = closerCol - b.left;
                                else if (p.xAnchor == "right") finalWidth = b.right - closerCol;
                            }

                            return [finalWidth, finalHeight];
                        }
                    },
                    closestRow: {
                        type: "grid",
                        labels: [],
                        run: function(p) {
                            var b = p.b;
                            //escolhe a posição y mais proxima (linha ímpar)
                            var rows = objPropsToArray(page().guides, "location");
                            rows.sort(function(a, b) {
                                return a - b;
                            });
                            var closerRow = null;
                            var rowDist = Number.POSITIVE_INFINITY;
                            var yStart = 1;
                            var movingAxis = b.bottom;
                            if (p.yAnchor == "bottom") {
                                yStart = 0;
                                movingAxis = b.top;
                            }

                            for (var i = yStart; i < rows.length; i += 2) {
                                var rightRow =
                                    (p.yAnchor == "top" && rows[i] - b.top > p.minObjSize) ||
                                    (p.yAnchor == "bottom" && b.bottom - rows[i] > p.minObjSize);
                                if (rightRow) { //para nao fazer tamanho negativo, só ajusta de fr uma guia depois do y do item
                                    var d = abs(rows[i] - movingAxis);
                                    if (d < rowDist) {
                                        rowDist = d;
                                        closerRow = rows[i];
                                    }
                                }
                            }
                            //size
                            var finalWidth = b.right - b.left;
                            var finalHeight = b.bottom - b.top;
                            if (closerRow != null) {
                                if (p.yAnchor == "top") finalHeight = closerRow - b.top;
                                else if (p.yAnchor == "bottom") finalHeight = b.bottom - closerRow;
                            }

                            return [finalWidth, finalHeight];
                        }
                    },
                    closestGuides: {
                        type: "grid",
                        labels: [],
                        run: function(p) {
                            //size
                            var finalWidth = pageItemMethods.methods.sizeGridRelative.subMethods.closestColumn.run(p);
                            var finalHeight = pageItemMethods.methods.sizeGridRelative.subMethods.closestRow.run(p);
                            return [finalWidth[0], finalHeight[1]];
                        }
                    }
                },
                run: function(opts) {
                    if (!(selectedItem instanceof Image)) {
                        //Se nao ha guides, cria-las
                        var cols = page().marginPreferences.columnsPositions;
                        var rows = objPropsToArray(page().guides, "location");
                        if (cols.length < 2 || rows.length < 2) pageMethods.methods.createGrid.run({});

                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var p = getTransformationProperties(randomSubMethod, opts);
                        //$.writeln(randomSubMethod.name);
                        var size = randomSubMethod.run(p);

                        if (size != null) {
                            sizeHelper(p, size);

                            if (!opts.hasOwnProperty("adjust") && opts.adjust != false) {
                                //ajust images
                                if (selectedItem.hasOwnProperty("fit")) {
                                    if (selectedItem.hasOwnProperty("images"))
                                        if (selectedItem.images.length > 0) {
                                            selectedItem.fit(FitOptions.CONTENT_AWARE_FIT);
                                        }
                                }
                                //adjust text
                                fitTextToTextBox(selectedItem) //expandTextBox(selectedItem);
                            }

                        } else return "Sorry, something went wrong... :S";

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot resize images, just their frames.";

                }

            },
            rotate: {
                type: "transform",
                labels: ["rotate", "dance", "unbalance", "tilt", "movement", "move", "leaning", "displace"],
                subMethods: {
                    none: { //TODO: rotate.reset() la fora, em vez deste none.
                        labels: ["no", "none", "straight", "neutral", "organized"],
                        run: function(v) {
                            return 0;
                        }
                    },
                    veryLittle: {
                        labels: ["few", "little", "very"],
                        run: function(v) {
                            return randomFloat(180 / 64, 180 / 8);
                        }
                    },
                    third: {
                        type: "ang",
                        labels: ["third", "three"],
                        run: function(v) {
                            return 180 / 3;
                        }
                    },
                    little: {
                        type: "ang",
                        labels: ["few", "little"],
                        run: function(v) {
                            return randomFloat(180 / 8, 45);
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: ["medium"],
                        run: function(v) {
                            return randomFloat(45, 90);
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: ["quarter", "four",
                            /*depois mover para outros que façam mais sentido:*/
                            "extreme", "super", "very", "diagonal"
                        ],
                        run: function(v) {
                            return 90;
                        }
                    },
                    /*half: {
                        type: "ang",
                        labels: ["half"],
                        run: function(v) {
                            return 180;
                        }
                    },
                    very: {
                        type: "ang",
                        labels: ["very"],
                        run: function(v) {
                            return randomFloat(90, 270);
                        }
                    },
                    veryMuch: {
                        type: "ang",
                        labels: ["very", "much"],
                        run: function(v) {
                            return randomFloat((Math.PI / 4) * 3, (Math.PI * 2) - (Math.PI / 64));
                        }
                    }*/
                },
                run: function(opts) {
                    //TODO: constants to define ref point
                    referencePoint(CENTER);
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var ang = randomSubMethod.run();
                    if (!(selectedItem instanceof Image)) {
                        var error = tryMutation(function(it) {
                            it.rotationAngle = ang;
                        });
                        if (error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot rotate images, just their frames.";
                }
            },
            flipItem: {
                type: "transform",
                labels: ["flip", "mirror", "invert", "contrary", "shift", "surprise", "around", "unbalance", "different", "complex", "deformed", "inverse"],
                subMethods: {
                    none: {
                        type: "Flip",
                        labels: ["straight", "none", "default", "organized", "neutral", "normal"],
                        run: function(it) {
                            return Flip.NONE
                        }
                    },
                    horizontal: {
                        type: "Flip",
                        labels: ["horizontal"],
                        run: function(it) {
                            return Flip.HORIZONTAL
                        }
                    },
                    vertical: {
                        type: "Flip",
                        labels: ["vertical", "down", "upside"],
                        run: function(it) {
                            return Flip.VERTICAL
                        }
                    },
                    horizontalAndVertical: {
                        type: "Flip",
                        labels: ["horizontal", "vertical"],
                        run: function(it) {
                            return Flip.HORIZONTAL_AND_VERTICAL
                        }
                    },
                    both: {
                        type: "Flip",
                        labels: ["both"],
                        run: function(it) {
                            return Flip.BOTH
                        }
                    },
                },
                constants: {
                    //anchor point
                    // usar sempre center para o elemento nao sair da pagina
                    /*bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: ["bottom", "center"]
                    },
                    bottomLeftAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_LEFT_ANCHOR,
                        labels: ["bottom", "left"]
                    },
                    bottomRightAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_RIGHT_ANCHOR,
                        labels: ["bottom", "right"]
                    },
                    centerAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.CENTER_ANCHOR,
                        labels: ["center"]
                    },
                    rightCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.RIGHT_CENTER_ANCHOR,
                        labels: ["right", "center"]
                    },
                    bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: ["bottom", "center"]
                    },
                    bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: ["bottom", "center"]
                    },
                    topCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_CENTER_ANCHOR,
                        labels: ["top", "center"]
                    },
                    topLeftAchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_LEFT_ANCHOR,
                        labels: ["top", "left"]
                    },
                    topRightAchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_RIGHT_ANCHOR,
                        labels: ["top", "right"]
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    /*var constants = pageItemMethods.methods.flipItem.constants;
                    var axisConstants = filterSubObjsByType(constants, "Flip");
                    var randomAxis = rouletteFromProbToRun(axisConstants);*/

                    //$.writeln("        " + randomAxis.value);
                    //var achorConstants = filterSubObjsByType(constants, "AnchorPoint");
                    //var randomAnchor = rouletteFromProbToRun(achorConstants);
                    //$.writeln("        " + randomAnchor.value);
                    if (selectedItem.hasOwnProperty("flipItem")) {
                        var axis = randomSubMethod.run();
                        selectedItem.flipItem(axis, AnchorPoint.CENTER_ANCHOR);
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Looks like this item cannot be flipped";
                }
            },
            shear: {
                type: "transform",
                labels: ["shear", "tilt", "leaning", "unbalance", "different", "fire", "aggressive", "extreme"],
                subMethods: {
                    //TODO: method for the right and for the left (negative)
                    none: {
                        labels: ["no", "none", "straight", "default", "organized", "neutral", "normal"],
                        run: function(v) {
                            return 0;
                        }
                    },
                    veryLittle: {
                        labels: ["few", "little", "very"],
                        run: function(v) {
                            return randomInt(5, 10);
                        }
                    },
                    little: {
                        type: "ang",
                        labels: ["few", "little"],
                        run: function(v) {
                            return randomInt(11, 20);
                        }
                    },
                    /*mediumSmall: {
                        type: "ang",
                        labels: ["medium", "small"],
                        run: function(v) {
                            return randomInt(21, 30);
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: ["medium"],
                        run: function(v) {
                            return randomInt(31, 44);
                        }
                    },
                    half: {
                        type: "ang",
                        labels: ["half"],
                        run: function(v) {
                            return 45;
                        }
                    },*/
                    /*mediumHigh: {
                        type: "ang",
                        labels: ["medium"],
                        run: function(v) {
                            return randomInt(46, 60);
                        }
                    },*/
                    /*very: {
                        type: "ang",
                        labels: ["very"],
                        run: function(v) {
                            return randomInt(61, 70);
                        }
                    },*/
                    /*veryMuch: {
                        type: "ang",
                        labels: ["very", "much"],
                        run: function(v) {
                            return randomInt(71, 89);
                        }
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var ang = randomSubMethod.run();
                    if (!(selectedItem instanceof Image)) {
                        var error = tryMutation(function(it) {
                            /*if (selectedItem.hasOwnProperty("convertShape") && selectedItem instanceof TextFrame) {
                                it.convertShape(ConvertShapeOptions.CONVERT_TO_RECTANGLE);
                            }*/
                            it.shearAngle = ang;
                        });
                        if (error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot shear images, just their frames.";

                }
            },
            fit: {
                type: "transform",
                labels: ["fit", "organized"],
                subMethods: {
                    /*applyFrameFittingOptions: {
                        run: function() {
                            return FitOptions.APPLY_FRAME_FITTING_OPTIONS;
                        },
                        labels: ["center", "middle", "framed"]
                    },*/
                    centerContent: {
                        run: function() {
                            return FitOptions.CENTER_CONTENT;
                        },
                        labels: ["center", "middle"]
                    },
                    contentAwareFit: {
                        run: function() {
                            return FitOptions.CONTENT_AWARE_FIT;
                        },
                        labels: ["center", "middle", "framed", "focus"]
                    },
                    /*contentToFrame: {
                        run: function() {
                            return FitOptions.CONTENT_TO_FRAME;
                        },
                        labels: ["center", "middle", "framed"]
                    },*/
                    fillProportionally: {
                        run: function() {
                            return FitOptions.FILL_PROPORTIONALLY
                        },
                        labels: ["center", "middle", "proportional"]
                    },
                    /*frameToContent: {
                        run: function() {
                            return FitOptions.FRAME_TO_CONTENT
                        },
                        labels: ["center", "middle", "framed"]
                    },*/
                    proportionally: {
                        run: function() {
                            return FitOptions.PROPORTIONALLY
                        },
                        labels: ["center", "middle", "proportional"]
                    }
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    if (selectedItem.hasOwnProperty("fit") && !(selectedItem instanceof TextFrame)) {
                        selectedItem.fit(randomSubMethod.run());
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, look like I cannot fit this item.";
                }
            },
            /*clearObjectStyleOverrides: {
                labels: ["clear","empy","void","simple","stroke","less","minimum","minus","modest","basic","raw"],
                run: function() {
                    selectedItem.clearObjectStyleOverrides()
                }
            },*/
            /*clearTransformations: {
                labels: ["clear","straight"","static","still","simple","raw"],
                run: function() {
                    var error = tryMutation(function(it) {
                        it.clearTransformations();
                    });
                    
                }
            },*/

            //text
            textFont: {
                minProbToRun: 0.2,
                type: "text",
                labels: ["font"],
                subMethods: {
                    randomNum: {
                        hideFromUser: true,
                        //ignoreInEvolution: true,
                        labels: ["random", "extreme", "surprise", ],
                        run: function(numFonts) {
                            var finalWeight;
                            //$.writeln("commonProps: " + commonProps.length)

                            if (!numFonts) {
                                if (!commonRandomNum) commonRandomNum = randomInt(1, 3);
                                numFonts = commonRandomNum;
                            }

                            if (commonProps.length != numFonts) {
                                //$.writeln("added")
                                //se ainda nao escolheu N diferentes, continua a selecionar random
                                //font family
                                var constants = pageItemMethods.methods.textFont.constants;
                                var randomFamily = rouletteFromProbToRun(constants);
                                //font weight
                                var randomWeight = rouletteFromProbToRun(randomFamily.weights).value
                                //salvar para a proxima iteração
                                commonProps.push(randomWeight);
                                //final
                                finalWeight = randomWeight
                            } else {
                                //$.writeln("collected")
                                // se ja escolheu N diferentes, seleciona das que ja escolheu
                                //isto garante que se é para ser 2 random, ha sempre 2 random e o resto é das que ja escolheu antes
                                //se nao fizesse assim, as vezes, podia escolher sempre a mesma random mesmo havendo 2 ou mais para escolher
                                finalWeight = commonProps.randomItem();
                            }
                            $.writeln(finalWeight.name)
                            typo(selectedItem, "appliedFont", finalWeight);
                        }
                    },
                    oneRandom: {
                        labels: ["random", "equaly", "uniform", "neutral", "linear", "simple", "balance", "group", "base", "clean", "minimal", "less", "clear", "minimum", "minus", "modest", "raw", "organized"],
                        run: function() {
                            pageItemMethods.methods.textFont.subMethods.randomNum.run(1);
                        }
                    },
                    twoRandom: {
                        labels: [],
                        run: function() {
                            pageItemMethods.methods.textFont.subMethods.randomNum.run(2);

                        }
                    },
                    threeRandom: {
                        labels: [],
                        run: function() {
                            pageItemMethods.methods.textFont.subMethods.randomNum.run(3);

                        }
                    },
                    randomInUse: {
                        labels: [],
                        run: function(canBeItsOwnFont) {
                            if (canBeItsOwnFont == undefined) canBeItsOwnFont = false;
                            var page = app.activeWindow.activePage;

                            if (commonProps.length <= 0)
                                commonProps = page.textFrames.everyItem().texts.everyItem().appliedFont.unique();

                            var allFontsInUse /*in the page*/ = [].concat(commonProps);

                            if (allFontsInUse.length > 0) {
                                if (!canBeItsOwnFont) allFontsInUse.removeItem(typo(selectedItem, "appliedFont"));
                                var randomFontInUse = allFontsInUse.randomItem();
                                typo(selectedItem, "appliedFont", randomFontInUse);
                            } else {
                                //alert("so ha uma fonte na pagina")
                            }
                        }

                    }
                },
                constants: fontConstants, //initiated in initFonts() e passado como arg em init()
                //TODO: chage font only of a char, of a line, of a paragram
                //more likely to change words related to keywords
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        randomSubMethod.run();
                        expandTextBox(selectedItem);

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod." +
                            "(sometimes, fonts may not change because the newly selected fonts might not have the glyphs needed).";
                    } else {
                        //alert("Sorry, this method must be applied to text items");
                        return "Sorry, this method must be applied to text items."
                    }
                }
            },
            textSize: { //rever isto quando tiver hierarquia
                //minProbToRun: 0.2,
                type: "text",
                labels: ["text", "size", "body"],
                subMethods: {
                    random: {
                        labels: ["random"],
                        run: function() {
                            //var subMethods = pageMethods.methods.textBodySize.subMethods;
                            //return rouletteFromProbToRun(subMethods).run();
                            return randomInt(15, 150);
                        }
                    },
                    /*textBodySize: {
                        labels: ["body","read","normal"],
                        run: function () {
                            return textBodySize;
                        }
                    },
                    biggerThanTextBody: {
                        labels: ["big","title","subtitle","important","head","attention"],
                        run: function () {
                            var level = randomInt(2, 10);
                            return textBodySize * (Math.pow(textHierachyRel, level));
                        }
                    },
                    smallerThanTextBody: {
                        labels: ["small","note","detail","info","partners","authors","label"],
                        run: function () {
                            //var level = randomInt(-2, -10);
                            var level = randomInt(-2, -4);
                            var newSize = textBodySize / (Math.pow(textHierachyRel, Math.abs(level)));
                            //check minSize
                            //var minSize = width / (595 / 4);
                            //var minSize = 4;
                            //if (newSize < minSize) newSize = -1;

                            return newSize;
                        }
                    },*/
                    fitTextToTextBox: {
                        type: "fit",
                        labels: ["fit"],
                        run: function() {
                            fitTextToTextBox(selectedItem);
                        }
                    }
                },
                //TODO: mudar tamanho num só paragrafo etc..
                //ir buscar tamanho de outro  texto existente
                //melhor: editar apenas estilos de texto no pageitems. 
                //no item apenas escolhe um estilo existente de acordo com a hierarquia
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var randomValue = randomSubMethod.run();

                        if (randomSubMethod.type != "fit") {
                            var textSizeAnterior = selectedItem.texts[0].pointSize;
                            var entrelinhaAnterior = selectedItem.texts[0].leading;
                            if (randomValue == -1) randomValue = textSizeAnterior; //em caso de se menor que o min. permitido
                            var it = selectedItem;
                            typo(it, "pointSize", randomValue);
                            //atualizar entrelinha proporcionalmente
                            if (entrelinhaAnterior != "AUTO" && entrelinhaAnterior != Leading.AUTO) {
                                var rel = randomValue / textSizeAnterior;
                                var newLeading = entrelinhaAnterior * rel;
                                typo(it, "leading", newLeading);
                            }
                            //ajusta sempre a caixa (caixas maiores que o texto so são possiveis com o meth size())
                            expandTextBox(selectedItem);
                        }
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, this method must be applied to text items."
                }
            },
            textColor: {
                minProbToRun: 0.2,
                type: "text",
                labels: ["fill"],
                subMethods: { //igual ao fillColor (depois trocar para serem os mesmos)
                    randomColor: {
                        labels: ["random", "color", "simple", "plane"],
                        run: function() {
                            return pageItemMethods.methods.fillColor.subMethods.randomColor.run();
                        }
                    },
                    randomGradient: {
                        labels: ["random", "gradient", "complex", "smooth"],
                        run: function() {
                            return pageItemMethods.methods.fillColor.subMethods.randomGradient.run();
                        }
                    }
                },
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var c = randomSubMethod.run();
                        if (c && selectedItem.fillColor.id != c.id) {
                            for (var i = 0; i < selectedItem.texts.length; i++) {
                                var t = selectedItem.texts[i];
                                t.fillColor = c;
                            }
                            return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                        }
                        return "Sorry, could not get a colour."
                    } else return "Sorry, this method must be applied to text items."

                }
            },
            justification: {
                minProbToRun: 0.2,
                type: "text",
                labels: ["text", "justify"],
                constants: {
                    //horizontal
                    awayFromBindingSide: {
                        type: "horizontal",
                        labels: ["away", "from", "binding", "side"],
                        value: Justification.AWAY_FROM_BINDING_SIDE
                    },
                    centerAlign: {
                        type: "horizontal",
                        labels: ["center", "middle", "balance", "align"],
                        value: Justification.AWAY_FROM_BINDING_SIDE
                    },
                    centerJustified: {
                        type: "horizontal",
                        labels: ["center", "middle", "balance", "justify", "side", "tight"],
                        value: Justification.CENTER_JUSTIFIED
                    },
                    fullyJustified: {
                        type: "horizontal",
                        labels: ["center", "middle", "balance", "justify", "full", "tight", "dance", "happy"],
                        value: Justification.FULLY_JUSTIFIED
                    },
                    leftAlign: {
                        type: "horizontal",
                        labels: ["left", "align", "side", "normal", "traditional"],
                        value: Justification.LEFT_ALIGN
                    },
                    rightAlign: {
                        type: "horizontal",
                        labels: ["right", "align", "side", "different", "contrary", "unbalance"],
                        value: Justification.RIGHT_ALIGN
                    },
                    rightJustified: {
                        type: "horizontal",
                        labels: ["right", "justify", "side", "tight", "different", "contrary", "unbalance"],
                        value: Justification.RIGHT_JUSTIFIED
                    },
                    toBindingSide: {
                        type: "horizontal",
                        labels: ["binding", "side"],
                        value: Justification.TO_BINDING_SIDE
                    }
                },
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var constants = pageItemMethods.methods.justification.constants;
                        var randomHoriz = rouletteFromProbToRun(constants).value;

                        for (var i = 0; i < selectedItem.texts.length; i++) {
                            var t = selectedItem.texts[i];
                            t.justification = randomHoriz;
                        }
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry,this method must be applied to text items."
                }
            },
            verticalAlign: {
                type: "text",
                labels: ["text", "align"],
                constants: {
                    //vertical
                    bottomAlign: {
                        type: "vertical",
                        labels: ["bottom", "align", "land", "down", "balance"],
                        value: VerticalJustification.BOTTOM_ALIGN
                    },
                    centerAlign: {
                        type: "vertical",
                        labels: ["center", "align", "middle", "balance"],
                        value: VerticalJustification.CENTER_ALIGN
                    },
                    justifyAlign: {
                        type: "vertical",
                        labels: ["justify", "align", "tight", "full", "dance", "movement", "space"],
                        value: VerticalJustification.JUSTIFY_ALIGN
                    },
                    topAlign: {
                        type: "vertical",
                        labels: ["top", "align", "sky", "up", "fly", "normal", "default", "minimal"],
                        value: VerticalJustification.TOP_ALIGN
                    }
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var constants = pageItemMethods.methods.verticalAlign.constants;
                        var randomVert = rouletteFromProbToRun(constants).value;
                        selectedItem.textFramePreferences.verticalJustification = randomVert;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, this method must be applied to text items."
                }
            },
            tracking: {
                minProbToRun: 0.1,
                type: "text",
                labels: ["tracking", "space", "letter"],
                subMethods: {
                    negative: {
                        labels: ["negative", "very", "join", "merge", "together", "short", "close"],
                        run: function() {
                            return randomInt(-50, -100)
                        }
                    },
                    small: {
                        labels: ["small", "short", "close"],
                        run: function() {
                            return randomInt(0, 20)
                        }
                    },
                    medium: {
                        labels: ["medium", "normal", "default"],
                        run: function() {
                            return randomInt(21, 50)
                        }
                    },
                    big: {
                        labels: ["big", "separated", "apart"],
                        run: function() {
                            return randomInt(51, 200)
                        }
                    },
                    veryBig: {
                        labels: ["very", "big", "separated", "apart", "dance", "movement", "space"],
                        run: function() {
                            return randomInt(201, 500)
                        }
                    },
                    overSized: {
                        labels: ["over", "extreme", "huge", "separated", "apart", "dance", "movement", "space"],
                        run: function() {
                            return randomInt(501, 1000)
                        }
                    }
                },
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var randomValue = randomSubMethod.run();

                        typo(selectedItem, "tracking", randomValue);
                        //TODO: variavel "autoAdjust" que o user pode checkar ou nao na interface
                        //i.e. autoAdjust texbox / textSize
                        fitTextToTextBox(selectedItem); //expandTextBox(selectedItem);
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, this method must be applied to text items."
                }
            },
            leading: {
                type: "text",
                labels: ["leading", "space", "line", "vertical"],
                subMethods: {
                    negative: {
                        labels: ["negative", "very", "join", "merge", "together"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 0.95, txtSize * 0.8)
                        }
                    },
                    small: {
                        labels: ["small", "short"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.01, txtSize * 1.1)
                        }
                    },
                    medium: {
                        labels: ["medium"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.11, txtSize * 1.2)
                        }
                    },
                    big: {
                        labels: ["big", "separated", "apart", "breathe"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.21, txtSize * 1.4)
                        }
                    },
                    veryBig: {
                        labels: ["very", "big", "separated", "apart", "space", "breathe"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.41, txtSize * 1.6)
                        }
                    },
                    overSized: {
                        labels: ["over", "extreme", "huge", "separated", "apart", "space", "breathe"],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.61, txtSize * 4)
                        }
                    }
                    /*,
                                        giant: {
                                            labels: ["over","extreme","huge","separated","apart"],
                                            run: function(txtSize) {
                                                return randomInt(txtSize * 4.1, txtSize * 50)
                                            }
                                        }*/

                },
                run: function(opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var txtSize = selectedItem.texts[0].pointSize;
                        var randomValue = randomSubMethod.run(txtSize);

                        typo(selectedItem, "leading", randomValue);
                        fitTextToTextBox(selectedItem); //expandTextBox(selectedItem);
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, this method must be applied to text items."
                }
            },
            //TODO: kerning
            //TODO:copiar estilo de um outro item
            //TODO:criar estilos de character e paragrafo no pagemethods; aqui, aplicar um  desses estilos  ao texto

            //repeat
            repeat: {
                ignoreInEvolution: true,
                type: "repeat",
                desc: "Repeats the selected items. Just keep clicking. I'll delete the previous series of repetions automatically. If you want a repeted item to stick, just user the 'Make Definitive' method on it.",
                labels: ["repeat", "duplicate", "copy", "replica", "many", "several", "much"],
                subMethods: {
                    linearX: {
                        //linear x
                        run: function(v) {
                            v.x = v.incx;
                            return v;
                        },
                        labels: ["linear", "horizont", "horizontal", "straight", "big", "lay", "down", "base", "platform", "bottom"],
                    },
                    linearY: {
                        //linear y
                        run: function(v) {
                            v.y = v.incy;
                            return v;
                        },
                        labels: ["linear", "vertical", "straight", "tower", "build", "building", "tall", "big", "up", "top"],
                    },
                    linearXY: {
                        //linear xy
                        run: function(v) {
                            v.x = v.incx;
                            v.y = v.incy;
                            return v;
                        },
                        labels: ["linear", "diagonal", "tilt", "drunk", "big", "slide"],
                    },
                    incX: {
                        //inc x
                        run: function(v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            return v;
                        },
                        labels: ["stretch", "increment", "increasing", "horizontal", "wider", "big"],
                    },
                    incy: {
                        //inc y
                        run: function(v) {
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: ["stretch", "increment", "increasing", "straight", "vertical", "taller", "big", "tower", "jump", "top", "skyscraper", "launch", "throw", "fall", "drop", "apart", "split"],
                    },
                    incXY: {
                        //inc xy
                        run: function(v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: ["stretch", "increment", "increasing", "throw", "apart", "split", "diagonal", "tilt", "drunk", "big", "slide"],
                    },
                    grid: {
                        run: function(v) {
                            var b = bounds(selectedItem);

                            if (v.currentColumnIndex > v.maxNumColumns || b.right >= width) {
                                v.currentColumnIndex = 0;
                                v.y = v.incy;
                                v.x = -(b.left - v.initialX);
                                $.writeln(b.left, v.initialX);
                            } else {
                                v.currentColumnIndex++;
                                v.x = abs(v.incx);
                                v.y = 0;
                            }

                            return v;
                        },
                        labels: ["grid", "matrix", "brick", "wall"],
                    },
                    polar: {
                        //polar
                        run: function(v) {
                            v.x = v.radius * Math.cos(v.angle);
                            v.y = v.radius * Math.sin(v.angle);
                            v.angle += v.angleInc;

                            if (randomFloat(0, 1) < v.probToInvertDirection) {
                                v.angleInc = -v.angleInc;
                                //v.angleIncMin = v.angleIncMax * -1;
                                //v.angleIncMax = v.angleIncMin * -1;
                            }
                            //v.angleInc = limit(v.angleInc, v.angleIncMin, v.angleIncMax);
                            return v;
                        },
                        labels: ["polar", "smooth", "waves", "snake", "rope", "wire", "road", "track", "dance", "movement", "drunk", "curve"],
                    },
                    polarIncAng: {
                        //polar inc ang
                        run: function(v) {
                            v.x = v.radius * Math.cos(v.angle);
                            v.y = v.radius * Math.sin(v.angle);
                            v.angle += v.angleInc;
                            v.angInc += v.angleIncInc;

                            if (randomFloat(0, 1) < v.probToInvertDirection) {
                                v.angleInc = -v.angleInc;
                                //v.angleIncMin = v.angleIncMax * -1;
                                //v.angleIncMax = v.angleIncMin * -1;
                            }
                            //v.angleInc = limit(v.angleInc, v.angleIncMin, v.angleIncMax);
                            return v;
                        },
                        labels: ["polar", "smooth", "waves", "snake", "rope", "wire", "road", "track", "dance", "movement", "drunk", "curve", "curly"],
                    },
                    polarIncRadius: {
                        //polar inc radius
                        run: function(v) {
                            v.x = v.radius * Math.cos(v.angle);
                            v.y = v.radius * Math.sin(v.angle);
                            v.angle += v.angleInc;
                            v.radius += v.radiusInc;

                            if (randomFloat(0, 1) < v.probToInvertDirection) {
                                v.angInc *= -1;
                                //v.angleIncMin = v.angleIncMax * -1;
                                //v.angleIncMax = v.angleIncMin * -1;
                            }
                            //v.angleInc = limit(v.angleInc, v.angleIncMin, v.angleIncMax);

                            return v;
                        },
                        labels: ["polar", "smooth", "waves", "snake", "rope", "wire", "road", "track", "dance", "movement", "drunk", "curve", "stretch", "increment", "increasing"],
                    },
                    polarIncAngAndRadius: {
                        //polar inc ang inc radius
                        run: function(v) {
                            v.x = v.radius * Math.cos(v.angle);
                            v.y = v.radius * Math.sin(v.angle);
                            v.radius += v.radiusInc;
                            v.angle += v.angleInc;
                            v.angleInc += v.angleIncInc;

                            if (randomFloat(0, 1) < v.probToInvertDirection) {
                                v.angInc *= -1;
                                //v.angleIncMin = v.angleIncMax * -1;
                                //v.angleIncMax = v.angleIncMin * -1;
                            }
                            //v.angleInc = limit(v.angleInc, v.angleIncMin, v.angleIncMax);

                            return v;
                        },
                        labels: ["rope", "wire", "road", "polar", "smooth", "waves", "dance", "movement", "drunk", "curve", "stretch", "increment", "increasing"],
                    },
                    espiral: {
                        //espiral
                        minRepetitions: 20,
                        run: function(v) {
                            v.x = v.radius * Math.cos(v.angle);
                            v.y = v.radius * Math.sin(v.angle);
                            v.radiusInc = abs(v.radiusInc);
                            v.radius += limit(v.radiusInc, v.radiusInc, v.radiusInc * 4);
                            v.angle += limit(v.angleInc, PI / 16, PI / 4);
                            return v;
                        },
                        labels: ["espiral", "polar", "smooth", "dance", "movement", "curve", "increment", "increasing", "rotate", "around"],
                    }
                    //TODO: inc up e depois inc down o raio e/ou ang!!!
                    //total random
                    //tudo  isto com variação de uma propriedade... tipo cor  ou tamanho...
                    //repetir grupos de coisas e nao apenas coisas individuais 
                },
                run: function(opts) {

                    //alert("Repeat tool");

                    //se o selectedItem nao for o item de origem nao faz mal porque o metodo
                    //abaixo redefine o selected item como tal
                    pageItemMethods.methods.removeRepeated.subMethods.removeAll.run();
                    var originalItem = selectedItem; //aqui o selected item já é o elemento de origem

                    var its = getPageItems();

                    var user = opts && opts.subMethod;
                    var maxNumberOfItems = Number.POSITIVE_INFINITY;
                    if (!user) maxNumberOfItems = 10;

                    if (its.length < maxNumberOfItems && !(selectedItem instanceof Image)) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        //num repetitions
                        var numRepetitions = semiConceptualRandomBetween(1, 5); //50
                        //if (randomSubMethod.init) randomSubMethod.init();
                        if (randomSubMethod.minRepetitions && numRepetitions < randomSubMethod.minRepetitions)
                            numRepetitions = randomSubMethod.minRepetitions;

                        //other variables
                        var radius = randomRadius();
                        var initialAng = randomFloat(0, Math.PI * 2);
                        var angleIncMin = Math.PI / 8;
                        var angleIncMax = Math.PI / 4;
                        var angInc = randomInc(angleIncMax - angleIncMin);
                        var allowInvertRadius = randomFloat(0, 1) < 0.5;
                        var b = bounds(selectedItem);
                        var initialX = b.left;

                        var v = {
                            x: 0, //offset (relative pos from prev elm)
                            y: 0, //offset (relative pos from prev elm)
                            incx: randomRadius(true),
                            incy: randomRadius(true),
                            initialX: initialX,
                            incxInc: randomInc(radius / 2),
                            incyInc: randomInc(radius / 2),
                            maxNumColumns: semiConceptualRandomBetween(2, ceil(numRepetitions / 2)),
                            currentColumnIndex: 0,
                            radius: radius,
                            radiusInc: randomInc(radius / 2),
                            angle: initialAng,
                            angleInc: angInc,
                            angleIncInc: randomInc(angInc / 4),
                            probToInvertDirection: randomFloat(0, 1),
                            angleIncMax: angleIncMax,
                            angleIncMin: angleIncMin,
                            allowInvertRadius: allowInvertRadius,
                            initialSetup: true
                        }

                        //repeat
                        var prevItem = selectedItem;
                        var itemsOutsidePage = [];

                        for (var i = 0; i < numRepetitions; i++) {
                            var newv = randomSubMethod.run(v);
                            var newItem = prevItem.duplicate(page(), [newv.x, newv.y]); //offsetX offsetY
                            label(newItem, "copy_" + originalItem.id);

                            var old = bounds(prevItem);
                            var n = bounds(newItem);
                            //line(old.left, old.top, n.left, n.top);

                            //here: se sair totalmente, ja nao entra; faz break

                            if (outsidePage(newItem)) itemsOutsidePage.push(newItem);
                            if (steppingAway(newItem)) break; //outside enviroment (because can go outsite and enter again)
                            //else if (!v.allowInvertRadius && v.radius <= 0) break;

                            selectedItem = newItem;
                            prevItem = newItem;
                        }

                        for (var i = 0; i < itemsOutsidePage.length; i++)
                            itemsOutsidePage[i].remove();

                        selectedItem = originalItem;
                        selection(selectedItem);

                        return "Did <i>Repeat</i> using the <i>" + randomSubMethod.name + "</i> submethod." +
                            "<br>Don't be afraid to click again. The items repeated before will be deleted." +
                            "<br>If you want them to stick. Just use the <i>Make Definitive</i> method on them.";
                    } else return "did no repeat. is an image or there are too many items"


                }
            },
            removeRepeated: { //remove apenas os repetidos deste item
                //so remove copias. os orignais so podem desaparecer atraves da opacidade
                type: "repeat",
                labels: ["remove", "delete", "clean", "empty", "minimal", "less", "simple", "space", "breathe"],
                subMethods: {
                    removeAll: {
                        hideFromUser: true,
                        labels: ["nothing"],
                        run: function() {
                            var toRemove = [];
                            var its_o = getPageItems(null, true);
                            var its = its_o.everyItem().getElements();

                            //get id do item original
                            var originalId = selectedItem.id;
                            if (selectedItem.label.indexOf("copy_") > -1) {
                                originalId = selectedItem.label.replace("copy_", "");
                            }

                            //se o item original foi apagado, o selectedItem passa a ser o original
                            var originalItem = its_o.itemByID(Number(originalId));
                            if (!originalItem.isValid) {
                                originalItem = selectedItem;
                                selectedItem.label = "";
                            }

                            //procurar ids dos items a remover 
                            for (var i = 0; i < its.length; i++)
                                if (its[i].label.indexOf("copy_" + originalId) > -1) toRemove.push(its[i].id);

                            //remover items encontrados
                            for (var i = 0; i < toRemove.length; i++) its_o.itemByID(toRemove[i]).remove();

                            selectedItem = originalItem;
                            selection(selectedItem);
                        }
                    }
                    /*removeRandomNum:
                    removeRandomNumFromBegining:
                    removeRandomNumFromEnd:*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    //var start = millis();
                    randomSubMethod.run();
                    //$.writeln("removeRepeated toke " + (millis() - start) + " ms to load.");
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            makeDefinitive: {
                ignoreInEvolution: true,
                type: "repeat",
                subMethods: {},
                labels: ["repeat", "many", "more", "increasing", "progressive", "complex", "multiple", "duplicated", "several", "increment", "multiply"],
                run: function(opts) {
                    selectedItem.label = "";
                    return "Did <i>" + this.name + "</i>.";
                }

            },

            //hierachy
            /*highlightHierachy: {
                //highlight par = evidenciar em comparação ao mais pequeno (corpo < subtitulo || subtitulo < titulo)
                //highlight todos = envidenciar todos com a mesma regra (p.e. + claro para mais escuro)

                //highlight pode ser:
                //size / textsize, posição, brilho, hue, textweight
                //no highlight de pares tambem: underline, caixa alta, (textweight fica aqui?)

                labels: ["hierachy","level"],
                run: function() {

                }
            },*/
        },
        runAll: function(pag) {
            page(pag);
            var methods = pageItemMethods.methods;

            var exp = 1;
            if (interfaceSettings.keywords.length > 0) exp = probToRunMethodsExponent;

            for (var k in methods) {
                //i.parent instanceof Spread //mutar apenas items filhos do spread? ou desagruupar tudo?
                //METHODS
                var m = methods[k];
                if (m.type == "text" && !(selectedItem instanceof TextFrame)) continue;
                var r = randomFloat(0, 1);

                //if (r < m.probToRun) {
                //if (1 - Math.pow(r, exp) < m.probToRun) { //muta bastante
                if (r < Math.pow(m.probToRun, exp)) { //pow methods
                    var name = m.name;
                    var executed = m.run({});
                    //BREAK IF REMOVED
                    if (executed)
                        if (m.name == "remove") break; //se removeu o item, nao ha mais mutações a fazer
                }
            }

        },
        runRandomOne: function(pag, opts) {
            page(pag);
            var methods = pageItemMethods.methods;

            //TODO: um filtro apenas!!!

            //se nao é texto, retirar meths de texto
            if (!(selectedItem instanceof TextFrame)) {
                methods = filterObj(methods, function(v, k) {
                    return v.type !== "text"
                });
            }

            //se nao for evo, so usa metodos sem "ignoreInEvolution"
            var evolution = false;
            if (opts && opts.evolution) evolution = true;
            if (evolution) {
                methods = filterObj(methods, function(v, k) {
                    return !v.hasOwnProperty("ignoreInEvolution") || (v.ignoreInEvolution == false)
                });
            }

            var exp = 1;
            if (interfaceSettings.keywords.length > 0) exp = probToRunMethodsExponent;

            var randomMethod = rouletteFromProbToRun(methods, exp);

            $.writeln(selectedItem.constructor.name)
            $.writeln(randomMethod.name + " " + randomMethod.probToRun);

            randomMethod.run(opts || {});

            //here.
            logToFile(randomMethod.name);
            $.writeln("did run the method");
        }
    };
    $.writeln("pageItemMethods:");
    initMethods(pim.methods);
    return pim;
};

//Page methods
var pageMethods;
var initPageMethods = function(fontConstants) {
    var pm = {
        methods: {
            /*TODO: group: {
                labels: ["group","together","united"],
                run: function() {
                    //isto é dificil porque nao se pode agrupar o que esta dentro de um grupo com o que esta fora,
                    //mas no array pageItems aparece tudo misturado, incluindo os grupos como se fosse um item separado.

                    var its = items(page());
                    var toGroup = [];
                    var numItems = semiConceptualRandomBetween(2, its.length);
                    for (var i = 0; i < numItems; i++) {
                        var randomIndex = randomInt(0, its.length - 1);
                        toGroup.push(its[randomIndex]);
                        its.splice(randomIndex, 1);
                    }
                    $.writeln(toGroup);
                    group(toGroup, "group");
                }
            }*/
            //TODO: ungroup
            /*strokeWeight: {
                labels: ["stroke", "border"],
                constants: {
                    none: {
                        type: "none",
                        index: 0,
                        labels: ["none", "no"],
                        value: -1
                    },
                    small: {
                        type: "small",
                        index: 1,
                        labels: ["small", "thin"],
                        value: [595, 198]
                    },
                    medium: {
                        type: "medium",
                        index: 2,
                        labels: ["medium", "normal"],
                        value: [197, 59]
                    },
                    big: {
                        type: "big",
                        index: 3,
                        labels: ["big", "spacy"],
                        value: [58, 39]
                    },
                    veryBig: {
                        type: "oversized",
                        index: 4,
                        labels: ["oversized","huge","extreme","much","over"],
                        value: [38, 10]
                    }
                },
                run: function() {
                    var constants = pageMethods.methods.strokeWeight.constants;
                    var randomConstant = rouletteFromProbToRun(constants);
                    var w = 0;
                    if (randomConstant.value != -1) w = randomFloat(randomConstant.value[0], randomConstant.value[1]);
                    strokeWeight(width / w);
                }
            },*/
            //TODO
            /*textHierachyRelation: {
                labels: ["hierarchy"],
                subMethods: {
                    //big
                    //small
                    //...
                },
                run: function() {

                }
            },*/
            /*textBodySize: {
                labels: ["text", "size", "body"],
                subMethods: {
                    //body
                    varySmallBody: {
                        type: "body",
                        labels: ["small", "very"],
                        run: function() {
                            var s = 595 / randomFloat(2, 6)
                            return width / s;
                        }
                    },
                    smallBody: {
                        type: "body",
                        labels: ["small"],
                        run: function() {
                            var s = 595 / randomFloat(6.1, 9)
                            return width / s;
                        }
                    },
                    mediumBody: {
                        type: "body",
                        labels: ["medium"],
                        run: function() {
                            var s = 595 / randomFloat(9.1, 13)
                            return width / s;
                        }
                    },
                    bigBody: {
                        type: "body",
                        labels: ["big","separated","apart"],
                        run: function() {
                            var s = 595 / randomFloat(13.1, 14)
                            return width / s;
                        }
                    },
                    veryBigBody: {
                        type: "body",
                        labels: ["very","big","separated","apart"],
                        run: function() {
                            var s = 595 / randomFloat(14.1, 18)
                            return width / s;
                        }
                    },
                    overSizedBody: {
                        type: "body",
                        labels: ["over","extreme","huge","separated","apart"],
                        run: function() {
                            var s = 595 / randomFloat(18.1, 28)
                            return width / s;
                        }
                    },
                    giantBody: {
                        type: "body",
                        labels: ["over","extreme","huge","separated","apart"],
                        run: function() {
                            var s = 595 / randomFloat(28.1, 50)
                            return width / s;
                        }
                    }
                },
                run: function() {
                    var subMethods = pageMethods.methods.textBodySize.subMethods;
                    $.writeln("gb-" + subMethods);
                    var randomValue = rouletteFromProbToRun(subMethods).run();
                    $.writeln("gb-" + randomValue);
                    textBodySize = randomValue;
                    //TODO: se random 0.5, atualizar todos os elementos com label textbody
                }
            },*/
            /*textSize: {
                labels: ["text","size"],
                run: function() {
                    var level = randomInt(-10, 10);
                    var size = 0;
                    if (level < 0) size = textBodySize / (Math.pow(textHierachyRel, Math.abs(level)));
                    else size = textBodySize * (Math.pow(textHierachyRel, level));
                    textSize(size);
                }
            },*/
            /*textFont: {
                labels: ["font"],
                constants: fontConstants,
                run: function() {
                    var constants = pageMethods.methods.textFont.constants;
                    var randomFamily = rouletteFromProbToRun(constants);
                    var randomWeight = rouletteFromProbToRun(randomFamily.weights)

                    $.writeln("randomFamily: " + randomFamily.value);
                    $.writeln("randomWeight: " + randomWeight.value.fontStyleName);
                    textFont(randomFamily.value, randomWeight.value.fontStyleName);
                }
            },*/

            //grid
            setMargins: {
                type: "grid",
                labels: ["margin", "border", "frame"],
                constants: {
                    none: {
                        type: "none",
                        index: 0,
                        labels: ["none", "no"],
                        value: -1
                    },
                    small: {
                        type: "small",
                        index: 1,
                        labels: ["small", "thin"],
                        value: [40, 31]
                    },
                    medium: {
                        type: "medium",
                        index: 2,
                        labels: ["medium", "normal"],
                        value: [30, 21]
                    },
                    big: {
                        type: "big",
                        index: 3,
                        labels: ["big", "spacy"],
                        value: [20, 11]
                    },
                    oversized: {
                        type: "oversized",
                        index: 4,
                        labels: ["oversized", "huge", "extreme", "much", "over"],
                        value: [10, 3]
                    }
                },
                subMethods: {
                    equal: {
                        labels: ["equal", "balance", "center", "normal"],
                        run: function(v, sizeFromConst) {
                            var constrains = rouletteFromProbToRun(v.constants);
                            var margin = sizeFromConst(v, constrains);
                            margins(margin);
                        }
                    },
                    verticalCenter: {
                        labels: ["different", "vertical", "balance", "tall", "high", "big", "center"],
                        run: function(v) {
                            margins(v.small, v.big, v.small, v.big);
                        }
                    },
                    horizontalCenter: {
                        labels: ["different", "horizontal", "balance", "short", "base", "long", "center"],
                        run: function(v) {
                            margins(v.big, v.small, v.big, v.small);
                        }
                    },
                    alignTop: {
                        labels: ["different", "top", "fly", "up"],
                        run: function(v) {
                            margins(v.small, v.small, v.big, v.small);
                        }
                    },
                    alignBottom: {
                        labels: ["different", "bottom", "land", "heavy", "terrain", "down"],
                        run: function(v) {
                            margins(v.big, v.small, v.small, v.small);
                        }
                    },
                    /*
                                        alignLeft: {
                                            labels: ["different", "left", "side"],
                                            run: function(v) {
                                                margins(v.small, v.big, v.small, v.small);
                                            }
                                        },
                                        alignRight: {
                                            labels: ["different", "right", "side"],
                                            run: function(v) {
                                                margins(v.small, v.small, v.small, v.big);
                                            }
                                        },
                                        alignTopLeft: {
                                            labels: ["different", "top", "left", "corner", "trapped", "up"],
                                            run: function(v) {
                                                margins(v.small, v.big, v.big, v.small);
                                            }
                                        },
                                        alignTopRigt: {
                                            labels: ["different", "top", "right", "corner", "trapped", "up"],
                                            run: function(v) {
                                                margins(v.small, v.small, v.big, v.big);
                                            }
                                        },
                                        alignBottomLeft: {
                                            labels: ["different", "bottom", "left", "corner", "trapped", "down"],
                                            run: function(v) {
                                                margins(v.big, v.big, v.small, v.small);
                                            }
                                        },
                                        alignBottomRigt: {
                                            labels: ["different", "bottom", "right", "corner", "trapped", "down"],
                                            run: function(v) {
                                                margins(v.big, v.small, v.small, v.big);
                                            }
                                        }*/
                },
                run: function(opts) {
                    var v = {};
                    v.pageSize = min(width, height);
                    v.constants = pageMethods.methods.setMargins.constants;

                    //separate small and big constrains
                    var smallConstants = {};
                    for (var key in v.constants)
                        if (v.constants[key].index < 4) smallConstants[key] = v.constants[key];
                    v.smallLimits = rouletteFromProbToRun(smallConstants);

                    var bigConstants = {};
                    for (var key in v.constants)
                        if (v.constants[key].index > v.smallLimits.index) bigConstants[key] = v.constants[key];
                    v.bigLimits = rouletteFromProbToRun(bigConstants);

                    //calculate margin size from constrains
                    sizeFromConst = function(v, constant) {
                        margSize = 0;
                        if (constant.value != -1) {
                            var margDiv = randomFloat(constant.value[0], constant.value[1]);
                            margSize = v.pageSize / margDiv;
                        }
                        return margSize;
                    }
                    v.small = sizeFromConst(v, v.smallLimits);
                    v.big = sizeFromConst(v, v.bigLimits);

                    var subMethods = pageMethods.methods.setMargins.subMethods;
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);

                    //guardar margens anteriores para depois mapeaar as guides
                    var ms = page().marginPreferences;
                    var ptop = ms.top;
                    var pbottom = height - ms.bottom;

                    //randomSubMethod = pageMethods.methods.setMargins.subMethods.alignBottomRight;
                    randomSubMethod.run(v, sizeFromConst);

                    updateGuides(ptop, pbottom);

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                }
            },
            createGrid: {
                type: "grid",
                labels: ["grid", "conductor", "align", "order"],
                constants: {
                    noGutter: {
                        labels: ["no", "close", "near"],
                        value: 0
                    },
                    random: {
                        labels: ["random"],
                        value: -1
                    }
                    //TODO:
                    //gutter muito pequena 1/5 entrelinha
                    //gutter pequena 1x entrelinha
                    //gutter media 2x entrelinha
                    //gutter grande 3x entrelinha
                    //gutter = min(margem_mais_pequena, 3x entrelinha)
                },
                subMethods: {
                    monoSpacedColumns: {
                        labels: ["column"],
                        run: function(gutter) {
                            //num cols
                            var ms = page().marginPreferences;
                            ms.columnCount = round(semiConceptualRandomBetween(2, 10));

                            //gutter
                            var constants = pageMethods.methods.createGrid.constants;
                            var randomConst = rouletteFromProbToRun(constants);

                            if (gutter == -1) {
                                if (randomConst.value == -1) gutter = randomFloat(width / 80, width / 30)
                                else gutter = randomConst.value;
                            } else if (!gutter) {
                                gutter = ms.columnGutter;
                            }

                            ms.columnGutter = gutter;

                            return gutter;
                        }
                    },
                    monoSpacedRows: {
                        labels: ["row"],
                        run: function(gutter, numRows) {
                            //delete old guides
                            for (var i = page().guides.length - 1; i >= 0; i--) page().guides[i].remove();

                            var ms = page().marginPreferences;

                            //num rows
                            if (!numRows) numRows = round(semiConceptualRandomBetween(2, 10));

                            //gutter
                            if (!gutter && gutter != 0) {
                                gutter = ms.columnGutter;
                            }

                            //////////////////////////////////////////////////////
                            var halfGutter = 0;
                            if (gutter > 0) halfGutter = gutter / 2;
                            var gridH = height - ms.top - ms.bottom;
                            var rowH = gridH / numRows;

                            var y = ms.top;
                            //faz uma  na margem, 2 em cada guttter, uma na margem final
                            for (var i = 0; i <= numRows; i++) {
                                if (i == 0 || i == numRows) guideY(y);
                                else {
                                    guideY(y - halfGutter);
                                    guideY(y + halfGutter);
                                }
                                y += rowH;
                            }
                        }
                    },
                    monoSpacedGrid: {
                        labels: ["row", "column"],
                        run: function() {
                            var gutter = pageMethods.methods.createGrid.subMethods.monoSpacedColumns.run(-1);
                            pageMethods.methods.createGrid.subMethods.monoSpacedRows.run(gutter);
                        }

                    }
                    //TODO:
                    //randomColumns: {
                    //var gridW = width - ms.left - ms.right;
                    //page().marginPreferences.columnsPositions = [gridW/10, gridW/10*9];
                    //},
                    //randomRows: {
                    //}
                    //TODO: grelha de quadrados (aproximadamente)
                },
                run: function(opts) {
                    if (!opts || getObjectKeys({}).length == 0) opts = {
                        subMethod: "monoSpacedGrid"
                    }
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    randomSubMethod.run();
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            //tirar estes dois: TODO
            moveSelectionToGrid: {
                ignoreInEvolution: true,
                type: "grid",
                labels: ["grid", "order"],
                run: function(opts) {
                    adjustSelectionToGrid();
                    return "Did <i>" + this.name + "</i>.";
                }
            },
            moveAndScaleSelectionToGrid: {
                ignoreInEvolution: true,
                type: "grid",
                labels: ["grid", "order"],
                run: function(opts) {
                    adjustSelectionToGrid(true);
                    return "Did <i>" + this.name + "</i>.";
                }
            },

            //items
            createBackground: {
                type: "items",
                labels: ["back"],
                subMethods: {
                    randomColor: {
                        labels: ["plane"],
                        run: function() {
                            rectMode(CORNER);
                            var r = rect(0, 0, width, height);
                            r.label = "background";
                            return r;
                        }
                    },
                    randomGradient: {
                        labels: ["gradient"],
                        run: function() {
                            return pageMethods.methods.createBackground.subMethods.randomColor.run();
                        }
                    }
                },
                run: function(opts) {
                    //eliminar items do background anterior
                    var toRemove = [];
                    var its_o = getPageItems(null, true);
                    var its = its_o.everyItem().getElements();
                    for (var i = 0; i < its.length; i++)
                        if (its[i].label == "background") toRemove.push(its[i].id);
                    for (var i = 0; i < toRemove.length; i++) its_o.itemByID(toRemove[i]).remove();

                    //create shape
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    selectedItem = randomSubMethod.run();
                    selection(selectedItem);

                    var fillType = "randomColor"
                    if (randomSubMethod.name == "randomGradient") fillType = "randomGradient"

                    pageItemMethods.methods.fillColor.run({
                        subMethod: fillType
                    });
                    pageItemMethods.methods.strokeWeight.run({
                        subMethod: "none"
                    });
                    pageItemMethods.methods.moveZ.run({
                        subMethod: "back"
                    });

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }

            },
            createShape: {
                ignoreInEvolution: true,
                type: "items",
                labels: ["shape"],
                constants: {
                    //todos para o "arc":

                    //shape
                    circleH: {
                        type: "shape",
                        labels: ["circle", "normal", "moon"],
                        run: function(v) {
                            return v.w;
                        }
                    },
                    ellipseH: {
                        type: "shape",
                        labels: ["ellipse", "deformed"],
                        run: function(v) {
                            return randomFloat(width / v.minDiv, height);
                        }
                    },
                    //angles
                    verySmall: {
                        type: "ang",
                        labels: ["small", "very", "mini", "spike"],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 64, Math.PI / 8);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    third: {
                        type: "ang",
                        labels: ["third"],
                        run: function(v) {
                            return [0, Math.PI / 3];
                        }
                    },
                    small: {
                        type: "ang",
                        labels: ["small", "spike"],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 8, Math.PI / 4);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: ["quarter"],
                        run: function(v) {
                            return [0, Math.PI / 4];
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: ["medium", "pizza", "cone"],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 4, Math.PI / 2);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    half: {
                        type: "ang",
                        labels: ["half", "divide"],
                        run: function(v) {
                            return [0, Math.PI];
                        }
                    },
                    big: {
                        type: "ang",
                        labels: ["big", "missing"],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 2, (Math.PI / 4) * 3);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    veryBig: {
                        type: "ang",
                        labels: ["very", "big", "missing", "bit"],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat((Math.PI / 4) * 3, (Math.PI * 2) - (Math.PI / 64));
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    //modes
                    open: {
                        type: "mode",
                        labels: ["open", "moon", "slice", "curve"],
                        run: function(v) {
                            return OPEN
                        }
                    },
                    chord: {
                        type: "mode",
                        labels: ["chord", "curve"],
                        run: function(v) {
                            return CHORD
                        }
                    },
                    pie: {
                        type: "mode",
                        labels: ["pie", "pizza", "cone"],
                        run: function(v) {
                            return PIE
                        }
                    }
                },
                subMethods: {
                    arc: {
                        labels: ["arc"],
                        run: function() {
                            ellipseMode(CENTER);
                            var v = {};
                            v.minDiv = 595 / 5;
                            v.maxDiv = 1;
                            v.w = randomFloat(width / v.minDiv, width);

                            var constants = pageMethods.methods.createShape.constants;

                            //circular ou ellipsy
                            var shapeConstants = filterSubObjsByType(constants, "shape");
                            var randomShape = rouletteFromProbToRun(shapeConstants);
                            v.h = randomShape.run(v);

                            //angs
                            var angConstants = filterSubObjsByType(constants, "ang");
                            var randomAngs = rouletteFromProbToRun(angConstants);
                            var angs = randomAngs.run(v);
                            v.startAng = angs[0];
                            v.endAng = angs[1];

                            //mode
                            var modeConstants = filterSubObjsByType(constants, "mode");
                            var randomMode = rouletteFromProbToRun(modeConstants);
                            v.mode = randomMode.run(v);

                            //create
                            var x = randomFloat(v.w / 2, width - v.w / 2);
                            var y = randomFloat(v.h / 2, height - v.h / 2);
                            return arc(x, y, v.w, v.h, v.startAng, v.endAng, v.mode);
                        }
                    },
                    ellipse: {
                        labels: ["ellipse", "egg"],
                        //TODO: submethods para ellipse vertical / horizontal
                        run: function() {
                            ellipseMode(CENTER);
                            var v = {};
                            var minDiv = 595 / 5;
                            var w = randomFloat(width / minDiv, width);
                            var h = randomFloat(width / minDiv, height);
                            var x = randomFloat(w / 2, width - w / 2);
                            var y = randomFloat(h / 2, height - h / 2);
                            return ellipse(x, y, w, h);

                        }
                    },
                    circle: {
                        labels: ["circle", "ball", "round"],
                        run: function() {
                            ellipseMode(CENTER);
                            var v = {};
                            var minDiv = 595 / 5;
                            var w = randomFloat(width / minDiv, width);
                            var h = w;
                            var x = randomFloat(w / 2, width - w / 2);
                            var y = randomFloat(h / 2, height - h / 2);
                            return ellipse(x, y, w, h);

                        }
                    },
                    rect: {
                        labels: ["rect", "box", "four"],
                        //TODO: submethods para rect vertical / horizontal
                        run: function() {
                            rectMode(CENTER);
                            var v = {};
                            var minDiv = 595 / 5;
                            var w = randomFloat(width / minDiv, width);
                            var h = randomFloat(width / minDiv, height);
                            var x = randomFloat(w / 2, width - w / 2);
                            var y = randomFloat(h / 2, height - h / 2);
                            return rect(x, y, w, h);

                        }
                    },
                    square: {
                        labels: ["square", "box", "equal", "four"],
                        run: function() {
                            rectMode(CENTER);
                            var v = {};
                            var minDiv = 595 / 5;
                            var w = randomFloat(width / minDiv, width);
                            var h = w;
                            var x = randomFloat(w / 2, width - w / 2);
                            var y = randomFloat(h / 2, height - h / 2);
                            return rect(x, y, w, h);

                        }
                    },
                    line: {
                        labels: ["line"],
                        //TODO: submethods para rect vertical / horizontal
                        run: function() {
                            var x = randomFloat(0, width);
                            var y = randomFloat(0, height);
                            var x2 = randomFloat(0, width);
                            var y2 = randomFloat(0, height);
                            return line(x, y, x2, y2);
                        }
                    },
                    /*point: {
                        labels: ["point", "dot"],
                        run: function() {
                            var x = randomFloat(0, width);
                            var y = randomFloat(0, height);
                            return point(x, y);

                        }
                    },*/
                    quad: {
                        labels: ["quad", "shape", "four"],
                        //TODO: 4 pontos a volta de um raio
                        //TODO: 4 pontos dentro e um raio maximo
                        run: function() {
                            var p = [];
                            for (var i = 0; i < 4; i++) {
                                p.push({
                                    x: randomFloat(0, width),
                                    y: randomFloat(0, height)
                                });
                            }
                            return quad(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
                        }
                    },
                    triangle: {
                        labels: ["triangle", "three"],
                        //TODO: 3 pontos a volta de um raio
                        //TODO: 3 pontos dentro e um raio maximo
                        //TODO: equilatero
                        //TODO: agudo e obtuso
                        run: function() {
                            var p = [];
                            for (var i = 0; i < 3; i++) {
                                p.push({
                                    x: randomFloat(0, width),
                                    y: randomFloat(0, height)
                                });
                            }
                            return triangle(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);
                        }
                    },
                    //TODO:losangulo
                    /*randomShape: {
                        //https://deploy-preview-145--basiljs2.netlify.app/reference/#vertex
                    }*/
                },
                run: function(opts) {
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    selectedItem = randomSubMethod.run();
                    selection(selectedItem);
                    pageItemMethods.methods.fillColor.run({});
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }

            },
            removeAllRepeatedItems: {
                //so remove copias. os orignais so podem desaparecer atraves da opacidade
                type: "items",
                labels: ["remove", "delete", "clean", "empty", "minimal", "less", "simple", "space", "breathe"],
                subMethods: {
                    removeAll: {
                        hideFromUser: true,
                        labels: ["all"],
                        run: function() {
                            var toRemove = [];
                            var its_o = getPageItems(null, true);
                            var its = its_o.everyItem().getElements();
                            for (var i = 0; i < its.length; i++)
                                if (its[i].label.indexOf("copy") > -1 /*&& !(it instanceof Image)*/ ) toRemove.push(its[i].id);
                            for (var i = 0; i < toRemove.length; i++) its_o.itemByID(toRemove[i]).remove();
                        }
                    }
                    /*removeRandomNum:
                    removeRandomNumFromBegining:
                    removeRandomNumFromEnd:*/
                },
                run: function(opts) {
                    var originalItem = selectedItem;
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    //var start = millis();
                    randomSubMethod.run();
                    //$.writeln("removeRepeated toke " + (millis() - start) + " ms to load.");
                    selectedItem = originalItem;
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            //TODO: removeAllAutoCreated
        },
        runAll: function(pag) {
            page(pag);
            var methods = pageMethods.methods;
            for (var k in methods) {
                var m = methods[k];
                var r = randomFloat(0, 1);
                if (r < m.probToRun) {
                    var name = m.name;
                    try {
                        m.run({});
                    } catch (e) {
                        $.writeln("ERROR running PM: " + e)
                    }
                }
            }
        }
    }
    //pm.methods.textFont.constants = pageItemMethods.methods.textFont.constants;
    $.writeln("pageMethods:");
    initMethods(pm.methods);
    return pm;
}

//Document methods
var docMethods;
var initDocMethods = function(fontConstants) {
    var dm = {
        methods: {
            //swatches
            createColor: {
                ignoreInEvolution: true,
                type: "swatches",
                labels: ["color", "basic"],
                subMethods: {
                    //hue
                    randomHue: {
                        type: "hue",
                        labels: ["random"],
                        run: function() {
                            return randomFloat(0, 360) / 360;
                        }
                    },
                    randomRed: {
                        type: "hue",
                        labels: ["red"], //, "fire", "apple", "strawberry", "love"],
                        brightnessLimits: {
                            minBrightness: .3,
                            maxBrightness: 1
                        },
                        run: function() {
                            var r = randomFloat(0, 16) / 360;
                            if (randomFloat(0, 1) < .5) r = randomFloat(337, 360) / 360;
                            return r;
                        }
                    },
                    randomOrange: {
                        type: "hue",
                        labels: ["orange"], //, "fire"],
                        brightnessLimits: {
                            minBrightness: 0.6,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(16, 45) / 360;
                        }
                    },
                    randomBrown: {
                        type: "hue",
                        labels: ["brown"], //, "wood"],
                        brightnessLimits: {
                            minBrightness: .2,
                            maxBrightness: .6
                        },
                        run: function() {
                            return randomFloat(16, 45) / 360
                        }
                    },
                    randomYellow: {
                        type: "hue",
                        labels: ["yellow"], //, "sun"],
                        brightnessLimits: {
                            minBrightness: 0.6,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(45, 73) / 360;
                        }
                    },
                    randomGreen: {
                        type: "hue",
                        labels: ["green"], //, "grass", "tree", "enviroment", "forest", "plant"],
                        brightnessLimits: {
                            minBrightness: .3,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(73, 170) / 360;
                        }
                    },
                    randomBlue: {
                        type: "hue",
                        labels: ["blue"], //, "water", "sky", "sad", "sea", "fish"],
                        brightnessLimits: {
                            minBrightness: .3,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(196, 259) / 360;
                        }
                    },
                    randomPurple: {
                        type: "hue",
                        labels: ["purple"], //, "wine", "violet"],
                        brightnessLimits: {
                            minBrightness: .3,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(259, 278) / 360;
                        }
                    },
                    randomPink: {
                        type: "hue",
                        labels: ["pink"],
                        brightnessLimits: {
                            minBrightness: .3,
                            maxBrightness: 1
                        },
                        run: function() {
                            return randomFloat(278, 337) / 360;
                        }
                    },
                    //saturation
                    randomSaturation: {
                        hideFromUser: true,
                        type: "saturation",
                        labels: ["random", "red", "orange", "brown", "yellow", "green", "blue", "purple", "pink"],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    maxSaturation: {
                        hideFromUser: true,
                        type: "saturation",
                        labels: ["colorful", "happy", "very", "super", "extreme", "saturation", "total"],
                        run: function(min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    highSaturation: {
                        type: "saturation",
                        labels: ["colorful", "happy", "saturation", "high"],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(max / 2, max);
                        }
                    },
                    lowSaturation: {
                        type: "saturation",
                        labels: ["low", "gray", "sad"],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max / 2);
                        }
                    },
                    minSaturation: {
                        hideFromUser: true,
                        type: "saturation",
                        labels: ["low", "sad", "gray", "black", "white", "old", "neutral"],
                        run: function(min, max) {
                            if (!min) min = .1;
                            return min;
                        }
                    },
                    //brightness
                    randomBrightness: {
                        hideFromUser: true,
                        type: "brightness",
                        labels: ["random", "red", "orange", "brown", "yellow", "green", "blue", "purple", "pink"],
                        run: function(min, max) {
                            if (!min) min = .33;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    maxBrightness: {
                        hideFromUser: true,
                        type: "brightness",
                        labels: ["bright", "sunny", "light", "peace", "day", "white", "big"],
                        run: function(min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    highBrightness: {
                        type: "brightness",
                        labels: ["bright", "sunny", "light", "peace", "day", "big"],
                        run: function(min, max) {
                            if (!min) min = .5;
                            if (!max) max = 1;
                            //var range = (max - min) / 2;
                            return randomFloat(min, max); //return randomFloat(min + range, max);
                        }
                    },
                    lowBrightness: {
                        type: "brightness",
                        labels: ["low", "dark", "sad", "fear", "surprise", "night"],
                        run: function(min, max) {
                            if (!min) min = .33;
                            if (!max) max = .5;
                            //var range = (max - min) / 2;
                            return randomFloat(min, max); // return randomFloat(min, min + range);
                        }
                    },
                    minBrightness: {
                        hideFromUser: true,
                        type: "brightness",
                        labels: ["low", "dark", "sad", "fear", "surprise", "night", "black"],
                        run: function(min, max) {
                            if (!min) min = .33;
                            return min;
                        }
                    },
                },

                /*run: function(opts) {
                    opts = opts || {};
                    var userMethod;
                    var user = opts && opts.subMethod;
                    if (user) userMethod = getSubMethod("docMethods", this.name, opts)

                    //separar os metodos por tipo
                    var subMethods = docMethods.methods.createColor.subMethods;
                    var hueMethods = {};
                    var satMethods = {};
                    var briMethods = {};
                    for (var key in subMethods) {
                        if (subMethods[key].type == "hue") hueMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "saturation") satMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "brightness") briMethods[key] = subMethods[key];
                    }

                    //HUE
                    var randomH;
                    if (userMethod && userMethod.type == "hue") randomH = userMethod;
                    //else randomH = rouletteFromProbToRun(hueMethods);
                    else {
                        opts.type = "hue";
                        randomH = getSubMethod("docMethods", this.name, opts);
                    }

                    var maxProbToRun = randomH.probToRun;

                    //SATURATION
                    var satLims = randomH.saturationLimits;
                    var randomS = 1;
                    if (userMethod && userMethod.type == "saturation") randomS = userMethod;
                    //else randomS = rouletteFromProbToRun(satMethods)
                    else {
                        opts.type = "saturation";
                        randomS = getSubMethod("docMethods", this.name, opts);
                    }
                    maxProbToRun = max(randomS.probToRun, maxProbToRun);
                    if (satLims) randomS = randomS.run(satLims.minSaturation, satLims.maxSaturation);
                    else randomS = randomS.run();

                    //BRIGHTNESS
                    var briLims = randomH.brightnessLimits;
                    var randomB = 1;
                    if (userMethod && userMethod.type == "brightness") randomB = userMethod;
                    //else randomB = rouletteFromProbToRun(briMethods);
                    else {
                        opts.type = "brightness";
                        randomB = getSubMethod("docMethods", this.name, opts);
                    }
                    maxProbToRun = max(randomB.probToRun, maxProbToRun);
                    //"!user" é porque os laranjas e amarelos tem sempre muito brilho 
                    //e para os users pode ser contraituitivo ver cores tao claras quando escolher o metodos minBrigthness
                    if (!user && briLims) randomB = randomB.run(briLims.minBrightness, briLims.maxBrightness);
                    else randomB = randomB.run();

                    randomH = randomH.run();
                    //$.writeln("        HSB: " + randomH + "," + randomS + "," + randomB);

                    var rgb = HSVtoRGB(randomH, randomS, randomB);
                    var finalColor = color(rgb.r, rgb.g, rgb.b);

                    var group = doc().colorGroups.itemByName("eD.colors");
                    if (!group.isValid) {
                        doc().colorGroups.add("eD.colors", []);
                        group = doc().colorGroups.itemByName("eD.colors");
                    }
                    group.colorGroupSwatches.add(finalColor);

                    //reset probToRun dos metdos de cor para ser igual ao max das cores escolhidas:
                    //pageItemMethods.methods.fillColor.probToRun = max(pageItemMethods.methods.fillColor.probToRun, maxProbToRun);
                    //pageItemMethods.methods.textColor.probToRun = max(pageItemMethods.methods.textColor.probToRun, maxProbToRun);

                    return "Did <i>" + this.name + "</i>.";

                }*/

                //versao iccc:
                run: function(opts) {
                    var userMethod;
                    var user = opts && opts.subMethod;
                    if (user) userMethod = getSubMethod("docMethods", this.name, opts);

                    //separar os metodos por tipo
                    var subMethods = docMethods.methods.createColor.subMethods;
                    var hueMethods = {};
                    var satMethods = {};
                    var briMethods = {};
                    for (var key in subMethods) {
                        if (subMethods[key].type == "hue") hueMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "saturation") satMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "brightness") briMethods[key] = subMethods[key];
                    }

                    //hue
                    var randomH;
                    if (userMethod && userMethod.type == "hue") randomH = userMethod;
                    else randomH = rouletteFromProbToRun(hueMethods);
                    var maxProbToRun = randomH.probToRun;

                    //saturation
                    var satLims = randomH.saturationLimits;
                    var randomS = 1;
                    if (userMethod && userMethod.type == "saturation") randomS = userMethod;
                    else randomS = rouletteFromProbToRun(satMethods)
                    maxProbToRun = max(randomS.probToRun, maxProbToRun);

                    //if (randomS.probToRun < .5) randomS =  satMethods.randomSaturation;

                    if (satLims) randomS = randomS.run(satLims.minSaturation, satLims.maxSaturation);
                    else randomS = randomS.run();

                    //brightness
                    var briLims = randomH.brightnessLimits;
                    var randomB = 1;
                    if (userMethod && userMethod.type == "brightness") randomB = userMethod;
                    else randomB = rouletteFromProbToRun(briMethods);
                    maxProbToRun = max(randomB.probToRun, maxProbToRun);

                    //if (randomB.probToRun < .5) randomB =  briMethods.randomBrightness;

                    //"!user" é porque os laranjas e amarelos tem sempre muito brilho 
                    //e para os users pode ser contraituitivo ver cores tao claras quando escolher o metodos minBrigthness
                    if (!user && briLims) randomB = randomB.run(briLims.minBrightness, briLims.maxBrightness);
                    else randomB = randomB.run();

                    randomH = randomH.run();
                    //$.writeln("        HSB: " + randomH + "," + randomS + "," + randomB);

                    var rgb = HSVtoRGB(randomH, randomS, randomB);
                    var finalColor = color(rgb.r, rgb.g, rgb.b);

                    var group = doc().colorGroups.itemByName("eD.colors");
                    if (!group.isValid) {
                        doc().colorGroups.add("eD.colors", []);
                        group = doc().colorGroups.itemByName("eD.colors");
                    }
                    group.colorGroupSwatches.add(finalColor);

                    //reset probToRun dos metdos de cor para ser igual ao max das cores escolhidas:
                    //pageItemMethods.methods.fillColor.probToRun = max(pageItemMethods.methods.fillColor.probToRun, maxProbToRun);
                    //pageItemMethods.methods.textColor.probToRun = max(pageItemMethods.methods.textColor.probToRun, maxProbToRun);

                    return "Did <i>" + this.name + "</i>.";

                }

            },
            createGradient: {
                ignoreInEvolution: true,
                type: "swatches",
                labels: ["gradient", "progressive", "smooth", "transition", "merge"],
                constants: {
                    linear: {
                        type: "gradientType",
                        labels: ["linear", "forward", "straight", "rect"],
                        value: GradientType.LINEAR
                    },
                    radial: {
                        type: "gradientType",
                        labels: ["radial", "around", "circle", "ring"],
                        value: GradientType.RADIAL
                    }
                },
                subMethods: {
                    //type: "gradientColors",
                    twoColors: {
                        type: "gradientColors",
                        labels: ["two", "simple", "balance", "half", "split"],
                        run: function(randomPos) {
                            //certififcar que há pelo menos 2 cores:
                            var colorSwatches = getColors();
                            var dif = 2 - colorSwatches.length;
                            for (var i = 0; i < dif; i++) docMethods.methods.createColor.run({});
                            if (colorSwatches.length < 2) colorSwatches = getColors(); //porque apesar de ter adicionado cores, a variavel precisa de ser atuallizada: 
                            //escolher cor 1
                            var j = colorSwatches.randomIndex();
                            var c1 = colorSwatches[j].swatchItemRef;
                            //remover cor 1 do array
                            colorSwatches.remove(j);
                            //escolher cor 2
                            j = colorSwatches.randomIndex();
                            var c2 = colorSwatches[j].swatchItemRef;

                            //distancia entre cores no gradiente:
                            var pos = [0, 100];
                            var name = "twoColors" + c1.id + "," + c2.id;

                            if (randomPos) {
                                pos = [randomInt(0, 100), randomInt(0, 100)];
                                var name = "twoColorsRandDist" + c1.id + "," + c2.id;
                            }

                            return gradient([c1, c2], pos, name);
                        }
                    },
                    twoColorsRandomDist: {
                        type: "gradientColors",
                        labels: ["two", "random", "unbalance", "different"],
                        run: function() {
                            return docMethods.methods.createGradient.subMethods.twoColors.run(true);
                        }
                    },
                    multipleColors: {
                        type: "gradientColors",
                        labels: ["multiple", "complex", "equaly", "balance", "uniform", "colorful"],
                        run: function(randomDist) {
                            //certififcar que há pelo menos 3 cores:
                            var colorSwatches = getColors();
                            var dif = 3 - colorSwatches.length;
                            for (var i = 0; i < dif; i++) docMethods.methods.createColor.run({});
                            if (colorSwatches.length < 3) colorSwatches = getColors(); //porque apesar de ter adicionado cores, a variavel precisa de ser atuallizada: 
                            //cor 1
                            var pIndex = colorSwatches.randomIndex();
                            var pColor = colorSwatches[pIndex];
                            var cs = [pColor.swatchItemRef];
                            var pos = [randomInt(0, 100)];
                            //remover cor 1 do array
                            colorSwatches.remove(pIndex);
                            //outras cores
                            var numCs = randomInt(3, semiConceptualRandomBetween(4, 20));
                            var name = "multColors";
                            if (randomDist) name = "multColorsRandDist"
                            for (var i = 0; i < numCs; i++) {
                                var j = colorSwatches.randomIndex();
                                var c = colorSwatches[j];
                                name += c.swatchItemRef.id + ",";
                                cs.push(c.swatchItemRef);
                                if (randomDist) pos.push(randomInt(0, 100));
                                //remover cor atual do array
                                colorSwatches.remove(j);
                                //adicionar cor anterior ao array
                                colorSwatches.push(pColor);
                                pColor = c;
                            }

                            var finalGrad;
                            if (randomDist) finalGrad = gradient(cs, pos, name);
                            else finalGrad = gradient(cs, name);
                            return finalGrad;
                        }
                    },
                    multipleColorsRandomDist: {
                        type: "gradientColors",
                        labels: ["multiple", "complex", "random", "unbalance", "different", "colorful"],
                        run: function() {
                            return docMethods.methods.createGradient.subMethods.multipleColors.run(true);
                        }
                    }
                },
                run: function(opts) {
                    var subMeth = getSubMethod("docMethods", this.name, opts);
                    var consts = docMethods.methods.createGradient.constants;
                    var gradientMode = rouletteFromProbToRun(consts);

                    var finalGradient = subMeth.run();
                    var group = doc().colorGroups.itemByName("eD.gradients");
                    if (!group.isValid) {
                        doc().colorGroups.add("eD.gradients", []);
                        group = doc().colorGroups.itemByName("eD.gradients");
                    }
                    finalGradient.type = gradientMode.value;
                    group.colorGroupSwatches.add(finalGradient);

                    return "Did <i>" + this.name + "</i> using the <i>" + subMeth.name + "</i> submethod.";
                }
            },
            resetSwatches: {
                ignoreInEvolution: true,
                type: "swatches",
                labels: ["color"],
                run: function(opts) {
                    initSwatches();
                    return "Did <i>" + this.name + "</i>.";
                }
            },
            deleteUnusedSwatches: {
                ignoreInEvolution: true,
                type: "swatches",
                labels: ["color"],
                run: function(opts) {
                    deleteUnusedSwatchesAndGroups();
                    return "Did <i>" + this.name + "</i>.";
                }
            },

            //control
            /*undo: {
                ignoreInEvolution: true,
                type: "control",
                labels: ["back"],
                run: function(opts) {
                    
                    
                }
            }*/

        },
        runAll: function() {
            var methods = docMethods.methods;
            var exp = 1;
            if (interfaceSettings.keywords.length > 0) exp = probToRunMethodsExponent;
            for (var k in methods) {
                var m = methods[k];
                var r = randomFloat(0, 1);
                //if (r < m.probToRun) {
                //if (1 - Math.pow(r, exp) < m.probToRun) { //muta bastante
                if (r < Math.pow(m.probToRun, exp)) m.run({}); //pow methods
            }
        }
    }
    $.writeln("docMethods:");
    initMethods(dm.methods);
    return dm;
}

function getLabelsFromFontName(str) {
    var labels_tx = str.split(" ");
    var finalLabels = [];
    for (var j = 0; j < labels_tx.length; j++) {
        var lb = labels_tx[j].toLowerCase().replace(/\s/g, '');
        if (lb == '') continue;
        if (!labelsArr.indexOf(lb) <= -1) labelsArr.push(lb);
        finalLabels.push(lb || createLabel(lb));
    }
    return finalLabels;
}

function initFonts() { //cria as font constants/submethods 
    var start = millis();

    myFonts = {} //loadJSON(extensionFolder + "/js/savedFonts.json"); //constants do metodo fontFamily
    //var pMyFonts = JSON.stringify(myFonts);
    var fonts = app.fonts.everyItem().getElements();

    //por cada estilo
    for (var i = 0; i < fonts.length; i++) {
        //NOTA!!!! se as fontes estiverem corrompidas, vai crasha aqui!!!

        //$.writeln("initing font " + i + " of " + fonts.length)
        //nome familia
        var name = fonts[i].fontFamily;
        var key = name.toLowerCase().replace(/\s/g, '');
        //nome peso
        var styleName = fonts[i].fontStyleName;
        var styleKey = styleName.toLowerCase().replace(/\s/g, '');

        //1 - se ainda nao existe a familia, cria uma
        var family = myFonts[key] || myFonts[key] = {
            //name: key, //já é feito no initSubs
            fontName: name,
            labels: getLabelsFromFontName(name),
            weights: {}
            //probToRun: styleProbToRun //já é feito no initSubs
        };

        //2 - create style
        var styleLabels = getLabelsFromFontName(styleName);
        //var styleProbToRun = getProbToRun(styleLabels) || defaultProbToRun; //já é feito no initSubs
        family.labels = family.labels.concat(styleLabels).unique();
        //family.probToRun = getProbToRun(family.labels) || defaultProbToRun; //já é feito no initSubs
        family.weights[styleKey] = { //family.weights são os estilos (bold, regular, italic...)
            value: fonts[i],
            styleName: styleName,
            //name: styleKey, //já é feito no initSubs
            labels: styleLabels,
            //probToRun: styleProbToRun //já é feito no initSubs
        }


    }

    $.writeln("Fonts toke " + (millis() - start) + " ms to load.");
    return myFonts;
}

function initSubs(m, sub) {
    //--var allLabels = [];
    var msub = m[sub] || {};
    for (var key in msub) {
        var c = msub[key];
        c.name = key;
        //KEYWORDS
        //--allLabels = allLabels.concat(c.labels);
        if (!c.hasOwnProperty("probToRun")) {
            if (c.hasOwnProperty("minProbToRun")) c.probToRun = c.minProbToRun;
            else c.probToRun = defaultProbToRun;
        }

        //for font weights 
        if (c.hasOwnProperty("weights")) {
            //--var fontWeightLabels = 
            initSubs(c, "weights");
            //--allLabels = allLabels.concat(fontWeightLabels);
        }
    }
    //--return allLabels;
}

function initMethods(meths) {
    var start = millis();

    for (var k in meths) {
        var m = meths[k];
        //--var allLabels = [].concat(m.labels);
        if (!m.hasOwnProperty("probToRun")) {
            if (m.hasOwnProperty("minProbToRun")) m.probToRun = m.minProbToRun;
            else m.probToRun = defaultProbToRun;
        }
        m.name = k;
        //$.writeln("-" + m.name);

        //constants
        if (m.constants) {
            //--var constLabels = 
            initSubs(m, "constants");
            //--allLabels = allLabels.concat(constLabels);
        }
        //sub methods
        if (m.subMethods) {
            //var methLabels = 
            initSubs(m, "subMethods");
            //--allLabels = allLabels.concat(methLabels);
        }
        //KEYWORDS  
        //allLabels = allLabels.unique();
        //m.labels = allLabels;
    }
    $.writeln("     initMethods toke " + (millis() - start) + " ms to load.");
}

function initAllMutationMethods(fts) {
    pageItemMethods = initPageItemMethods(fts);
    pageMethods = initPageMethods(fts);
    docMethods = initDocMethods(fts);

    //copiar labels das cores para os metodos de random color e random gradient
    pageItemMethods.methods.fillColor.subMethods.randomColor.labels.concat(docMethods.methods.createColor.labels);
    pageItemMethods.methods.fillColor.subMethods.randomGradient.labels.concat(docMethods.methods.createGradient.labels);
    //mesmo para textColor
    pageItemMethods.methods.textColor.subMethods.randomColor.labels.concat(docMethods.methods.createColor.labels);
    pageItemMethods.methods.textColor.subMethods.randomGradient.labels.concat(docMethods.methods.createGradient.labels);

    allMeths = {
        pageItemMethods: pageItemMethods,
        pageMethods: pageMethods,
        docMethods: docMethods
    }

}

function adjustSelectionToGrid(adjustSize) {

    selections(function(item, loopcount) {
        $.writeln(item)
        selectedItem = item;
        $.writeln("move")

        var moveMeth = "closestGuidesEitherSides";
        if (adjustSize) moveMeth = "closestGuides";

        pageItemMethods.methods.moveToGrid.run({
            subMethod: moveMeth,
            defaultAxes: adjustSize
        });
        if (adjustSize) {
            $.writeln("size")
            pageItemMethods.methods.sizeGridRelative.run({
                subMethod: "closestGuides",
                defaultAxes: true
            });
        }
    })

}