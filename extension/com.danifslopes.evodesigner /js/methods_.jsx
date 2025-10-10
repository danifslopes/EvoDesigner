/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

var probConceptNumbers = 0.9;
var defaultProbToRun = 0.01;
var keywords = ["big", "shark"];
var conceptNumbers = [];
var copyIndex = 0,
    colorIndex = 0;
var textBodySize = 12;
var textHierachyRel = 1.5;
var fontFamilies = [];

//PageItem methods
var pageItemMethods;
var initPageItemMethods = function(fontConstants) {
    var pim = {
        methods: {
            /*remove: {
                //so remove copias. os orignais so podem desaparecer atraves da opacidade
                labels: [l.remove, l.delete, l.clean, l.empty, l.minimal, l.less, l.simple, l.space, l.breathe],
                run: function() {
                    var executed = false;
                    if (selectedItem.label == "copy" && !(selectedItem instanceof Image)) {
                        selectedItem.remove();
                        executed = true;
                        logToFile("removed " + selectedItem.name);
                    } else {
                        logToFile("Could not remove " + selectedItem.name);
                    }
                    return executed;
                }
            },*/
            /*clearObjectStyleOverrides: {
                labels: [l.clear, l.empy, l.void, l.simple, l.stroke, l.less, l.minimum, l.minus, l.modest, l.basic, l.raw],
                run: function() {
                    selectedItem.clearObjectStyleOverrides()
                }
            },*/
            /*clearTransformations: {
                labels: [l.clear, l.straight", l.static, l.still, l.simple, l.raw],
                run: function() {
                    tryMutation(function(it) {
                        it.clearTransformations();
                    });
                }
            },*/
            convertShape: {
                labels: [l.shape, l.form, l.geometric],
                constants: {
                    convertToBeveledRectangle: {
                        value: ConvertShapeOptions.CONVERT_TO_BEVELED_RECTANGLE,
                        labels: [l.beveled, l.rectangle, l.corner, l.cut, l.box, l.detail]
                    },
                    convertToToClosedPath: {
                        value: ConvertShapeOptions.CONVERT_TO_CLOSED_PATH,
                        labels: [l.closed, l.path]
                    },
                    convertToInverseRoundedRectangle: {
                        value: ConvertShapeOptions.CONVERT_TO_INVERSE_ROUNDED_RECTANGLE,
                        labels: [l.inverse, l.rounded, l.rectangle, l.concave, l.cut, l.corner, l.negative, l.detail, l.box, l.table]
                    },
                    convertToLine: {
                        value: ConvertShapeOptions.CONVERT_TO_LINE,
                        labels: [l.line, l.stroke, l.string, l.rope, l.chord]
                    },
                    convertToOpenPath: {
                        value: ConvertShapeOptions.CONVERT_TO_OPEN_PATH,
                        labels: [l.open, l.path, l.broken, l.gap]
                    },
                    convertToOval: {
                        value: ConvertShapeOptions.CONVERT_TO_OVAL,
                        labels: [l.oval, l.egg, l.ellipse, l.bird, l.chicken, l.circle]
                    },
                    convertToPolygon: {
                        value: ConvertShapeOptions.CONVERT_TO_POLYGON,
                        labels: [l.pentagon, l.hexagon, l.octahedron, l.polygon]
                    },
                    convertToRectangle: {
                        value: ConvertShapeOptions.CONVERT_TO_RECTANGLE,
                        labels: [l.rectangle, l['4'], l.four, l.box, l.table, l["90"]]
                    },
                    convertToToRoundedRectangle: {
                        value: ConvertShapeOptions.CONVERT_TO_ROUNDED_RECTANGLE,
                        labels: [l.rectangle, l.box, l.smooth, l.child, l.kid, l.children, l.detail, l.table]
                    },
                    convertToStraightLine: {
                        value: ConvertShapeOptions.CONVERT_TO_STRAIGHT_LINE,
                        labels: [l.line, l.straight, l.stroke, l.string, l.rope, l.chord]
                    },
                    convertToTriangle: {
                        value: ConvertShapeOptions.CONVERT_TO_TRIANGLE,
                        labels: [l.triangle, l['3'], l.three, l.sharp, l.corner, l.beak, l.tip, l.careful, l.warning, l.sign, l.attention]
                    }
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("convertShape") &&
                        !(selectedItem instanceof GraphicLine) &&
                        !(selectedItem instanceof Image)) {

                        var constants = pageItemMethods.methods.convertShape.constants;

                        if (randomFloat(0, 1) < 0.5) {
                            var randomConst = rouletteFromProbToRun(constants);
                            //randomConst = pageItemMethods.methods.convertShape.constants.convertToInverseRoundedRectangle;

                            tryMutation(function(it) {
                                if (
                                    !(it instanceof TextFrame &&
                                        (randomConst.name == "convertToLine" ||
                                            randomConst.name == "convertToStraightLine" ||
                                            randomConst.name == "convertToOpenPath" ||
                                            randomConst.name == "convertToToClosedPath")
                                    )
                                ) {
                                    it.convertShape(randomConst.value);
                                    if (it.hasOwnProperty("fit"))
                                        it.fit(FitOptions.FRAME_TO_CONTENT);
                                }
                            });

                        } else {
                            var polygonSides = Math.round(semiConceptualRandomBetween(3, 100));
                            var starInsetPercentage = Math.round(semiConceptualRandomBetween(0, 100));
                            var rectCornerRadius = semiConceptualRandomBetween(0, maxItemWidth());
                            var randomConst = rouletteFromProbToRun(constants);
                            randomConst = pageItemMethods.methods.convertShape.constants.convertToInverseRoundedRectangle;

                            tryMutation(function(it) {
                                if (!(it instanceof TextFrame && randomConst.name == "convertToLine")) {
                                    it.convertShape(randomConst.value, polygonSides, starInsetPercentage, rectCornerRadius);
                                    if (it.hasOwnProperty("fit"))
                                        it.fit(FitOptions.FRAME_TO_CONTENT);
                                }
                            });

                        }
                    }
                },
            },
            /*duplicate: {
                labels: [l.repeat, l.duplicate, l.copy, l.replica, l.many, l.several, l.much],
                subMethods: {
                    linearx: {
                        //linear x
                        run: function(v) {
                            v.x = v.incx;
                            return v;
                        },
                        labels: [l.linear, l.horizont, l.horizontal, l.straight, l.big, l.lay, l.down, l.base, l.platform, l.bottom],
                    },
                    lineary: {
                        //linear y
                        run: function(v) {
                            v.y = v.incy;
                            return v;
                        },
                        labels: [l.linear, l.vertical, l.straight, l.tower, l.build, l.building, l.tall, l.big, l.up, l.top],
                    },
                    linearxy: {
                        //linear xy
                        run: function(v) {
                            v.x = v.incx;
                            v.y = v.incy;
                            return v;
                        },
                        labels: [l.linear, l.diagonal, l.tilting, l.tilted, l.drunk, l.big, l.slide],
                    },
                    incx: {
                        //inc x
                        run: function(v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.horizontal, l.wider, l.bigger],
                    },
                    incy: {
                        //inc y
                        run: function(v) {
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.straight, l.vertical, l.taller, l.bigger, l.tower, l.jump, l.top, l.skyscraper, l.launch, l.throw, l.fall, l.drop, l.apart, l.split],
                    },
                    incxy: {
                        //inc xy
                        run: function(v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.bigger, l.throw, l.apart, l.split, l.diagonal, l.tilt, l.drunk, l.big, l.slide],
                    },
                    grid: {
                        //grid
                        run: function(v) {
                            var b = bounds(selectedItem);

                            if (v.currentColumnIndex > v.maxNumColumns || b.left > width) {
                                v.currentColumnIndex = 0;
                                v.y = v.incy;
                                v.x = -(b.left - v.initialX);
                                println(b.left, v.initialX);
                            } else {
                                v.currentColumnIndex++;
                                v.x = abs(v.incx);
                                v.y = 0;
                            }

                            return v;
                        },
                        labels: [l.grid, l.matrix, l.brick, l.wall],
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
                        labels: [l.polar, l.smooth, l.waves, l.snake, l.rope, l.wire, l.road, l.track, l.dance, l.movement, l.drunk, l.curve],
                    },
                    polarincang: {
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
                        labels: [l.polar, l.smooth, l.waves, l.snake, l.rope, l.wire, l.road, l.track, l.dance, l.movement, l.drunk, l.curve, l.curly],
                    },
                    polarincradius: {
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
                        labels: [l.polar, l.smooth, l.waves, l.snake, l.rope, l.wire, l.road, l.track, l.dance, l.movement, l.drunk, l.curve, l.stretch, l.increment, l.increasing],
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
                        labels: [l.rope, l.wire, l.road, l.polar, l.smooth, l.waves, l.dance, l.movement, l.drunk, l.curve, l.stretch, l.increment, l.increasing],
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
                        labels: [l.espiral, l.polar, l.smooth, l.dance, l.movement, l.curve, l.increment, l.increasing, l.rotate, l.around],
                    }
                    //TODO: inc up e depois inc down o raio e/ou ang!!!
                    //total random
                    //tudo  isto com variação de uma propriedade... tipo cor  ou tamanho...
                    //repetir grupos de coisas e nao apenas coisas individuais 
                },
                run: function() { //uses one of the sub methods
                    var its = items(page());
                    //nao duplicar se ja houverem muitos (remover na versão final, may be)
                    //nao duplicar se for imagem pq para cada imagem ja existe tambem um obj rect
                    if (its.length < 10 && !(selectedItem instanceof Image)) {
                        var subMethods = pageItemMethods.methods.duplicate.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);

                        //num repetitions
                        var numRepetitions = 1; //semiConceptualRandomBetween(1, 100);
                        if (randomSubMethod.init) randomSubMethod.init();
                        if (randomSubMethod.minRepetitions)
                            if (numRepetitions < randomSubMethod.minRepetitions) numRepetitions = randomSubMethod.minRepetitions;

                        //other variables
                        var radius = randomRadius();
                        var initialAng = randomFloat(0, Math.PI * 2);
                        var angleIncMin = Math.PI / 32;
                        var angleIncMax = Math.PI / 4;
                        var angInc = randomInc(angleIncMax - angleIncMin);
                        var allowNegativeRadius = false;
                        if (randomFloat(0, 1) < 0.5) allowNegativeRadius = true;
                        var b = bounds(selectedItem);
                        var initialX = b.left;

                        var v = {
                            x: 0, //offset (relative pos from prev elm)
                            y: 0, //offset (relative pos from prev elm)
                            incx: randomRadius(),
                            incy: randomRadius(),
                            initialX: initialX,
                            incxInc: randomInc(radius / 2),
                            incyInc: randomInc(radius / 2),
                            maxNumColumns: semiConceptualRandomBetween(2, round(numRepetitions / 2)),
                            currentColumnIndex: 0,
                            radius: radius,
                            radiusInc: randomInc(radius / 2),
                            angle: initialAng,
                            angleInc: angInc,
                            angleIncInc: randomInc(angInc / 4),
                            probToInvertDirection: randomFloat(0, 1),
                            angleIncMax: angleIncMax,
                            angleIncMin: angleIncMin,
                            allowNegativeRadius: allowNegativeRadius,
                            initialSetup: true
                        }

                        //repeat
                        var prevItem = selectedItem;
                        var itemsOutsidePage = [];
                        //var originalItem = selectedItem;

                        for (var i = 0; i < numRepetitions; i++) {
                            var newv = randomSubMethod.run(v);
                            var newItem = prevItem.duplicate(page(), [newv.x, newv.y]);
                            label(newItem, "copy");

                            var old = bounds(prevItem);
                            var n = bounds(newItem);
                            //line(old.left, old.top, n.left, n.top);

                            if (outsidePage(newItem)) itemsOutsidePage.push(newItem);
                            if (steppingAway(newItem)) break; //outside enviroment (because can go outsite and enter again)
                            if (v.allowNegativeRadius && v.radius <= 0) break;

                            //selectedItem = newItem;
                            prevItem = newItem;
                        }

                        for (var i = 0; i < itemsOutsidePage.length; i++)
                            itemsOutsidePage[i].remove();

                        //selectedItem = originalItem;
                    }
                }
            },*/
            /*fit: {
                labels: [l.fit],
                constants: {
                    applyFrameFittingOptions: {
                        value: FitOptions.APPLY_FRAME_FITTING_OPTIONS,
                        labels: [l.center, l.middle, l.framed]
                    },
                    centerContent: {
                        value: FitOptions.CENTER_CONTENT,
                        labels: [l.center, l.middle]
                    },
                    contentAwareFit: {
                        value: FitOptions.CONTENT_AWARE_FIT,
                        labels: [l.center, l.middle, l.framed, l.focus, l.focus]
                    },
                    contentToFrame: {
                        value: FitOptions.CONTENT_TO_FRAME,
                        labels: [l.center, l.middle, l.framed]
                    },
                    fillProportionally: {
                        value: FitOptions.FILL_PROPORTIONALLY,
                        labels: [l.center, l.middle, l.proportional]
                    },
                    frameToContent: {
                        value: FitOptions.FRAME_TO_CONTENT,
                        labels: [l.center, l.middle, l.framed]
                    },
                    proportionally: {
                        value: FitOptions.PROPORTIONALLY,
                        labels: [l.center, l.middle, l.proportional]
                    }
                },
                run: function() {
                    var constants = pageItemMethods.methods.fit.constants;
                    var randomConst = rouletteFromProbToRun(constants);
                    if (selectedItem.hasOwnProperty("fit") && !(selectedItem instanceof TextFrame)) {
                        tryMutation(function(it) {
                            it.fit(randomConst.value);
                        });
                    }
                }
            },*/
            /*fitToPage: {
                //TODO: resize to fit in the page
            }*/
            moveZ: {
                labels: [l.move, l.z, l.depth],
                subMethods: {
                    back: {
                        labels: [l.back],
                        run: function() {
                            arrange(selectedItem, BACK);
                        }
                    },
                    front: {
                        labels: [l.front],
                        run: function() {
                            arrange(selectedItem, FRONT);
                        }
                    },
                    forward: {
                        labels: [l.forward],
                        run: function() {
                            arrange(selectedItem, FORWARD);
                        }
                    },
                    backward: {
                        labels: [l.backward],
                        run: function() {
                            arrange(selectedItem, BACKWARD);
                        }
                    }
                },
                run: function() {
                    if (!(selectedItem instanceof Image)) {
                        var subMethods = pageItemMethods.methods.moveZ.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);
                        randomSubMethod.run();
                        //TODO: retornar  constantes em zes de correr logo para  poder fazer trymutation
                    }

                }
            },
            //TODO: change position  with another item
            flipItem: {
                labels: [l.flip, l.mirror, l.invert, l.contrary, l.shift],
                constants: {
                    //axis
                    both: {
                        type: "Flip",
                        value: Flip.BOTH,
                        labels: [l.both]
                    },
                    horizontal: {
                        type: "Flip",
                        value: Flip.HORIZONTAL,
                        labels: [l.horizontal]
                    },
                    horizontalAndVertical: {
                        type: "Flip",
                        value: Flip.HORIZONTAL_AND_VERTICAL,
                        labels: [l.horizontal, l.vertical]
                    },
                    none: {
                        type: "Flip",
                        value: Flip.NONE,
                        labels: [l.straight, l.none, l.default]
                    },
                    vertical: {
                        type: "Flip",
                        value: Flip.VERTICAL,
                        labels: [l.vertical, l.down, l.upside]
                    },
                    //anchor point
                    // usar sempre center para o elemento nao sair da pagina
                    /*bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: [l.bottom, l.center]
                    },
                    bottomLeftAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_LEFT_ANCHOR,
                        labels: [l.bottom, l.left]
                    },
                    bottomRightAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_RIGHT_ANCHOR,
                        labels: [l.bottom, l.right]
                    },
                    centerAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.CENTER_ANCHOR,
                        labels: [l.center]
                    },
                    rightCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.RIGHT_CENTER_ANCHOR,
                        labels: [l.right, l.center]
                    },
                    bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: [l.bottom, l.center]
                    },
                    bottomCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR,
                        labels: [l.bottom, l.center]
                    },
                    topCenterAnchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_CENTER_ANCHOR,
                        labels: [l.top, l.center]
                    },
                    topLeftAchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_LEFT_ANCHOR,
                        labels: [l.top, l.left]
                    },
                    topRightAchor: {
                        type: "AnchorPoint",
                        value: AnchorPoint.TOP_RIGHT_ANCHOR,
                        labels: [l.top, l.right]
                    }*/
                },
                run: function() {
                    var constants = pageItemMethods.methods.flipItem.constants;
                    var axisConstants = filterSubObjsByType(constants, "Flip");
                    var randomAxis = rouletteFromProbToRun(axisConstants);
                    //$.writeln("        " + randomAxis.value);
                    //var achorConstants = filterSubObjsByType(constants, "AnchorPoint");
                    //var randomAnchor = rouletteFromProbToRun(achorConstants);
                    //$.writeln("        " + randomAnchor.value);
                    tryMutation(function(it) {
                        if (it.hasOwnProperty("flipItem")) {
                            it.flipItem(randomAxis.value, AnchorPoint.CENTER_ANCHOR);
                        }
                    });
                }
            },
            move: {
                labels: [l.move, l.translate, l.displace],
                subMethods: {
                    randomOffset: {
                        labels: [l.by, l.offset],
                        run: function() {
                            var b = bounds(selectedItem);
                            //var minVisible = min(width, height) / 64;
                            var minVisible;
                            if (selectedItem instanceof TextFrame) {
                                minVisible = b.width;
                            } else minVisible = b.width / 2;

                            //move x
                            var maxDistLeft = b.right - minVisible;
                            maxDistLeft = min(b.width, maxDistLeft); //max que pode andar para a esquerda //anda no maximo a sua propria largura
                            var maxDistRight = (width - b.left) - minVisible;
                            maxDistRight = min(b.width, maxDistRight); //max que pode andar para a direita
                            //move y
                            var maxDistTop = b.bottom - minVisible;
                            maxDistTop = min(b.height, maxDistTop); //max que pode andar para cima
                            var maxDistBottom = (height - b.top) - minVisible;
                            maxDistBottom = min(b.height, maxDistBottom); //max que pode andar para baixo
                            //move
                            var offset = [randomFloat(-maxDistLeft, maxDistRight), randomFloat(-maxDistTop, maxDistBottom)];

                            tryMutation(function(it) {
                                it.move([0, 0], offset);
                            });
                        }
                    },
                    randomPos: {
                        labels: [l.to, l.random],
                        run: function() {
                            var b = bounds(selectedItem);
                            //var minVisible = min(width, height) / 64;
                            var minVisible;
                            if (selectedItem instanceof TextFrame) {
                                minVisible = b.width;
                            } else minVisible = b.width / 2;

                            //move x
                            var maxDistLeft = b.right - minVisible; //max que pode andar para a esquerda
                            var maxDistRight = (width - b.left) - minVisible; //max que pode andar para a direita
                            //move y
                            var maxDistTop = b.bottom - minVisible; //max que pode andar para cima
                            var maxDistBottom = (height - b.top) - minVisible; //max que pode andar para baixo
                            //move
                            var offset = [randomFloat(-maxDistLeft, maxDistRight), randomFloat(-maxDistTop, maxDistBottom)];

                            tryMutation(function(it) {
                                it.move([0, 0], offset);
                            })
                        }
                    }
                    //TODO: move to sitios especificos como centro, top, topcenter, left... com  ou sem  offset
                    //snap to grid (make  grid->page.MarginPreference.customColumns)
                    //GuidePreference.guidesSnapto
                },
                run: function() {
                    var subMethods = pageItemMethods.methods.move.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    //randomSubMethod = pageItemMethods.methods.move.subMethods.randomPos;
                    if (!(selectedItem instanceof Image))
                        randomSubMethod.run();
                },
            },
            /*reframe: {
                labels: ["reframe"],
                subMethods: {
                    cutVertical: {
                        labels: [l.cut, l.slice, l.vertical],
                        run: function(b) {
                            var x = 0,
                                w = 0;

                            if (randomInt(0, 1) == 1) w = randomInt(-b.width, -1);
                            if (randomInt(0, 1) == 1) x = randomInt(1, b.width - w);
                            return {
                                x: x,
                                y: 0,
                                w: w,
                                h: 0
                            }
                        }
                    },
                    cutHorizontal: {
                        labels: [l.cut, l.slice, l.horizontal],
                        run: function(b) {
                            var y = 0,
                                h = 0;
                            if (randomInt(0, 1) == 1) h = randomInt(-b.height, -1);
                            if (randomInt(0, 1) == 1) y = randomInt(1, b.height - h);
                            return {
                                x: 0,
                                y: y,
                                w: 0,
                                h: h
                            }
                        }
                    },
                    cutHorizontalAndVertical: {
                        labels: [l.cut, l.slice, l.both],
                        run: function(b) {
                            var x = 0,
                                w = 0,
                                y = 0,
                                h = 0
                            if (randomInt(0, 1) == 1) w = randomInt(-b.width, -1);
                            if (randomInt(0, 1) == 1) x = randomInt(1, b.width - w);
                            if (randomInt(0, 1) == 1) h = randomInt(-b.height, -1);
                            if (randomInt(0, 1) == 1) y = randomInt(1, b.height - h);
                            return {
                                x: x,
                                y: y,
                                w: w,
                                h: h
                            }
                        }
                    },
                    //TODO: 
                    //constants: cut little, medium, much, half...
                    //augment
                    //cut dividing by concept number
                    //augment multiplying by concept number
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("reframe") &&
                        selectedItem.hasOwnProperty("images") &&
                        selectedItem.images.length == 1 &&
                        !(selectedItem instanceof TextFrame)) {

                        var b = bounds(selectedItem);
                        var subMethods = pageItemMethods.methods.reframe.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);
                        //randomSubMethod = pageItemMethods.methods.reframe.subMethods.cutHorizontalAndVertical;
                        var newBounds = randomSubMethod.run(b);

                        tryMutation(function(it) {
                            it.reframe(CoordinateSpaces.PAGE_COORDINATES, [
                                [-b.width + newBounds.x, -b.height + newBounds.y],
                                [newBounds.w, newBounds.h]
                            ]);
                            //if (it instanceof TextFrame) it.fit(FitOptions.FRAME_TO_CONTENT);
                        });

                    }
                }
            },*/
            //basil.js
            blendMode: {
                labels: [l.blend, l.opacity, l.effects],
                constants: {
                    normal: {
                        labels: [l.normal, l.default, l.natural],
                        value: BlendMode.NORMAL,
                    },
                    multiply: {
                        labels: [l.multiply, l.both],
                        value: BlendMode.MULTIPLY,
                    },
                    screen: {
                        labels: [l.screen],
                        value: BlendMode.SCREEN,
                    },
                    overlay: {
                        labels: [l.overlay],
                        value: BlendMode.OVERLAY,
                    },
                    softLight: {
                        labels: [l.soft, l.light],
                        value: BlendMode.SOFT_LIGHT,
                    },
                    hardLight: {
                        labels: [l.hard, l.light],
                        value: BlendMode.HARD_LIGHT,
                    },
                    colorDodge: {
                        labels: [l.color, l.dodge],
                        value: BlendMode.COLOR_DODGE,
                    },
                    colorBurn: {
                        labels: [l.color, l.burn],
                        value: BlendMode.COLOR_BURN,
                    },
                    darken: {
                        labels: [l.darken, l.dark],
                        value: BlendMode.DARKEN,
                    },
                    lighten: {
                        labels: [l.lighten, l.light],
                        value: BlendMode.LIGHTEN,
                    },
                    difference: {
                        labels: [l.difference, l.contrast],
                        value: BlendMode.DIFFERENCE,
                    },
                    exclusion: {
                        labels: [l.exclusion, l.contrast],
                        value: BlendMode.EXCLUSION,
                    },
                    hue: {
                        labels: [l.hue],
                        value: BlendMode.HUE,
                    },
                    saturation: {
                        labels: [l.saturation],
                        value: BlendMode.SATURATION,
                    },
                    color: {
                        labels: [l.color],
                        value: BlendMode.COLOR,
                    },
                    luminosity: {
                        labels: [l.luminosity, l.gray, l.black, l.white],
                        value: BlendMode.LUMINOSITY,
                    }
                },
                run: function() {
                    var constants = pageItemMethods.methods.blendMode.constants;
                    var randomConst = rouletteFromProbToRun(constants);
                    //$.writeln("        " + randomConst.value);
                    tryMutation(function(it) {
                        blendMode(it, randomConst.value);
                    })
                }
            },
            fillColor: {
                labels: [l.fill],
                subMethods: {
                    noFill: {
                        labels: [l.nofill, /*l.no, */ l.clean, l.empy],
                        run: function() {
                            //$.writeln("2")
                            return "None"
                        }
                    },
                    randomColor: {
                        labels: [l.random, l.color, l.plane, l.simple],
                        run: function() {
                            //$.writeln("2")
                            var colorSwatches = getColorSwatches();
                            //$.writeln("3")
                            var i = randomInt(0, colorSwatches.length - 1);
                            //$.writeln("4")
                            var c = colorSwatches[i];
                            //$.writeln("5")
                            return c;
                        }
                    },
                    /*randomGradient: {
                        labels: [l.random, l.gradient, l.smooth, l.complex],
                        run: function() {
                            var c = null;
                            var gradientSwatches = getGradientSwatches()
                            //if(gradientSwatches.length <= 0) {
                            //    pageMethods.methods.createGradient.run();
                            //    gradientSwatches = getGradientSwatches();
                            //}
                            if (gradientSwatches.length > 0) {
                                var i = randomInt(0, gradientSwatches.length - 1);
                                c = gradientSwatches[i];
                            }
                            return c;
                        }
                    }*/
                },
                run: function() {
                    //$.writeln("1")
                    var subMethods = pageItemMethods.methods.fillColor.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    tryMutation(function(it) {
                        var c = randomSubMethod.run();

                        if (c)
                            it.fillColor = c;
                    });
                }
            },
            textColor: {
                labels: [l.fill],
                subMethods: { //igual ao fillColor (depois trocar para serem os mesmos)
                    randomColor: {
                        labels: [l.random, l.color, l.simple, l.plane],
                        run: function() {
                            //$.writeln("2")
                            var colorSwatches = getColorSwatches();
                            //$.writeln("3")
                            var i = randomInt(0, colorSwatches.length - 1);
                            //$.writeln("4")
                            var c = colorSwatches[i];
                            //$.writeln("5")
                            return c;
                        }
                    },
                    /*randomGradient: {
                        labels: [l.random, l.gradient, l.complex, l.smooth],
                        run: function() {
                            var c = null;
                            var gradientSwatches = getGradientSwatches()
                            //if(gradientSwatches.length <= 0) {
                            //    pageMethods.methods.createGradient.run();
                            //    gradientSwatches = getGradientSwatches();
                            //}
                            if (gradientSwatches.length > 0) {
                                var i = randomInt(0, gradientSwatches.length - 1);
                                c = gradientSwatches[i];
                            }
                            return c;
                        }
                    }*/
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var subMethods = pageItemMethods.methods.fillColor.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);
                        var c = randomSubMethod.run();

                        if (c && c != "None") tryMutation(function(it) {
                            for (var i = 0; i < selectedItem.texts.length; i++) {
                                var t = selectedItem.texts[i];
                                t.fillColor = c;
                            }
                        });

                    }
                }
            },
            fillTint: {
                labels: [l.fill, l.tint, l.opacity, l.transparency],
                subMethods: {
                    fullTint: {
                        labels: [l.full, l.vivid],
                        run: function() {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: [l.high],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: [l.medium],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*lowTint: {
                        labels: [l.low, l.sad, l.autumn],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },
                    randomTint: {
                        labels: [l.random],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function() {
                    var subMethods = pageItemMethods.methods.fillTint.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    var tone = randomSubMethod.run();
                    //$.writeln(tone);
                    tryMutation(function(it) {
                        it.fillTint = tone;
                    })
                }
            },
            strokeColor: {
                labels: [l.stroke, l.frame, l.around, l.box, l.border],
                subMethods: {
                    noStroke: {
                        labels: [l.nostroke, l.no],
                        run: function() {
                            //$.writeln("2.1")
                            return "None"
                        }
                    },
                    randomColor: {
                        labels: [l.random, l.color, l.simple, l.plane],
                        run: function() {
                            //$.writeln("2.2")
                            var colorSwatches = getColorSwatches();
                            //$.writeln("3")
                            var i = randomInt(0, colorSwatches.length - 1);
                            //$.writeln("4")
                            var c = colorSwatches[i];
                            //$.writeln("5")
                            return c;
                        }
                    },
                    /*randomGradient: {
                        labels: [l.random, l.color, l.gradient, l.complex],
                        run: function() {
                            //$.writeln("2.3")
                            var gradientSwatches = getGradientSwatches()
                            //$.writeln("3")
                            var i = randomInt(0, gradientSwatches.length - 1);
                            //$.writeln("4")
                            var c = gradientSwatches[i];
                            //$.writeln("5")
                            return c;
                        }
                    }*/
                },
                run: function() {
                    //$.writeln("1")
                    var subMethods = pageItemMethods.methods.strokeColor.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    if (!(selectedItem instanceof Image))
                        tryMutation(function(it) {
                            var c = randomSubMethod.run();
                            if (c && c != "None") it.strokeColor = c
                        });
                }
            },
            strokeTint: {
                labels: [l.stroke, l.tint, l.opacity, l.transparency],
                subMethods: {
                    fullTint: {
                        labels: [l.full, l.vivid],
                        run: function() {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: [l.high],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: [l.medium],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*lowTint: {
                        labels: [l.low, l.sad, l.autumn],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },
                    randomTint: {
                        labels: [l.random],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function() {
                    var subMethods = pageItemMethods.methods.strokeTint.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    if (!(selectedItem instanceof Image))
                        //tryMutation(function(it) {
                        selectedItem.strokeTint = randomSubMethod.run();
                    //});
                }
            },
            opacity: {
                labels: [l.opacity, l.transparent, l.translucid, l.glass, l.through],
                subMethods: {
                    full: {
                        labels: [l.full, l.vivid],
                        run: function() {
                            return 100;
                        }
                    },
                    hight: {
                        labels: [l.high],
                        run: function() {
                            return randomFloat(75, 90);
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function() {
                            return randomFloat(40, 60);
                        }
                    },
                    /*low: {
                        labels: [l.low, l.sad, l.autumn],
                        run: function() {
                            return randomFloat(5, 25);
                        }
                    },*/
                    /*none: { //TODO: nao usar nos mandatorios
                        labels: [l.remove, l.hide, l.invisible],
                        run: function() {
                            return 0;
                        }
                    },*/
                    /*random: {
                        labels: [l.random],
                        run: function() {
                            return randomFloat(5, 100);
                        }
                    }*/
                },
                run: function() {
                    var subMethods = pageItemMethods.methods.opacity.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    var v = randomSubMethod.run();
                    tryMutation(function(it) {
                        opacity(it, v);
                    });
                }
            },
            strokeWeight: {
                labels: [l.stroke, l.border],
                //estas constantes ja estao no pageItemMethods
                constants: {
                    none: {
                        type: "none",
                        index: 0,
                        labels: [l.none, l.no],
                        value: -1
                    },
                    small: {
                        type: "small",
                        index: 1,
                        labels: [l.small, l.thin],
                        value: [595, 198]
                    },
                    medium: {
                        type: "medium",
                        index: 2,
                        labels: [l.medium, l.normal],
                        value: [197, 59]
                    },
                    big: {
                        type: "big",
                        index: 3,
                        labels: [l.big, l.spacy],
                        value: [58, 39]
                    },
                    /*veryBig: {
                        type: "oversized",
                        index: 4,
                        labels: [l.oversized, l.huge, l.extreme, l.much, l.over],
                        value: [38, 10]
                    }*/
                },
                run: function() {
                    //var constants = pageMethods.methods.strokeWeight.constants;
                    var constants = pageItemMethods.methods.strokeWeight.constants;
                    var randomConstant = rouletteFromProbToRun(constants);
                    //randomConstant = pageMethods.methods.strokeWeight.constants.oversized
                    var w = 0;
                    if (randomConstant.value != -1) {
                        var divisor = randomFloat(randomConstant.value[0], randomConstant.value[1]);
                        w = width / divisor;
                    }

                    if (!(selectedItem instanceof Image))
                        tryMutation(function(it) {
                            it.strokeWeight = w;
                        });

                }
            },
            rotate: {
                labels: [l.rotate, l.tilt],
                subMethods: {
                    veryLittle: {
                        labels: [l.few, l.little, l.very],
                        run: function(v) {
                            return randomFloat(180 / 64, 180 / 8);
                        }
                    },
                    third: {
                        type: "ang",
                        labels: [l.third, l.three],
                        run: function(v) {
                            return 180 / 3;
                        }
                    },
                    little: {
                        type: "ang",
                        labels: [l.few, l.little],
                        run: function(v) {
                            return randomFloat(180 / 8, 45);
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: [l.medium],
                        run: function(v) {
                            return randomFloat(45, 90);
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: [l.quarter, l.four],
                        run: function(v) {
                            return 90;
                        }
                    },
                    half: {
                        type: "ang",
                        labels: [l.half],
                        run: function(v) {
                            return 180;
                        }
                    },
                    very: {
                        type: "ang",
                        labels: [l.very],
                        run: function(v) {
                            return randomFloat(90, 270);
                        }
                    },
                    veryMuch: {
                        type: "ang",
                        labels: [l.very, l.much],
                        run: function(v) {
                            return randomFloat((Math.PI / 4) * 3, (Math.PI * 2) - (Math.PI / 64));
                        }
                    }
                },
                run: function() {
                    //TODO: constants to define ref point
                    referencePoint(CENTER);

                    var subMethods = pageItemMethods.methods.rotate.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    var ang = randomSubMethod.run();

                    if (!(selectedItem instanceof Image))
                        tryMutation(function(it) {
                            transform(it, "rotate", ang);
                        });
                }
            },
            /*scale: {
                labels: [l.scale, l.dimension, l.size],
                subMethods: {
                    random: {
                        labels: [l.random],
                        run: function() {
                            return randomFloat(0, 4);
                        }
                    },
                    big: {
                        labels: [l.big],
                        run: function() {
                            return randomFloat(2, 4);
                        }
                    },
                    mediumBig: {
                        labels: [l.medium, l.bigger],
                        run: function() {
                            return randomFloat(1.5, 2);
                        }
                    },
                    mediumSmall: {
                        labels: [l.medium, l.small],
                        run: function() {
                            return randomFloat(0.5, 1 / 3);
                        }
                    },
                    small: {
                        labels: [l.medium, l.small],
                        run: function() {
                            return randomFloat(0.1, 0.5);
                        }
                    }
                },
                run: function() {
                    if (!(selectedItem instanceof TextFrame)) {
                        var b = bounds(selectedItem);
                        var size = min(b.width, b.height);

                        referencePoint(CENTER)
                        //factor
                        var subMethods = pageItemMethods.methods.scale.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);
                        var factor = randomSubMethod.run();
                        //check can change size
                        var minSize = min(width, height) / (595 / 50); //50px
                        var canIncrease = size < max(width, height);
                        var canDecrease = size > minSize;
                        //change size
                        if ((factor < 1 && canDecrease) || (factor > 1 && canIncrease)) {
                            tryMutation(function(it) {
                                transform(it, "scale", factor);
                                //if (selectedItem instanceof TextFrame) selectedItem.fit(FitOptions.FRAME_TO_CONTENT)
                            });
                        }
                    }

                }
            },*/
            shear: {
                labels: [l.shear, l.tilt],
                subMethods: {
                    //TODO: method for the right and for the left (negative)
                    veryLittle: {
                        labels: [l.few, l.little, l.very],
                        run: function(v) {
                            return randomInt(5, 10);
                        }
                    },
                    little: {
                        type: "ang",
                        labels: [l.few, l.little],
                        run: function(v) {
                            return randomInt(11, 20);
                        }
                    },
                    mediumSmall: {
                        type: "ang",
                        labels: [l.medium, l.small],
                        run: function(v) {
                            return randomInt(21, 30);
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: [l.medium],
                        run: function(v) {
                            return randomInt(31, 44);
                        }
                    },
                    half: {
                        type: "ang",
                        labels: [l.half],
                        run: function(v) {
                            return 45;
                        }
                    },
                    /*mediumHigh: {
                        type: "ang",
                        labels: [l.medium],
                        run: function(v) {
                            return randomInt(46, 60);
                        }
                    },*/
                    /*very: {
                        type: "ang",
                        labels: [l.very],
                        run: function(v) {
                            return randomInt(61, 70);
                        }
                    },*/
                    /*veryMuch: {
                        type: "ang",
                        labels: [l.very, l.much],
                        run: function(v) {
                            return randomInt(71, 89);
                        }
                    }*/
                },
                run: function() {
                    var subMethods = pageItemMethods.methods.shear.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    var ang = randomSubMethod.run();
                    $.writeln("Ang:'" + ang + "'");

                    if (!(selectedItem instanceof Image)) {
                        tryMutation(function(it) {
                            transform(it, "shear", ang);
                        });
                    }

                }
            },
            size: {
                labels: [l.size],
                subMethods: {
                    /*veryBig: {
                        labels: [l.big, l.very],
                        run: function() {
                            return [
                                randomFloat(width, width * 2),
                                randomFloat(height, height * 2)
                            ]
                        }
                    },*/
                    big: {
                        labels: [l.big, l.bigger],
                        run: function() {
                            return [
                                randomFloat(width / 2, width),
                                randomFloat(height / 2, height)
                            ]
                        }
                    },
                    medium: {
                        labels: [l.medium, l.normal],
                        run: function() {
                            return [
                                randomFloat(width / 4, width / 2),
                                randomFloat(height / 4, height / 2)
                            ]
                        }
                    },
                    small: {
                        labels: [l.small, l.mini],
                        run: function() {
                            return [
                                randomFloat(width / 8, width / 4),
                                randomFloat(height / 8, height / 4)
                            ]
                        }
                    },
                    /*verySmall: {
                        labels: [l.big],
                        run: function() {
                            return [
                                randomFloat(width / 64, width / 8),
                                randomFloat(height / 64, height / 8)
                            ]
                        }
                    }*/
                    //se imagem, ajuste automatico?
                    //TODO: horizontal, vertical...
                    //TODO: size to grid size
                    //TODO: size proportionaly
                },
                run: function() {
                    if (!(selectedItem instanceof Image))
                        if (!(selectedItem instanceof TextFrame)) {
                            var subMethods = pageItemMethods.methods.size.subMethods;
                            var randomSubMethod = rouletteFromProbToRun(subMethods);
                            var size = randomSubMethod.run();
                            //TODO: define height proportioinally 

                            tryMutation(function(it) {
                                transform(it, "size", size);
                                //if (selectedItem instanceof TextFrame) selectedItem.fit(FitOptions.FRAME_TO_CONTENT)
                                if (it.hasOwnProperty("fit"))
                                    it.fit(FitOptions.FRAME_TO_CONTENT);
                            });
                        }
                }
            },
            justification: {
                labels: [l.text, l.justify],
                constants: {
                    //horizontal
                    awayFromBindingSide: {
                        type: "horizontal",
                        labels: [l.away, l.from, l.binding, l.side],
                        value: Justification.AWAY_FROM_BINDING_SIDE
                    },
                    centerAlign: {
                        type: "horizontal",
                        labels: [l.center, l.middle, l.balance, l.align],
                        value: Justification.AWAY_FROM_BINDING_SIDE
                    },
                    centerJustified: {
                        type: "horizontal",
                        labels: [l.center, l.middle, l.balance, l.justify, l.side, l.tight],
                        value: Justification.CENTER_JUSTIFIED
                    },
                    fullyJustified: {
                        type: "horizontal",
                        labels: [l.center, l.middle, l.balance, l.justify, l.full, l.tight],
                        value: Justification.FULLY_JUSTIFIED
                    },
                    leftAlign: {
                        type: "horizontal",
                        labels: [l.left, l.align, l.side, l.normal, l.traditional],
                        value: Justification.LEFT_ALIGN
                    },
                    rightAlign: {
                        type: "horizontal",
                        labels: [l.right, l.align, l.side],
                        value: Justification.RIGHT_ALIGN
                    },
                    rightJustified: {
                        type: "horizontal",
                        labels: [l.right, l.justify, l.side, l.tight],
                        value: Justification.RIGHT_JUSTIFIED
                    },
                    toBindingSide: {
                        type: "horizontal",
                        labels: [l.binding, l.side],
                        value: Justification.TO_BINDING_SIDE
                    }
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        for (var i = 0; i < selectedItem.texts.length; i++) {
                            var constants = pageItemMethods.methods.justification.constants;
                            var randomHoriz = rouletteFromProbToRun(constants).value;

                            tryMutation(function(it) {
                                var t = it.texts[i];
                                t.justification = randomHoriz;
                                //$.writeln(t.justification)
                            });
                        }
                    }
                }
            },
            verticalAlign: {
                labels: [l.text, l.align],
                constants: {
                    //vertical
                    bottomAlign: {
                        type: "vertical",
                        labels: [l.bottom, l.align, l.land, l.down],
                        value: VerticalJustification.BOTTOM_ALIGN
                    },
                    centerAlign: {
                        type: "vertical",
                        labels: [l.center, l.align, l.middle, l.balance],
                        value: VerticalJustification.CENTER_ALIGN
                    },
                    justifyAlign: {
                        type: "vertical",
                        labels: [l.justify, l.align, l.tight, l.full],
                        value: VerticalJustification.JUSTIFY_ALIGN
                    },
                    topAlign: {
                        type: "vertical",
                        labels: [l.top, l.align, l.sky, l.up, l.fly],
                        value: VerticalJustification.TOP_ALIGN
                    }
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var constants = pageItemMethods.methods.verticalAlign.constants;
                        var randomVert = rouletteFromProbToRun(constants).value;
                        tryMutation(function(it) {
                            //for (var i = 0; i < it.texts.length; i++) {
                            //var t = it.texts[i];
                            it.textFramePreferences.verticalJustification = randomVert;
                            //}
                        });
                    }
                }
            },
            /* textFont: {
                 labels: [l.font],
                 constants: fontConstants, //initiated in initFonts
                 //TODO: chage font only of a char, of a line, of a paragram
                 //most likely to change words related to keywords
                 run: function() {
                     if (selectedItem.hasOwnProperty("texts")) {
                         //font family
                         var constants = pageItemMethods.methods.textFont.constants;
                         var randomFamily = rouletteFromProbToRun(constants);
                         //font weight
                         var randomWeight = rouletteFromProbToRun(randomFamily.weights).value

                         tryMutation(function(it) {
                             typo(it, "appliedFont", randomWeight);
                             if (it.hasOwnProperty("fit"))
                                 it.fit(FitOptions.FRAME_TO_CONTENT);
                         });
                     }
                 }
             },*/
            //TODO: kerning
            tracking: {
                labels: [l.tracking, l.space, l.letter],
                subMethods: {
                    negative: {
                        labels: [l.negative, l.very, l.join, l.merge, l.together],
                        run: function() {
                            return randomInt(-50, -100)
                        }
                    },
                    small: {
                        labels: [l.small],
                        run: function() {
                            return randomInt(0, 20)
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function() {
                            return randomInt(21, 50)
                        }
                    },
                    big: {
                        labels: [l.big, l.separated, l.apart],
                        run: function() {
                            return randomInt(51, 200)
                        }
                    },
                    veryBig: {
                        labels: [l.very, l.big, l.separated, l.apart],
                        run: function() {
                            return randomInt(201, 500)
                        }
                    },
                    overSized: {
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function() {
                            return randomInt(501, 1000)
                        }
                    }
                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var subMethods = pageItemMethods.methods.tracking.subMethods;
                        var randomValue = rouletteFromProbToRun(subMethods).run();

                        tryMutation(function(it) {
                            typo(it, "tracking", randomValue);
                            if (it.hasOwnProperty("fit"))
                                it.fit(FitOptions.FRAME_TO_CONTENT);
                        });

                    }
                }
            },
            leading: {
                labels: [l.leading, l.space, l.line, l.vertical],
                subMethods: {
                    negative: {
                        labels: [l.negative, l.very, l.join, l.merge, l.together],
                        run: function(txtSize) {
                            return randomInt(txtSize * 0.95, txtSize * 0.8)
                        }
                    },
                    small: {
                        labels: [l.small],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.01, txtSize * 1.1)
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.11, txtSize * 1.2)
                        }
                    },
                    big: {
                        labels: [l.big, l.separated, l.apart],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.21, txtSize * 1.4)
                        }
                    },
                    veryBig: {
                        labels: [l.very, l.big, l.separated, l.apart],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.41, txtSize * 1.6)
                        }
                    },
                    overSized: {
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function(txtSize) {
                            return randomInt(txtSize * 1.61, txtSize * 4)
                        }
                    },
                    giant: {
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function(txtSize) {
                            return randomInt(txtSize * 4.1, txtSize * 50)
                        }
                    }

                },
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var subMethods = pageItemMethods.methods.leading.subMethods;
                        var txtSize = selectedItem.texts[0].pointSize;
                        var randomValue = rouletteFromProbToRun(subMethods).run(txtSize);

                        tryMutation(function(it) {
                            typo(it, "leading", randomValue);
                            if (it.hasOwnProperty("fit"))
                                it.fit(FitOptions.FRAME_TO_CONTENT);
                        });
                    }
                }
            },
            textSize: { //rever isto quando tiver hierarquia
                labels: [l.text, l.size, l.body],
                subMethods: {
                    random: {
                        labels: [l.random],
                        run: function() {
                            //var subMethods = pageMethods.methods.textBodySize.subMethods;
                            //return rouletteFromProbToRun(subMethods).run();
                            return randomInt(15, 150);
                        }
                    },
                    textBodySize: {
                        labels: [l.body, l.read, l.normal],
                        run: function() {
                            return textBodySize;
                        }
                    },
                    biggerThanTextBody: {
                        labels: [l.bigger, l.title, l.subtitle, l.important, l.head, l.attention],
                        run: function() {
                            //var level = randomInt(2, 10);
                            var level = randomInt(2, 4);
                            return textBodySize * (Math.pow(textHierachyRel, level));
                        }
                    },
                    smallerThanTextBody: {
                        labels: [l.smaller, l.note, l.detail, l.info, l.partners, l.authors, l.label],
                        run: function() {
                            //var level = randomInt(-2, -10);
                            var level = randomInt(-2, -4);
                            var newSize = textBodySize / (Math.pow(textHierachyRel, Math.abs(level)));

                            //check minSize
                            //var minSize = width / (595 / 4);
                            var minSize = 30;
                            if (newSize < minSize) newSize = -1;

                            return newSize;
                        }
                    }
                },
                //TODO: mudar tamanho num do paragrafo etc..
                //ir buscar tamanho de outro  texto existente
                //melhor: editar apenas estilos de texto no pageitems. 
                //no item apenas escolhe um estilo existente de acordo com a hierarquia
                run: function() {
                    if (selectedItem.hasOwnProperty("texts")) {
                        doc().frameFittingOptions.autoFit = true;

                        var textSizeAnterior = selectedItem.texts[0].pointSize;
                        var entrelinhaAnterior = selectedItem.texts[0].leading;
                        //$.writeln("textSizeAnterior " + textSizeAnterior);
                        //$.writeln("entrelinhaAnterior " + entrelinhaAnterior);

                        var subMethods = pageItemMethods.methods.textSize.subMethods;
                        var randomSubMethod = rouletteFromProbToRun(subMethods);
                        var randomValue = randomSubMethod.run();
                        if (randomValue == -1) randomValue = textSizeAnterior;

                        tryMutation(function(it) {

                            if (it.hasOwnProperty("fit"))
                                it.fit(FitOptions.FRAME_TO_CONTENT);
                            //$.writeln("        " + randomSubMethod.name + ": " + randomValue);
                            typo(it, "pointSize", randomValue);
                            //$.writeln("pointSize " + randomValue);
                            if (it.hasOwnProperty("fit"))
                                it.fit(FitOptions.FRAME_TO_CONTENT);
                            //atualizar entrelinha proporcionalmente
                            if (entrelinhaAnterior != "AUTO" && entrelinhaAnterior != Leading.AUTO) {
                                var rel = randomValue / textSizeAnterior;
                                var newLeading = entrelinhaAnterior * rel;
                                typo(it, "leading", newLeading);
                                //$.writeln("leading  " + newLeading);
                                if (it.hasOwnProperty("fit"))
                                    it.fit(FitOptions.FRAME_TO_CONTENT);
                            }

                        });

                        //doc().frameFittingOptions.autoFit = false;
                    } else {
                        $.writeln("elemento nao tem prop texts")
                    }
                }
            },
            /*hierachyLevel: {
                //ver notas no caderno
                labels: [l.hierachy, l.level],
                run: function() {

                }
            },*/
            //TODO:copiar estilo de um outro item
            //TODO:criar estilos de character e paragrafo no pagemethods; aqui, aplicar um  desses estilos  ao texto
        },
        runAll: function(pag) {
            logToFile("pageItemMethods");
            page(pag);
            var methods = pageItemMethods.methods;
            var i = 0;

            for (var k in methods) {
                //DEBUG
                var before = items(page(pag)).filter(function(i) {
                    return i.parent instanceof Spread
                }).length;

                //METHODS
                var m = methods[k];
                var r = randomFloat(0, 1);
                if (r < m.probToRun) {
                    var name = m.name;
                    logToFile("\npageItemMethods: about to run method (" + k + ") " + m.name + " at " + selectedItem.name);
                    var executed = m.run();

                    //DEBUG
                    var after = items(page(pag)).filter(function(i) {
                        return i.parent instanceof Spread
                    }).length;
                    if (after != before) logToFile("metodo " + m.name + " alterou num items " + before + " " + after);

                    //BREAK IF REMOVED
                    if (executed)
                        if (m.name == "remove") break; //se removeu o item, nao ha mais mutações a fazer
                }
            }

            logToFile("pageItemMethods END")
        }
    }
    initMethods(pim.methods);
    return pim;
};

//Page and document methods
var pageMethods;
var initPageMethods = function(fontConstants) {
    var pm = {
        methods: {
            createColor: {
                name: "createColor",
                labels: [l.color, l.basic],
                subMethods: {
                    //hue
                    randomRed: {
                        type: "hue",
                        labels: [l.red, l.fire, l.apple, l.strawberry, l.love],
                        run: function() {
                            var r = randomFloat(0, 16) / 360;
                            if (randomFloat(0, 1) < .5) r = randomFloat(337, 360) / 360;
                            return r;
                        }
                    },
                    randomOrange: {
                        type: "hue",
                        labels: [l.orange, l.fire],
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
                        labels: [l.brown, l.wood],
                        brightnessLimits: {
                            minBrightness: .1,
                            maxBrightness: .6
                        },
                        run: function() {
                            return randomFloat(16, 45) / 360
                        }
                    },
                    randomYellow: {
                        type: "hue",
                        labels: [l.yellow, l.sun],
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
                        labels: [l.green, l.grass, l.tree, l.enviroment, l.forest, l.plant],
                        run: function() {
                            return randomFloat(73, 170) / 360;
                        }
                    },
                    randomBlue: {
                        type: "hue",
                        labels: [l.blue, l.water, l.sky, l.sad, l.sea, l.fish],
                        run: function() {
                            return randomFloat(196, 259) / 360;
                        }
                    },
                    randomPurple: {
                        type: "hue",
                        labels: [l.purple, l.wine, l.violet],
                        run: function() {
                            return randomFloat(259, 278) / 360;
                        }
                    },
                    randomPink: {
                        type: "hue",
                        labels: [l.pink],
                        run: function() {
                            return randomFloat(278, 337) / 360;
                        }
                    },
                    randomHue: {
                        type: "hue",
                        labels: [l.random],
                        run: function() {
                            return randomFloat(0, 360) / 360;
                        }
                    },
                    //saturation
                    randomSaturation: {
                        type: "saturation",
                        labels: [l.random],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    lowSaturation: {
                        type: "saturation",
                        labels: [l.low, l.gray, l.sad],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max / 2);
                        }
                    },
                    highSaturation: {
                        type: "saturation",
                        labels: [l.colorful, l.happy, l.saturation, l.high],
                        run: function(min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(max / 2, max);
                        }
                    },
                    maxSaturation: {
                        type: "saturation",
                        labels: [l.colorful, l.happy, l.very, l.super, l.extreme, l.saturation, l.total],
                        run: function(min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    minSaturation: {
                        type: "saturation",
                        labels: [l.low, l.sad, l.gray, l.black, l.white, l.old, l.neutral],
                        run: function(min, max) {
                            if (!min) min = .1;
                            return min;
                        }
                    },
                    //brightness
                    randomBrightness: {
                        type: "brightness",
                        labels: [l.random],
                        run: function(min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    lowBrightness: {
                        type: "brightness",
                        labels: [l.low, l.dark, l.sad, l.fear, l.surprise, l.night],
                        run: function(min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            var range = (max - min) / 2;
                            return randomFloat(min, min + range);
                        }
                    },
                    highBrightness: {
                        type: "brightness",
                        labels: [l.bright, l.sunny, l.light, l.peace, l.day],
                        run: function(min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            var range = (max - min) / 2;
                            return randomFloat(min + range, max);
                        }
                    },
                    maxBrightness: {
                        type: "brightness",
                        labels: [l.bright, l.sunny, l.light, l.peace, l.day, l.white],
                        run: function(min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    minBrightness: {
                        type: "brightness",
                        labels: [l.low, l.dark, l.sad, l.fear, l.surprise, l.night, l.black],
                        run: function(min, max) {
                            if (!min) min = .2;
                            return min;
                        }
                    },
                },
                run: function() {
                    var subMethods = pageMethods.methods.createColor.subMethods;
                    var hueMethods = {};
                    var satMethods = {};
                    var briMethods = {};
                    for (var key in subMethods) {
                        if (subMethods[key].type == "hue") hueMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "saturation") satMethods[key] = subMethods[key];
                        else if (subMethods[key].type == "brightness") briMethods[key] = subMethods[key];
                    }

                    //hue
                    var randomH = rouletteFromProbToRun(hueMethods);
                    //var randomH = hueMethods.randomHue;

                    //saturation
                    var randomS = 1;
                    var satLims = randomH.saturationLimits;
                    if (satLims) {
                        randomS = rouletteFromProbToRun(satMethods)
                        //$.writeln("        " + randomS.name);
                        randomS = randomS.run(satLims.minSaturation, satLims.maxSaturation);
                    } else {
                        randomS = rouletteFromProbToRun(satMethods);
                        //$.writeln("        " + randomS.name);
                        randomS = randomS.run();
                    }

                    //brightness
                    var randomB = 1;
                    var briLims = randomH.brightnessLimits;
                    if (briLims) {
                        randomB = rouletteFromProbToRun(briMethods);
                        //$.writeln("        " + randomB.name);
                        randomB = randomB.run(briLims.minBrightness, briLims.maxBrightness);
                    } else {
                        randomB = rouletteFromProbToRun(briMethods);
                        //$.writeln("        " + randomB.name);
                        randomB = randomB.run();
                    }

                    randomH = randomH.run();
                    //$.writeln("        HSB: " + randomH + "," + randomS + "," + randomB);

                    var rgb = HSVtoRGB(randomH, randomS, randomB);
                    return color(rgb.r, rgb.g, rgb.b);
                }
            },
            //TODO:
            /*createColorFromCymbolism: { //creates color using keywords and  http://cymbolism.com/about
                name: "createColorFromCymbolism",
                labels: [l.color, l.meaningful],
                run: function() {
                    //ir as keywords, associa-las às palavras existentes no cymbolisme sacar cor
                }
            },*/
            /*createGradient: {
                name: "createGradient",
                labels: [l.gradient, l.progressive, l.smooth, l.transition, l.merge],
                constants: {
                    linear: {
                        type: "gradientType",
                        labels: [l.linear, l.forward, l.straight],
                        value: GradientType.LINEAR
                    },
                    radial: {
                        type: "gradientType",
                        labels: [l.radial, l.around, l.circle, l.ring],
                        value: GradientType.RADIAL
                    }
                },
                subMethods: {
                    //type: "gradientColors",
                    twoColors: {
                        type: "gradientColors",
                        labels: [l.two, l.simple, l.balanced, l.half, l.split],
                        run: function() {
                            var colorSwatches = getColorSwatches();

                            if (colorSwatches.length >= 2) {
                                var j = randomInt(0, colorSwatches.length - 1);
                                var c1 = colorSwatches[j];

                                j = randomInt(0, colorSwatches.length - 1);
                                var c2 = colorSwatches[j];
                                while (c2.id == c1.id) {
                                    j = randomInt(0, colorSwatches.length - 1);
                                    c2 = colorSwatches[j];
                                }

                                var name = "twoColors" + c1.id + "," + c2.id;
                                gradient([c1, c2], name);

                            } else $.writeln("Needs at least 2 colors to create a gradient")
                        }
                    },
                    twoRandomDistColors: {
                        type: "gradientColors",
                        labels: [l.two, l.random, l.unbalance, l.different],
                        run: function() {
                            var colorSwatches = getColorSwatches();

                            if (colorSwatches.length >= 2) {

                                var j = randomInt(0, colorSwatches.length - 1);
                                var c1 = colorSwatches[j];
                                var pos = [randomInt(0, 100), randomInt(0, 100)];

                                j = randomInt(0, colorSwatches.length - 1);
                                var c2 = colorSwatches[j];
                                while (c2.id == c1.id) {
                                    j = randomInt(0, colorSwatches.length - 1);
                                    c2 = colorSwatches[j];
                                }

                                var name = "twoRandDistColors" + c1.id + "," + c2.id;
                                gradient([c1, c2], pos, name);

                            } else $.writeln("Needs at least 2 colors to create a gradient")
                        }
                    },
                    multipleEqualyDistColors: {
                        type: "gradientColors",
                        labels: [l.multiple, l.complex, l.equaly, l.balance, l.uniform, l.colorful],
                        run: function() {
                            var colorSwatches = getColorSwatches();
                            if (colorSwatches.length >= 3) {

                                var cs = [];
                                var numCs = randomInt(3, semiConceptualRandomBetween(4, colorSwatches.length * 4));

                                var name = "multEqDist";
                                for (var i = 0; i < numCs; i++) {
                                    var j = randomInt(0, colorSwatches.length - 1);
                                    var c = colorSwatches[j];
                                    name += c.id + ",";
                                    cs.push(c)
                                }


                                gradient(cs, name);
                            } else $.writeln("Needs at least 3 colors to create a  multy color gradient")
                        }
                    },
                    multipleRandomDistColors: {
                        type: "gradientColors",
                        labels: [l.multiple, l.complex, l.random, l.unbalance, l.different, l.colorful],
                        run: function() {
                            var colorSwatches = getColorSwatches();
                            if (colorSwatches.length >= 3) {

                                var cs = [];
                                var pos = [];
                                var numCs = randomInt(3, semiConceptualRandomBetween(4, colorSwatches.length * 4));

                                var name = "multRandDist";
                                for (var i = 0; i < numCs; i++) {
                                    var j = randomInt(0, colorSwatches.length - 1);
                                    var c = colorSwatches[j];
                                    name += c.id + ",";
                                    cs.push(c);
                                    pos.push(randomInt(0, 100));
                                }

                                gradient(cs, pos, name);

                            } else $.writeln("Needs at least 3 colors to create a  multy color gradient")
                        }
                    }
                },
                run: function() {
                    var subMethods = pageMethods.methods.createGradient.subMethods;
                    var subMeth = rouletteFromProbToRun(subMethods);

                    var consts = pageMethods.methods.createGradient.constants;
                    var gradMode = rouletteFromProbToRun(consts);

                    //gradientMode(gradientMode.value)
                    subMeth.run(gradientMode.value);
                    var gradientSwatches = getGradientSwatches();
                    gradientSwatches[gradientSwatches.length - 1].type = gradientMode.value;

                }
            },*/
            /*referencePoint: { //TODO: verificar se isto vale a pena
                labels: [l.achor, l.reference, l.point],
                constants: {
                    topleft: {
                        labels: [l.top, l.left],
                        value: AnchorPoint.TOP_LEFT_ANCHOR
                    },
                    topcenter: {
                        labels: [l.top, l.center],
                        value: AnchorPoint.TOP_CENTER_ANCHOR
                    },
                    topright: {
                        labels: [l.top, l.right],
                        value: AnchorPoint.TOP_RIGHT_ANCHOR
                    },
                    leftcenter: {
                        labels: [l.left, l.center],
                        value: AnchorPoint.LEFT_CENTER_ANCHOR
                    },
                    center: {
                        labels: [l.center, l.midle, l.balance],
                        value: AnchorPoint.CENTER_ANCHOR
                    },
                    rightcenter: {
                        labels: [l.right, l.center],
                        value: AnchorPoint.RIGHT_CENTER_ANCHOR
                    },
                    bottomleft: {
                        labels: [l.bottom, l.left],
                        value: AnchorPoint.BOTTOM_LEFT_ANCHOR
                    },
                    bottomcenter: {
                        labels: [l.bottom, l.center],
                        value: AnchorPoint.BOTTOM_CENTER_ANCHOR
                    },
                    bottomright: {
                        labels: [l.bottom, l.right],
                        value: AnchorPoint.BOTTOM_RIGHT_ANCHOR
                    }
                },
                run: function() {
                    var constants = pageMethods.methods.referencePoint.constants;
                    var c = rouletteFromProbToRun(constants).value;
                    referencePoint(c);
                }
            },*/
            /*removeCopies: {
                labels: [l.remove, l.duplicated, l.missing, l.cut],
                subMethods: {
                    one: {
                        labels: [l.one],
                        run: function() {
                            var copies = [];
                            var its = items(page());
                            forEach(its, function(i) {
                                if (i.label == "copy") copies.push(i);
                            });
                            var randomItem = randomInt(0, copies.length - 1);
                            //remove(copies[randomItem]);
                            copies[randomItem].remove();
                        }
                    },
                    //TODO severalRandom //severalConsecutive
                    all: {
                        labels: [l.multiple, l.several],
                        run: function() {
                            var its = items(page());
                            forEach(its, function(i) {
                                if (i.label == "copy") {
                                    //remove(i);
                                    i.remove();
                                }
                            });
                        }
                    }
                },
                run: function() {
                    //remove apenas senao for original (input do utilizador)
                    //para fazer desaparecer originais, o sistema conta com a opacidade ou visibilidade
                    var subMethods = pageMethods.methods.removeCopies.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);
                    $.writeln(randomSubMethod.name)
                    randomSubMethod.run();
                }
            },*/
            /*TODO: group: {
                labels: [l.group, l.together, l.united],
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
            //TODO: fill etc...
            /*setMargins: {
                labels: [l.margin, l.border, l.frame],
                constants: {
                    none: {
                        type: "none",
                        index: 0,
                        labels: [l.none, l.no],
                        value: -1
                    },
                    small: {
                        type: "small",
                        index: 1,
                        labels: [l.small, l.thin],
                        value: [40, 31]
                    },
                    medium: {
                        type: "medium",
                        index: 2,
                        labels: [l.medium, l.normal],
                        value: [30, 21]
                    },
                    big: {
                        type: "big",
                        index: 3,
                        labels: [l.big, l.spacy],
                        value: [20, 11]
                    },
                    oversized: {
                        type: "oversized",
                        index: 4,
                        labels: [l.oversized, l.huge, l.extreme, l.much, l.over],
                        value: [10, 3]
                    }
                },
                subMethods: {
                    equal: {
                        labels: [l.equal, l.balanced, l.center, l.normal],
                        run: function(v, sizeFromConst) {
                            var constrains = rouletteFromProbToRun(v.constants);
                            var margin = sizeFromConst(v, constrains);
                            margins(margin);
                        }
                    },
                    verticalCenter: {
                        labels: [l.different, l.vertical, l.balanced, l.tall, l.high, l.big, l.center],
                        run: function(v) {
                            margins(v.small, v.big, v.small, v.big);
                        }
                    },
                    horizontalCenter: {
                        labels: [l.different, l.horizontal, l.balanced, l.short, l.base, l.long, l.center],
                        run: function(v) {
                            margins(v.big, v.small, v.big, v.small);
                        }
                    },
                    alignTop: {
                        labels: [l.different, l.top, l.fly, l.up],
                        run: function(v) {
                            margins(v.small, v.small, v.big, v.small);
                        }
                    },
                    alignBottom: {
                        labels: [l.different, l.bottom, l.land, l.heavy, l.terrain, l.down],
                        run: function(v) {
                            margins(v.big, v.small, v.small, v.small);
                        }
                    },
                    alignLeft: {
                        labels: [l.different, l.left, l.side],
                        run: function(v) {
                            margins(v.small, v.big, v.small, v.small);
                        }
                    },
                    alignRight: {
                        labels: [l.different, l.right, l.side],
                        run: function(v) {
                            margins(v.small, v.small, v.small, v.big);
                        }
                    },
                    alignTopLeft: {
                        labels: [l.different, l.top, l.left, l.corner, l.trapped, l.up],
                        run: function(v) {
                            margins(v.small, v.big, v.big, v.small);
                        }
                    },
                    alignTopRigt: {
                        labels: [l.different, l.top, l.right, l.corner, l.trapped, l.up],
                        run: function(v) {
                            margins(v.small, v.small, v.big, v.big);
                        }
                    },
                    alignBottomLeft: {
                        labels: [l.different, l.bottom, l.left, l.corner, l.trapped, l.down],
                        run: function(v) {
                            margins(v.big, v.big, v.small, v.small);
                        }
                    },
                    alignBottomRigt: {
                        labels: [l.different, l.bottom, l.right, l.corner, l.trapped, l.down],
                        run: function(v) {
                            margins(v.big, v.small, v.small, v.big);
                        }
                    }
                },
                run: function() {
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
                    var randomSubMethod = rouletteFromProbToRun(subMethods);

                    //randomSubMethod = pageMethods.methods.setMargins.subMethods.alignBottomRigt;
                    randomSubMethod.run(v, sizeFromConst);
                }
            },*/
            /*createGuide: {
                labels: [l.guide, l.conductor, l.align],
                subMethods: {
                    horizontal: {
                        labels: [l.y, l.horizontal, l.column],
                        run: function() {
                            var div = randomInt(2, 40);
                            var h = height / div;
                            var mult = randomInt(1, div - 1);
                            var y = h * mult;
                            guideY(y);
                        }
                    },
                    vertical: {
                        labels: [l.x, l.vertical, l.row],
                        run: function() {
                            var div = randomInt(2, 40);
                            var w = width / div;
                            var mult = randomInt(1, div - 1);
                            var x = w * mult;
                            guideX(x);
                        }
                    },
                    twoVert: {
                        labels: [l.x, l.vertical, l.column],
                        run: function() {
                            var div = randomInt(2, 40);
                            var w = width / div;

                            var mult = randomInt(1, div - 2);
                            var x1 = w * mult;
                            var x2 = w * (mult + 1);

                            guideX(x1);
                            guideX(x2);
                        }
                    },
                    twoHoriz: {
                        labels: [l.y, l.horizonal, l.row],
                        run: function() {
                            var div = randomInt(2, 40);
                            var h = height / div;

                            var mult = randomInt(1, div - 2);
                            var y1 = h * mult;
                            var y2 = h * (mult + 1);

                            guideY(y1);
                            guideY(y2);
                        }
                    },
                },
                run: function() {
                    var subMethods = pageMethods.methods.createGuide.subMethods;
                    var randomSubMethod = rouletteFromProbToRun(subMethods);

                    //randomSubMethod = pageMethods.methods.createGuide.subMethods.twoHoriz;
                    randomSubMethod.run();
                }
            },*/
            //TODO: remove guide
            /*createGrid: {
                labels: [l.grid, l.conductor, l.align, l.order],
                constants: {
                    noGutter: {
                        labels: [l.no, l.close, l.near],
                        value: 0
                    },
                    random: {
                        labels: [l.random],
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
                    equalColumns: {
                        labels: [l.column],
                        run: function() {
                            //num cols
                            var ms = page().marginPreferences;
                            ms.columnCount = round(semiConceptualRandomBetween(2, 10));

                            //gutter
                            var constants = pageMethods.methods.createGrid.constants;
                            var randomConst = rouletteFromProbToRun(constants);
                            var gutter;
                            if (randomConst.value == -1) gutter = randomFloat(width / 80, width / 30)
                            else gutter = randomConst.value;

                            ms.columnGutter = gutter;

                            return gutter;
                        }
                    },
                    equalRows: {
                        labels: [l.row],
                        run: function(gutter) {
                            //delete old guides
                            for (var i = page().guides.length - 1; i >= 0; i--) page().guides[i].remove();

                            var ms = page().marginPreferences;

                            //num rows
                            var numRows = round(semiConceptualRandomBetween(2, 10));

                            //gutter
                            var constants = pageMethods.methods.createGrid.constants;
                            var randomConst = rouletteFromProbToRun(constants);

                            if (!gutter) {
                                if (randomConst.value == -1) gutter = randomFloat(width / 80, width / 30)
                                else gutter = randomConst.value;
                            }

                            var halfGutter = 0;
                            if (gutter > 0) halfGutter = gutter / 2;
                            var gridH = height - ms.top - ms.bottom;
                            var rowH = gridH / numRows;

                            var y = ms.top;
                            for (var i = 0; i < numRows - 1; i++) {
                                y += rowH;
                                if (gutter == 0) guideY(y);
                                else {
                                    guideY(y - halfGutter);
                                    guideY(y + halfGutter);
                                }
                            }
                        }
                    },
                    //TODO:
                    //randomColumns: {
                        //var gridW = width - ms.left - ms.right;
                        //page().marginPreferences.columnsPositions = [gridW/10, gridW/10*9];
                    //},
                    //randomRows: {
                    77}
                    //TODO: grelha de quadrados (aproximadamente)
                },
                run: function() {
                    var subMethods = pageMethods.methods.createGrid.subMethods;
                    //var randomSubMethod = rouletteFromProbToRun(subMethods);
                    randomSubMethod = pageMethods.methods.createGrid.subMethods.equalColumns;
                    var gutter = randomSubMethod.run();

                    randomSubMethod = pageMethods.methods.createGrid.subMethods.equalRows;
                    randomSubMethod.run(gutter);

                }
            },*/
            //fiquei aqui na verificação
            /*strokeWeight: {
                labels: [l.stroke, l.border],
                constants: {
                    none: {
                        type: "none",
                        index: 0,
                        labels: [l.none, l.no],
                        value: -1
                    },
                    small: {
                        type: "small",
                        index: 1,
                        labels: [l.small, l.thin],
                        value: [595, 198]
                    },
                    medium: {
                        type: "medium",
                        index: 2,
                        labels: [l.medium, l.normal],
                        value: [197, 59]
                    },
                    big: {
                        type: "big",
                        index: 3,
                        labels: [l.big, l.spacy],
                        value: [58, 39]
                    },
                    veryBig: {
                        type: "oversized",
                        index: 4,
                        labels: [l.oversized, l.huge, l.extreme, l.much, l.over],
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
            /*arc: {
                labels: [l.arc],
                subMethods: {
                    //shape
                    circleH: {
                        type: "shape",
                        labels: [l.circle, l.normal, l.moon],
                        run: function(v) {
                            return v.w;
                        }
                    },
                    ellipseH: {
                        type: "shape",
                        labels: [l.ellipse, l.deformed],
                        run: function(v) {
                            return randomFloat(width / v.minDiv, height);
                        }
                    },
                    //angles
                    verySmall: {
                        type: "ang",
                        labels: [l.small, l.very, l.mini, l.spike],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 64, Math.PI / 8);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    third: {
                        type: "ang",
                        labels: [l.third],
                        run: function(v) {
                            return [0, Math.PI / 3];
                        }
                    },
                    small: {
                        type: "ang",
                        labels: [l.small, l.spike],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 8, Math.PI / 4);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: [l.quarter],
                        run: function(v) {
                            return [0, Math.PI / 4];
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: [l.medium, l.pizza, l.cone],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 4, Math.PI / 2);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    half: {
                        type: "ang",
                        labels: [l.half, l.divide],
                        run: function(v) {
                            return [0, Math.PI];
                        }
                    },
                    big: {
                        type: "ang",
                        labels: [l.big, l.missing],
                        run: function(v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 2, (Math.PI / 4) * 3);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    veryBig: {
                        type: "ang",
                        labels: [l.very, l.big, l.missing, l.bit],
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
                        labels: [l.open, l.moon, l.slice, l.curve],
                        run: function(v) {
                            return OPEN
                        }
                    },
                    chord: {
                        type: "mode",
                        labels: [l.chord, l.curve],
                        run: function(v) {
                            return CHORD
                        }
                    },
                    pie: {
                        type: "mode",
                        labels: [l.pie, l.pizza, l.cone],
                        run: function(v) {
                            return PIE
                        }
                    }
                },
                run: function() {
                    ellipseMode(CENTER);

                    var v = {};
                    v.minDiv = 595 / 5;
                    v.maxDiv = 1;
                    v.w = randomFloat(width / v.minDiv, width);

                    var subMethods = pageMethods.methods.arc.subMethods;

                    //circular ou ellipsy
                    var shapeMethods = filterSubObjsByType(subMethods, "shape");
                    var randomShape = rouletteFromProbToRun(shapeMethods);
                    v.h = randomShape.run(v);

                    //angs
                    var angMethods = filterSubObjsByType(subMethods, "ang");
                    var randomAngs = rouletteFromProbToRun(angMethods);
                    var angs = randomAngs.run(v);
                    v.startAng = angs[0];
                    v.endAng = angs[1];

                    //mode
                    var modeMethods = filterSubObjsByType(subMethods, "mode");
                    var randomMode = rouletteFromProbToRun(modeMethods);
                    v.mode = randomMode.run(v);

                    //create
                    arc(width / 2, height / 2, v.w, v.h, v.startAng, v.endAng, v.mode);
                }
            },
            ellipse: {
                labels: [l.ellipse, l.egg],
                //TODO: submethods para ellipse vertical / horizontal
                run: function() {
                    ellipseMode(CENTER);
                    var v = {};
                    var minDiv = 595 / 5;
                    var w = randomFloat(width / minDiv, width);
                    var h = randomFloat(width / minDiv, height);
                    var x = randomFloat(-w / 2, width + w / 2);
                    var y = randomFloat(-h / 2, height + h / 2);
                    ellipse(x, y, w, h);

                }
            },
            circle: {
                labels: [l.circle, l.ball, l.round],
                run: function() {
                    ellipseMode(CENTER);
                    var v = {};
                    var minDiv = 595 / 5;
                    var w = randomFloat(width / minDiv, width);
                    var h = w;
                    var x = randomFloat(-w / 2, width + w / 2);
                    var y = randomFloat(-h / 2, height + h / 2);
                    ellipse(x, y, w, h);

                }
            },
            rect: {
                labels: [l.rect, l.box, l.four],
                //TODO: submethods para rect vertical / horizontal
                run: function() {
                    rectMode(CENTER);
                    var v = {};
                    var minDiv = 595 / 5;
                    var w = randomFloat(width / minDiv, width);
                    var h = randomFloat(width / minDiv, height);
                    var x = randomFloat(-w / 2, width + w / 2);
                    var y = randomFloat(-h / 2, height + h / 2);
                    rect(x, y, w, h);

                }
            },
            square: {
                labels: [l.square, l.box, l.equal, l.four],
                run: function() {
                    rectMode(CENTER);
                    var v = {};
                    var minDiv = 595 / 5;
                    var w = randomFloat(width / minDiv, width);
                    var h = w;
                    var x = randomFloat(-w / 2, width + w / 2);
                    var y = randomFloat(-h / 2, height + h / 2);
                    rect(x, y, w, h);

                }
            },
            //TODO:losangulo
            line: {
                labels: [l.line],
                //TODO: submethods para rect vertical / horizontal
                run: function() {
                    var x = randomFloat(0, width);
                    var y = randomFloat(0, height);

                    var x2 = randomFloat(0, width);
                    var y2 = randomFloat(0, height);

                    line(x, y, x2, y2);

                }
            },
            point: {
                labels: [l.point, l.dot],
                run: function() {
                    var x = randomFloat(0, width);
                    var y = randomFloat(0, height);

                    point(x, y);

                }
            },
            quad: {
                labels: [l.quad, l.shape, l.four],
                //TODO: 4 pontos a volta de um raio
                //TODO: 4 pontos dentro e um raio maximo
                run: function() {
                    var p = [];
                    var maxOut = width / 2;

                    for (var i = 0; i < 4; i++) {
                        var x = randomFloat(-maxOut, width + maxOut);
                        var y = randomFloat(-maxOut, height + maxOut);
                        p.push({
                            x: x,
                            y: y
                        });
                    }
                    quad(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y, p[3].x, p[3].y);
                }
            },
            triangle: {
                labels: [l.triangle, l.three],
                //TODO: 3 pontos a volta de um raio
                //TODO: 3 pontos dentro e um raio maximo
                //TODO: equilatero
                //TODO: agudo e obtuso
                run: function() {
                    var p = [];
                    var maxOut = width / 2;

                    for (var i = 0; i < 3; i++) {
                        var x = randomFloat(-maxOut, width + maxOut);
                        var y = randomFloat(-maxOut, height + maxOut);
                        p.push({
                            x: x,
                            y: y
                        });
                    }
                    triangle(p[0].x, p[0].y, p[1].x, p[1].y, p[2].x, p[2].y);
                }
            },*/
            //TODO
            /*textHierachyRelation: {
                labels: [l.hierarchy],
                subMethods: {
                    //big
                    //small
                    //...
                },
                run: function() {

                }
            },*/
            /*textBodySize: {
                labels: [l.text, l.size, l.body],
                subMethods: {
                    //body
                    varySmallBody: {
                        type: "body",
                        labels: [l.small, l.very],
                        run: function() {
                            var s = 595 / randomFloat(2, 6)
                            return width / s;
                        }
                    },
                    smallBody: {
                        type: "body",
                        labels: [l.small],
                        run: function() {
                            var s = 595 / randomFloat(6.1, 9)
                            return width / s;
                        }
                    },
                    mediumBody: {
                        type: "body",
                        labels: [l.medium],
                        run: function() {
                            var s = 595 / randomFloat(9.1, 13)
                            return width / s;
                        }
                    },
                    bigBody: {
                        type: "body",
                        labels: [l.big, l.separated, l.apart],
                        run: function() {
                            var s = 595 / randomFloat(13.1, 14)
                            return width / s;
                        }
                    },
                    veryBigBody: {
                        type: "body",
                        labels: [l.very, l.big, l.separated, l.apart],
                        run: function() {
                            var s = 595 / randomFloat(14.1, 18)
                            return width / s;
                        }
                    },
                    overSizedBody: {
                        type: "body",
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function() {
                            var s = 595 / randomFloat(18.1, 28)
                            return width / s;
                        }
                    },
                    giantBody: {
                        type: "body",
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
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
                labels: [l.text, l.size],
                run: function() {
                    var level = randomInt(-10, 10);
                    var size = 0;
                    if (level < 0) size = textBodySize / (Math.pow(textHierachyRel, Math.abs(level)));
                    else size = textBodySize * (Math.pow(textHierachyRel, level));
                    textSize(size);
                }
            },*/
            /*textFont: {
                labels: [l.font],
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
            //TODO: createShape —  https://deploy-preview-145--basiljs2.netlify.app/reference/#vertex
        },
        runAll: function(pag) {
            logToFile("pageMethods")
            page(pag);
            var methods = pageMethods.methods;
            for (var k in methods) {
                var m = methods[k];
                var r = randomFloat(0, 1);
                if (r < m.probToRun) {
                    logToFile("    " + m.name + "    random:" + r + " probToRun:" + m.probToRun);
                    fileLog += "\npageMethods: about to run method " + m.name;
                    var name = m.name;
                    try {
                        m.run();
                    } catch (e) {
                        println("ERROR running PM: " + e)
                        logToFile(e);
                    }
                }
            }

            logToFile("pageMethods END")
        }
    }
    //pm.methods.textFont.constants = pageItemMethods.methods.textFont.constants;
    initMethods(pm.methods);
    return pm;
}

function rouletteFromProbToRun(objs) { //objs = constants | subMethods
    //tentar: map de (-1, 1, 0, 1)

    var probsSum = 0;
    for (var key in objs) {
        probsSum += Math.pow(objs[key].probToRun, 5); //focus exp
        //$.writeln(objs[key].probToRun);
    }

    var randomPerc = randomFloat(0, probsSum),
        progress = 0,
        randomObj = {};

    for (var key in objs) {
        progress += Math.pow(objs[key].probToRun, 5); //focus exp
        //$.writeln("rouletteFromProbToRun");
        //$.writeln(randomPerc);
        //$.writeln(progress);
        //$.writeln("");
        if (randomPerc < progress) {
            randomObj = objs[key];
            break;
        }
    }

    //$.writeln("-----" + randomObj.name);

    toSave += "            cons/submeth: " + randomObj.name + "\n";
    $.writeln("            cons/submeth: " + randomObj.name + "\n");
    return randomObj;
}

function constantsFromStringsArray(arr) {
    var constants = {};
    for (var i = 0; i < arr.length; i++) {
        var c = {}
        c.value = arr[i];
        var name = arr[i].replace(/\s/g, '');
        c.name = name

        var labels_tx = arr[i].split(" ");
        labels_tx.push(arr[i]);
        //TODO: ir buscar descrições dasfontes à net para fazerr labels

        keywords.concat(labels_tx);
        c.labels = [];
        for (var j in labels_tx) {
            var lb = labels_tx[j];
            l[lb] = {
                name: lb,
                probToRun: defaultProbToRun
            }
            c.labels.push(l[lb]);
        }

        constants[name] = c;
    }
    return constants;
}

function constantsFromArr(arr, nameProp) {
    var constants = {};

    for (var i = 0; i < arr.length; i++) {
        var c = {}
        c.value = arr[i];
        var str = arr[i];
        if (typeof str !== 'string') str = arr[i][nameProp];
        //run4
        //str = str.toLowerCase();

        var name = str.replace(/\s/g, '');
        c.name = name;

        var labels_tx = str.split(" ");
        //TODO: ir buscar descrições das fontes à net para fazerr labels
        keywords.concat(labels_tx);
        c.labels = [];

        for (var j = 0; j < labels_tx.length; j++) {
            var lb = labels_tx[j];
            //run3
            //createLabel(lb);
            c.labels.push(l[lb]);
        }

        constants[name] = c;
    }

    return constants;
}

function initFonts() {
    var myFonts = app.fonts.everyItem().getElements(); //all families (objs)
    var fontFamilyNames = getNamesOfFontFamilies(myFonts); //sets the global variable 'fontFamilies'
    var fontConstants = constantsFromArr(fontFamilyNames);
    // {arial: {
    // name: arial
    // value: Arial
    // labels:[l.arial, l.bold], 
    // }...}

    //pesos
    for (var i in fontConstants) {
        var family = fontConstants[i].value;

        pesos = myFonts.filter(function(f) {
            return f.fontFamily === family;
        });

        var pesosConsts = constantsFromArr(pesos, 'fontStyleName');
        fontConstants[i].weights = pesosConsts;
        // {arial: {
        // name: arial
        // value: Arial
        // labels:[l.arial, l.bold], 
        // weights:  {bold : {value: arial bold, labels: [l.arial, l.bold], ...}}
        // }...}

        //adicionar labels dos pesos às labels da familia
        for (var j in pesosConsts) {
            var peso = pesosConsts[j];
            fontConstants[i].labels = fontConstants[i].labels.concat(peso.labels);
        }
    }

    return fontConstants;
}

function getProbToRun(labels) {
    var max = 0;
    for (var i = 0; i < labels.length; i++) {
        var lb = labels[i];
        $.writeln(lb.name);
        if (lb.probToRun > max) max = lb.probToRun;
    }
    return max
}

function initSubs(m, sub) {
    var allLabels = [];
    if (m[sub])
        for (var key in m[sub]) {
            var c = m[sub][key];
            c.name = key;
            allLabels = allLabels.concat(c.labels);
            c.probToRun = getProbToRun(c.labels);

            //for font weights
            if (c.weights) {
                var fontWeightLabels = initSubs(c, "weights");
                allLabels = allLabels.concat(fontWeightLabels);
            }
        }
    return allLabels;
}

function initMethods(meths) {
    for (var k in meths) {
        var m = meths[k];

        var allLabels = [].concat(m.labels);
        m.probToRun = defaultProbToRun;
        m.name = k;
        $.writeln("-" + m.name);
        //constants
        if (m.constants) {
            var constLabels = initSubs(m, "constants");
            allLabels = [].concat(constLabels);
        }
        //sub methods
        if (m.subMethods) {
            var methLabels = initSubs(m, "subMethods");
            allLabels = [].concat(methLabels);
        }

        allLabels = removeDuplicated(allLabels); //allLabels.unique();
        m.labels = allLabels;
        m.probToRun = getProbToRun(m.labels)
    }
}

var runSetupMutationMethods = function() {
    //grid
    //pageMethods.methods.setMargins.run();
    //pageMethods.methods.createGrid.run();

    //colors
    deleteSwatches(); //remove existing colors
    var numNewColors = semiConceptualRandomBetween(1, 10); //create new colors
    for (var i = 0; i < numNewColors; i++)
        pageMethods.methods.createColor.run();
    $.writeln("iiiii createdColors")

    //font
    //TODO: create character and paragrah styles with 1 or more fonts
    //pageMethods.methods.textFont.run();
    $.writeln("iiiii textFont")

    //fontSize
    //pageMethods.methods.textSize.run();
    $.writeln("iiiii textSize")
}