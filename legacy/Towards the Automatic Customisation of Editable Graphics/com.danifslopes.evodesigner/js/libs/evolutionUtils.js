function contaTextos() {
    var count = 0;
    var its = page(16).pageItems;
    forEach(its, function (it) {
        if (it instanceof TextFrame) count++;
    })
    if (count > 2) alert("+ de 2 textos");
}

function updateInterfaceSettings(settings) {
    for (var key in settings) interfaceSettings[key] = settings[key];

    keywords = interfaceSettings.keywords;
    conceptNumbers = keywords.filter(function (v) {
        return Number(v)
    });
    conceptNumbers = conceptNumbers.map(function (v) {
        return Number(v)
    });

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
    var it = referenceMandatoryItems.find(function (e) {
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
    selections(function (item, i) {
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
    var sp = doc().spreads[pag.documentOffset];
    if (sp.pages[0].id != pag.id) alert("fuck, duplicatePage ano foi buscar a pag certa");
    var newSpread = doc().spreads[pag.documentOffset].duplicate(LocationOptions.AT_END);
    //TODO: copy  grid from all the pages of the spread
    //copyGrid(pag, newSpread.pages[0]);
    return newSpread.pages[0];
}

function copyGrid(fromPage, toPage) {
    var pp = page();
    var p1 = fromPage;
    var p2 = toPage;
    //MARGIN
    page(p2);
    margins(p1.marginPreferences.top, p1.marginPreferences.right, p1.marginPreferences.bottom, p1.marginPreferences.left);
    //COLUMNS
    //var cols = p1.marginPreferences.columnsPositions;
    p2.marginPreferences.columnCount = p1.marginPreferences.columnCount;
    p2.marginPreferences.columnGutter = p1.marginPreferences.columnGutter;
    //ROWS
    for (var i = p2.guides.length - 1; i >= 0; i--) {
        p2.guides[i].remove();
    }
    page(p2);
    for (var i = p1.guides.length - 1; i >= 0; i--) {
        guideY(p1.guides[i].location);
    }
    page(pp);
}

function updateGuides(ptop, pbottom) {
    if(page().guides.length <=0) alert("sem guuias");
    //mapear as guides atuais para o novo topo e novo bottom
    var rows = objPropsToArray(page().guides, "location");
    var ms = page().marginPreferences;
    var ntop = ms.top;
    var nbottom = height - ms.bottom;
    //apagar anteriores
    for (var i = page().guides.length - 1; i >= 0; i--) page().guides[i].remove();
    //desenhar novas
    for (var i = 0; i < rows.length; i++) {
        var newPos = map(rows[i], ptop, pbottom, ntop, nbottom);
        guideY(newPos);
    }
}

function warnings(on) {
    if (on) app.scriptPreferences.userInteractionLevel = UserInteractionLevels.INTERACT_WITH_ALL;
    else app.scriptPreferences.userInteractionLevel = UserInteractionLevels.NEVER_INTERACT;
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
    items(parent, function (item, i) {
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
    itsToDuplicate.sort(function (a, b) {
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
    forEach(its, function (i) {
        if (i instanceof TextFrame) {
            arrange(i, FRONT);
        }
    });
}