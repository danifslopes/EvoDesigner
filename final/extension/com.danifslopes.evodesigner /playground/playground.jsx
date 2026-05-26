// @include ../js/libs/basiljs/basil.js

//pageItems.everyItem().getElements()

#includepath "/Users/danifslopes/Library/Application Support/Adobe/CEP/extensions/com.danifslopes.evodesigner";

//#include "js/libs/seedrandom.js";

//Math.seedrandom("d6");

#include "js/libs/http/http.jsx";

#include "js/utils/utils.jsx";

#include "js/utils/evolutionUtils.jsx";

#include "js/labels.jsx";

#include "js/utils/mutationUtils.jsx";

#include "js/methods.jsx";

var basilPath, extensionName, extensionFolder, current_pop_dir;
var interfaceSettings = { //imported from main.js
    keywords: [""],
    mandatory_tools: [""],
    mandatory_props: ["randomRed"],
    mand_elms: [],
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
var pagMutationProb = 1.1;
var itemMutationProb = 0.1;
var percItemsToMutate = 1;
var needsInit = false;

//corre quando a extensão é iniciada
function setup() {
    basilPath = $.fileName;
    extensionName = "com.danifslopes.evodesigner";
    extensionFolder = basilPath.substring(0, basilPath.indexOf(extensionName)) + extensionName;
    current_pop_dir = extensionFolder + "/server/public/current_pop";
    logPath = extensionFolder + "/server/debug_file.txt";
    colorMode(RGB);
    app.activeDocument.pasteboardPreferences.pasteboardMargins = [(width * 2.5) + 'pt', (height + 2.5) + 'pt'];

    init();

    $.writeln("---");
    //updateProbsToRun();
    //oneClickStylise(100, 5, ["fillColor", "textColor"]);
    /*runMeth("pageItemMethods", "textFont", {
         subMethod: "oneRandom",
         //constant: "",
         //defaultAxes: true
     });*/
    /*selections(function (item, loopcount) {
        $.writeln(item.constructor.name)
    })*/

    $.writeln("playground running");
}

function init() {
    clearMandatoryItems();
    initLabelList();
    var fts = initFonts(); //adiciona labels à labels list
    initAllMutationMethods(fts);
    initSwatches();

    //font
    //TODO: create character and paragrah styles with 1 or more fonts
    //pageMethods.methods.textFont.run();
    //$.writeln("Defined global text font.")

    //fontSize
    //pageMethods.methods.textSize.run();
    //$.writeln("Defined global text size")

    //deleteUnusedColorGroups(); //ja é feito no initSwatches. delete se calhar
    return "OK"
}


//TODO: samename items crossover with eatch other (ignore mandatory)
function crossover(parent1, parent2) {
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

//outra op seria: correr todos os metodos; se metodo correr, escolher um item random para ser mutado
function mutate(pag, overwriteMutationProb) {
    if (!overwriteMutationProb) overwriteMutationProb = itemMutationProb;

    if (randomFloat(0, 1) < pagMutationProb) {
        logToFile("mutar pag");
        //todo: mutar apenas flhos do spread? o que acontece com grupos? desagrupa? ou muta o grupo?
        var its = items(page(pag));
        var countMutated = 0;
        forEach(its, function(i) {
            if (randomFloat(0, 1) < overwriteMutationProb) {
                countMutated++;
                selectedItem = i;
                //pageItemMethods.runAll(pag);
                pageItemMethods.runRandomOne(pag);
            }
        })

    }
    initCommonVars();
    $.writeln("mutate pag " + page().name + " " + countMutated + " times")
    return "mutate pag " + page().name + " " + countMutated + " times"
}

function mutateGivenNumItems(pag, overwriteMutationProb) {
    if (!overwriteMutationProb) overwriteMutationProb = percItemsToMutate;

    if (randomFloat(0, 1) < pagMutationProb) {
        //todo: mutar apenas flhos do spread? o que acontece com grupos? desagrupa? ou muta o grupo?
        var its = items(page(pag));

        var totalItems = its.length;
        var numItemsToMutate = ceil(overwriteMutationProb * totalItems);
        alert(numItemsToMutate);

        var countMutated = 0;
        for (var i = 0; i < numItemsToMutate; i++) {
            selectedItem = its.spliceRandom();
            countMutated++;
            pageItemMethods.runRandomOne(pag);
        }
    }

    initCommonVars();
    $.writeln("mutate pag " + page().name + " " + countMutated + " times")
    return "mutate pag " + page().name + " " + countMutated + " times"
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

//——————

function manualMutateSelected(itemMutationProb) {
    var pag = app.activeWindow.activePage;
    return mutateGivenNumItems(pag, Number(itemMutationProb));
}

function updateKeywords(ks) {
    //needsInit = true;
    interfaceSettings.keywords = ks
    return JSON.stringify(ks);
}

function updateConceptAlgoritm(ks) {
    //needsInit = true;
    interfaceSettings.conceptAlgorithm = ks
    return JSON.stringify(ks);
}

function oneClickStylise(mutProb, numPags, mandatoryTools) {
    inspect(mutProb)
    inspect(numPags)

    println("xxxxx RUNNING METHODS");
    var active_page = app.activeWindow.activePage;
    //quantos filhos
    for (var pagina = 0; pagina < Number(numPags); pagina++) {
        var p = duplicatePage(active_page);
        page(p);

        //todo: so se nao tiver
        pageMethods.methods.setMargins.run({});
        pageMethods.methods.createGrid.run();

        //quantos ciclos de mutação 
        for (var i = 0; i < 1; i++) {
            println("RUN " + i);
            //var its = items(p);
            its = p.pageItems.everyItem().getElements(); //selectiona todos os items
            //for cada item
            forEach(its, function(it) {

                if (Math.random() * 100 <= mutProb) {
                    selectedItem = it;
                    selection(selectedItem);

                    //pageItemMethods.runAll(p);
                    for (var k in pageItemMethods.methods) {
                        var m = pageItemMethods.methods[k];

                        var isMandatory = mandatoryTools.findFirst(function(tool) {
                            return tool.label == m.name;
                        })

                        //usar so de metodos de evolução?
                        var canUse = !m.hasOwnProperty("ignoreInEvolution") || (m.ignoreInEvolution == false)

                        //se nao é texto, retirar meths de texto
                        var toIgnore = !(selectedItem instanceof TextFrame) && m.type == "text"

                        var passedProb = Math.random() < Math.pow(m.probToRun, probToRunMethodsExponent);

                        if ((passedProb || isMandatory) && canUse && !toIgnore) {
                            //runMeth("pageItemMethods", m.name, {});
                            m.run({
                                //evolutionMethodsOnly: true
                                evolution: true
                            });
                        }
                    }


                }


            })
        }

        //TODO: correr todos os pageMethods mandatorios, nao so o background
        var backIsMandatory = mandatoryTools.findFirst(function(tool) {
            return tool.label == "createBackground";
        })
        if (Math.random() < Math.pow(pageMethods.methods.createBackground.probToRun, probToRunMethodsExponent) || backIsMandatory) {
            pageMethods.methods.createBackground.run({});
        }
    }

    return numPags + ' pages were created and stylised for the keywords "' + interfaceSettings.keywords + '".';
}