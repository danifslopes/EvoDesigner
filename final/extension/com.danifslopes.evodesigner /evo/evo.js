/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

var csInterface = new CSInterface();
csInterface.requestOpenExtension("com.danifslopes.evodesigner.server", "");
//EVO VARS
var current_pop_pags = [];
var satisfying_fitness = 1; //0.999;
var evolving = false;
var curr_num_gens = 0;

//OTHER VARS
var current_pop_dir = "";
var fitnessLog = [];
var fitnessCSV;
var missingFitnesses = false;
var initStamp = 0;

function fetchWithTimeout(url, options, timeout = 40000) {
  return Promise.race([
    fetch(url, options),
    new Promise((resolve, reject) =>
      setTimeout(() => {
        reject("Ext Says: Server taking too long. Trying again...");
      }, timeout)
    )
  ]);
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

  }).catch(err => {
    logToUser(err);
    //fetchServer(data, callback);
  })
}

//PROGRAM INIT 
function init() {
  logToUser("Initiating...");
  fitnessLog = [];
  fitnessCSV = "gen;bestFitness;avgFitness;penalisedFitnessOFTheBest;avgPenalisedFitness;novelty of best;balance of best;legibility of best;weightedNovelty of best;weightedBalance of best;weightedLegibility of best\n";

  ui.elite_size = ui.algorithm == "genetic" ? elite_size_genetic : elite_size_climber;

  console.log("0 - init")
  getAndUpdateInterfaceSettings(function () {
    curr_num_gens = ui.max_num_gens;
    updateArrSelectedBasePages();

    fetchServer({
      type: 'clearPopFolder',
      content: {}
    }, json => {
      if (json.content === "OK") {
        console.log("Pop folder has been cleared");
        initGeneration();
      } else console.error("could not clear pop folder")
    })
  });

}

//EVO INIT
function initGeneration() {
  initStamp = Date.now();
  console.log("1 - initGeneration")
  //initGeneration
  let selected_basePages_str = JSON.stringify(selected_base_pags);
  //console.log(selected_basePages_str);
  logToUser("Initiating evolution... Base pages: " + selected_basePages_str);

  csInterface.evalScript("initGeneration(" + selected_basePages_str + ")", function (pop_pagNums) {
    //console.log("JSX: initGeneration(). Pag numbers of pop: " + pop_pagNums);
    logToUser("Population pages: " + pop_pagNums);
    current_pop_pags = JSON.parse(pop_pagNums);
    current_pop_pags.sort();
    exportPopAndInformServer(true);
  });
}

function exportPopAndInformServer(init = false) {
  //console.log("2 - JSX is exporting pop...")
  logToUser("Exporting population...");
  missingFitnesses = true;
  csInterface.evalScript("exportPop(" + init + ")", function (curr_pop_dir) {
    //console.log("JSX: Pop was exported to folder: " + curr_pop_dir);
    current_pop_dir = curr_pop_dir;
    //tellExtensionServerToClassifyPop2(current_pop_dir);
    checkNumPNGsInPopFolder(current_pop_dir);
  });

}

function checkNumPNGsInPopFolder(current_pop_dir) {
  //console.log("3.1 - Tell server to check if all pngs are in folder");

  fetchServer({
    type: 'checkNumPNGsInPopFolder',
    content: {}
  }, json => {
    //console.log("3.3 - Server did check num pngs");

    if (json.numPNGs === Number(ui.pop_size)) {
      //console.log("3.4 - OK, all PNGs are in folder");
      tellExtensionServerToClassifyPop(current_pop_dir);

    } else if (evolving) setTimeout(function () {
      console.log("3.4 - Not all PNGs were in folder yet. Verifying again...");
      checkNumPNGsInPopFolder(current_pop_dir);
    }, 200)
  })

}

function tellExtensionServerToClassifyPop(curr_pop_dir) {
  //console.log("4 - Tell server to classify pop")
  logToUser("Evaluating generation " + (ui.max_num_gens - curr_num_gens));

  let elite_size = ui.elite_size;

  fetchServer({
    type: 'onPopExported',
    content: {
      gen: (ui.max_num_gens - curr_num_gens + 1),
      curr_pop_dir: curr_pop_dir,
      elite_size: elite_size,
      pop_size: ui.pop_size,
      fst_pop_pag: Number(current_pop_pags[0])
    }
  }, json => {
    if (json.type == "cancel") {
      csInterface.evalScript("alert('" + json.content.msg + "')", function (r) {
        //stopEvolution();
        //tellExtensionServerToClassifyPop(curr_pop_dir);
      });

    } else onFitnessReceived(json.content);
  })

}

function standardDeviation(values){
  const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
  const squareDiffs = values.map(value => Math.pow(value - avg, 2));
  const avgSquareDiff = squareDiffs.reduce((sum, diff) => sum + diff, 0) / squareDiffs.length;
  return Math.sqrt(avgSquareDiff);
}

function calcWeightedFitness(posterFitnessObj) {
  var noveltyWeight = (ui.noveltyValue / 100);
  var balanceWeight = (ui.balanceValue / 100);
  var legibilityWeight = (ui.legibilityValue / 100);

  //adjust ui weights to always sum up 1 (e.g. if balance is 0, novelty and leg will wight 0.5 each)
  var weightsSum = noveltyWeight + balanceWeight + legibilityWeight;
  noveltyWeight = weightsSum == 0 ? 0 : noveltyWeight / weightsSum;
  balanceWeight = weightsSum == 0 ? 0 : balanceWeight / weightsSum;
  legibilityWeight = weightsSum == 0 ? 0 : legibilityWeight / weightsSum;

  //calcular fitness pesada
  var weightedNovelty = posterFitnessObj.novelty * noveltyWeight;
  var weightedBalance = posterFitnessObj.balance * balanceWeight;
  var weightedLegibility = posterFitnessObj.legibility * legibilityWeight;

  var weightedFitness = weightedNovelty + weightedBalance + weightedLegibility;

  //penalisar se a distancia entre metricas é muita (para otimiizar todas)
  //let std = standardDeviation([posterFitnessObj.novelty, posterFitnessObj.balance, posterFitnessObj.legibility]);
 // weightedFitness = weightedFitness - (std * 0.1); //v1
  //weightedFitness = weightedFitness * (1 - std); //v2 

  return {
    weightedFitness: weightedFitness,
    weightedNovelty: weightedNovelty,
    weightedBalance: weightedBalance,
    weightedLegibility: weightedLegibility
  };
}

function onFitnessReceived(fitness_values) {
  //console.log("7 - Handling fiteness values (onFitnessReceived)");

  logToUser("Fitness Received...");

  missingFitnesses = false;
  var avg = 0;
  var penalisedAvg = 0;

  // [ {pag: 4, novelty: 4000, balance: 3000, etc..., imgName:'02.png'} ]

  //calcular fitness pesada + avg fitness
  for (var i = 0; i < fitness_values.length; i++) {
    let f = fitness_values[i];
    let wFitness = calcWeightedFitness(f);
    f.fitness = wFitness.weightedFitness;
    f.penalisedFitness = f.fitness / f.diversityPenalty; //diversity sharing
    //stats:
    avg += f.fitness;
    penalisedAvg += f.penalisedFitness;
  }
  avg = avg / fitness_values.length;
  penalisedAvg = penalisedAvg / fitness_values.length;

  //ordenar do maior para menor
  fitness_values.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });

  let wFitnessOfBest = calcWeightedFitness(fitness_values[0]);

  console.log("Fitness values:", fitness_values);
  logToUser("Best fitness: " + fitness_values[0].fitness);

  //csv
  fitnessCSV += (ui.max_num_gens - curr_num_gens) + ";"; //gen
  fitnessCSV += fitness_values[0].fitness + ";"; //best fitness
  fitnessCSV += avg + ";"; //avg finness
  fitnessCSV += fitness_values[0].penalisedFitness + ";"; //penalised fitness of the best
  fitnessCSV += penalisedAvg + ";"; //avg penalised fitness

  fitnessCSV += fitness_values[0].novelty + ";";
  fitnessCSV += fitness_values[0].balance + ";";
  fitnessCSV += fitness_values[0].legibility + ";";

  fitnessCSV += wFitnessOfBest.weightedNovelty + ";";
  fitnessCSV += wFitnessOfBest.weightedBalance + ";";
  fitnessCSV += wFitnessOfBest.weightedLegibility + "\n";

  fitnessLog.push({
    gen: ui.max_num_gens - curr_num_gens,
    best: fitness_values[0].fitness,
    fitness_values: fitness_values
  });

  //se encontrou um indivíduo otimo, envia comando jsx para parar a evolução e ordenar ‘pop’ do pior para o melhor
  if (fitness_values[0].fitness >= satisfying_fitness || !evolving || curr_num_gens < 1) {
    if (fitness_values[0].fitness >= satisfying_fitness) {
      logToUser("Found a fitted individual!");
      // csInterface.evalScript("alert('Found a fitted individual')");
    }
    else if (curr_num_gens < 1) {
      logToUser("All generation were run!");
      //csInterface.evalScript("alert('All generation were run')");
    }
    stopEvolution(fitness_values);
  }

  //se nao, cria uma nova geracao
  else newGeneration(fitness_values);
}

function stopEvolution(sorted_fitness = []) {

  console.log("7 - stopEvolution");
  logToUser("Evolution ended.");
  evolving = false;
  var sorted_fitness_str = JSON.stringify(sorted_fitness);

  console.log(fitnessLog);
  fitnessCSV = fitnessCSV.replace(/\./g, ',')
  console.log(fitnessCSV);
  let elapsed = Date.now() - initStamp;
  console.log(formatElapsedTime(elapsed));
  localStorage.fitnessCSV = fitnessCSV;
  localStorage.time = (Date.now() - initStamp);


  csInterface.evalScript("stopEvolution(" + sorted_fitness_str + ")", function (r) {
    console.log(r)
  });


  document.getElementById("generatebtn").innerHTML = "Generate";

  download("fitness_" + Date.now() + ".csv", fitnessCSV);
  download("timePassed_" + Date.now() + ".csv", Date.now() - initStamp);
}

function formatElapsedTime(elapsed) {
  let seconds = Math.floor(elapsed / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return hours + "h" + minutes + "m" + seconds + "s";
}

function randomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

function randomPag(fitness_values) {
  var randomIndex = randomInt(0, fitness_values.length - 1);
  return fitness_values[randomIndex];
}

function selectPagNumByTournament(fitness_values, diversity = true) {
  var pag1 = randomPag(fitness_values),
    pag2 = randomPag(fitness_values);
  while (pag2.pag === pag1.pag && evolving) pag2 = randomPag(fitness_values);

  //penalisedFitness for fitness sharing
  let fitnessType = diversity ? "penalisedFitness" : "fitness";
  return pag1[fitnessType] > pag2[fitnessType] ? pag1 : pag2;
}

function newGeneration(fitness_values) {
  console.log("8 - Generation:", ui.max_num_gens - curr_num_gens + 1);

  if (fitness_values.length < 2) {
    console.log("Population is too small. Make sure there's at least 2 individuals")
    csInterface.evalScript("alert('Population is too small. Make sure there's at least 2 individuals')");
    return;
  }

  logToUser("Selecting elite and parents...");

  var parents = {
    elite: [],
    crossoverPairs: [],
    selectedIndividuals: []
  };
  var elite_fitness_values = [];
  let elite_size = ui.elite_size;

  //ellite (pick best)
  //console.log("Selecting elite");


  //ELITE novelty
  fitness_values.sort(function (a, b) {
    return a.novelty < b.novelty ? 1 : -1
  });
  parents.elite.push(fitness_values[0].pag);
  elite_fitness_values.push(fitness_values[0]);
  //ELITE balance
  fitness_values.sort(function (a, b) {
    return a.balance < b.balance ? 1 : -1
  });
  parents.elite.push(fitness_values[0].pag);
  elite_fitness_values.push(fitness_values[0]);
  //ELITE legibility
  fitness_values.sort(function (a, b) {
    return a.legibility < b.legibility ? 1 : -1
  });
  parents.elite.push(fitness_values[0].pag);
  elite_fitness_values.push(fitness_values[0]);
  //ELITE global fitness
  fitness_values.sort(function (a, b) {
    return a.fitness < b.fitness ? 1 : -1
  });
  /*for (let i = 0; i < elite_size; i++) {
    parents.elite.push(fitness_values[i].pag);
    elite_fitness_values.push(fitness_values[i]);
  }*/
  parents.elite.push(fitness_values[0].pag);
  elite_fitness_values.push(fitness_values[0]);


  if (parents.elite.length != elite_size) alert("elite malformed");


  //SELECTION
  if (ui.algorithm == "genetic") parents = geneticSelection(parents, fitness_values, elite_size);
  else parents = hillClimberSelection(parents, elite_fitness_values, elite_size);
  console.log("PARENTS", parents);

  //criar filhos e eliminar old ‘pop’
  console.log("Asking JSX to create children");
  var parents_str = JSON.stringify(parents);

  logToUser("Creating new population...");

  csInterface.evalScript("newPop(" + parents_str + ")", function (r) {
    console.log("JSX tried to create new pop: " + r);
    //send to evaluation
    if (r !== "EvalScript error.") {
      exportPopAndInformServer();
      curr_num_gens--;
    } else {
      console.error("Old pop could not be defined or something")
      logToUser("There has been an error cretaing offspring.");
      stopEvolution();
    }
  });

}

function geneticSelection(parents, fitness_values, elite_size) {
  console.log("Selecting parents by tornament");
  if (ui.variation == "crossover") {
    //tournament (p1 + p2 for crossover)
    for (let i = 0; i < ui.pop_size - elite_size; i++) {
      var parent1 = selectPagNumByTournament(fitness_values),
        parent2 = selectPagNumByTournament(fitness_values);
      while (parent2.pag == parent1.pag && evolving) parent2 = selectPagNumByTournament(fitness_values);
      parents.crossoverPairs.push([parent1.pag, parent2.pag])
    }

  } else {
    //tournament (p1 only, for mutation ony)
    for (let i = 0; i < ui.pop_size - elite_size; i++) {
      var parent1 = selectPagNumByTournament(fitness_values);
      parents.selectedIndividuals.push(parent1.pag)
    }

  }

  return parents;
}

function hillClimberSelection(parents, elite_fitness_values, elite_size) {
  console.log("Selecting parents from elite");

  if (ui.variation == "crossover") {
    //tournament (p1 + p2 for crossover)
    if (parents.elite.size < 2) {
      parents.crossoverPairs.push([parents.elite[0], parents.elite[1]]);
    } else {
      for (let i = 0; i < ui.pop_size - elite_size; i++) {
        var parent1 = selectPagNumByTournament(elite_fitness_values),
          parent2 = selectPagNumByTournament(elite_fitness_values);
        while (parent2.pag == parent1.pag && evolving) parent2 = selectPagNumByTournament(elite_fitness_values);
        parents.crossoverPairs.push([parent1.pag, parent2.pag])
      }
    }

  } else {
    //tournament (p1 only, for mutation ony)
    let j = 0;
    for (let i = 0; i < ui.pop_size - elite_size; i++) {
      var parent1pag = parents.elite[j];
      j++;
      if (j > parents.elite.length - 1) j = 0;
      parents.selectedIndividuals.push(parent1pag)
    }

  }

  return parents;

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

//only for playground
let = function () {

}