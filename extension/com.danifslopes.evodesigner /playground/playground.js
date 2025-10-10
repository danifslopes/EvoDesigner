/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

var csInterface = new CSInterface();

let ui = {
  mandatory_tools: [
    { "id": "pageMethods.items.createBackground", "label": "createBackground", "category": "items" },

    { "id": "pageItemMethods.style.fillColor", "label": "fillColor", "category": "style" },
    { "id": "pageItemMethods.text.textColor", "label": "textColor", "category": "text" },
    //{ "id": "pageItemMethods.style.blendMode", "label": "blendMode", "category": "style" },
    { "id": "pageItemMethods.text.tracking", "label": "tracking", "category": "text" },
    //{ "id": "pageItemMethods.text.textFont", "label": "textFont", "category": "text" },

    //{ "id": "pageItemMethods.transform.convertShape", "label": "convertShape", "category": "transform" },
    { "id": "pageItemMethods.transform.move", "label": "move", "category": "transform" },
    { "id": "pageItemMethods.transform.size", "label": "size", "category": "transform" },
    //{ "id": "pageItemMethods.transform.fit", "label": "fit", "category": "transform" },
    //{ "id": "pageItemMethods.style.opacity","label":"opacity","category":"style"}
  ],
  mandatory_props: [],
  conceptAlgorithm: "ConceptNet", //ConceptNet | GPT
}

//let current_keywords = []; //keywords ja aprendidas
//let probDisplay; //se as probabilidades estao ou nao visiveis


function loaderOn(on) {
  console.log("loader " + on)

  document.querySelector("#content").style.display = on ? "none" : "block";
  document.querySelector("#log").style.display = on ? "none" : "block";

  document.querySelector("#loader").style.display = on ? "flex" : "none";

}

window.onload = function () {
  console.log("onload");

  //ir buscar nome dos metodos todos e criar buttons
  createButtonsForManualMethods();

  //atualizar keywords onblur
  let keywordsInput = document.querySelector("#keywords");
  if (keywordsInput) {
    keywordsInput.onblur = function (e) {
      userTypedKeywords(keywordsInput);
    }
    keywordsInput.onkeypress = e => {
      if (e.key === "Enter") {
        userTypedKeywords(keywordsInput);
      }
    }
  }

  conceptAlgorithmOnChange();

  //ir buscar variaveis uteis
  //logger
  //atualizar texto do btn mandatory tools
  commonWindowOnload();

}

function conceptAlgorithmOnChange() {
  let radios = document.querySelectorAll('input[name="conceptAlgorithm"]');
  radios.forEach(radio => {
    radio.addEventListener('change', function () {
      let val = this.value;
      console.log(val);
      ui.conceptAlgorithm = val

      csInterface.evalScript("updateConceptAlgoritm(" + JSON.stringify(val) + ")", function (r) {
        r = JSON.parse(r);
        console.log(r)
      });
    });
  });
}

function userTypedKeywords(keywordsInput) {

  let ks = keywordsInput.value.trim() === '' ? [] : commaStrToArray(keywordsInput.value);
  csInterface.evalScript("updateKeywords(" + JSON.stringify(ks) + ")", function (r) {
    r = JSON.parse(r);

    handleKeywordsUI(r); //replaces the above
    /*
    //tip
    let tip = "";
    if (r.join() == current_keywords.join()) {
      //se nao as mesmas keywords nao ha tip
      tip == "";
    } else if (r.length > 0) {
      tip = 'Click "Learn keywords" to consider the new keywords.';
    }
    document.querySelector("#learn_keywords").setAttribute("active", tip != "");
    if (tip != "") {
      console.log(tip);
      logToUser(tip);
    }
    */

    keywordsInput.value = ks.join(", ");

  })
}

window.oncontextmenu = e => {
  e.preventDefault();
}

window.onclick = e => {

  //blur dropdowns
  if (!e.path.find(v => v.id == "dropdown")) {
    if (!e.target.classList.contains("dropcheckboxlist") && !e.target.classList.contains("op")) {
      document.getElementById("dropdown").style.display = "none";
      lastOp = null;
    }
  }

  //on click na seta, abrir submetodos 
  if (e.target.classList.contains("op")) {
    if (lastOp != e.target) {
      openSubmethods(e);
      lastOp = e.target;
    } else {
      document.getElementById("dropdown").style.display = "none";
      lastOp = null;
    }
  } else if (e.target.tagName === "BUTTON") {
    //botoes com atributo jsx (RESETs)
    let jsx = e.target.getAttribute('jsx');
    if (jsx) {
      //mostrar ou esconder labels das probTtoRun
      var probLabelsDisplay = (jsx == "init()") ? "initial" : "none";
      var probLabels = document.querySelectorAll("prob");
      for (let i = 0; i < probLabels.length; i++) probLabels[i].style.display = probLabelsDisplay;

      //correer meth jsx
      csInterface.evalScript(jsx, function (r) {
        console.log(r);
        logToUser(r);
      });

      //mutate
    } else if (e.target.id == "auto_mutate") {
      console.log("auto_mutate")
      let prob = document.querySelector("#mutprob").value;
      let numPags = document.querySelector("#numpages").value;
      console.log(JSON.stringify(ui.mandatory_tools))
      csInterface.evalScript("oneClickStylise(" + prob + ", " + numPags + ", " + JSON.stringify(ui.mandatory_tools) + ")", function (r) {
        console.log(r);
        logToUser(r);
      });

      //crossover
    } else if (e.target.id == "auto_cross") {

      //metodos individuais
    } else if (e.target.classList.contains('manual-mutate')) {
      let m = e.target.id;
      let type = e.target.parentElement.parentElement.parentElement.getAttribute("mthtype");
      console.log("type", type);
      let opt = {
        //constant: "",
        ///subMethod: subMeth,
        //defaultAxes: true
      }
      opt = JSON.stringify(opt);

      csInterface.evalScript("runMeth('" + type + "','" + m + "', " + opt + ")", function (r) {
        console.log(r);
        logToUser(r);
      });
    } else if (e.target.classList.contains('dropcheckboxlist')) {
      openDropCheckBox(e, getSelectedFromMethodsObj, "mandatoryOnChange");

    } else if (e.target.id == "learn_keywords") {
      learnKeywords(e, ui.conceptAlgorithm);
    }
  } else if (e.target.id == "reset_keywords") {
    console.log("reset")
    let keywordsInput = document.querySelector("#keywords");
    keywordsInput.value = "";
    userTypedKeywords(keywordsInput);
    learnKeywords(e, ui.conceptAlgorithm);
  }

}
/*
function learnKeywords(e) {
  csInterface.evalScript("updateProbsToRun()", function (r) {
    r = JSON.parse(r);

    current_keywords = r;

    let current_ks_note = "";
    let logPlus = "";
    probDisplay = "none";
    if (r.length <= 0) {
      current_ks_note = '(no keywords in use right now)';
    } else {
      current_ks_note = 'Keywords in use: "' + r.join(", ") + '"';
      logPlus = " All good to stylise pages manually or automatically. See the relatedess of each tool side by its name."
      probDisplay = "inline"
    }

    document.querySelector("#learn_keywords").setAttribute("active", false);

    document.querySelector("#current_keywords").innerHTML = current_ks_note;
    document.querySelector("#keywords_tip").innerHTML = probDisplay == "none" ? "" : "<u id='reset_keywords' class='clickable_text'>Reset Keywords</u>";

    updateBtnsProbsToRun(probDisplay);

    console.log(current_ks_note + logPlus);
    logToUser(current_ks_note + logPlus);
  });
}*/

updateBtnsProbsToRun = function (probDisplay) {
  let btns_lists = document.querySelectorAll(".btns_list");
  for (let i = 0; i < btns_lists.length; i++) {
    btns_lists[i].innerHTML = "";
  }
  createButtonsForManualMethods(probDisplay);
}

document.querySelector("#mutprob").onchange = e => {
  let v = e.target.value;
  if (v < 1) v = 1;
  else if (v > 100) v = 100;
  e.target.value = v;
}

document.querySelector("#numpages").onchange = e => {
  let numPags = e.target.value;
  let maxPags = Number(e.target.getAttribute("max"));
  if (numPags < 1) numPags = 1;
  else if (numPags > Math.round(maxPags)) numPags = maxPags;
  e.target.value = Math.round(numPags);
}

//---action buttons
function createButtonsForManualMethods(probDisplay = "none") {
  //ir buscar nomes dos metodos, subs, consts e probs
  csInterface.evalScript("getMethodNames()", function (r) {
    r = JSON.parse(r);
    methods = r;
    console.log(r);

    //por cada categoria de metodos (doc, page, item)
    for (let k in r) {
      let count = 1;
      let methDomain = r[k];
      let list = document.querySelector(".btns_list[mthtype=" + k + "]");

      //por cada tipo de metodo (transform, style, text...)
      for (let type in methDomain) {
        let meths = methDomain[type];
        var div = document.createElement("div");
        list.appendChild(div);
        div.innerHTML += "<span class='note'>" + type + "</span>";

        //meths.sort( (a, b )=> b.probToRun - a.probToRun );

        //por cada metodo
        for (let m of meths) {
          var subs = m.subMethods.map(v => v.name);
          var cons = m.constants.map(v => v.name);
          var mprobs = m.subMethods.map(v => v.probToRun);
          var cprobs = m.constants.map(v => v.probToRun);

          //se ha subs, cria setinha de dropdown

          var ophtml = '<button class="op topcoat-button"' +
            'methName="' + m.name + '" subMethods="' + subs + '" mprobs="' + mprobs + '" constants="' + cons + '" cprobs="' + cprobs + '" ' +
            '>&#9662;</button>';

          var op = subs.length > 0 ? ophtml : "";
          var hasop = subs.length > 0 ? "hasop" : "";
          var name = m.name,
            name = name.split(/(?=[A-Z])/).join(" ");
          name = name[0].toUpperCase() + name.substr(1);

          //criar botao
          let alpha = (m.probToRun * 6) - 6;

          div.innerHTML +=
            '<btnAndOp style="box-shadow: 3px 3px 6px ' + alpha + 'px #292929">' +
            '<button id="' + m.name + '" class ="topcoat-button manual-mutate ' + hasop + '" >' +
            /*count + ': ' +*/
            name + '<prob style="display:' + probDisplay + '">' + m.probToRun + '</prob>' /*+ op*/ + '</button>' +
            op + '</btnAndOp>'
          count++;
        }

      }
    }

  });

}

function runSub(e) {
  let type = e.target.getAttribute("type");
  let meth = e.target.getAttribute("meth");
  let subMeth = e.target.id;
  console.log(type, meth, subMeth)

  let opt = {
    constant: "",
    subMethod: subMeth,
    //defaultAxes: true
  }

  opt = JSON.stringify(opt);
  csInterface.evalScript("runMeth('" + type + "','" + meth + "', " + opt + ")", function (r) {
    console.log(r);
    logToUser(r);
  });
}

function openSubmethods(e) {
  console.log("op");

  //ir buscar a div dropdown
  let dp = document.querySelector("#dropdown");

  //ir buscar botao seta
  let btn = openBtn = e.target;
  let bounds = btn.getBoundingClientRect();

  //ir buscar nomes e probs dos submetodos
  let type = btn.parentElement.parentElement.parentElement.getAttribute("mthtype");
  let subs = btn.getAttribute("subMethods").split(",").filter(v => v);
  let cons = btn.getAttribute("constants").split(",").filter(v => v);
  let mprobs = btn.getAttribute("mprobs").split(",").filter(v => v);
  let cprobs = btn.getAttribute("cprobs").split(",").filter(v => v);
  let methName = btn.getAttribute("methName");

  //ir buscar body
  let bodyBounds = document.body.getBoundingClientRect();

  //meter a div junto ao botao principal
  let left = bounds.x;
  let top = bounds.y + bounds.height - bodyBounds.y + initBodyY;
  dp.style.left = left + "px";
  dp.style.top = top + "px";

  //escrever cada submetodo e consts dentro do dropdown
  let html = "<note>SubMethods:</note>";
  var grupo = "";
  for (let i in subs) {
    //todo: ir buscar grupo e agrupar por grupos
    html += '<span onclick="runSub(event)" type="' + type + '" meth="' + methName + '" id="' + subs[i] + '" probToRun="' + mprobs[i] + '" class ="sub" > ' + subs[i] + ' <prob style="display:' + probDisplay + '">(' + mprobs[i] + ')</prob> </span>';
  }

  /*  
  if (cons.length > 0) {
    html += "<note>Constants:</note>";
    for (let i in cons)
      html += '<span onclick="runSub(event)" type="' + type + '" meth="' + btn.id + '" id="' + cons[i] + '" probToRun="' + cprobs[i] + '" class ="sub" > ' + cons[i] + ' <prob style="display:' + probDisplay + '">(' + cprobs[i] + ')</prob> </span>';
  }*/

  dp.innerHTML = html;
  dp.style.display = "flex";

  //corrigir posição, se o dropdown estiver forma do ecra
  let subBounds = dp.getBoundingClientRect();
  let tx = 0,
    ty = 0;
  if (bounds.x + subBounds.width > window.innerWidth) {
    left = bounds.x
    tx = -100;
  }
  if (bounds.y + subBounds.height > window.innerHeight) {
    top = bounds.y - bodyBounds.y + initBodyX;
    ty = -100;
  }
  dp.style.left = left + "px";
  dp.style.top = top + "px";
  dp.style.transform = "translate(" + tx + "%," + ty + "%)"
}