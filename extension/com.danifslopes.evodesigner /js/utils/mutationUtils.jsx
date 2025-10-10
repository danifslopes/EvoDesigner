/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/


function runMeth(type, name, opts) {
    var msg = "";
    if (!opts) opts = {};
    var t = allMeths[type];
    if (isObject(t)) {
        var m = t.methods[name];
        if (isObject(m)) {
            //se ha items, por cada item selected
            if (type === "pageItemMethods") {
                selections(function(item, loopcount) {
                    selectedItem = item;
                    msg = m.run(opts);
                })
            } else if (type === "pageMethods") {
                var pag = app.activeWindow.activePage;
                page(pag);
                msg = m.run(opts);
            } else if (type === "docMethods") {
                msg = m.run(opts);
            }
        }
    }

    initCommonVars();
    return msg;
}

function getMethodNames() {
    var m = {
        docMethods: {},
        pageMethods: {},
        pageItemMethods: {}
    };

    //alert(allMeths) //todo: o allMethods é undefined

    if (allMeths == undefined) return {};

    for (var mk in m) {
        if (allMeths[mk])
            for (var k in allMeths[mk].methods) {
                var method = allMeths[mk].methods[k];
                var type = method.type;
                if (!type) type = "other";
                if (!m[mk][type]) m[mk][type] = [];

                var r = {
                    name: k,
                    probToRun: method.probToRun,
                    expProbToRun: Math.pow(method.probToRun, probToRunMethodsExponent).toFixed(3),
                    subMethods: [],
                    constants: [],
                    desc: method.desc || ''
                }

                if (method.subMethods) {
                    var subs = [];
                    for (var k2 in method.subMethods) {
                        if (!method.subMethods[k2].hideFromUser)
                            subs.push({
                                name: k2,
                                probToRun: method.subMethods[k2].probToRun,
                                expProbToRun: Math.pow(method.subMethods[k2].probToRun, probToRunPropertiesExponent),
                                desc: method.subMethods[k2].desc || ''
                            });
                    }
                    r.subMethods = subs;
                }

                if (method.constants) {
                    var cons = [];
                    for (var k2 in method.constants) {
                        if (!method.constants[k2].hideFromUser)
                            cons.push({
                                name: k2,
                                probToRun: method.constants[k2].probToRun,
                                expProbToRun: Math.pow(method.constants[k2].probToRun, probToRunPropertiesExponent),
                                desc: method.constants[k2].desc || ''
                            });
                    }
                    r.constants = cons;
                }

                m[mk][type].push(r);
            }
    }
    return JSON.stringify(m);
}

function snapToGrid(item) {
    selectedItem = item;
    pageItemMethods.methods.moveToGrid.run({
        subMethod: "snapToCloserGrid"
    });
    pageItemMethods.methods.sizeGridRelative.run({
        subMethod: "snapToCloserGrid"
    });
}


function sizeHelper(p, size) {
    referencePoint(TOP_LEFT);

    //final bounds
    var b = p.b;
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

    var error = tryMutation(function(it) {
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
    if (error) {
        // alert("Err while sizing:" + error);
    }
}



function adjustPageToGrid(pageObj) {
    if (!pageObj) pageObj = app.activeWindow.activePage;

    var its = items(pageObj);
    forEach(its, function(i) {
        selectedItem = i;
        pageItemMethods.methods.move.run({
            subMethod: "snapToCloserGrid"
        });
        pageItemMethods.methods.size.run({
            subMethod: "snapToCloserGrid"
        });
    });
}

function getSubMethod(methDomain, methName, opts, checkTextMethods) {
    var subMethods = allMeths[methDomain].methods[methName].subMethods;
    var randomSubMethod;

    //se options dizem qual é o metodo
    if (opts && opts.subMethod) {
        randomSubMethod = allMeths[methDomain].methods[methName].subMethods[opts.subMethod];

    } else {
        var finalSubMeths = {};
        var haMandatory = interfaceSettings.mandatory_props && interfaceSettings.mandatory_props.length > 0;
        var mandatorySubs = {};

        //se o item nao é texto, tirar submetodos de texto TODO
        if (checkTextMethods && !(selectedItem instanceof TextFrame)) {
            subMethods = filterObj(subMethods, function(m) {
                return m.type != "text";
            })
        }

        for (var k in subMethods) {
            var subMeth = null;

            //ficar so com os que não têm "ignoreInEvolution"
            if (opts && opts.evolution) {
                if (!subMethods[k].ignoreInEvolution) subMeth = subMethods[k];
            } else subMeth = subMethods[k];

            //se so queremos um tipo especifico de submeth, nao passar os outros
            if (opts && opts.type) {
                if (subMethods[k].type !== opts.type) subMeth = null;
            }

            //se ha submetodos mandatorios, ver algum pertence a este metodo
            if (subMeth && haMandatory) {
                if (interfaceSettings.mandatory_props.indexOf(k) > -1) {
                    mandatorySubs[k] = subMethods[k];
                }
            }

            if (subMeth) finalSubMeths[k] = subMeth;
        }

        //se ha mandatory subs neste metodo, usar so esses
        if (getObjectKeys(mandatorySubs).length > 0) {
            finalSubMeths = mandatorySubs;
        }

        //escolher um random dos restantes
        //alert(methName + "----" + getObjectKeys(finalSubMeths))
        randomSubMethod = rouletteFromProbToRun(finalSubMeths);
    }

    return randomSubMethod;
}

function rouletteFromProbToRun(objs, exp) { //objs = constants | subMethods
    if (interfaceSettings.keywords.length <= 0) exp = 1;
    else if (!exp) exp = probToRunPropertiesExponent;

    var probsSum = 0;
    for (var key in objs) {
        probsSum += Math.pow(objs[key].probToRun, exp); //pow submethods
        //$.writeln("rouletteFromProbToRun");
        //$.writeln(objs[key].probToRun);
    }

    var randomPerc = randomFloat(0, probsSum),
        progress = 0,
        randomObj = {};

    for (var key in objs) {
        progress += Math.pow(objs[key].probToRun, exp); //por submethods
        //$.writeln("rouletteFromProbToRun");
        //$.writeln(randomPerc);
        //$.writeln(progress);
        //$.writeln("");
        if (randomPerc <= progress) {
            randomObj = objs[key];
            break;
        }
    }

    //$.writeln("-----" + randomObj.name);

    //logToFile("            cons/submeth: " + randomObj.name + "\n");
    //$.writeln("            cons/submeth: " + randomObj.name + " " +randomObj.probToRun+"\n");
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

        //keywords.concat(labels_tx);
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

function constantsFromArr(arr /* font/weight names */ , opts) {
    if (opts == undefined) opts = {};
    var gettingFamilies = opts.fontFamilyKey == undefined;
    var constants = {};

    //por cada nome de fonte/peso
    for (var i = 0; i < arr.length; i++) {
        var c = {}
        c.value = arr[i];
        var str = arr[i];
        if (typeof str !== 'string') {
            str = arr[i]['fontStyleName'];
            c.fullName = arr[i].fullName;
        }
        str = str.toLowerCase();
        var name = str.replace(/\s/g, '');
        c.name = name;

        //IR BUSCAR FONTE/PESO GUARDADO
        var savedObj;
        //se é uma fonte mãe, tenta ir buscar a fonte guardada
        if (gettingFamilies) savedObj = opts.savedFonts[name];
        //if é um peso (foi passado o font family), tenta ir buscar o peso guardado
        else if (opts.savedFonts[opts.fontFamilyKey])
            savedObj = opts.savedFonts[opts.fontFamilyKey].weights[name];

        //SE NAO ESTIVER GUARDADO, gerar labels e probToRun
        if (savedObj == undefined) { //TODO: ir buscar descrições das fontes à net para fazer labels?
            var labels_tx = str.split(" ");
            c.labels = [];
            for (var j = 0; j < labels_tx.length; j++) {
                var lb = labels_tx[j];
                if (!labelsArr[lb]) { //cria se nao existe em labelsArr
                    labelsArr.push(lb);
                    createLabel(lb); //isto já adiciona a label ao obj l
                    //--here guardar novas labels tambem
                }
                c.labels.push(lb); //here --- ver como guardar isto!!!
            }
        } //se estava guardado, copia 1 fonte/peso
        else c = savedObj;

        ///------------------------------------

        //ir buscar os pesos
        if (gettingFamilies) {
            var family = c.value;
            var pesos = opts.myFonts.filter(function(f) {
                return f.fontFamily === family;
            });
            c.weights = {};
            var pesosConsts = constantsFromArr(pesos, {
                savedFonts: opts.savedFonts,
                fontFamilyKey: c.name,
            });
            c.weights = pesosConsts;
            /*{arial: {
             name: arial
             value: Arial
             labels:[l.arial, l.bold], 
             weights:  {bold : {value: arial bold, labels: [l.arial, l.bold], ...}}
             }...} */


            //adicionar labels dos pesos às labels da familia
            for (var j in pesosConsts) {
                var peso = pesosConsts[j];
                c.labels = c.labels.concat(peso.labels);
            }
        }

        ///------------------------------------

        constants[name] = c;
    }


    return constants;
}

function getProbToRun(method) {
    var labels = method.labels;

    var max = 0;
    if (method.hasOwnProperty("minProbToRun")) max = method.minProbToRun;

    for (var i = 0; i < labels.length; i++) {
        if (l[labels[i]] == undefined) {
            createLabel(labels[i]);
            //$.writeln("label " + labels[i] + " didn't exist. just created it")
        }
        var lb = l[labels[i]];

        $.writeln("labels[i]");
        $.writeln(labels[i]);

        if (lb.probToRun > max) max = lb.probToRun;
    }
    return max
}

function getNamesOfFontFamilies(myFonts) {

    myFonts = myFonts.map(function(f) {
        return f.fontFamily;
    })
    fontFamilies = myFonts.unique();
    return fontFamilies;
}

function conceptNumberBetween(min, max) {
    var matching = [];
    for (var i = 0; i < conceptNumbers.length; i++) {
        var v = conceptNumbers[i];
        if (v <= min && v >= max) matching.push(v);
    }
    return matching.length > 0 ? matching[randomInt(0, matching.length - 1)] : null;
}

function semiConceptualRandom() {
    var prob = randomFloat(0, 1);
    if (prob < probConceptNumbers && conceptNumbers.length > 0) return randomConceptValue();

    var i = randomInt(0, 3);
    if (i == 0) return randomFloat(0, 1);
    else if (i == 1) return randomFloat(0, 10);
    else if (i == 2) return randomFloat(0, 100);
    else if (i == 3) return randomFloat(0, 1000);
}

function semiConceptualRandomBetween(min, max) {
    var prob = randomFloat(0, 1);
    if (prob < probConceptNumbers && conceptNumbers.length > 0) return randomConceptValue();

    //else 
    var range = max - min;
    var i = randomInt(0, 3);
    var value = 0;
    if (i == 0) value = randomFloat(0, Math.min(1, range));
    else if (i == 1) value = randomFloat(0, Math.min(10, range));
    else if (i == 2) value = randomFloat(0, Math.min(100, range));
    else if (i == 3) value = randomFloat(0, Math.min(1000, range));

    return value + min;
}

function randomConceptNumber() {
    return conceptNumbers.length > 0 ? conceptNumbers[randomInt(0, conceptNumbers.length - 1)] : 0;
}

function getMatchingWords(labels) {
    //ver quais fazes match usando o modulode keywords to visuals
    return [""];
}

function maxItemWidth() {
    page();
    return Math.max(width, height) * 2;
}

function randomItemWidth() {
    page();
    return Math.max(width, height) * semiConceptualRandomBetween(0.01, 2);
}

function maxInc() {
    page();
    return Math.min(width, height) * 0.9;
}

function randomInc(range) {
    return range * semiConceptualRandomBetween(-1, 1);
}

function getMinObjectSize() {
    var pageSize = Math.min(width, height);
    return pageSize / 64;
}

function getMinVisible() {
    var b = getBounds(selectedItem);

    var minVisible;
    if (selectedItem instanceof TextFrame) minVisible = b.width; //se for texto, fica tudo dentro //todo: rever decisão
    else minVisible = b.width / 3;
}

function getTransformationProperties(randomSubMethod, opts) {
    var xAnchor = "left",
        yAnchor = "top";

    if (randomSubMethod.type == "grid" && !opts.defaultAxes) { //se for snap, pode usar diferentes eixos
        var cons = pageItemMethods.methods.moveToGrid.constants;
        var xAs = filterSubObjsByType(cons, "x");
        var yAs = filterSubObjsByType(cons, "y");
        xAnchor = rouletteFromProbToRun(xAs).name;
        yAnchor = rouletteFromProbToRun(yAs).name;
    }

    //calc bounds
    var b = getBounds(selectedItem);

    //calc min visible
    var minVisibleRatio;
    if (selectedItem instanceof TextFrame) minVisibleRatio = minVisibleRatio_textboxes; //se for texto, fica tudo dentro //todo: rever decisão
    else minVisibleRatio = minVisibleRatio_all;

    //all transformation properties 
    return {
        b: b,
        minVisibleRatio: minVisibleRatio,
        xAnchor: xAnchor,
        yAnchor: yAnchor,
        defaultAxes: opts.defaultAxes,
        minObjSize: getMinObjectSize()
    };
}

function getBounds(it) {
    if (!it) {
        it = selectedItem;
    }

    var b = {
        left: it.visibleBounds[1],
        top: it.visibleBounds[0],
        right: it.visibleBounds[3],
        bottom: it.visibleBounds[2],
        width: it.visibleBounds[3] - it.visibleBounds[1],
        height: it.visibleBounds[2] - it.visibleBounds[0]
    }

    return b;
}

function randomRadius(canBeNegative) {
    page(app.activeWindow.activePage);
    var b = bounds(selectedItem);
    var itemSize = Math.max(b.width, b.height);
    var pageSize = Math.min(width, height);

    var r = semiConceptualRandomBetween(itemSize / 6, itemSize * 1.5);
    if (canBeNegative && randomFloat(0, 1) < 0.5) r = -r;
    return r;
}

function outsidePage(item) {
    if (!item) {
        alert("outside");
        return true;
    }

    var b = bounds(item);
    if (!b) {
        alert("outside");
        return true;
    }

    return b.left >= width || b.right <= 0 || b.top >= height || b.bottom <= 0;
}

/*function outsidePage(item) {
    var b = bounds(item);
    //return b.left >= width || b.right <= 0 || b.top >= height || b.bottom <= 0;

    var out = false;
    var centerX = b.left + (b.width / 2);
    var centerY = b.top + (b.height / 2);

    //TODO: na versão final isto nao faz sentido, porque  user pode querer que  texto nao seja legivel e então pode sair.
    if (item instanceof TextFrame) out = (b.right >= width || b.left <= 0 || b.bottom >= height || b.top <= 0) //texto tem de estar sempre dentro
    else //out = (centerX >= width || centerX <= 0 || centerY >= height || centerY <= 0); // o resto pode sair metade
        (b.left >= width || b.right <= 0 || b.top >= height || b.bottom <= 0);

    return out;
}*/

function steppingAway(item) {
    var b = bounds(item);
    var border = Math.max(width, height);
    return b.left >= border || b.right <= -border || b.top >= border || b.bottom <= -border;
}

function filterSubObjsByType(obj, type) {
    var these = {};
    for (var key in obj)
        if (obj[key].type == type) these[key] = obj[key];
    return these;
}

function filterObj(obj, filter) {
    var these = {};
    for (var key in obj)
        if (filter(obj[key], key)) these[key] = obj[key];
    return these;
}

function randomSubMethod(methodsObj, mainMethodName) {
    if (selectedItem.hasOwnProperty(mainMethodName)) {
        var subMethods = methodsObj.methods[mainMethodName].subMethods;
        var randomSubMethod = rouletteFromProbToRun(subMethods);
        return randomSubMethod

    } else $.writeln("Selected item has no property " + mainMethod.name);
}

function getSpread(pagNum) {
    //TODO: se o spread forem duas paginas iisto nao funciona
    return doc().spreads[pagNum - 1];
}

function randomConstant(methodsObj, mainMethodName) {
    if (selectedItem.hasOwnProperty(mainMethodName)) {
        var constants = methodsObj.constants[mainMethodName].constants;
        var randomConstant = rouletteFromProbToRun(constants);
        return randomConstant

    } else $.writeln("Selected item has no prop " + mainMethod.name);
}

function initSwatches() {
    var start = millis();

    deleteUnusedSwatches();

    //para nao eliminar as cores que estao em posters existentes,
    //cria um novo grupo eD.colors (2) e mete para la as cores que estavam no eD.colors
    var start2 = millis();
    var eDcolorGroup = doc().colorGroups.itemByName("eD.colors");
    if (eDcolorGroup.isValid) {
        var colors = eDcolorGroup.colorGroupSwatches.everyItem().getElements();
        var newEDcolorGroup = doc().colorGroups.add("eD.colors", []);
        for (var i = 0; i < colors.length; i++) newEDcolorGroup.colorGroupSwatches.add(colors[i].swatchItemRef);
    }
    $.writeln("     save old colors " + (millis() - start2) + " ms to load.");

    //o mesmo para gradientes
    var start3 = millis();
    var eDgradientGroup = doc().colorGroups.itemByName("eD.gradients");
    if (eDgradientGroup.isValid) {
        var gradients = eDgradientGroup.colorGroupSwatches.everyItem().getElements();
        var newEDgradientGroup = doc().colorGroups.add("eD.gradients", []);
        for (var i = 0; i < gradients.length; i++) newEDgradientGroup.colorGroupSwatches.add(gradients[i].swatchItemRef);
    }
    $.writeln("     save old gradients " + (millis() - start3) + " ms to load.");

    //create colors
    var start4 = millis();
    var start5 = millis();
    var numNewColors = semiConceptualRandomBetween(10, 10); //1-15
    for (var i = 0; i < numNewColors; i++) {
        docMethods.methods.createColor.run();
    }
    $.writeln("         create colors " + (millis() - start5) + " ms to load.");

    //create gradients
    var start6 = millis();
    var numNewGradients = semiConceptualRandomBetween(10, 10);
    for (var i = 0; i < numNewGradients; i++) {
        docMethods.methods.createGradient.run();
    }
    $.writeln("         create gradients " + (millis() - start6) + " ms to load.");

    $.writeln("     create new colors and gradients " + (millis() - start4) + " ms to load.");

    deleteUnusedColorGroups();

    $.writeln("initSwatches toke " + (millis() - start4) + " ms to load.");
}

function getColors() {
    var group = doc().colorGroups.itemByName("eD.colors");
    var cols = [];
    if (group.isValid) cols = group.colorGroupSwatches.everyItem().getElements();
    //todo: forçar retornar tambem o branco e o preto?
    //.swatchItemRef;

    return cols;
}

function getGradients() {
    var group = doc().colorGroups.itemByName("eD.gradients");
    var gradients = [];
    if (group.isValid) gradients = group.colorGroupSwatches.everyItem().getElements();
    return gradients;
}

function getSwatches() {
    var colorsgroup = doc().colorGroups.itemByName("eD.colors");
    var gradientsgroup = doc().colorGroups.itemByName("eD.gradients");

    var swatches = [];
    if (colorsgroup.isValid) swatches.concat(group.colorGroupSwatches.everyItem().getElements());
    if (gradientsgroup.isValid) swatches.concat(group.colorGroupSwatches.everyItem().getElements());

    return swatches;
}

function deleteSwatches() {
    var allcolors = doc().colorGroups.itemByName("eD.colors");
    var allgradients = doc().colorGroups.itemByName("eD.gradients");
    if (allcolors.isValid) allcolors.remove();
    if (allgradients.isValid) allgradients.remove();
}

function solveTextOverflow(txtFrame) {
    if (txtFrame.overflows) txtFrame.fit(FitOptions.FRAME_TO_CONTENT);
    if (txtFrame.overflows) txtFrame.convertShape(ConvertShapeOptions.CONVERT_TO_RECTANGLE);
    if (txtFrame.overflows) {
        txtFrame.textFramePreferences.autoSizingReferencePoint = AutoSizingReferenceEnum.TOP_LEFT_POINT;
        txtFrame.textFramePreferences.autoSizingType = AutoSizingTypeEnum.WIDTH_ONLY;
        txtFrame.textFramePreferences.useNoLineBreaksForAutoSizing = false;
        //desligar auto-size
        txtFrame.textFramePreferences.autoSizingType = AutoSizingTypeEnum.OFF;
    }
}

function tryMutation(func) {
    //var originalOverflows = false;
    //if (selectedItem instanceof TextFrame) originalOverflows = selectedItem.overflows;

    var testItem = selectedItem.duplicate();
    var err = false;

    func(testItem);

    if (outsidePage(testItem)) {
        err = true;
    }
    //else out of workspace
    /*else if (testItem instanceof TextFrame)
        if (!originalOverflows && testItem.overflows) {
            err = true;
            logToFile("overflows");
        }*/

    testItem.remove();

    if (err) {
        //alert("(tryMutation) Edition failed: item fully outside page")
        return "the item is out of page";
    } else {
        func(selectedItem);
        return null;
    }
}

//TEXTBOX TO TEXT
function tryExpand(it) {
    if (it.overflows) {
        var b = getBounds(it);
        if (b.bottom < height) {
            b.bottom = b.bottom + 10;
            it.visibleBounds = [b.top, b.left, b.bottom, b.right];
            tryExpand(it);
        } else if (b.right < width) {
            b.right = b.right + 10;
            it.visibleBounds = [b.top, b.left, b.bottom, b.right];
            tryExpand(it);
        } else {
            fitTextToTextBox(it);
        }
    }
}

function expandTextBox(it, force) {
    if (it.hasOwnProperty("texts")) {
        var strokeWeight = it.strokeWeight;
        if (it.overflows || force) {
            //var b = getBounds(it);
            //b.bottom = b.top + 10 + strokeWeight;
            //it.visibleBounds = [b.top, b.left, b.bottom, b.right];
            tryExpand(it);
        }
    }
}

//TEXT TO TEXTBOX
function tryFitText(it, counter) {
    var textSizeAnterior = selectedItem.texts[0].pointSize;
    var entrelinhaAnterior = selectedItem.texts[0].leading;
    var textSize = textSizeAnterior + 2;

    typo(it, "pointSize", textSize);
    //atualizar entrelinha proporcionalmente
    if (entrelinhaAnterior != "AUTO" && entrelinhaAnterior != Leading.AUTO) {
        var rel = textSize / textSizeAnterior;
        var newLeading = entrelinhaAnterior * rel;
        typo(it, "leading", newLeading);
    }

    if (it.overflows || counter > 200) {
        typo(it, "pointSize", textSizeAnterior);
        typo(it, "leading", entrelinhaAnterior);
    } else {
        counter += 1;
        tryFitText(it, counter);
    }
}

function fitTextToTextBox(it) {
    if (it.hasOwnProperty("texts")) {
        var textSizeAnterior = it.texts[0].pointSize;
        var entrelinhaAnterior = it.texts[0].leading;
        var textSize = 2;

        typo(it, "pointSize", textSize);
        //atualizar entrelinha proporcionalmente
        if (entrelinhaAnterior != "AUTO" && entrelinhaAnterior != Leading.AUTO) {
            var rel = textSize / textSizeAnterior;
            var newLeading = entrelinhaAnterior * rel;
            typo(it, "leading", newLeading);
        }

        tryFitText(it, 0);
    }

}

function getPageItems(pag, getOriginalObj) {
    var pag = pag || page();
    var selectedPag = app.activeWindow.activePage || page(pag);
    var r = selectedPag.pageItems;
    if (!getOriginalObj) r = r.everyItem().getElements();
    return r;
}

function deleteUnusedSwatches() {
    var start = millis();

    var toDelete = [];
    for (var i = 0; i < doc().unusedSwatches.length; i++) {
        toDelete.push(doc().unusedSwatches[i].id)
    }
    for (var i = 0; i < toDelete.length; i++)
        doc().swatches.itemByID(toDelete[i]).remove();

    $.writeln("deleteUnusedSwatches toke " + (millis() - start) + " ms to load.");
}

function deleteUnusedColorGroups() {
    var start = millis();

    var toDelete = [];
    for (var i = 0; i < doc().colorGroups.length; i++) {
        var name = doc().colorGroups[i].name;
        if (name.indexOf("eD.colors") > -1 || name.indexOf("eD.gradients") > -1) {
            if (doc().colorGroups[i].colorGroupSwatches.length <= 0) {
                toDelete.push(doc().colorGroups[i].id);
            }
        }
    }
    for (var i = 0; i < toDelete.length; i++)
        doc().colorGroups.itemByID(toDelete[i]).remove();

    $.writeln("deleteUnusedColorGroups toke " + (millis() - start) + " ms to load.");
}

function deleteUnusedSwatchesAndGroups() {
    deleteUnusedSwatches();
    deleteUnusedColorGroups();
}