/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

var csInterface = new CSInterface();
csInterface.requestOpenExtension("com.danifslopes.evodesigner.server", "");

let dp;
let initBodyX, initBodyY;
let keywords = [];
let logger, logHistory = [];

function commaStrToArray(srt) {
  return srt.split(",").map(a => a.trim().replace(/\s\s+/g, ' ')).filter(a => a);
}

function loaderOn(on) {
  //console.log("loader " + on)
  //document.querySelector("#loader").style.display = on ? "flex" : "none";
}

window.onload = function () {
  //ir buscar nome dos metodos todos e criar buttons
  createButtonsForManualMethods();

  //atualizar keywords onblur
  let keywordsInput = document.querySelector("#keywords");
  if (keywordsInput) keywordsInput.onblur = function (e) {
    let ks = e.target.value.trim() === '' ? [] : commaStrToArray(e.target.value);
    ks = JSON.stringify(ks);
    csInterface.evalScript("updateKeywords(" + ks + ")", function (r) {
      console.log(r);
      logToUser(r);
    })
  }

  //ir buscar variaveis uteis
  dp = document.querySelector("#dropdown");
  let bodyBounds = document.body.getBoundingClientRect();
  initBodyX = bodyBounds.x;
  initBodyY = bodyBounds.y;

  logger = document.querySelector("#logtxt");
}

window.oncontextmenu = e => {
  e.preventDefault();
}

window.onclick = e => {
  e.stopPropagation();

  //blur dropdowns
  if (!e.path.find(v => v.id == "dropdown")) {
    document.getElementById("dropdown").style.display = "none";
  }

  //on click na seta, abrir submetodos 
  if (e.target.tagName === "OP") {
    openSubmethods(e);

  } else if (e.target.tagName === "BUTTON") {
    //botoes com atributo jsx (RESETs)
    let jsx = e.target.getAttribute('jsx');
    if (jsx) {
      //mostrar ou esconder labels das probTtoRun
      var probLabelsDisplay = (jsx == "init()" && keywords.length > 0) ? "initial" : "none";
      var probLabels = document.querySelectorAll("prob");
      for (let i = 0; i < probLabels.length; i++) probLabels[i].style.display = probLabelsDisplay;

      //correer meth jsx
      csInterface.evalScript(jsx, function (r) {
        console.log(r);
        logToUser(r);
      });

      //mutate
    } else if (e.target.id == "auto_mutate") {
      let prob = document.querySelector("#mutprob").value;
      if (prob < 0) prob = 0;
      else if (prob > 1) prob = 1;
      document.querySelector("#mutprob").value = prob;
      csInterface.evalScript("manualMutateSelected(" + prob + ")", function (r) {
        console.log(r);
        logToUser(r);
      });

      //crossover
    } else if (e.target.id == "auto_cross") {

      //metodos individuais
    } else if (e.target.classList.contains('manual-mutate')) {
      let m = e.target.id;
      let type = e.target.parentElement.parentElement.getAttribute("mthtype");
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
    }

  }
}

document.querySelector("#mutprob").onchange = e => {
  let v = e.target.value;
  if (v < 0) v = 0;
  else if (v > 1) v = 1;
  e.target.value = v;
}

function createButtonsForManualMethods() {
  //ir buscar nomes dos metodos, subs, consts e probs
  csInterface.evalScript("getMethodNames()", function (r) {
    r = JSON.parse(r);
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

        //por cada metodo
        for (let m of meths) {
          var subs = m.subMethods.map(v => v.name);
          var cons = m.constants.map(v => v.name);
          var mprobs = m.subMethods.map(v => v.probToRun);
          var cprobs = m.constants.map(v => v.probToRun);

          //se ha subs, cria setinha de dropdown
          var op = subs.length > 0 ? '<op>&nbsp;&#9662; </op>' : "";
          var hasop = subs.length > 0 ? "hasop" : "";
          var name = m.name,
            name = name.split(/(?=[A-Z])/).join(" ");
          name = name[0].toUpperCase() + name.substr(1);

          //criar botao
          div.innerHTML += '<button id="' + m.name + '" class ="topcoat-button manual-mutate ' + hasop +
            '" subMethods="' + subs + '" mprobs="' + mprobs + '" constants="' + cons + '" cprobs="' + cprobs + '"> ' +
            /*count + ': ' +*/
            name + '<prob>' + m.probToRun + '</prob>' + op + '</button>';
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

  //ir buscar botao principal
  let btn = openBtn = e.target.parentElement;
  let bounds = btn.getBoundingClientRect();

  //ir buscar nomes e probs dos submetodos
  let type = btn.parentElement.parentElement.getAttribute("mthtype");
  let subs = btn.getAttribute("subMethods").split(",").filter(v => v);
  let cons = btn.getAttribute("constants").split(",").filter(v => v);
  let mprobs = btn.getAttribute("mprobs").split(",").filter(v => v);
  let cprobs = btn.getAttribute("cprobs").split(",").filter(v => v);

  //ir buscar a div dropdown
  let dp = document.querySelector("#dropdown");

  //ir buscar body
  let bodyBounds = document.body.getBoundingClientRect();

  //meter a div junto ao botao principal
  let left = bounds.x;
  let top = bounds.y + bounds.height - bodyBounds.y + initBodyY;
  dp.style.left = left + "px";
  dp.style.top = top + "px";

  //escrever cada submetodo e consts dentro do dropdown
  let html = "<note>SubMethods:</note>";
  for (let i in subs)
    html += '<span onclick="runSub(event)" type="' + type + '" meth="' + btn.id + '" id="' + subs[i] + '" probToRun="' + mprobs[i] + '" class ="sub" > ' + subs[i] + " <prob>(" + mprobs[i] + ')</prob> </span>';

  if (cons.length > 0) {
    html += "<note>Constants:</note>";
    for (let i in cons)
      html += '<span onclick="runSub(event)" type="' + type + '" meth="' + btn.id + '" id="' + cons[i] + '" probToRun="' + cprobs[i] + '" class ="sub" > ' + cons[i] + " <prob>(" + cprobs[i] + ')</prob> </span>';
  }
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

function logToUser(txt) {
  //txt = "– " + txt;
  var log = "<div id='pastLog'>"+ logHistory.join("<br>") + "</div>";
  log += "<div id='newLog'>"+txt+"</div>";

  logger.innerHTML = log;
  logger.scrollTop = logger.scrollHeight;

  logHistory.push(txt);
  if (logHistory.length > 20) logHistory.shift();
}