/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

var csInterface = new CSInterface();
csInterface.requestOpenExtension("com.danifslopes.evodesigner.server", "");
//gen
var selected_base_pags = [], //quais as paginas a considerar 
  current_pop_pags = [],
  satisfying_fitness = 100000;
//other
var current_pop_dir = "";
var fitnessLog = [];
var fitnessCSV = "";
var generatebtn;
var evolving = false;
var curr_num_gens = 0;
var elite_size = 1;
var missingFitnesses = false;

//update array of selected base pages
function updateArrSelectedBasePages() {
  selected_base_pags = pagesStringToArray(interface.selected_basePages_str);
}

window.onload = function () {
  //Interface mostly
  updateSettingsOnInterface();
  evalInterfaceSettings(v => console.log(v));
  updateArrSelectedBasePages();
  //blur events to update user variables
  let inputs = document.getElementsByTagName("input");
  for (let i of inputs) i.onclick = (e) => {
    //mandatory elms
    if (e.target.id === 'mand_elms') {
      csInterface.evalScript("addSelectionToMandatoryItems()", function (r) {
        console.log("Madatory items returned by JSX", r);
        interface.mand_elms = JSON.parse(r);
        updateSettingsOnInterface();
        evalInterfaceSettings(v => console.log(v));
      });
    } else {
      updateInterfaceSettings();
      updateArrSelectedBasePages();
    }
  }
  //click events
  window.onclick = function (e) {
    let t = e.target;
    //Generate button
    if (t.id === 'generatebtn') {
      console.log("generate btn pressed");
      if (!evolving) {
        t.innerHTML = "Stop Generation";
        init();
      } else t.innerHTML = "Generate";
      evolving = !evolving;
    }
    //hierarchy buttons
    else if (t.classList.contains('addLevel')) {
      let t = e.target;
      let inputlist = t.offsetParent;
      console.log(t, inputlist);
      addItemInInputList(inputlist);
    } else if (t.classList.contains('removeLevel')) {
      let t = e.target;
      let inputlist = t.offsetParent;
      removeItemInInputList(inputlist);
    }
  }
  
  //on dragging interface sliders
  let inputcombosliders = document.getElementsByClassName("inputcomboslider");
  for (let s of inputcombosliders) {
    s.oninput = e => {
      e.preventDefault();
      let numberInput = document.getElementById(e.target.id.replace("Range", ""));
      numberInput.value = e.target.value;
    }

    s.onchange = getSettingsFromInterface;

  }
}

function fetchServer(data, callback) {
  fetch("http://localhost:8088/fromExtension", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    response.json().then(function (json_response) {
      console.log(json_response);
      callback(json_response);
    })
  })
}

function init() { //overall init
  fitnessLog = [];
  fitnessCSV = [];

  console.log("0 - init")
  updateInterfaceSettings(function (v) {
    curr_num_gens = interface.max_num_gens;
    updateArrSelectedBasePages();

    fetchServer({
      type: 'clearPopFolder',
      content: {}
    }, json => {
      if (json.content == "OK") {
        console.log("Pop folder has been cleared");
        initGeneration();
      } else console.error("could not clear pop folder")
    })
  });
}

var initStamp = 0;
function initGeneration() {
  initStamp = Date.now();

  console.log("1 - initGeneration")
  //initGeneration
  let selected_basePages_str = JSON.stringify(selected_base_pags);
  console.log(selected_basePages_str);

  csInterface.evalScript("initGeneration(" + selected_basePages_str + ")", function (pop_pagNums) {
    console.log("JSX: initGeneration(). Pag numbers of pop: " + pop_pagNums);
    current_pop_pags = JSON.parse(pop_pagNums);
    current_pop_pags.sort();
    exportPopAndInformServer();
  });
}

function exportPopAndInformServer() {
  console.log("2 - JSX is exporting pop...")
  missingFitnesses = true;

  //AQUI: desconnecta enquanto exporta pop!!!! O sistema para aqui!!!

  csInterface.evalScript("exportPop()", function (curr_pop_dir) {
    console.log("JSX: Pop was exported to folder: " + curr_pop_dir);
    current_pop_dir = curr_pop_dir;
    //tellExtensionServerToClassifyPop2(current_pop_dir);
    checkNumPNGsInPopFolder(current_pop_dir);
  });

}

function checkNumPNGsInPopFolder(current_pop_dir) {
  console.log("3.1 - Tell server to check if all pngs are in folder");

  fetchServer({
    type: 'checkNumPNGsInPopFolder',
    content: {}
  }, json => {
    console.log("3.3 - Server did check num pngs");

    if (json.numPNGs == Number(interface.pop_size)) {
      console.log("3.4 - OK, all PNGs are in folder");
      tellExtensionServerToClassifyPop(current_pop_dir);

    } else if (evolving) setTimeout(function () {
      console.log("3.4 - Not all PNGs were in folder yet. Verifying again...");
      checkNumPNGsInPopFolder(current_pop_dir);
    }, 200)
  })

}

function tellExtensionServerToClassifyPop(curr_pop_dir) {
  console.log("4 - Tell server to classify pop")

  fetchServer({
    type: 'onPopExported',
    content: {
      gen: (interface.max_num_gens - curr_num_gens + 1),
      curr_pop_dir: curr_pop_dir,
      elite_size: elite_size,
      pop_size: interface.pop_size,
      fst_pop_pag: Number(current_pop_pags[0])
    }
  }, json => {
    onFitnessReceived(json.content);
  })

}

function onFitnessReceived(fitness_values) {
  console.log("7 - Handling fiteness values (onFitnessReceived)");
  missingFitnesses = false;

  // [ {pag: 4, fitness: 5000, novelty: 4000, balance: 3000, etc..., imgName:'02.png'} ]
  //fitness_values = JSON.parse(fitness_values);
  //ordenar do maior para menor
  fitness_values.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });

  console.log("Fitness values:", fitness_values);

  fitnessCSV += (interface.max_num_gens - curr_num_gens + 1) + ";";
  fitnessCSV += fitness_values[0].fitness + ";";
  var avg = 0;
  for (var i = 0; i < fitness_values.length; i++) {
    avg +=fitness_values[i].fitness;
  }
  avg = avg/fitness_values.length;
  fitnessCSV += avg + "\n";

  fitnessLog.push({
    gen: interface.max_num_gens - curr_num_gens + 1,
    best: fitness_values[0].fitness,
    fitness_values: fitness_values
  });

  //se encontrou um individuo otimo, envia comando jsx para parar a evolução e ordenar pop do pior para o melhor
  if (fitness_values[0].fitness >= satisfying_fitness || !evolving || curr_num_gens < 1)
    stopEvolution(fitness_values);

  //se nao, cria uma nova geracao
  else newGeneration(fitness_values);
}

function stopEvolution(sorted_fitness = []) {

  console.log("7 - stopEvolution");
  evolving = false;
  var sorted_fitness_str = JSON.stringify(sorted_fitness);
  csInterface.evalScript("stopEvolution(" + sorted_fitness_str + ")", function (r) {
    console.log(r)
  });

  console.log(fitnessLog);
  fitnessCSV = fitnessCSV.replace(/\./g, ',')
  console.log(fitnessCSV);
  console.log(initStamp, Date.now());
  localStorage.fitnessCSV = fitnessCSV;
  localStorage.time = (Date.now()-initStamp);
  document.getElementById("generatebtn").innerHTML = "Generate";

  download("fitness_"+Date.now()+".csv", fitnessCSV);
  download("timePassed_"+Date.now()+".csv", Date.now()-initStamp);
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function randomPag(fitness_values) {
  var randomIndex = randomInt(0, fitness_values.length - 1);
  return fitness_values[randomIndex];
}

function selectPagNumByTournament(fitness_values) {
  var pag1 = randomPag(fitness_values),
    pag2 = randomPag(fitness_values);
  while (pag2.pag == pag1.pag && evolving) pag2 = randomPag(fitness_values);

  return pag1.fitness > pag2.fitness ? pag1 : pag2;
}

function newGeneration(fitness_values) {
  console.log("8 - Generation:", interface.max_num_gens - curr_num_gens + 1);

  if (fitness_values.length < 2) {
    console.log("Population is too small. Make sure there's at least 2 individuals")
    csInterface.evalScript("alert('Population is too small. Make sure there's at least 2 individuals')");
    return;
  }

  var parents = {
    elite: [],
    crossoverPairs: []
  };

  //ellite (pick best)
  console.log("Selecting elite");
  fitness_values.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });
  for (let i = 0; i < elite_size; i++)
    parents.elite.push(fitness_values[i].pag);

  //tournament
  console.log("Selecting parents by tornament");
  for (let i = 0; i < interface.pop_size - elite_size; i++) {
    var parent1 = selectPagNumByTournament(fitness_values),
      parent2 = selectPagNumByTournament(fitness_values);
    while (parent2.pag == parent1.pag && evolving) parent2 = selectPagNumByTournament(fitness_values);
    parents.crossoverPairs.push([parent1.pag, parent2.pag])
  }

  console.log(parents);

  //criar filhos e eliminar old pop
  console.log("Asking JSX to create children");
  var parents_str = JSON.stringify(parents);
  csInterface.evalScript("newPop(" + parents_str + ")", function (r) {
    console.log("JSX tried to create new pop: " + r);
    //send to evaluation
    if (r !== "EvalScript error.") {
      exportPopAndInformServer();
      curr_num_gens--;
    } else {
      console.error("Old pop could not be defined or something")
      stopEvolution();
    }
  });

}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}