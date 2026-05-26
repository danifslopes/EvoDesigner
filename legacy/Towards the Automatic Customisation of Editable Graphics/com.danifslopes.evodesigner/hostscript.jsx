// @include js/libs/basiljs/basil.js

//pageItems.everyItem().getElements()

#includepath "/Users/danifslopes/Library/Application Support/Adobe/CEP/extensions/com.danifslopes.evodesigner";
#include "js/libs/seedrandom.js";
Math.seedrandom("d6");
#include "js/libs/http/http.jsx";
#include "js/libs/utils.js";
#include "js/libs/evolutionUtils.js";
#include "js/libs/labels.js";
#include "js/mutation/properties.js";
#include "js/mutation/mutationUtils.jsx";
#include "js/mutation/methods.jsx";

var basilPath, extensionName, extensionFolder, current_pop_dir;
var interfaceSettings = { //imported from main.js
    //main painel
    selected_basePages_str: '15, 16, 17',
    pop_size: 10, //se nao houver este num de pags, ele cria individuos random
    keywords: ["small", "shark"],
    mandatory_tools: [],
    desirable_tools: [],
    mand_elms: [],
    hierarchy: [],
    noveltyOn: true,
    noveltyValue: 100, //%
    balanceOn: true,
    balanceValue: 90,
    legibilityOn: true,
    legibilityValue: 80,
    styleOn: true,
    styleValue: 90,
    style_classifier: "evodesigner.com/style/mystyle",
    max_num_gens: 3,
};
var selectedItem;
var selectedPag;
var selected_basePages_nums = [];
var pop_pagNums = [];
var fst_popPagNum = 1;
var mandatoryItems_names = [];
var referenceMandatoryItems = [];
var fileLog = "";
var logPath = "";
var toSave = "";
var elite_size = 1;
var pagMutationProb = 1;
var itemMutationProb = 0.1;

//corre quando a extensão é iniciada e é executada uma função pela primeira vez
function setup() {
    basilPath = $.fileName;
    extensionName = "com.danifslopes.evodesigner";
    extensionFolder = basilPath.substring(0, basilPath.indexOf(extensionName)) + extensionName;
    current_pop_dir = extensionFolder + "/server/public/current_pop";
    logPath = extensionFolder + "/server/debug_file.txt";

    app.pngExportPreferences.pngQuality = PNGQualityEnum.MAXIMUM;
    app.pngExportPreferences.exportResolution = 72;
    app.pngExportPreferences.transparentBackground = false;
    app.pngExportPreferences.pngExportRange = PNGExportRangeEnum.EXPORT_RANGE;
    app.pngExportPreferences.pageString = interfaceSettings.selected_basePages_str;
    colorMode(RGB);

    app.activeDocument.pasteboardPreferences.pasteboardMargins = [ (width*2.5)+'pt', (height+2.5)+'pt'];

    //clear labels and names before start
    forEach(doc().spreads, function(p) {
        var its = p.pageItems;
        forEach(its, function(i) {
            i.label = "";
            if (i.name.indexOf("eD.mandatory") > -1) i.name = "";
        })
    })
    println("Cleared Item Labels");

    //run1s
    println("xxxxx initing LabelList");
    initLabelList(); // l = ProbToRun from ConceptNet

    println("xxxxx initing Fonts");
    var fts = {}; //initFonts(); //l = ProbToRun from ConceptNet

    println("xxxxx initing Methods");
    pageItemMethods = initPageItemMethods(fts);
    pageMethods = initPageMethods(fts);

    println("xxxxx running SetupMutationMethods");
    runSetupMutationMethods();

    //fazer disto uma checkbox para o user
    //sobrescrever probToRun de move, size, fillColor, textColor, textSize, textfont
    //pageItemMethods.methods.move.probToRun = 1;
    //pageItemMethods.methods.fillColor.probToRun = 1;

    //verificar as probToRun de todos o metodos
    for(var m in pageItemMethods.methods) {
        $.writeln(pageItemMethods.methods[m].name);
        $.writeln(pageItemMethods.methods[m].probToRun);
    }

    println("xxxxx did SetupMutationMethods");

    //TESTE KEYWORDS:
   /* println("xxxxx RUNNING METHODS");
    for (var pagina = 0; pagina < 30; pagina++) {
        var p = duplicatePage(page(17));
        toSave = "";
        for (var i = 0; i < 1; i++) {
            println("RUN " + i)
            toSave += "RUN " + i + "\n";
            var its = items(p);
            its = p.pageItems.everyItem().getElements();
            forEach(its, function(it) {
                selectedItem = it;
                println("Item: " + it.name + "\n");
                toSave += "   Item: " + it.name + "\n"

                pageItemMethods.runAll(p);
            })
        }
        saveString("experiments/experiment_" + (p.name) + ".txt", toSave);
    } */

    /*addSelectionToMandatoryItems();
    println("Added Mandatories");
    createInitialPop([15, 16, 17])
    println("created initpop");
    newPop({
        elite: [18],
        crossoverPairs: [
            [18,20],
            [19,22],
            [18,19],
            [20,25],
            [22,19],
            [21,24],
            [26,23],
            [19,24],
            [19,24],
            [25,21]]
            //,[22,52],[20,60],[25,42],[42,52],[26,64],[23,30],[33,27],[50,42],[54,24],[54,39],[63,54],[53,40],[56,34],[48,39],[28,33],[39,52],[27,25],[26,49],[29,66],[30,63],[24,45],[30,59],[63,65],[35,42],[45,40],[45,63],[25,48],[64,34],[49,27],[40,48],[50,49],[65,43],[28,26],[65,58],[22,55],[53,45],[39,37],[56,42],[54,63]]
    })*/
}

function crossover(parent1, parent2) {
    //crossover 2 
    //1- elementos obrigatorios só podem trocar com eles mesmos
    //2- selecionar uma zona em p1. eliminar esses elementos
    //selecionar a mesma zona em p2. copiar os elementos de p2 para p1
        //function crossover(parent1, parent2) {}

    //crossover 3
    //1- elementos obrigatorios só podem trocar com eles mesmos
    //eliminar gene random em p1
    //copiar para essa posição em gene random de p2;
    //max operações = min(num its n obrigatorios de p1, num its n obrigatorios de p2) 

    var itsP1 = items(parent1).filter(function(i) {
        return (i.parent instanceof Spread)
    })

    var itsP2 = items(parent2);
    var mandItsP2 = [];
    var optItsP2 = [];
    forEach(itsP2, function(item, i) {
        if ((item.parent instanceof Spread)) { //se filho direto da pagina (n esta dentro de rects)
            if (contains(mandatoryItems_names, item.name)) {
                mandItsP2.push(item);
            } else {
                optItsP2.push(item);
            }
        }
    });

    var itsChild = [];
    var itsP1Lng = itsP1.length;

    for (var i = 0; i < itsP1Lng; i++) {
        var randIndex1 = randomInt(0, itsP1.length - 1);
        var randItP1 = itsP1[randIndex1];
        var mandatory = contains(mandatoryItems_names, randItP1.name);

        var finalItem;
        if (randomFloat(0, 1) < .5 || //50% prob de apenas copiar de p1
            (mandatory && mandItsP2.length <= 0) || //ou se ja tiver esgotado os mandatorios de p2
            (!mandatory && optItsP2.length <= 0)) { //ou se ja tiver esgotado os obrigatorios de p2
            finalItem = {
                item: randItP1,
                indexInP1: randIndex1
            }
        } else { //se nao, troca com um de p2

            //MANDATORY
            if (mandatory) {
                logToFile("mandatory1 " + randItP1.name + " " + randItP1.constructor.name)
                var similars = mandItsP2.findAll(function(i2) {
                    return i2.name == randItP1.name
                });

                //NAO HA SEMELHANTES
                if (similars.length <= 0) { //se nao houve semelhantes, apenas copia de apenas p1
                    finalItem = {
                        item: randItP1,
                        indexInP1: randIndex1
                    }
                    logToFile("No similars to " + randItP1.name + " in p2:" + parent2.name);
                    logToFile("copiou  de p1 o item " + randItP1.name + " " + randItP1.constructor.name)

                    //HA SEMELHANTES
                } else {
                    var randomSimilar = similars[randomInt(0, similars.length - 1)];
                    mandItsP2.splice(mandItsP2.indexOf(randomSimilar), 1);
                    finalItem = {
                        item: randomSimilar,
                        indexInP1: randIndex1
                    }
                    logToFile("mandItsP2 size " + mandItsP2.length)
                }

                //OPTIONAL
            } else {
                //fazer tambem a coisa dos semelhantes (com o mesmo nome);
                //se houver uma ccdeira em p2, vou busca-la, se nao, vou buscar outra coisa
                //(so pra saberes daniel do futuro, pode ir buscar um circulo vemelho  mas ja existir um em p1 e entao fica com 2 circulos em p1)

                var randIndexOpt = randomInt(0, optItsP2.length - 1);
                var randomOptional = optItsP2[randIndexOpt];
                optItsP2.splice(randIndexOpt, 1);

                finalItem = {
                    item: randomOptional,
                    indexInP1: randIndex1
                }

            }
        }

        itsP1.splice(randIndex1, 1);
        itsChild.push(finalItem);
    }

    //ordena-los ao contrario de como estavam em p1, para desenhar primeiro os de tras
    itsChild.sort(function(a, b) {
        var res = -1;
        if (a.indexInP1 > b.indexInP1) res = -1;
        return res;
    })

    logToFile("itsP1Lng " + itsP1Lng + " itsChild.length " + itsChild.length)

    var child = addPage();
    //$.writeln("before");
    copyGrid(parent1, child); //TODO?: ou 50% de herdar do p1 ou p2
    //$.writeln("after");

    for (var i = 0; i < itsChild.length; i++) {
        logToFile(itsChild[i].item.name + " " + randItP1.constructor.name)
        itsChild[i].item.duplicate(child);
    }

    if (itsP1Lng != itsChild.length) alert("Crossover resultou em mais elementos do que devia");

    //50% prob de cada item se ajustar???
    //adjustPageToGrid(child); 

    return child;

}

function mutate(pag) {
    if(randomFloat(0,1) < pagMutationProb) {
        logToFile("mutar pag");

        var its = items(page(pag));
        forEach(its, function(i) {
            if(randomFloat(0,1) < itemMutationProb) {
                logToFile("mutar item " + i.name);
                selectedItem = i;
                //pageItemMethods.runAll(pag);
                pageItemMethods.runRandomOne(pag);
            }
        })

    }
}

function createInitialPop(sel_basePag_nums) {
    logToFile("//createInitialPop");
    if (referenceMandatoryItems.length != mandatoryItems_names.length) {
        alert("Error: referenceMandatoryItems and mandatoryItems_names must be the same size")
        return;
    }

    var numSelectedPages = sel_basePag_nums.length;
    var pop_size = interfaceSettings.pop_size;
    pop_pagNums = []; //guardar pags da init pop GERADA (as originais/selecionadas nao são utilizadas na evolução)

    logToFile("//1 — COPY SELECTED PAGES")
    //1 — COPY SELECTED PAGES
    for (var i = 0; i < sel_basePag_nums.length; i++) {
        var missingMandatoriyItems_names = [].concat(mandatoryItems_names);

        //duplicate 
        var p1 = page(sel_basePag_nums[i]);
        var child = duplicatePage(p1);
        var its = p1.pageItems;
        for (var j = its.length - 1; j >= 0; j--) {
            //if it's mandatory, remove from missingMandatoriyItems_names
            var nameIndex = missingMandatoriyItems_names.indexOf(its[j].name);
            if (nameIndex > -1) missingMandatoriyItems_names.splice(nameIndex, 1);
            //remover text overflow
            if(its[j] instanceof TextFrame) solveTextOverflow(it[j]);
        }

        //add mandatory items that did not exist in parent1
        for (var j = missingMandatoriyItems_names.length - 1; j >= 0; j--) {
            var name = missingMandatoriyItems_names[j];
            var missingItem = referenceMandatoryItems.findFirst(function(e) { //TODO: get the missing item from a random page that has one item of that kind
                return e.name == name;
            })
            if (missingItem) {
                var mi = missingItem.duplicate(child);
                //remover text overflow
                if(mi instanceof TextFrame) solveTextOverflow(mi);
            } else logToFile("Could not find missing item named  " + name);
        }

        //add grid if it doesn't have one
        var pp = page();
        page(child);
        var colsCount = child.marginPreferences.columnCount;
        var rowsCount = child.guides.length;
        if(colsCount <= 1 && rowsCount <= 0) {  //se o user nao definiu
            pageMethods.methods.setMargins.run(); //TODO: if margins == default values
            pageMethods.methods.createGrid.run();
        }
        page(pp);

        //add pag to pop list
        pop_pagNums.push(child.name);
        $.writeln(pop_pagNums);
    }

    logToFile("//2 - CREATE REMAINING PAGES BASED ON PREVIOUS ONES")
    //2 - CREATE REMAINING PAGES BASED ON PREVIOUS ONES
    var basePages_nums = [].concat(pop_pagNums);
    if (pop_size < numSelectedPages) pop_size = numSelectedPages;
    var numToCreate = pop_size - numSelectedPages;

    for (var i = 0; i < numToCreate; i++) {
        var possiblePagNums = [].concat(basePages_nums);
        var child, p1 = page(possiblePagNums.spliceRandom(1));

        if (numSelectedPages >= 2) {
            var p2 = page(possiblePagNums.spliceRandom(1));
            child = crossover(p1, p2); //crossover
        } else child = duplicatePage(p1);

        mutate(child); //mutation

        //remover text overflow
        var its = child.pageItems;
        for (var j = 0; j < its.length; j ++) {
            if(its[j] instanceof TextFrame) solveTextOverflow(its[j]);
        }

        pop_pagNums.push(child.name);
        $.writeln(pop_pagNums);
    }

    //$.writeln(pop_pagNums);
    fst_popPagNum = pop_pagNums.sort()[0];
}

function initGeneration(selected_basePages_arr) {
    warnings(false);
    //mode(SILENT);

    //init labels
    //iniit methods

    selected_basePages_nums = selected_basePages_arr;
    createInitialPop(selected_basePages_nums); //gerar pop se nao existem ou nao foram selecionados pop_size individuos 
   
    //$.writeln(pop_pagNums);
    return JSON.stringify(pop_pagNums);
}

function stopEvolution(sorted_fitness) {
    warnings(true);

    //duplicar as pags por ordem de fitness
    var numDuplicatedPages = 0;
    for (var i = sorted_fitness.length - 1; i >= 0; i--) {
        var copy = duplicatePage(page(sorted_fitness[i].pag));

        //anotar fitness ao lado das pags
        page(copy);
        textSize(12);
        text(sorted_fitness[i].fitness, width + 10, 0, 200, 100);
        numDuplicatedPages++;
    }

    //apagar as antigas
    //if(numDuplicatedPages == pop_pagNums.length) 
    deleteOldPop();

    //parar de evoluir
    alert("Evolution ended. You can continue to manually edit pages and/or you can then start evolving again");
    return "OK"
}

function newChild(parent1Pag, parent2Pag) {
    //fileLog += "\nNew child";
    //saveString(logPath, fileLog);

    var parent1 = page(parent1Pag);
    var parent2 = page(parent2Pag);
    //fileLog += "\nP1 " + parent1.name + " P2 " + parent2.name;
    //saveString(logPath, fileLog);

    //crossover: buscar n elementos a cada parent
    var child = crossover(parent1, parent2);
    //fileLog += "\ncrossover done";
    //saveString(logPath, fileLog);

    //mutation: for numMutacoes: buscar um elm random e alterar um propriedade random
    mutate(child);
    //fileLog += "\nmutation done";
    //saveString(logPath, fileLog);

    //all text on top (only for this version)
    sentTextToTop(child);

    return child;
}

function newPop(parents) {
   // $.gc();

    logToFile("-----------New pop\nCreating elite...")

    //elite
    elite_size = parents.elite.length;
    for (var i = 0; i < parents.elite.length; i++) {
        var p = page(parents.elite[i]);
        duplicatePage(p);
        ///page(p);
        //text("ELITE", 100, 100, 100, 100);
    }

    logToFile("-----------Creating children...");

    //parent pairs
    for (var i = 0; i < parents.crossoverPairs.length; i++) {
        logToFile("-----------child number " + i);
        var ps = parents.crossoverPairs[i];
        var p = newChild(ps[0], ps[1]);
    }

    logToFile("-----------Deleting old pop... 1st:" + fst_popPagNum);
    logToFile("-----------pop_pagNums.length: " + pop_pagNums.length);

    //alert("about to delete")
    deleteOldPop();

    logToFile("-----------new pop done");

    return JSON.stringify("-----------New pop has been created");
}

function deleteOldPop() {
    for (var i = 0; i < pop_pagNums.length; i++) {
        page(fst_popPagNum).remove();
    }
}