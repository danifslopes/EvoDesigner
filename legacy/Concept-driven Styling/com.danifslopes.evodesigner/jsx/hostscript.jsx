/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

// @include ../js/libs/basiljs/basil.js

#includepath "/Users/danifslopes/Library/Application Support/Adobe/CEP/extensions/com.danifslopes.evodesigner";

#include "../js/libs/seedrandom.js"
Math.seedrandom("d2");

#include "../js/mutation/properties.js";

#include "../js/mutation/methods.jsx";

var basilPath, extensionName, extensionFolder, current_pop_dir;
var interfaceSettings = { //imported from main.js
    selected_basePages_str: "1-"
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

function logToFile(txt) {
    //fileLog += "\n" + txt;
    //saveString(logPath, fileLog);
}

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

    //clear labels and names before start
    forEach(doc().pages, function(p) {
        var its = items(p);
        forEach(its, function(i) {
            i.label = "";
            if (i.name.indexOf("eD.mandatory") > -1) i.name = "";
        })
    })

    
}

function updateInterfaceSettings(settings) {
    for (var key in settings) interfaceSettings[key] = settings[key];
    return "OK"
}

function exportPop() { //guardar pop na pasta current_pop
    //export elite
    var elite_pags = [].concat(pop_pagNums);
    elite_pags = elite_pags.splice(0, elite_size);
    var elite_str = elite_pags.join(",");

    app.pngExportPreferences.pageString = elite_str;
    savePNG(current_pop_dir + "/e_0.png", false);

    //export other pages
    var other_pags = [].concat(pop_pagNums);
    other_pags = other_pags.splice(elite_size, other_pags.length - elite_size);
    var others_str = other_pags.join(",");

    app.pngExportPreferences.pageString = others_str;
    savePNG(current_pop_dir + "/o_0.png", false);

    return current_pop_dir;
}

function removeMandatoryItem(id) {
    var it = referenceMandatoryItems.find(function(e) {
        return e.id = id;
    });
    var i = referenceMandatoryItems.indexOf(it);
    referenceMandatoryItems.splice(i, 1);
    mandatoryItems_names.splice(i, 1);

    var toReturn = [];
    for (var i = 0; i < referenceMandatoryItems.length; i++) {
        toReturn.push({
            name: referenceMandatoryItems[i].name,
            id: referenceMandatoryItems[i].id
        })
    }
    return JSON.stringify(toReturn);
}

function clearMandatoryItems() {
    for (var i = 0; i < referenceMandatoryItems.length; i++) {
        referenceMandatoryItems[i].label = "";
        if (referenceMandatoryItems[i].name.indexOf("eD.mandatory") > -1) referenceMandatoryItems[i].name = "";
    }
    mandatoryItems_names = [];
    referenceMandatoryItems = [];
    return "[]";
}

function addSelectionToMandatoryItems() {
    var toReturn = [];

    //adicionar items selecionados
    selections(function(item, i) {
        label(item, "eD.mandatory");
        if (item.name == "") item.name = "eD.mandatory" + i;
        if (mandatoryItems_names.indexOf(item.name) <= -1) {
            if (!(item instanceof Image)) {
                referenceMandatoryItems.push(item);
                mandatoryItems_names.push(item.name);
            }
        }
    })

    for (var i = 0; i < referenceMandatoryItems.length; i++) {
        /*toReturn.push({
            name: referenceMandatoryItems[i].name,
            id: referenceMandatoryItems[i].id
        })*/
        toReturn.push(referenceMandatoryItems[i].id);
    }

    return JSON.stringify(toReturn);
}

function duplicatePage(pag) {
    var its = items(pag);
    var newPage = addPage();
    for (var i = its.length - 1; i >= 0; i--) {
        if (!(its[i] instanceof Image))
            its[i].duplicate(newPage);
    }
    return newPage;
}

//crossover 1
//mau porque os individuos começam a ficar muito grandes
/*function crossover(parent1, parent2) {
    var child = addPage();
    //escolher random quantos passar do p1 (min1)
    duplicateRandomNumItems(parent1, child);
    //escolher random quandos passam  do p2 (min1)
    duplicateRandomNumItems(parent2, child, true);
    return child;
}*/

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

function crossover(parent1, parent2) {
    var itsP1 = items(parent1).filter(function(i) {
        return (i.parent instanceof Spread)
    })

    var itsP2 = items(parent2);
    var mandItsP2 = [];
    var optItsP2 = [];
    forEach(itsP2, function(item, i) {
        if ((item.parent instanceof Spread)) { //se primeiro filho da pagina (n esta dentro de nada)
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

    //ordena-los ao contrario de como estavam em p1
    //para desenhar primeiro os de tras
    itsChild.sort(function(a, b) {
        var res = -1;
        if (a.indexInP1 > b.indexInP1) res = -1;
        return res;
    })

    logToFile("itsP1Lng " + itsP1Lng + " itsChild.length " + itsChild.length)

    var child = addPage();
    for (var i = 0; i < itsChild.length; i++) {
        logToFile(itsChild[i].item.name + " " + randItP1.constructor.name)
        itsChild[i].item.duplicate(child);
    }

    if (itsP1Lng != itsChild.length) alert("Crossover resultou em mais elementos do que devia");


    return child;

}

function mutate(pag) {
    pageMethods.runAll(pag);

    var its = items(page(pag));
    forEach(its, function(i) {
        selectedItem = i;
        pageItemMethods.runAll(pag);
    })
}

function createInitialPop(sel_basePag_nums) {
    if (referenceMandatoryItems.length != mandatoryItems_names.length) {
        alert("Error: referenceMandatoryItems and mandatoryItems_names must be the same size")
        return;
    }

    var numSelectedPages = sel_basePag_nums.length;
    var pop_size = interfaceSettings.pop_size;
    pop_pagNums = []; //guardar pags da init pop GERADA (as originais/selecionadas nao são utilizadas na evolução)

    //1 — COPY SELECTED PAGES
    for (var i = 0; i < sel_basePag_nums.length; i++) {
        var missingMandatoriyItems_names = [].concat(mandatoryItems_names);

        //duplicate 
        var p1 = page(sel_basePag_nums[i]);
        var child = addPage();
        var its = items(p1);
        for (var j = its.length - 1; j >= 0; j--) {
            if (its[j].parent instanceof Spread) {
                var newItem = its[j].duplicate(child);
                //if it's mandatory, remove from missingMandatoriyItems_names
                var nameIndex = missingMandatoriyItems_names.indexOf(newItem.name);
                if (nameIndex > -1) missingMandatoriyItems_names.splice(nameIndex, 1);
            }
        }

        //add mandatory items that did not exist in parent1
        for (var j = missingMandatoriyItems_names.length - 1; j >= 0; j--) {
            var name = missingMandatoriyItems_names[j];
            var missingItem = referenceMandatoryItems.findFirst(function(e) { //TODO: get the missing item from a random page that has one item of that kind
                return e.name == name;
            })
            if (missingItem) missingItem.duplicate(child);
            else logToFile("Could not find missing item named  " + name);
        }

        //add pag to pop list
        pop_pagNums.push(child.name);
    }

    //2 - CREATE REMAINING PAGES BASED ON PREVIOUS ONES
    var basePages_nums = [].concat(pop_pagNums);

    if (pop_size < numSelectedPages) pop_size = numSelectedPages;
    var numToCreate = pop_size - numSelectedPages;

    var duplicationMethod = "mutation";
    if (numSelectedPages >= 2) duplicationMethod = "both";

    for (var i = 0; i < numToCreate; i++) {
        var child;
        if (duplicationMethod == "both") {
            //pick parents
            var p1Index = basePages_nums[randomInt(0, basePages_nums.length - 1)];
            var p2Index = basePages_nums[randomInt(0, basePages_nums.length - 1)];
            while (p1Index == p2Index) p2Index = basePages_nums[randomInt(0, basePages_nums.length - 1)];
            var p1 = page(p1Index),
                p2 = page(p2Index);
            child = crossover(p1, p2); //crossover
            mutate(child); //mutation

        } else {
            //pick parent
            var p1Index = basePages_nums[randomInt(0, basePages_nums.length - 1)];
            var p1 = page(p1Index);
            child = duplicatePage(p1);
            mutate(child); //mutation
        }

        pop_pagNums.push(child.name);
    }

    fst_popPagNum = pop_pagNums.sort()[0];

}

function warnings(on) {
    if (on) app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
    else app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
}

function initGeneration(selected_basePages_arr) {
    warnings(false);
    mode(SILENT);
    selected_basePages_nums = selected_basePages_arr;

    createInitialPop(selected_basePages_nums); //gerar pop se nao existem ou nao foram selecionados pop_size individuos 
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

    mode(VISIBLE);

    //parar de evoluir
    alert("Evolution ended. You can continue to manually edit pages and/or you can then start evolving again");
    return "OK"
}

//nao funciona como queria
function equal(obj1, obj2) {
    var props1 = JSON.parse(JSON.stringify(obj1.properties));
    delete props1.id;
    delete props1.index;
    props1 = JSON.stringify(props1);

    var props2 = JSON.parse(JSON.stringify(obj2.properties));
    delete props2.id;
    delete props2.index;
    props2 = JSON.stringify(props2);

    return props1 == props2;
}

function thereIsNoSimilarItems(item, page) {
    var its = items(page);
    for (var j = i + 1; j < its.length; j++) {
        if (equal(item, its[j])) return false;
        break;
    }
    return true;
}

function duplicateRandomNumItems(parent, child, checkEquals) {
    //duplica items pela ordem que  aparecem na página pai
    //TODO: método para ducplicar por ordem random? (ver versoes antigas)
    //TODO: método para colocar um item duplicado num z-indez random (items do parent2 poderem ficar atras de itms do parent1)?

    var pItems = [];
    items(parent, function(item, i) {
        pItems.push({
            item: item,
            zIndex: i
        });
    });

    //pick genes to pass
    var numGenesFromP1 = randomInt(1, pItems.length - 1);
    var itsToDuplicate = [];
    for (var i = 0; i < numGenesFromP1; i++) {
        var it = pItems[randomInt(0, pItems.length - 1)];
        itsToDuplicate.push(it);
        pItems.splice(index, 1);
    }

    //sort by z-index
    itsToDuplicate.sort(function(a, b) {
        var r = 1;
        if (a.zIndex < b.zIndex) r = -1;
        return r;
    });

    //duplicate
    for (var i = 0; i < itsToDuplicate.length; i++) {
        var index = itsToDuplicate[i].zIndex;
        var item = items(parent)[index];

        //$.writeln(index);

        if (checkEquals && thereIsNoSimilarItems(item, child)) item.duplicate(child);
        else item.duplicate(child);
    }
}

function sentTextToTop(pag) {
    var its = items(page(pag));
    forEach(its, function(i) {
        if (i instanceof TextFrame) {
            arrange(i, FRONT);
        }
    });
}

function newChild(parent1Pag, parent2Pag) {
    fileLog += "\nNew child";
    saveString(logPath, fileLog);

    var parent1 = page(parent1Pag);
    var parent2 = page(parent2Pag);
    fileLog += "\nP1 " + parent1.name + " P2 " + parent2.name;
    saveString(logPath, fileLog);

    //crossover: buscar n elementos a cada parent
    var child = crossover(parent1, parent2);
    fileLog += "\ncrossover done";
    saveString(logPath, fileLog);

    //mutation: for numMutacoes: buscar um elm random e alterar um propriedade random
    mutate(child);
    fileLog += "\nmutation done";
    saveString(logPath, fileLog);

    //all text on top (only for this version)
    sentTextToTop(child);

    return child;
}

var elite_size = 1;

function newPop(parents) {
    logToFile("New pop\nCreating elite...")

    //elite
    elite_size = parents.elite.length;
    for (var i = 0; i < parents.elite.length; i++) {
        var p = page(parents.elite[i]);
        duplicatePage(p);
        ///page(p);
        //text("ELITE", 100, 100, 100, 100);
    }

    logToFile("Creating children...");

    //parent pairs
    for (var i = 0; i < parents.crossoverPairs.length; i++) {
        logToFile("child number " + i);
        var ps = parents.crossoverPairs[i];
        var p = newChild(ps[0], ps[1]);
    }

    logToFile("Deleting old pop... 1st:" + fst_popPagNum);
    logToFile("pop_pagNums.length: " + pop_pagNums.length);

    //alert("about to delete")
    deleteOldPop();

    logToFile("new pop done");
    return JSON.stringify("New pop has been created");
}

function deleteOldPop() {
    for (var i = 0; i < pop_pagNums.length; i++) {
        page(fst_popPagNum).remove();
    }
}