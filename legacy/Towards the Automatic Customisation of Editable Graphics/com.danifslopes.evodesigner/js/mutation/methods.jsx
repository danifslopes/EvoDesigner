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
var probToRunMethodsExponent = 3;
var probToRunPropertiesExponent = 5;
var allMeths;
var itemMinVisible = 2 / 3;
var pageGutter = null;

//PageItem methods
var pageItemMethods;
var initPageItemMethods = function (fontConstants) {
    var pim = {
        methods: {
            //repeat
            repeat: {
                type: "repeat",
                desc: "Repeats the selected items. Just keep clicking. I'll delete the previous series of repetions automatically. If you want a repeted item to stick, just user the 'Make Definitive' method on it.",
                labels: [l.repeat, l.duplicate, l.copy, l.replica, l.many, l.several, l.much],
                subMethods: {
                    linearX: {
                        //linear x
                        run: function (v) {
                            v.x = v.incx;
                            return v;
                        },
                        labels: [l.linear, l.horizont, l.horizontal, l.straight, l.big, l.lay, l.down, l.base, l.platform, l.bottom],
                    },
                    linearY: {
                        //linear y
                        run: function (v) {
                            v.y = v.incy;
                            return v;
                        },
                        labels: [l.linear, l.vertical, l.straight, l.tower, l.build, l.building, l.tall, l.big, l.up, l.top],
                    },
                    linearXY: {
                        //linear xy
                        run: function (v) {
                            v.x = v.incx;
                            v.y = v.incy;
                            return v;
                        },
                        labels: [l.linear, l.diagonal, l.tilting, l.tilted, l.drunk, l.big, l.slide],
                    },
                    incX: {
                        //inc x
                        run: function (v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.horizontal, l.wider, l.bigger],
                    },
                    incy: {
                        //inc y
                        run: function (v) {
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.straight, l.vertical, l.taller, l.bigger, l.tower, l.jump, l.top, l.skyscraper, l.launch, l.throw, l.fall, l.drop, l.apart, l.split],
                    },
                    incXY: {
                        //inc xy
                        run: function (v) {
                            v.x = v.incx;
                            v.incx += v.incxInc;
                            v.y = v.incy;
                            v.incy += v.incyInc;
                            return v;
                        },
                        labels: [l.stretch, l.increment, l.increasing, l.bigger, l.throw, l.apart, l.split, l.diagonal, l.tilt, l.drunk, l.big, l.slide],
                    },
                    grid: {
                        run: function (v) {
                            var b = bounds(selectedItem);

                            if (v.currentColumnIndex > v.maxNumColumns || b.right >= width) {
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
                        run: function (v) {
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
                    polarIncAng: {
                        //polar inc ang
                        run: function (v) {
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
                    polarIncRadius: {
                        //polar inc radius
                        run: function (v) {
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
                        run: function (v) {
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
                        run: function (v) {
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
                run: function (opts) {
                    //se o selectedItem nao for o item de origem nao faz mal porque o metodo
                    //abaixo redefine o selected item como tal
                    pageItemMethods.methods.removeRepeated.subMethods.removeAll.run();
                    var originalItem = selectedItem; //aqui o selected item já é o elemento de origem

                    var its = getPageItems();

                    var user = opts && opts.subMethod;
                    var maxNumberOfItems = Number.POSITIVE_INFINITY;
                    if (!user) maxNumberOfItems = 20;

                    if (its.length < maxNumberOfItems && !(selectedItem instanceof Image)) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                        //num repetitions
                        var numRepetitions = semiConceptualRandomBetween(1, 50);
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
                    }


                }
            },
            removeRepeated: { //remove apenas os repetidos deste item
                //so remove copias. os orignais so podem desaparecer atraves da opacidade
                type: "repeat",
                labels: [l.remove, l.delete, l.clean, l.empty, l.minimal, l.less, l.simple, l.space, l.breathe],
                subMethods: {
                    removeAll: {
                        labels: [l.all],
                        run: function () {
                            var toRemove = [];
                            var its_o = getPageItems(true);
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
                run: function (opts) {
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
                labels: [l.repeat],
                run: function (opts) {
                    selectedItem.label = "";
                    return "Did <i>" + this.name + "</i>.";
                }

            },

            //transform
            convertShape: {
                type: "transform",
                ignoreInEvolution: true,
                labels: [l.shape, l.form, l.geometric],
                subMethods: {
                    convertToBeveledRectangle: {
                        labels: [l.beveled, l.rectangle, l.corner, l.cut, l.box, l.detail],
                        run: function (it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_BEVELED_RECTANGLE);
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToToClosedPath: {
                        labels: [l.closed, l.path],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_CLOSED_PATH)
                        }
                    },*/
                    convertToInverseRoundedRectangle: {
                        labels: [l.inverse, l.rectangle, l.concave, l.cut, l.corner, l.negative, l.detail, l.box, l.table, l.spike],
                        run: function (it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_INVERSE_ROUNDED_RECTANGLE)
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToLine: {
                        labels: [l.line, l.stroke, l.string, l.rope, l.chord],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_LINE)
                        }
                    },*/
                    /*convertToOpenPath: {
                        labels: [l.open, l.path, l.broken, l.gap],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_OPEN_PATH)
                        }
                    },*/
                    convertToOval: {
                        labels: [l.oval, l.egg, l.ellipse, l.bird, l.chicken, l.circle],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_OVAL)
                        }
                    },
                    convertToPentagon: {
                        labels: [l.pentagon, l.polygon],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 5, 0)
                        }
                    },
                    convertToHexagon: {
                        labels: [l.hexagon, l.polygon],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 6, 0)
                        }
                    },
                    convertToOctahedron: {
                        labels: [l.octahedron, l.polygon],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, 8, 0)
                        }
                    },
                    convertToRectangle: {
                        labels: [l.rectangle, l['4'], l.four, l.box, l.table, l["90"]],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_RECTANGLE)
                        }
                    },
                    convertToRoundedRectangle: {
                        labels: [l.rectangle, l.rounded, l.box, l.smooth, l.child, l.kid, l.children, l.detail, l.table],
                        run: function (it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_ROUNDED_RECTANGLE);
                            it.topLeftCornerRadius = p.rectCornerRadius;
                            it.topRightCornerRadius = p.rectCornerRadius;
                            it.bottomLeftCornerRadius = p.rectCornerRadius;
                            it.bottomRightCornerRadius = p.rectCornerRadius;
                        }
                    },
                    /*convertToStraightLine: {
                        labels: [l.line, l.straight, l.stroke, l.string, l.rope, l.chord],
                        run: function(it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_STRAIGHT_LINE)
                        }
                    },*/
                    convertToTriangle: {
                        labels: [l.triangle, l['3'], l.three, l.sharp, l.corner, l.beak, l.tip, l.careful, l.warning, l.sign, l.attention],
                        run: function (it) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_TRIANGLE)
                        }
                    },
                    //todo: dividir este metodo por varios tipos de estrela
                    convertToStar: {
                        labels: [l.complex],
                        run: function (it, p) {
                            it.convertShape(ConvertShapeOptions.CONVERT_TO_POLYGON, p.polygonSides, p.starInsetPercentage);
                        }
                    }
                },
                run: function (opts) {
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
                        var error = tryMutation(function (it) {
                            randomSubMethod.run(it, convertShapeParams);
                            if (selectedItem instanceof TextFrame) expandTextBox(it);
                        });
                        if(error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot convert this item to shape.";
                },
            },
            move: {
                type: "transform",
                labels: [l.move, l.translate, l.displace],
                constants: {
                    //direction
                    //random: {labels: []},
                    left: {
                        type: "x",
                        labels: [l.left]
                    },
                    right: {
                        type: "x",
                        labels: [l.right]
                    },
                    bottom: {
                        type: "y",
                        labels: [l.bottom, l.down]
                    },
                    top: {
                        type: "y",
                        labels: [l.top, l.up]
                    },

                    /*topLeft: {labels:[], value: ""},
                    topRight: {labels:[], value: ""},
                    bottomLeft: {labels:[], value: ""},
                    bottomRight: {labels:[], value: ""},*/
                },
                //TODO: change position  with another item
                subMethods: {
                    //fully random
                    randomPos: {
                        type: "random",
                        labels: [l.to, l.random],
                        run: function (p, limit) {
                            var b = p.b;
                            var minVisible = p.minVisible;
                            var minVisibleInsidePageW = (b.width / 3 * 2); //minVisible = 2/3
                            var minVisibleInsidePageH = (b.height / 3 * 2); //minVisible = 2/3

                            //move x
                            var maxDistLeft;
                            if (p.dir == "randomRight") maxDistLeft = b.right - (width / 2) - minVisibleInsidePageW;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterVert") maxDistLeft = b.right - (width / 3) - minVisibleInsidePageW;
                            else maxDistLeft = b.right - minVisibleInsidePageW;
                            if (limit) maxDistLeft = min(b.width / 2, maxDistLeft); //max que pode andar para a esquerda //anda no maximo metade da sua largura

                            var maxDistRight;
                            if (p.dir == "randomLeft") maxDistRight = ((width / 2) - b.left) - minVisibleInsidePageW;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterVert") maxDistRight = ((width / 3 * 2) - b.left) - minVisibleInsidePageW;
                            else maxDistRight = (width - b.left) - minVisibleInsidePageW;
                            if (limit) maxDistRight = min(b.width / 2, maxDistRight); //max que pode andar para a direita //anda no maximo metade da sua largura

                            //move y
                            var maxDistTop;
                            if (p.dir == "randomBottom") maxDistTop = b.bottom - (height / 2) - minVisibleInsidePageH;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterHoriz") maxDistTop = b.bottom - (height / 3) - minVisibleInsidePageH;
                            else maxDistTop = b.bottom - minVisibleInsidePageH;
                            if (limit) maxDistTop = min(b.height / 2, maxDistTop); //max que pode andar para cima //anda no maximo metade da sua altura

                            var maxDistBottom;
                            if (p.dir == "randomTop") maxDistBottom = ((height / 2) - b.top) - minVisibleInsidePageH;
                            else if (p.dir == "randomCenter" || p.dir == "randomCenterHoriz") maxDistBottom = ((height / 3 * 2) - b.top) - minVisibleInsidePageH;
                            else maxDistBottom = (height - b.top) - minVisibleInsidePageH;
                            if (limit) maxDistBottom = min(b.height / 2, maxDistBottom); //max que pode andar para baixo //anda no maximo metade da sua altura

                            //move
                            var offset = [randomFloat(-maxDistLeft, maxDistRight), randomFloat(-maxDistTop, maxDistBottom)];
                            var error = tryMutation(function (it) {
                                it.move([0, 0], offset);
                            });
                            if(error) return "Ups, " + error;
                        }
                    },
                    randomOffset: { //anda no maximo metade da sua largura/altura
                        type: "random",
                        labels: [l.by, l.offset, l.random],
                        run: function (p) {
                            pageItemMethods.methods.move.subMethods.randomPos.run(p, true);
                        }
                    },

                    //smart placing
                    leftZone: {
                        type: "random",
                        labels: [l.random, l.left],
                        run: function (p) {
                            p.dir = "randomLeft";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p); //(p, true) faz com que avance um pouco nessa direção (offset)
                        }
                    },
                    rightZone: {
                        type: "random",
                        labels: [l.random, l.right],
                        run: function (p) {
                            p.dir = "randomRight";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    topZone: {
                        type: "random",
                        labels: [l.random, l.top],
                        run: function (p) {
                            p.dir = "randomTop";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    bottomZone: {
                        type: "random",
                        labels: [l.random, l.bottom],
                        run: function (p) {
                            p.dir = "randomBottom";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerZone: { //todo: pode ser melhorado
                        type: "random",
                        labels: [l.random, l.center],
                        run: function (p) {
                            p.dir = "randomCenter";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerVertZone: {
                        type: "random",
                        labels: [l.random, l.center, l.vertical],
                        run: function (p) {
                            p.dir = "randomCenterVert";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },
                    centerHorizZone: {
                        type: "random",
                        labels: [l.random, l.center, l.horizonal],
                        run: function (p) {
                            p.dir = "randomCenterHoriz";
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                        }
                    },

                    //grid
                    neighbourGuides: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap],
                        run: function (p) {
                            var b = p.b;

                            var marginLeft = page().marginPreferences.left;
                            var marginTop = page().marginPreferences.top;
                            var cols = page().marginPreferences.columnsPositions; //array
                            var consts = pageItemMethods.methods.move.constants;
                            var finalX, finalY;

                            //set achor and reference rulers
                            var xStart = 0,
                                yStart = 0;
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
                                    if (i % 2 == 0) {
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
                                rows.sort(function (a, b) {
                                    return a - b;
                                });
                                var rowDist = {
                                    top: Number.POSITIVE_INFINITY,
                                    bottom: Number.POSITIVE_INFINITY
                                }
                                //escolhe direcao
                                var dirR = consts.top;
                                if (consts.bottom.probToRun == consts.top.probToRun) {
                                    if (randomFloat(0, 1) > .5) dirR = consts.bottom;
                                } else if (consts.bottom.probToRun > consts.top.probToRun) {
                                    dirR = consts.bottom;
                                }
                                //definir default
                                var chosenRow = {
                                    top: rows[0],
                                    bottom: rows[1]
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
                            var error = tryMutation(function (it) {
                                transform(it, "translate", [finalX, finalY]);
                            });
                            if(error) return "Ups, " + error;
                        }
                    },
                    closestGuides: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap, l.close],
                        run: function (p) {
                            p.close = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p);
                        }
                    },
                    closestColumn: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap, l.close, l.column],
                        run: function (p) {
                            p.dir = "snapToColumn";
                            p.close = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p, true);
                        }
                    },
                    closestRow: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap, l.close, l.row],
                        run: function (p) {
                            p.dir = "snapToRow";
                            p.close = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p, true);
                        }
                    },
                    anyGuidesAround: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap, l.close, l.around],
                        run: function (p) {
                            p.around = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p);
                        }
                    },
                    anyColumnsAround: {
                        type: "grid",
                        labels: [
                            //l.snap, l.grid, l.organized,
                            l.align, l.around
                        ],
                        run: function (p) {
                            p.dir = "snapToColumn";
                            p.around = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p);
                        }
                    },
                    anyRowsAround: {
                        type: "grid",
                        labels: [
                            //l.snap, l.grid, l.organized,
                            l.align, l.around
                        ],
                        run: function (p) {
                            p.dir = "snapToRow";
                            p.around = true;
                            pageItemMethods.methods.move.subMethods.neighbourGuides.run(p);
                        }
                    },
                    randomGridPos: {
                        type: "grid",
                        labels: [l.align, l.grid, l.snap],
                        run: function (p) {
                            pageItemMethods.methods.move.subMethods.randomPos.run(p);
                            pageItemMethods.methods.move.run({
                                subMethod: "closestGuides"
                            });
                        }
                    }

                },
                run: function (opts) {
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

                        if (randomSubMethod.type == "grid" && !opts.defaultAxes) { //se for snap, pode usar diferentes eixos
                            var cons = pageItemMethods.methods.move.constants;
                            var xAs = filterSubObjsByType(cons, "x");
                            var yAs = filterSubObjsByType(cons, "y");
                            xAnchor = rouletteFromProbToRun(xAs).name;
                            yAnchor = rouletteFromProbToRun(yAs).name;
                        }

                        //quanto do item fica dentro da pagina, no minimo
                        var b = getBounds(selectedItem);

                        var minVisible;
                        if (selectedItem instanceof TextFrame) minVisible = b.width; //se for texto, fica tudo dentro //todo: rever decisão
                        else minVisible = b.width / 3;

                        randomSubMethod.run({
                            b: b,
                            minVisible: minVisible,
                            xAnchor: xAnchor,
                            yAnchor: yAnchor,
                            defaultAxes: opts.defaultAxes
                        });

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot move images, just their frames.";
                },
            },
            moveZ: {
                type: "transform",
                labels: [l.move, l.z, l.depth],
                subMethods: {
                    front: {
                        labels: [l.front],
                        run: function () {
                            arrange(selectedItem, FRONT);
                        }
                    },
                    back: {
                        labels: [l.back],
                        run: function () {
                            arrange(selectedItem, BACK);
                        }
                    },
                    forward: {
                        labels: [l.forward],
                        run: function () {
                            arrange(selectedItem, FORWARD);
                        }
                    },
                    backward: {
                        labels: [l.backward],
                        run: function () {
                            arrange(selectedItem, BACKWARD);
                        }
                    }
                },
                run: function (opts) {
                    if (!(selectedItem instanceof Image)) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        randomSubMethod.run();
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    }
                }
            },
            size: {
                type: "transform",
                labels: [l.size],
                //constants: big, small, medium....
                subMethods: {
                    //1.1 random
                    //1.3 random defined-ranges (uma função; varias constantes)
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
                        run: function () {
                            return [
                                randomFloat(width / 2, width),
                                randomFloat(height / 2, height)
                            ]
                        }
                    },
                    medium: {
                        labels: [l.medium, l.normal],
                        run: function () {
                            return [
                                randomFloat(width / 4, width / 2),
                                randomFloat(height / 4, height / 2)
                            ]
                        }
                    },
                    small: {
                        labels: [l.small, l.mini],
                        run: function () {
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

                    //2.1 grid random
                    randomColumn: {
                        type: "grid",
                        labels: [l.medium, l.normal],
                        run: function (p) {
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
                        run: function (p) {
                            var b = p.b;
                            //escolhe a posição y mais proxima (linha ímpar)
                            var rows = objPropsToArray(page().guides, "location");
                            rows.sort(function (a, b) {
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
                        run: function (p) {
                            var finalWidth = pageItemMethods.methods.size.subMethods.randomColumn.run(p);
                            var finalHeight = pageItemMethods.methods.size.subMethods.randomRow.run(p);
                            return [finalWidth[0], finalHeight[1]]; //w, h
                        }
                    },
                    //2.2 grid closer
                    closestColumn: {
                        type: "grid",
                        labels: [],
                        run: function (p) {
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
                        run: function (p) {
                            var b = p.b;
                            //escolhe a posição y mais proxima (linha ímpar)
                            var rows = objPropsToArray(page().guides, "location");
                            rows.sort(function (a, b) {
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
                        run: function (p) {
                            //size
                            var finalWidth = pageItemMethods.methods.size.subMethods.closestColumn.run(p);
                            var finalHeight = pageItemMethods.methods.size.subMethods.closestRow.run(p);
                            return [finalWidth[0], finalHeight[1]];
                        }
                    },
                    //2.3 defined ranges
                    //igual a "random defined-ranges" mas depois faz snap to grid

                    //TODO: horizontal, vertical...
                    //TODO: tamanho de x colunas/linhas (nao importa se esta alinhado)
                    //TODO: size proportionaly

                    //2.4 text related
                    adjustToText: {
                        type: "text",
                        labels: [],
                        run: function (p) {
                            expandTextBox(selectedItem);
                            return null;
                        }
                    }
                },
                run: function (opts) {
                    if (!(selectedItem instanceof Image)) {
                        //Se nao ha guides, cria-las
                        var cols = page().marginPreferences.columnsPositions;
                        var rows = objPropsToArray(page().guides, "location");
                        if (cols.length < 2 || rows.length < 2) pageMethods.methods.createGrid.run({});

                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var p = getTransformationProperties(randomSubMethod, opts);
                        var b = p.b;
                        var size = randomSubMethod.run(p);

                        if (size != null) {
                            referencePoint(TOP_LEFT);

                            //final bounds
                            var finalBounds = [b.top, b.left, b.bottom, b.right];
                            if (randomSubMethod.type != "grid" || p.xAnchor == "left") {
                                finalBounds[1] = b.left;
                                finalBounds[3] = b.left + size[0];
                            } else if (p.xAnchor == "right") {
                                finalBounds[1] = b.right - size[0];
                                finalBounds[3] = b.right;
                            }
                            if (randomSubMethod.type != "grid" || p.yAnchor == "top") {
                                finalBounds[0] = b.top;
                                finalBounds[2] = b.top + size[1];
                            } else if (p.yAnchor == "bottom") {
                                finalBounds[0] = b.bottom - size[1];
                                finalBounds[2] = b.bottom;
                            }

                            var error = tryMutation(function (it) {
                                //quando as medidas nao dao isto breaka!!!
                                it.visibleBounds = [finalBounds[0], finalBounds[1], finalBounds[2], finalBounds[3]];

                                //RESIZE METHOD
                                /*it.resize(
                                    [CoordinateSpaces.SPREAD_COORDINATES, BoundingBoxLimits.OUTER_STROKE_BOUNDS],
                                    AnchorPoint.TOP_LEFT_ANCHOR, 
                                    ResizeMethods.REPLACING_CURRENT_DIMENSIONS_WITH, 
                                    [UnitValue(size[0]+"px").as('pt'), UnitValue(size[1]+"px").as('pt')]
                                );*/
                                //REFRAME
                                /*var myTopLeft = it.resolve(AnchorPoint.TOP_LEFT_ANCHOR, CoordinateSpaces.SPREAD_COORDINATES)[0];
                                var myBottomRight = it.resolve(AnchorPoint.BOTTOM_RIGHT_ANCHOR, CoordinateSpaces.SPREAD_COORDINATES)[0];
                                var x_0 = myTopLeft[0];
                                var y_0 = myTopLeft[1];
                                var x_1 = x_0 + size[0];
                                var y_1 = y_0 + size[1];
                                it.reframe(CoordinateSpaces.SPREAD_COORDINATES, [[x_0, y_0], [x_1, y_1]]);*/

                            });
                            if(error) return "Ups, " + error;

                            if (selectedItem.hasOwnProperty("fit")) {
                                if (selectedItem.hasOwnProperty("images"))
                                    if (selectedItem.images.length > 0) selectedItem.fit(FitOptions.CONTENT_AWARE_FIT);
                            }

                            fitTextToTextBox(selectedItem) //expandTextBox(selectedItem);

                        } else return "Sorry, something went wrong... :S";

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";

                    } else return "Sorry, cannot resize images, just their frames.";
                }
            },
            rotate: {
                type: "transform",
                labels: [l.rotate, l.tilt],
                subMethods: {
                    none: {
                        labels: [l.no, l.none, l.straight],
                        run: function (v) {
                            return 0;
                        }
                    },
                    veryLittle: {
                        labels: [l.few, l.little, l.very],
                        run: function (v) {
                            return randomFloat(180 / 64, 180 / 8);
                        }
                    },
                    third: {
                        type: "ang",
                        labels: [l.third, l.three],
                        run: function (v) {
                            return 180 / 3;
                        }
                    },
                    little: {
                        type: "ang",
                        labels: [l.few, l.little],
                        run: function (v) {
                            return randomFloat(180 / 8, 45);
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: [l.medium],
                        run: function (v) {
                            return randomFloat(45, 90);
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: [l.quarter, l.four],
                        run: function (v) {
                            return 90;
                        }
                    },
                    /*half: {
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
                    }*/
                },
                run: function (opts) {
                    //TODO: constants to define ref point
                    referencePoint(CENTER);
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var ang = randomSubMethod.run();
                    if (!(selectedItem instanceof Image)) {
                        var error = tryMutation(function (it) {
                            it.rotationAngle = ang;
                        });
                        if(error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot rotate images, just their frames.";
                }
            },
            flipItem: {
                type: "transform",
                labels: [l.flip, l.mirror, l.invert, l.contrary, l.shift],
                subMethods: {
                    none: {
                        type: "Flip",
                        labels: [l.straight, l.none, l.default],
                        run: function (it) {
                            return Flip.NONE
                        }
                    },
                    horizontal: {
                        type: "Flip",
                        labels: [l.horizontal],
                        run: function (it) {
                            return Flip.HORIZONTAL
                        }
                    },
                    vertical: {
                        type: "Flip",
                        labels: [l.vertical, l.down, l.upside],
                        run: function (it) {
                            return Flip.VERTICAL
                        }
                    },
                    horizontalAndVertical: {
                        type: "Flip",
                        labels: [l.horizontal, l.vertical],
                        run: function (it) {
                            return Flip.HORIZONTAL_AND_VERTICAL
                        }
                    },
                    both: {
                        type: "Flip",
                        labels: [l.both],
                        run: function (it) {
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
                run: function (opts) {
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
                labels: [l.shear, l.tilt],
                subMethods: {
                    //TODO: method for the right and for the left (negative)
                    none: {
                        labels: [l.no, l.none, l.straight],
                        run: function (v) {
                            return 0;
                        }
                    },
                    veryLittle: {
                        labels: [l.few, l.little, l.very],
                        run: function (v) {
                            return randomInt(5, 10);
                        }
                    },
                    little: {
                        type: "ang",
                        labels: [l.few, l.little],
                        run: function (v) {
                            return randomInt(11, 20);
                        }
                    },
                    /*mediumSmall: {
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
                    },*/
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
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var ang = randomSubMethod.run();
                    if (!(selectedItem instanceof Image)) {
                        var error = tryMutation(function (it) {
                            /*if (selectedItem.hasOwnProperty("convertShape") && selectedItem instanceof TextFrame) {
                                it.convertShape(ConvertShapeOptions.CONVERT_TO_RECTANGLE);
                            }*/
                            it.shearAngle = ang;
                        });
                        if(error) return "Ups, " + error;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, cannot shear images, just their frames.";

                }
            },
            fit: {
                type: "transform",
                labels: [l.fit],
                subMethods: {
                    /*applyFrameFittingOptions: {
                        run: function() {
                            return FitOptions.APPLY_FRAME_FITTING_OPTIONS;
                        },
                        labels: [l.center, l.middle, l.framed]
                    },*/
                    centerContent: {
                        run: function () {
                            return FitOptions.CENTER_CONTENT;
                        },
                        labels: [l.center, l.middle]
                    },
                    contentAwareFit: {
                        run: function () {
                            return FitOptions.CONTENT_AWARE_FIT;
                        },
                        labels: [l.center, l.middle, l.framed, l.focus, l.focus]
                    },
                    /*contentToFrame: {
                        run: function() {
                            return FitOptions.CONTENT_TO_FRAME;
                        },
                        labels: [l.center, l.middle, l.framed]
                    },*/
                    fillProportionally: {
                        run: function () {
                            return FitOptions.FILL_PROPORTIONALLY
                        },
                        labels: [l.center, l.middle, l.proportional]
                    },
                    /*frameToContent: {
                        run: function() {
                            return FitOptions.FRAME_TO_CONTENT
                        },
                        labels: [l.center, l.middle, l.framed]
                    },*/
                    proportionally: {
                        run: function () {
                            return FitOptions.PROPORTIONALLY
                        },
                        labels: [l.center, l.middle, l.proportional]
                    }
                },
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    if (selectedItem.hasOwnProperty("fit") && !(selectedItem instanceof TextFrame)) {
                        selectedItem.fit(randomSubMethod.run());
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, look like I cannot fit this item.";
                }
            },
            /*clearObjectStyleOverrides: {
                labels: [l.clear, l.empy, l.void, l.simple, l.stroke, l.less, l.minimum, l.minus, l.modest, l.basic, l.raw],
                run: function() {
                    selectedItem.clearObjectStyleOverrides()
                }
            },*/
            /*clearTransformations: {
                labels: [l.clear, l.straight", l.static, l.still, l.simple, l.raw],
                run: function() {
                    var error = tryMutation(function(it) {
                        it.clearTransformations();
                    });
                    
                }
            },*/

            //style
            blendMode: {
                type: "style",
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
                //here -- meter os constants como submethods. 
                //nos que ja existe, filtrar por tipo para ir buscar constants.
                subMethods: {
                    random: {
                        type: "function",
                        hideFromUser: true,
                        labels: [l.blend, l.random],
                        run: function (value) {
                            var it = selectedItem;
                            //50% chance de aplicar na imagem em vez de na box
                            if (selectedItem.hasOwnProperty("images") && selectedItem.images.length > 0 && randomFloat(0, 1) < 0.5)
                                it = selectedItem.images[0];
                            blendMode(it, value);
                        }
                    },
                    clearAll: {
                        type: "function",
                        ignoreInEvolution: true,
                        labels: [l.nofill, l.clean, l.empy],
                        run: function () {
                            blendMode(selectedItem, BlendMode.NORMAL);
                            if (selectedItem.hasOwnProperty("images") && selectedItem.images.length > 0)
                                blendMode(selectedItem.images[0], BlendMode.NORMAL);
                        }
                    },
                    randomtoBox: {
                        type: "function",
                        ignoreInEvolution: true,
                        labels: [l.blend],
                        run: function (value) {
                            blendMode(selectedItem, value);
                        }
                    },
                    randomToImage: {
                        type: "function",
                        ignoreInEvolution: true,
                        labels: [l.blend],
                        run: function (value) {
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
                        labels: [l.normal, l.default, l.natural],
                        run: function() {
                            return BlendMode.NORMAL;
                        }
                    },
                    multiply: {
                        type: "value",
                        labels: [l.multiply, l.both],
                        run: function() {
                            return BlendMode.MULTIPLY;
                        }
                    },
                    screen: {
                        type: "value",
                        labels: [l.screen],
                        run: function() {
                            return BlendMode.SCREEN;
                        }
                    },
                    overlay: {
                        type: "value",
                        labels: [l.overlay],
                        run: function() {
                            return BlendMode.OVERLAY;
                        }
                    },
                    softLight: {
                        labels: [l.soft, l.light],
                        run: function() {
                            return BlendMode.SOFT_LIGHT;
                        }
                    },
                    hardLight: {
                        type: "value",
                        labels: [l.hard, l.light],
                        run: function() {
                            return BlendMode.HARD_LIGHT;
                        }
                    },
                    colorDodge: {
                        type: "value",
                        labels: [l.color, l.dodge],
                        run: function() {
                            return BlendMode.COLOR_DODGE;
                        }
                    },
                    colorBurn: {
                        type: "value",
                        labels: [l.color, l.burn],
                        run: function() {
                            return BlendMode.COLOR_BURN;
                        }
                    },
                    darken: {
                        type: "value",
                        labels: [l.darken, l.dark],
                        run: function() {
                            return BlendMode.DARKEN;
                        }
                    },
                    lighten: {
                        type: "value",
                        labels: [l.lighten, l.light],
                        run: function() {
                            return BlendMode.LIGHTEN;
                        }
                    },
                    difference: {
                        type: "value",
                        labels: [l.difference, l.contrast],
                        run: function() {
                            return BlendMode.DIFFERENCE;
                        }
                    },
                    exclusion: {
                        type: "value",
                        labels: [l.exclusion, l.contrast],
                        run: function() {
                            return BlendMode.EXCLUSION;
                        }
                    },
                    hue: {
                        type: "value",
                        labels: [l.hue],
                        run: function() {
                            return BlendMode.HUE;
                        }
                    },
                    saturation: {
                        type: "value",
                        labels: [l.saturation],
                        run: function() {
                            return BlendMode.SATURATION;
                        }
                    },
                    color: {
                        type: "value",
                        labels: [l.color],
                        run: function() {
                            return BlendMode.COLOR;
                        }
                    },
                    luminosity: {
                        type: "value",
                        labels: [l.luminosity, l.gray, l.black, l.white],
                        run: function() {
                            return BlendMode.LUMINOSITY;
                        }
                    }*/
                },
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var constants = pageItemMethods.methods.blendMode.constants;
                    var randomConst = rouletteFromProbToRun(constants);
                    randomSubMethod.run(randomConst.value);
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            fillColor: {
                type: "style",
                labels: [l.fill],
                subMethods: {
                    noFill: {
                        ignoreInEvolution: true,
                        labels: [l.nofill, l.clean, l.empy],
                        run: function () {
                            return "None"
                        }
                    },
                    randomColor: {
                        labels: [l.random, l.color, l.plane, l.simple],
                        run: function (opts) {
                            var group = doc().colorGroups.itemByName("eD.colors");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre uma cor, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    },
                    randomGradient: {
                        labels: [l.random, l.gradient, l.smooth, l.complex],
                        run: function (opts) {
                            var group = doc().colorGroups.itemByName("eD.gradients");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre um gradiente, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    }
                },
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var it = selectedItem;
                    var c = randomSubMethod.run(opts);
                    if (c) it.fillColor = c;
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            strokeColor: {
                type: "style",
                labels: [l.stroke, l.frame, l.around, l.box, l.border],
                subMethods: {
                    /*noStroke: {
                        labels: [l.nostroke, l.no],
                        run: function () {
                            //$.writeln("2.1")
                            return "None"
                        }
                    },*/
                    randomColor: {
                        labels: [l.random, l.color, l.simple, l.plane],
                        run: function () {
                            var group = doc().colorGroups.itemByName("eD.colors");
                            var c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            return c;
                        }
                    },
                    randomGradient: {
                        labels: [l.random, l.gradient, l.smooth, l.complex],
                        run: function (opts) {
                            var group = doc().colorGroups.itemByName("eD.gradients");
                            c = group.colorGroupSwatches.anyItem().swatchItemRef;
                            //só na evolução. o user recebe sempre um gradiente, nunca None
                            /*var user = (opts && opts.subMethod);
                            if (!user && randomFloat(0, 1) < 1 / (group.colorGroupSwatches.count() + 1)) c = "None";*/
                            return c;
                        }
                    }
                },
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);

                    if (!(selectedItem instanceof Image)) {
                        var c = randomSubMethod.run();
                        var w = selectedItem.strokeWeight;
                        selectedItem.strokeColor = c
                        selectedItem.strokeWeight = w;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } 

                    else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            strokeWeight: {
                type: "style",
                labels: [l.stroke, l.border],
                subMethods: {
                    none: {
                        labels: [l.none, l.no],
                        run: function () {
                            return -1;
                        }
                    },
                    small: {
                        labels: [l.small, l.thin],
                        run: function () {
                            return [595, 198]
                        }
                    },
                    medium: {
                        labels: [l.medium, l.normal],
                        run: function () {
                            return [197, 59]
                        }
                    },
                    big: {
                        labels: [l.big, l.spacy],
                        run: function () {
                            return [58, 39]
                        }
                    },
                    /*veryBig: {
                        labels: [l.oversized, l.huge, l.extreme, l.much, l.over],
                        run: function () {
                            [38, 10]
                        }
                    }*/
                },
                run: function (opts) {
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

                        var error = (function (it) {
                            it.strokeWeight = w;
                        });
                        if(error) return "Ups, " + error;

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } 

                    else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            fillTint: {
                type: "style",
                labels: [l.fill, l.tint, l.opacity, l.transparency],
                subMethods: {
                    fullTint: {
                        labels: [l.full, l.vivid],
                        run: function () {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: [l.high],
                        run: function () {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: [l.medium],
                        run: function () {
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
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var tone = randomSubMethod.run();
                    selectedItem.fillTint = tone;

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            strokeTint: {
                type: "style",
                labels: [l.stroke, l.tint, l.opacity, l.transparency],
                subMethods: {
                    fullTint: {
                        labels: [l.full, l.vivid],
                        run: function () {
                            return 100;
                        }
                    },
                    hightTint: {
                        labels: [l.high],
                        run: function () {
                            return randomFloat(75, 90);
                        }
                    },
                    mediumTint: {
                        labels: [l.medium],
                        run: function () {
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
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    if (!(selectedItem instanceof Image)) {
                        selectedItem.strokeTint = randomSubMethod.run();
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    }

                    else return "Sorry, cannot apply stroke to images, just their frames.";
                }
            },
            opacity: {
                type: "style",
                labels: [l.opacity, l.transparent, l.translucid, l.glass, l.through],
                subMethods: {
                    full: {
                        labels: [l.full, l.vivid],
                        run: function () {
                            return 100;
                        }
                    },
                    hight: {
                        labels: [l.high],
                        run: function () {
                            return randomFloat(75, 90);
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function () {
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
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                    var v = randomSubMethod.run();
                    opacity(selectedItem, v);

                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },

            //text
            textFont: {
                type: "text",
                labels: [l.font],
                subMethods: {
                    random: {
                        labels: [l.random],
                        run: function (randomWeight) {
                            typo(selectedItem, "appliedFont", randomWeight);
                        }
                    }
                },
                constants: fontConstants, //initiated in initFonts() e passado como arg em init()
                //TODO: chage font only of a char, of a line, of a paragram
                //more likely to change words related to keywords
                run: function (opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        //font family
                        var constants = pageItemMethods.methods.textFont.constants;
                        var randomFamily = rouletteFromProbToRun(constants);
                        //font weight
                        var randomWeight = rouletteFromProbToRun(randomFamily.weights).value

                        randomSubMethod.run(randomWeight);

                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    }

                    else return "Sorry, this method must be applied to text items."
                }
            },
            textSize: { //rever isto quando tiver hierarquia
                type: "text",
                labels: [l.text, l.size, l.body],
                subMethods: {
                    random: {
                        labels: [l.random],
                        run: function () {
                            //var subMethods = pageMethods.methods.textBodySize.subMethods;
                            //return rouletteFromProbToRun(subMethods).run();
                            return randomInt(15, 150);
                        }
                    },
                    textBodySize: {
                        labels: [l.body, l.read, l.normal],
                        run: function () {
                            return textBodySize;
                        }
                    },
                    biggerThanTextBody: {
                        labels: [l.bigger, l.title, l.subtitle, l.important, l.head, l.attention],
                        run: function () {
                            var level = randomInt(2, 10);
                            return textBodySize * (Math.pow(textHierachyRel, level));
                        }
                    },
                    smallerThanTextBody: {
                        labels: [l.smaller, l.note, l.detail, l.info, l.partners, l.authors, l.label],
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
                    },
                    fitTextToTextBox: {
                        type: "fit",
                        labels: [l.fit],
                        run: function () {
                            fitTextToTextBox(selectedItem);
                        }
                    }
                },
                //TODO: mudar tamanho num só paragrafo etc..
                //ir buscar tamanho de outro  texto existente
                //melhor: editar apenas estilos de texto no pageitems. 
                //no item apenas escolhe um estilo existente de acordo com a hierarquia
                run: function (opts) {
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
                    }
                    else return "Sorry, this method must be applied to text items."
                }
            },
            textColor: {
                type: "text",
                labels: [l.fill],
                subMethods: { //igual ao fillColor (depois trocar para serem os mesmos)
                    randomColor: {
                        labels: [l.random, l.color, l.simple, l.plane],
                        run: function () {
                            return pageItemMethods.methods.fillColor.subMethods.randomColor.run();
                        }
                    },
                    randomGradient: {
                        labels: [l.random, l.gradient, l.complex, l.smooth],
                        run: function () {
                            return pageItemMethods.methods.fillColor.subMethods.randomGradient.run();
                        }
                    }
                },
                run: function (opts) {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var randomSubMethod = getSubMethod("pageItemMethods", this.name, opts);
                        var c = randomSubMethod.run();
                        if (c) {
                            for (var i = 0; i < selectedItem.texts.length; i++) {
                                var t = selectedItem.texts[i];
                                t.fillColor = c;
                            }
                            return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                        } return "Sorry, could not get a colour."
                    } else return "Sorry, this method must be applied to text items."

                }
            },
            justification: {
                type: "text",
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
                run: function () {
                    if (selectedItem.hasOwnProperty("texts")) {
                        for (var i = 0; i < selectedItem.texts.length; i++) {
                            var constants = pageItemMethods.methods.justification.constants;
                            var randomHoriz = rouletteFromProbToRun(constants).value;
                            var t = selectedItem.texts[i];
                            t.justification = randomHoriz;
                        }
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, this method must be applied to text items."
                }
            },
            verticalAlign: {
                type: "text",
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
                run: function () {
                    if (selectedItem.hasOwnProperty("texts")) {
                        var constants = pageItemMethods.methods.verticalAlign.constants;
                        var randomVert = rouletteFromProbToRun(constants).value;
                        selectedItem.textFramePreferences.verticalJustification = randomVert;
                        return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                    } else return "Sorry, this method must be applied to text items."
                }
            },
            tracking: {
                type: "text",
                labels: [l.tracking, l.space, l.letter],
                subMethods: {
                    negative: {
                        labels: [l.negative, l.very, l.join, l.merge, l.together],
                        run: function () {
                            return randomInt(-50, -100)
                        }
                    },
                    small: {
                        labels: [l.small],
                        run: function () {
                            return randomInt(0, 20)
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function () {
                            return randomInt(21, 50)
                        }
                    },
                    big: {
                        labels: [l.big, l.separated, l.apart],
                        run: function () {
                            return randomInt(51, 200)
                        }
                    },
                    veryBig: {
                        labels: [l.very, l.big, l.separated, l.apart],
                        run: function () {
                            return randomInt(201, 500)
                        }
                    },
                    overSized: {
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function () {
                            return randomInt(501, 1000)
                        }
                    }
                },
                run: function (opts) {
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
                labels: [l.leading, l.space, l.line, l.vertical],
                subMethods: {
                    negative: {
                        labels: [l.negative, l.very, l.join, l.merge, l.together],
                        run: function (txtSize) {
                            return randomInt(txtSize * 0.95, txtSize * 0.8)
                        }
                    },
                    small: {
                        labels: [l.small],
                        run: function (txtSize) {
                            return randomInt(txtSize * 1.01, txtSize * 1.1)
                        }
                    },
                    medium: {
                        labels: [l.medium],
                        run: function (txtSize) {
                            return randomInt(txtSize * 1.11, txtSize * 1.2)
                        }
                    },
                    big: {
                        labels: [l.big, l.separated, l.apart],
                        run: function (txtSize) {
                            return randomInt(txtSize * 1.21, txtSize * 1.4)
                        }
                    },
                    veryBig: {
                        labels: [l.very, l.big, l.separated, l.apart],
                        run: function (txtSize) {
                            return randomInt(txtSize * 1.41, txtSize * 1.6)
                        }
                    },
                    overSized: {
                        labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                        run: function (txtSize) {
                            return randomInt(txtSize * 1.61, txtSize * 4)
                        }
                    }
                    /*,
                                        giant: {
                                            labels: [l.over, l.extreme, l.huge, l.separated, l.apart],
                                            run: function(txtSize) {
                                                return randomInt(txtSize * 4.1, txtSize * 50)
                                            }
                                        }*/

                },
                run: function (opts) {
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

            //hierachy
            /*highlightHierachy: {
                //highlight par = evidenciar em comparação ao mais pequeno (corpo < subtitulo || subtitulo < titulo)
                //highlight todos = envidenciar todos com a mesma regra (p.e. + claro para mais escuro)

                //highlight pode ser:
                //size / textsize, posição, brilho, hue, textweight
                //no highlight de pares tambem: underline, caixa alta, (textweight fica aqui?)

                labels: [l.hierachy, l.level],
                run: function() {

                }
            },*/
        },
        runAll: function (pag) {
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

                saveString(k + ".txt", "" + Math.pow(m.probToRun, exp));

                //if (r < m.probToRun) {
                //if (1 - Math.pow(r, exp) < m.probToRun) { //muta bastante
                if (r < Math.pow(m.probToRun, exp)) { //pow methods
                    var name = m.name;
                    logToFile("\npageItemMethods: about to run method (" + k + ") " + m.name + " at " + selectedItem.name);
                    var executed = m.run();
                    //BREAK IF REMOVED
                    if (executed)
                        if (m.name == "remove") break; //se removeu o item, nao ha mais mutações a fazer
                }
            }

        },
        runRandomOne: function (pag) {
            page(pag);
            var methods = pageItemMethods.methods;

            //se nao for texto, nao considera os metodos de texto
            if (!(selectedItem instanceof TextFrame))
                methods = filterObj(methods, function (v, k) {
                    return v.type !== "text"
                });

            var randomMethod = rouletteFromProbToRun(methods, probToRunMethodsExponent);

            $.writeln(randomMethod.name + " " + randomMethod.probToRun);
            randomMethod.run();
        }
    };
    $.writeln("pageItemMethods:");
    initMethods(pim.methods);
    return pim;
};

//Page methods
var pageMethods;
var initPageMethods = function (fontConstants) {
    var pm = {
        methods: {
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

            //grid
            setMargins: {
                type: "grid",
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
                        run: function (v, sizeFromConst) {
                            var constrains = rouletteFromProbToRun(v.constants);
                            var margin = sizeFromConst(v, constrains);
                            margins(margin);
                        }
                    },
                    verticalCenter: {
                        labels: [l.different, l.vertical, l.balanced, l.tall, l.high, l.big, l.center],
                        run: function (v) {
                            margins(v.small, v.big, v.small, v.big);
                        }
                    },
                    horizontalCenter: {
                        labels: [l.different, l.horizontal, l.balanced, l.short, l.base, l.long, l.center],
                        run: function (v) {
                            margins(v.big, v.small, v.big, v.small);
                        }
                    },
                    alignTop: {
                        labels: [l.different, l.top, l.fly, l.up],
                        run: function (v) {
                            margins(v.small, v.small, v.big, v.small);
                        }
                    },
                    alignBottom: {
                        labels: [l.different, l.bottom, l.land, l.heavy, l.terrain, l.down],
                        run: function (v) {
                            margins(v.big, v.small, v.small, v.small);
                        }
                    },
                    alignLeft: {
                        labels: [l.different, l.left, l.side],
                        run: function (v) {
                            margins(v.small, v.big, v.small, v.small);
                        }
                    },
                    alignRight: {
                        labels: [l.different, l.right, l.side],
                        run: function (v) {
                            margins(v.small, v.small, v.small, v.big);
                        }
                    },
                    alignTopLeft: {
                        labels: [l.different, l.top, l.left, l.corner, l.trapped, l.up],
                        run: function (v) {
                            margins(v.small, v.big, v.big, v.small);
                        }
                    },
                    alignTopRigt: {
                        labels: [l.different, l.top, l.right, l.corner, l.trapped, l.up],
                        run: function (v) {
                            margins(v.small, v.small, v.big, v.big);
                        }
                    },
                    alignBottomLeft: {
                        labels: [l.different, l.bottom, l.left, l.corner, l.trapped, l.down],
                        run: function (v) {
                            margins(v.big, v.big, v.small, v.small);
                        }
                    },
                    alignBottomRigt: {
                        labels: [l.different, l.bottom, l.right, l.corner, l.trapped, l.down],
                        run: function (v) {
                            margins(v.big, v.small, v.small, v.big);
                        }
                    }
                },
                run: function (opts) {
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
                    sizeFromConst = function (v, constant) {
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
                    monoSpacedColumns: {
                        labels: [l.column],
                        run: function (gutter) {
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
                        labels: [l.row],
                        run: function (gutter, numRows) {
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
                        labels: [l.row, l.column],
                        run: function () {
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
                run: function (opts) {
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    randomSubMethod.run();
                    return "Did <i>" + this.name + "</i> using the <i>" + randomSubMethod.name + "</i> submethod.";
                }
            },
            moveSelectionToGrid: {
                ignoreInEvolution: true,
                type: "grid",
                labels: [l.grid, l.order],
                run: function (opts) {
                    adjustSelectionToGrid();
                    return "Did <i>" + this.name + "</i>.";
                }
            },
            moveAndScaleSelectionToGrid: {
                ignoreInEvolution: true,
                type: "grid",
                labels: [l.grid, l.order],
                run: function (opts) {
                    adjustSelectionToGrid(true);
                    return "Did <i>" + this.name + "</i>.";
                }
            },

            //items
            createBackground: {
                type: "items",
                labels: [l.back],
                subMethods: {
                    solid: {
                        labels: [l.plane],
                        run: function () {
                            rectMode(CORNER);
                            var r = rect(0, 0, width, height);
                            r.label = "background";
                            return r;
                        }
                    }
                },
                run: function (opts) {
                    //eliminar items do background anterior
                    var toRemove = [];
                    var its_o = getPageItems(true);
                    var its = its_o.everyItem().getElements();
                    for (var i = 0; i < its.length; i++)
                        if (its[i].label == "background") toRemove.push(its[i].id);
                    for (var i = 0; i < toRemove.length; i++) its_o.itemByID(toRemove[i]).remove();

                    //create shape
                    var randomSubMethod = getSubMethod("pageMethods", this.name, opts);
                    selectedItem = randomSubMethod.run();
                    selection(selectedItem);
                    pageItemMethods.methods.fillColor.run({});
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
                labels: [l.shape],
                constants: {
                    //todos para o "arc":

                    //shape
                    circleH: {
                        type: "shape",
                        labels: [l.circle, l.normal, l.moon],
                        run: function (v) {
                            return v.w;
                        }
                    },
                    ellipseH: {
                        type: "shape",
                        labels: [l.ellipse, l.deformed],
                        run: function (v) {
                            return randomFloat(width / v.minDiv, height);
                        }
                    },
                    //angles
                    verySmall: {
                        type: "ang",
                        labels: [l.small, l.very, l.mini, l.spike],
                        run: function (v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 64, Math.PI / 8);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    third: {
                        type: "ang",
                        labels: [l.third],
                        run: function (v) {
                            return [0, Math.PI / 3];
                        }
                    },
                    small: {
                        type: "ang",
                        labels: [l.small, l.spike],
                        run: function (v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 8, Math.PI / 4);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    quarter: {
                        type: "ang",
                        labels: [l.quarter],
                        run: function (v) {
                            return [0, Math.PI / 4];
                        }
                    },
                    medium: {
                        type: "ang",
                        labels: [l.medium, l.pizza, l.cone],
                        run: function (v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 4, Math.PI / 2);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    half: {
                        type: "ang",
                        labels: [l.half, l.divide],
                        run: function (v) {
                            return [0, Math.PI];
                        }
                    },
                    big: {
                        type: "ang",
                        labels: [l.big, l.missing],
                        run: function (v) {
                            var start = randomFloat(0, Math.PI * 2);
                            var ang = randomFloat(Math.PI / 2, (Math.PI / 4) * 3);
                            var end = start + ang;
                            return [start, end];
                        }
                    },
                    veryBig: {
                        type: "ang",
                        labels: [l.very, l.big, l.missing, l.bit],
                        run: function (v) {
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
                        run: function (v) {
                            return OPEN
                        }
                    },
                    chord: {
                        type: "mode",
                        labels: [l.chord, l.curve],
                        run: function (v) {
                            return CHORD
                        }
                    },
                    pie: {
                        type: "mode",
                        labels: [l.pie, l.pizza, l.cone],
                        run: function (v) {
                            return PIE
                        }
                    }
                },
                subMethods: {
                    arc: {
                        labels: [l.arc],
                        run: function () {
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
                        labels: [l.ellipse, l.egg],
                        //TODO: submethods para ellipse vertical / horizontal
                        run: function () {
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
                        labels: [l.circle, l.ball, l.round],
                        run: function () {
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
                        labels: [l.rect, l.box, l.four],
                        //TODO: submethods para rect vertical / horizontal
                        run: function () {
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
                        labels: [l.square, l.box, l.equal, l.four],
                        run: function () {
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
                        labels: [l.line],
                        //TODO: submethods para rect vertical / horizontal
                        run: function () {
                            var x = randomFloat(0, width);
                            var y = randomFloat(0, height);
                            var x2 = randomFloat(0, width);
                            var y2 = randomFloat(0, height);
                            return line(x, y, x2, y2);
                        }
                    },
                    /*point: {
                        labels: [l.point, l.dot],
                        run: function() {
                            var x = randomFloat(0, width);
                            var y = randomFloat(0, height);
                            return point(x, y);

                        }
                    },*/
                    quad: {
                        labels: [l.quad, l.shape, l.four],
                        //TODO: 4 pontos a volta de um raio
                        //TODO: 4 pontos dentro e um raio maximo
                        run: function () {
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
                        labels: [l.triangle, l.three],
                        //TODO: 3 pontos a volta de um raio
                        //TODO: 3 pontos dentro e um raio maximo
                        //TODO: equilatero
                        //TODO: agudo e obtuso
                        run: function () {
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
                run: function (opts) {
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
                labels: [l.remove, l.delete, l.clean, l.empty, l.minimal, l.less, l.simple, l.space, l.breathe],
                subMethods: {
                    removeAll: {
                        labels: [l.all],
                        run: function () {
                            var toRemove = [];
                            var its_o = getPageItems(true);
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
                run: function (opts) {
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
        runAll: function (pag) {
            logToFile("pageMethods");
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
    $.writeln("pageMethods:");
    initMethods(pm.methods);
    return pm;
}

//Document methods
var docMethods;
var initDocMethods = function (fontConstants) {
    var dm = {
        methods: {
            //swatches
            createColor: {
                type: "swatches",
                labels: [l.color, l.basic],
                subMethods: {
                    //hue
                    randomHue: {
                        type: "hue",
                        labels: [l.random],
                        run: function () {
                            return randomFloat(0, 360) / 360;
                        }
                    },
                    randomRed: {
                        type: "hue",
                        labels: [l.red, l.fire, l.apple, l.strawberry, l.love],
                        run: function () {
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
                        run: function () {
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
                        run: function () {
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
                        run: function () {
                            return randomFloat(45, 73) / 360;
                        }
                    },
                    randomGreen: {
                        type: "hue",
                        labels: [l.green, l.grass, l.tree, l.enviroment, l.forest, l.plant],
                        run: function () {
                            return randomFloat(73, 170) / 360;
                        }
                    },
                    randomBlue: {
                        type: "hue",
                        labels: [l.blue, l.water, l.sky, l.sad, l.sea, l.fish],
                        run: function () {
                            return randomFloat(196, 259) / 360;
                        }
                    },
                    randomPurple: {
                        type: "hue",
                        labels: [l.purple, l.wine, l.violet],
                        run: function () {
                            return randomFloat(259, 278) / 360;
                        }
                    },
                    randomPink: {
                        type: "hue",
                        labels: [l.pink],
                        run: function () {
                            return randomFloat(278, 337) / 360;
                        }
                    },
                    //saturation
                    randomSaturation: {
                        hideFromUser: true,
                        type: "saturation",
                        labels: [l.random],
                        run: function (min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    maxSaturation: {
                        type: "saturation",
                        labels: [l.colorful, l.happy, l.very, l.super, l.extreme, l.saturation, l.total],
                        run: function (min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    highSaturation: {
                        type: "saturation",
                        labels: [l.colorful, l.happy, l.saturation, l.high],
                        run: function (min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(max / 2, max);
                        }
                    },
                    lowSaturation: {
                        type: "saturation",
                        labels: [l.low, l.gray, l.sad],
                        run: function (min, max) {
                            if (!min) min = .1;
                            if (!max) max = 1;
                            return randomFloat(min, max / 2);
                        }
                    },
                    minSaturation: {
                        type: "saturation",
                        labels: [l.low, l.sad, l.gray, l.black, l.white, l.old, l.neutral],
                        run: function (min, max) {
                            if (!min) min = .1;
                            return min;
                        }
                    },
                    //brightness
                    randomBrightness: {
                        hideFromUser: true,
                        type: "brightness",
                        labels: [l.random],
                        run: function (min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            return randomFloat(min, max);
                        }
                    },
                    maxBrightness: {
                        type: "brightness",
                        labels: [l.bright, l.sunny, l.light, l.peace, l.day, l.white],
                        run: function (min, max) {
                            if (!max) max = 1;
                            return max;
                        }
                    },
                    highBrightness: {
                        type: "brightness",
                        labels: [l.bright, l.sunny, l.light, l.peace, l.day],
                        run: function (min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            var range = (max - min) / 2;
                            return randomFloat(min + range, max);
                        }
                    },
                    lowBrightness: {
                        type: "brightness",
                        labels: [l.low, l.dark, l.sad, l.fear, l.surprise, l.night],
                        run: function (min, max) {
                            if (!min) min = .2;
                            if (!max) max = 1;
                            var range = (max - min) / 2;
                            return randomFloat(min, min + range);
                        }
                    },
                    minBrightness: {
                        type: "brightness",
                        labels: [l.low, l.dark, l.sad, l.fear, l.surprise, l.night, l.black],
                        run: function (min, max) {
                            if (!min) min = .2;
                            return min;
                        }
                    },
                },
                run: function (opts) {
                    var userMethod;
                    var user = opts && opts.subMethod;
                    if (user) userMethod = getSubMethod("docMethods", this.name, opts);

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
                    if (satLims) randomS = randomS.run(satLims.minSaturation, satLims.maxSaturation);
                    else randomS = randomS.run();

                    //brightness
                    var briLims = randomH.brightnessLimits;
                    var randomB = 1;
                    if (userMethod && userMethod.type == "brightness") randomB = userMethod;
                    else randomB = rouletteFromProbToRun(briMethods);
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

                }
            },
            createGradient: {
                type: "swatches",
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
                        run: function (randomPos) {
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
                        labels: [l.two, l.random, l.unbalance, l.different],
                        run: function () {
                            return docMethods.methods.createGradient.subMethods.twoColors.run(true);
                        }
                    },
                    multipleColors: {
                        type: "gradientColors",
                        labels: [l.multiple, l.complex, l.equaly, l.balance, l.uniform, l.colorful],
                        run: function (randomDist) {
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
                        labels: [l.multiple, l.complex, l.random, l.unbalance, l.different, l.colorful],
                        run: function () {
                            return docMethods.methods.createGradient.subMethods.multipleColors.run(true);
                        }
                    }
                },
                run: function (opts) {
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
                labels: [l.color],
                run: function (opts) {
                    initSwatches();
                    return "Did <i>" + this.name + "</i>.";
                }
            },
            deleteUnusedSwatches: {
                ignoreInEvolution: true,
                type: "swatches",
                labels: [l.color],
                run: function (opts) {
                    deleteUnusedSwatchesAndGroups();
                    return "Did <i>" + this.name + "</i>.";
                }
            },

            //control
            /*undo: {
                ignoreInEvolution: true,
                type: "control",
                labels: [l.back],
                run: function(opts) {
                    
                    
                }
            }*/

        },
        runAll: function () {
            var methods = docMethods.methods;
            var exp = 1;
            if (interfaceSettings.keywords.length > 0) exp = probToRunMethodsExponent;
            for (var k in methods) {
                var m = methods[k];
                var r = randomFloat(0, 1);
                //if (r < m.probToRun) {
                //if (1 - Math.pow(r, exp) < m.probToRun) { //muta bastante
                if (r < Math.pow(m.probToRun, exp)) m.run(); //pow methods
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
        finalLabels.push(l[lb] || createLabel(lb));
    }
    return finalLabels;
}

function initFonts() {
    var start = millis();

    var myFonts = {};
    var fonts = app.fonts.everyItem().getElements();
    for (var i = 0; i < fonts.length; i++) {
        var name = fonts[i].fontFamily;
        var key = name.toLowerCase().replace(/\s/g, '');

        var family = myFonts[key] || myFonts[key] = {
            fontName: name,
            //name: key, //já é feito no initSubs
            labels: getLabelsFromFontName(name),
            weights: {}
        };

        var styleName = fonts[i].fontStyleName;
        var styleKey = styleName.toLowerCase().replace(/\s/g, '');
        var styleLabels = getLabelsFromFontName(styleName);
        var styleProbToRun = getProbToRun(styleLabels) || defaultProbToRun;

        family.labels = family.labels.concat(styleLabels).unique();
        //family.probToRun = getProbToRun(family.labels) || defaultProbToRun; //já é feito no initSubs
        family.weights[styleKey] = {
            value: fonts[i],
            styleName: styleName,
            //name: styleKey, //já é feito no initSubs
            labels: styleLabels,
            probToRun: styleProbToRun
        }
    }

    $.writeln("Fonts toke " + (millis() - start) + " ms to load.");
    //saveJSON(extensionFolder + "/js/savedFonts.json", myFonts);
    //saveJSON(extensionFolder + "/js/savedLabels.json", l);
    return myFonts;
}

function initSubs(m, sub) {
    var allLabels = [];
    var msub = m[sub] || {};
    for (var key in msub) {
        //$.writeln(key);
        var c = msub[key];
        c.name = key;
        //KEYWORDS
        allLabels = allLabels.concat(c.labels);
        c.probToRun = getProbToRun(c.labels) || defaultProbToRun

        //for font weights //já é feito no init fonts
        /*if (c.weights) {
            var fontWeightLabels = initSubs(c, "weights");
            allLabels = allLabels.concat(fontWeightLabels);
        }*/
    }
    return allLabels;
}

function initMethods(meths) {
    var start = millis();

    for (var k in meths) {
        var m = meths[k];
        var allLabels = [].concat(m.labels);
        m.probToRun = defaultProbToRun;
        m.name = k;
        //$.writeln("-" + m.name);

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
        //KEYWORDS  
        allLabels = allLabels.unique();
        m.labels = allLabels;
        m.probToRun = getProbToRun(m.labels)
    }

    $.writeln("initMethods toke " + (millis() - start) + " ms to load.");
}

function initAllMutationMethods(fts) {

    pageItemMethods = initPageItemMethods(fts);
    pageMethods = initPageMethods(fts);
    docMethods = initDocMethods(fts);

    allMeths = {
        pageItemMethods: pageItemMethods,
        pageMethods: pageMethods,
        docMethods: docMethods
    }

}