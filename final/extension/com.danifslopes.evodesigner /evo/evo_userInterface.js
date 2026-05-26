var inputcombosliders;
var lastClickedElm = null;
var generatebtn;
var selected_base_pags = []; //quais as paginas a considerar para criar a init generation

var elite_size_genetic = 4;
var elite_size_climber = 4;

var ui = {
    //main painel
    selected_basePages_str: '18',
    pop_size: 20, //se nao houver este num de pags, ele cria individuos random
    keywords: [""],
    mandatory_tools: [],
    mandatory_props: [],
    mand_elms: [],
    //desirable_tools: ["blendMode"],
    hierarchy: [],
    noveltyOn: true,
    noveltyValue: 100, //%
    balanceOn: true,
    balanceValue: 100,
    legibilityOn: true,
    legibilityValue: 100,
    styleOn: true,
    styleValue: 90,
    style_classifier: "evodesigner.com/style/mystyle",
    max_num_gens: 50,
    algorithm: "genetic", //genetic | climber
    variation: "mutation", //mutation | crossover
    elite_size: -1, //to be defined in winddow.onload or when user changes algorithm
    conceptAlgorithm: "ConceptNet", //ConceptNet | GPT
};

//ON LOAD 
window.onload = function () {
    keywordsInput = document.querySelector("#keywords");
    ui.elite_size = ui.algorithm == "genetic"? elite_size_genetic: elite_size_climber

    //update user interface using code-defined variables
    //tambem vai fazer o setup disparar
    updateInterfaceSettings();

    //ir buscar os nomes dos metodos. 
    csInterface.evalScript("getMethodNames()", function (r) {
        r = JSON.parse(r);
        methods = r;
    });

    //get sliders
    inputcombosliders = document.getElementsByClassName("inputcomboslider");

    //blur actions on "Enter" pressed 
    document.querySelectorAll("input").forEach(elm => {
        elm.onkeyup = e => {
            if (e.key === "Enter") inputOnBlur(e.target)

        }
    })
    //on dragging interface sliders
    for (let s of inputcombosliders) {
        s.oninput = e => {
            e.preventDefault();
            let numberInput = document.getElementById(e.target.id.replace("Range", ""));
            numberInput.value = e.target.value;
        }
        s.onchange = function() {
            getAndUpdateInterfaceSettings();
        }
    }

    //ir buscar variaveis uteis + logger
    commonWindowOnload();

    updateTextofMandatoryBtn("mand_elms"); //os outros estao dentro de commonWindowOnload
}

//CLICK BLUR AND DRAG 
window.onclick = function (e) {
    let t = e.target;

    //blur dropdowns
    if (!e.path.find(v => v.id == "dropdown")) {
        if (!e.target.classList.contains("dropcheckboxlist") && !e.target.classList.contains("op")) {
            document.getElementById("dropdown").style.display = "none";
            lastOp = null;
        }
    }

    //BLUR last clicked item
    if (lastClickedElm && lastClickedElm !== t) {
        inputOnBlur(lastClickedElm);
    }

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

    } else if (e.target.classList.contains('dropcheckboxlist') /*&& e.target.tagName === "BUTTON"*/) {
        if (t.id === "mandatory_tools")
            openDropCheckBox(e, getSelectedFromMethodsObj, "mandatoryOnChange");
        else if (t.id === "mandatory_props")
            openDropCheckBox(e, getSelectedFromSubMethodsObj, "mandatoryOnChange");
        else if (t.id === "mand_elms") {
            openMandElmsDropBox(e)
        }
    } else if (t.id == "add_mand_elms") {
        addSelectionToMandatoryItems();
    } else if (t.id == "clear_mand_elms") {
        clearMandatoryItems();
    }
    //keywords
    else if (t.id == "learn_keywords") {
        learnKeywords(e, ui.conceptAlgorithm);
    }
    else if (e.target.id == "reset_keywords") {
        console.log("reset")
        keywordsInput.value = "";
        getAndUpdateInterfaceSettings();
        learnKeywords(e, ui.conceptAlgorithm);
    }
    //radios
    else if (t.type=="radio") {
        getAndUpdateInterfaceSettings();
    }

    lastClickedElm = e.target;
}

//INPUTS BLUR
function inputOnBlur(elm) {
    if (elm.tagName === "INPUT" && elm.type!="radio") {
        getAndUpdateInterfaceSettings();
    }
}

//MANDATORY ELMS
function openMandElmsDropBox(e) {
    csInterface.evalScript("getItemNames()", function (r) {
        r = JSON.parse(r);
        r = r.map(o => {
            let name = o.name === "" ? "[" + o.type + "]" : o.name;
            return {
                label: name,
                id: o.id,
                category: "pag" + o.page
            }
        })
        openDropCheckBox(e, r, "mandatoryOnChange");
    });
}

function addSelectionToMandatoryItems() {
    csInterface.evalScript("addSelectionToMandatoryItems()", function (r) {
        //console.log(r)
        ui = JSON.parse(r);
        updateSettingsOnInterface();
    });
}

function clearMandatoryItems() {
    csInterface.evalScript("clearMandatoryItems()", function (r) {
        //console.log(r)
        ui.mand_elms = r;
        updateTextofMandatoryBtn("mand_elms");
    });

}

//GET AND UPDATE INTERFACE

//helper
function getCheckedValue(radiodiv) {
    var checkedRadio = radiodiv.querySelector('input[type="radio"]:checked');
    if (!checkedRadio) {
        checkedRadio = radiodiv.querySelector('input[type="radio"]');
        checkedRadio.checked = true;
    }
    console.log(checkedRadio.value);

    ui.elite_size = ui.algorithm == "genetic" ? elite_size_genetic: elite_size_climber;
    return checkedRadio.value;
}

//helper
function getSettingsFromInterface() {
    //console.log("getSettingsFromInterface");

    for (let key of Object.keys(ui)) {
        let input = document.getElementById(key);
        if (!input) {
            //console.log("nao existe input " + key)
            continue
        }

        if (input.classList.contains("radiodiv")) {
            ui[key] = getCheckedValue(input);
        }
        else if (input.classList.contains("dropcheckboxlist")) {
            //isto já é feito com um evento em cada checkbox
            continue
        } else if (input.classList.contains("inputlist")) { //inputlist
            ui[key] = [];
            let realInputs = input.getElementsByTagName("input");
            for (let i of realInputs) ui[key].push(commaStrToArray(i.value));

        } else if (Array.isArray(ui[key])) { //commas text
            ui[key] = input.value.trim() === "" ? [] : commaStrToArray(input.value);

        } else if (typeof ui[key] === "boolean") {
            ui[key] = input.checked;

        } else if (typeof ui[key] === "number") {
            ui[key] = Number(input.value);

        } else if (typeof ui[key] === "string") {
            ui[key] = input.value;
        }

        //console.log(key, "-", ui[key], "-", input.type);
    }
}

//helper
function checkRadioWithValue(value, radiodiv) {
    var radios = radiodiv.querySelectorAll('input[type="radio"]');
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].value == value) {
            radios[i].checked = true;
            return;
        }
    }
    console.log('No radio button with value ' + value + ' found.');
    //if the vallue does not exist, check the first and retrieve it 
    checkedRadio = radiodiv.querySelector('input[type="radio"]');
    checkedRadio.checked = true;

    ui.elite_size = ui.algorithm == "genetic" ? elite_size_genetic: elite_size_climber;
    ui[radiodiv.id] = checkedRadio.value;
}

//helper
function updateSettingsOnInterface() {
    for (let key of Object.keys(ui)) {
        let input = document.getElementById(key);
        if (!input) {
            //console.log("nao existe input " + key)
            continue
        }

        if (input.classList.contains("radiodiv")) {
            checkRadioWithValue(ui[key], input);

        } else if (input.classList.contains("dropcheckboxlist")) {
            //console.log("drop", ui[key])
            let id = input.id;
            //console.log("id---", id)
            updateTextofMandatoryBtn(id);

        } else if (input.classList.contains("inputlist")) { //inputlist
            let realInputs = input.getElementsByTagName("input");
            for (let i = 0; i < realInputs.length; i++) {
                if (Array.isArray(ui[key][i]))
                    realInputs[i].value = ui[key][i].join(", ")
            }
        } else if (Array.isArray(ui[key])) { //commas text
            input.value = ui[key].join(", ");

        } else if (typeof ui[key] === "boolean") {
            input.checked = ui[key];

        } else if (typeof ui[key] === "number") {
            input.value = ui[key];

            //sliders
            if (input.parentElement.className === "inputcombo")
                document.getElementById(key + "Range").value = ui[key];

        } else if (typeof ui[key] === "string") {
            input.value = ui[key];
        }
    }

    updateArrSelectedBasePages();
}

//helper
function evalInterfaceSettings(cb = console.log) {
    var interface_str = JSON.stringify(ui);
    csInterface.evalScript("updateInterfaceSettings(" + interface_str + ")", function (r) {
        ui = JSON.parse(r);
        handleKeywordsUI(ui.keywords);
        updateSettingsOnInterface();
        cb("cb evalInterfaceSettings", r);
    });
}

function getAndUpdateInterfaceSettings(cb = console.log) {
    getSettingsFromInterface();
    evalInterfaceSettings(cb);
}

function updateInterfaceSettings(cb = console.log) {
    evalInterfaceSettings(cb);
}

//HIERARCHY INPUT
function addItemInInputList(inputlist = document.getElementById("hierarchy")) {
    let cont = inputlist.getElementsByClassName("inputlistcont")[0];

    for (let c of cont.children) c.getElementsByClassName("removeLevel")[0].classList.add("hide");

    //create new item
    let div = document.createElement('div');
    div.className = "inputlistitem";

    let p = document.createElement('p');
    p.className = "sublabel";
    p.innerHTML = (cont.children.length + 1) + "º";

    let input = document.createElement('input');
    input.setAttribute("type", "text");
    input.setAttribute("class", "topcoat-text-input input");
    input.setAttribute("placeholder", "Click here, then select page elements");

    let button = document.createElement('button');
    button.setAttribute("class", "addremove removeLevel");

    let br = document.createElement('br');

    div.appendChild(p);
    div.appendChild(input);
    div.appendChild(button);
    div.appendChild(br);

    //append to itemlist
    cont.appendChild(div);
}

function removeItemInInputList(inputlist = document.getElementById("hierarchy")) {
    let cont = inputlist.getElementsByClassName("inputlistcont")[0];

    if (cont.children.length > 1) {
        cont.removeChild(cont.children[cont.children.length - 1]);

        //depois de eliminar voltar a verificar quando children
        cont = inputlist.getElementsByClassName("inputlistcont")[0];
        if (cont.children.length > 1)
            cont.children[cont.children.length - 1].getElementsByClassName("removeLevel")[0].classList.remove("hide");
    }
}