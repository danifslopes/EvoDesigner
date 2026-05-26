// @include js/libs/basiljs/basil.js
#includepath "/Users/danifslopes/Library/Application Support/Adobe/CEP/extensions/com.danifslopes.evodesigner";
#include "js/libs/seedrandom.js"
Math.seedrandom("d1");

#include "js/mutation/mutationUtils.jsx";
#include "js/mutation/methods.jsx";

function setup() {
    basilPath = $.fileName;
    extensionName = "com.danifslopes.evodesigner";
    extensionFolder = basilPath.substring(0, basilPath.indexOf(extensionName)) + extensionName;
    current_pop_dir = extensionFolder + "/server/public/current_pop";
    logPath = extensionFolder + "/server/debug_file.txt";

    pageItemMethods = initPageItemMethods(fts);
    pageMethods = initPageMethods(fts);

    selectedPage = page(15);
    pageMethods.methods.createGrid;
    inspect(page(15).guides);

}



