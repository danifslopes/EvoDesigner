//common interface code for playgroung and evo

let dp;
let initBodyX, initBodyY;
let logger, logHistory = [];
let methods = {}
let lastOp = null;
let updateBtnsProbsToRun; //playgrounund only

//keywords
let probDisplay; //se as probabilidades estao ou nao visiveis (playground only)
let keywordsInput;
let current_keywords = []; //keywords ja aprendidas

function commonWindowOnload() {
    //ir buscar variaveis uteis
    dp = document.querySelector("#dropdown");
    let bodyBounds = document.body.getBoundingClientRect();
    initBodyX = bodyBounds.x;
    initBodyY = bodyBounds.y;
    //logger
    logger = document.querySelector("#logtxt");
    //atualizar texto do btn mandatory tools
    updateTextofMandatoryBtn("mandatory_tools");
}

//DROP CHECKBOX FOR MANDATORY METHODS
function openDropCheckBox(e, options, onChange) {
    console.log("openDropCheckBox");

    //ir buscar a div dropdown
    let dp = document.querySelector("#dropdown");

    //fechar se aberta
    if (dp.style.display == "flex") {
        dp.style.display = "none";
        lastOp = null;
        return
    }

    //ir buscar botao principal
    let btn = e.target;
    let bounds = btn.getBoundingClientRect();
    let btnId = e.target.id

    //ir buscar lista de coisas para meter no dropdown
    options = typeof options === 'function' ? options(btnId) : options;

    //ir buscar body bounds
    let bodyBounds = document.body.getBoundingClientRect();

    //meter a div junto ao botao principal
    let left = bounds.x;
    let top = bounds.y + bounds.height - bodyBounds.y + initBodyY;
    dp.style.left = left + "px";
    dp.style.top = top + "px";

    //escrever options dentro do dropdown
    let html = "";
    pTitle = "";
    for (let i in options) {
        let label = options[i].label || options[i];
        let id = options[i].id || options[i].category + "." + label;
        let title = options[i].category || "";
        let category = options[i].category ? 'category="' + options[i].category + '"' : "";

        let checked = ui[btnId].find(o => o.id + "" == options[i].id + "") ? "checked" : "";

        if (pTitle !== title && title !== "") html += "<note>" + title + ":</note>";
        pTitle = title;

        html +=
            '<div class="checkboxandlabel">' +
            '<input ' + category + ' ' + checked + ' section="options" btnId="' + btn.id + '" id="' + id + '" value="' + id + '" label="' + label + '" type="checkbox" class="dropcheckbox" onchange="' + onChange + '(event)">' +
            '<div class="topcoat-checkbox__checkmark"></div>' +
            '<label for="' + id + '">' + label + '</label>' +
            '</div>'
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

function getSelectedFromMethodsObj(btnId) {
    let result = [];
    for (domainName of Object.keys(methods))
        if (domainName != "docMethods") {
            let types = methods[domainName];
            for (typeKey in types) {
                let methods = types[typeKey];
                for (meth of methods) {
                    let obj = {
                        category: typeKey,
                        label: meth.name,
                        id: domainName + "." + typeKey + "." + meth.name
                    };
                    if (ui[btnId].find(o => o.label === meth.name)) obj.selected = true;
                    result.push(obj);
                }
            }
        }
    return result;
}

function getSelectedFromSubMethodsObj(btnId) {
    let result = [];
    for (domainName of Object.keys(methods))
        if (domainName != "docMethods" || true)
            for (type of Object.values(methods[domainName]))
                for (meth of type) {
                    for (sub of meth.subMethods) {
                        let obj = {
                            category: meth.name,
                            label: sub.name,
                            id: domainName + "." + meth.name + "." + sub.name
                        };
                        if (ui[btnId].find(o => o.label === sub.name)) obj.selected = true;
                        result.push(obj)
                    }
                }
    return result;
}

function mandatoryOnChange(e) {
    //guarda e elimina opçoes nas vars globais
    console.log("mandatoryOnChange", e.target);

    let btn_id = e.target.getAttribute("btnid");
    let obj = {
        id: e.target.id,
        label: e.target.getAttribute("label"),
        category: e.target.getAttribute("category")
    }

    if (e.target.checked) {
        ui[btn_id].push(obj);
    } else {
        let existing_obj = ui[btn_id].find(o => o.id + "" == obj.id + "")
        let index = ui[btn_id].indexOf(existing_obj)
        if (index > -1)
            ui[btn_id].splice(index, 1)

        console.log(ui.mand_elms)
    }

    updateTextofMandatoryBtn(btn_id);
}

function updateTextofMandatoryBtn(btn_id) {
    let btn = document.getElementById(btn_id);
    let text = "(no tools selected)";
    if (ui[btn_id].length > 0) {

        let allMeths = ui[btn_id].map(o => {
            return o.category + "." + o.label
        }).join(", ");

        let maxLen = 40;
        if (allMeths.length > maxLen) text = allMeths.substring(0, maxLen - 3) + "...";
        else text = allMeths.substring(0, maxLen);
    }
    btn.innerHTML = text + " <op>&nbsp;▾ </op>";

    if (btn_id === "mand_elms") {
        document.getElementById("clear_mand_elms").style.display = ui.mand_elms.length > 0 ? "block" : "none";
    }
}

//KEYWORDS

function handleKeywordsUI(r) {
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
}

function learnKeywords(e, conceptAlgorithm = "") {

    csInterface.evalScript("updateProbsToRun()", function (r) {
        r = JSON.parse(r);

        current_keywords = r;

        let current_ks_note = "";
        let logPlus = "";
        probDisplay = "none"; //playgrounud only
        if (r.length <= 0) {
            current_ks_note = '(no keywords in use right now)';
        } else {
            current_ks_note = 'Keywords in use: "' + r.join(", ") + '"';
            logPlus = " All good to stylise pages manually or automatically. See the relatedess of each tool side by its name."
            probDisplay = "inline" //playgrounud only
        }

        document.querySelector("#learn_keywords").setAttribute("active", false);

        document.querySelector("#current_keywords").innerHTML = current_ks_note;
        document.querySelector("#keywords_tip").innerHTML = probDisplay == "none" ? "" : "<u id='reset_keywords' class='clickable_text'>Reset Keywords</u>";

        if (updateBtnsProbsToRun != undefined) updateBtnsProbsToRun(probDisplay); //playgrounud only

        console.log(current_ks_note + logPlus);
        logToUser(current_ks_note + logPlus);
    });
}

//LOGGER
var logCount = 1;

function logToUser(txt) {
    txt = logCount + ": " + txt;
    var log = "<div id='pastLog'>" + logHistory.join("<br>") + "</div>";
    log += "<div id='newLog'>" + txt + "</div>";
    logCount++;

    logger.innerHTML = log;
    logger.scrollTop = logger.scrollHeight;

    logHistory.push(txt);
    if (logHistory.length > 20) logHistory.shift();
}

//UTILS
function pagesStringToArray(str) {
    let arr = [];
    str = str.replace(/ +?/g, ''); //tirar espaços
    str = str.split(",");

    for (let s of str) {
        if (Number(s)) arr.push(Number(s));

        else if (s.indexOf("-") > -1) {
            let fst = Number(s.substring(0, s.indexOf("-")));
            let snd = Number(s.substring(s.indexOf("-") + 1, s.length));
            for (let i = fst; i <= snd; i++) arr.push(i);

        } else console.log("unknown syntax");
    }

    return arr;
}

function commaStrToArray(srt) {
    return srt.split(",").map(a => a.trim().replace(/\s\s+/g, ' ')).filter(a => a);
}

function updateArrSelectedBasePages() {
    selected_base_pags = pagesStringToArray(ui.selected_basePages_str);
    console.log("selected_base_pags", selected_base_pags);

}