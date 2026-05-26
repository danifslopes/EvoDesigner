var interface = {
        //main painel
        selected_basePages_str: '15, 16, 17',
        pop_size: 50, //se nao houver este num de pags, ele cria individuos random
        keywords: [],
        mandatory_tools: [],
        desirable_tools: [],
        mand_elms: [],
        hierarchy: [],
        noveltyOn: true,
        noveltyValue: 100, //%
        balanceOn: true,
        balanceValue: 90,
        legibilityOn: true,
        legibilityValue: 80,
        styleOn: true,
        styleValue: 90,
        style_classifier: "evodesigner.com/style/mystyle",
        max_num_gens: 100,
};

function commaStrToArray(srt) {
    return srt.split(",").map(a=>a.trim().replace(/\s\s+/g, ' ')).filter(a => a);
  }

function getSettingsFromInterface() {
    console.log("");

    for (let key of Object.keys(interface)) {
        let input = document.getElementById(key);

        if (input.classList.contains("inputlist")) { //inputlist
            interface[key] = [];
            let realInputs = input.getElementsByTagName("input");
            for (let i of realInputs) interface[key].push(commaStrToArray(i.value));

        } else if (Array.isArray(interface[key])) { //commas text
            interface[key] = input.value === "".trim() ? [] : commaStrToArray(input.value);

        } else if (typeof interface[key] === "boolean") {
            interface[key] = input.checked;

        } else if (typeof interface[key] === "number") {
            interface[key] = Number(input.value);

        } else if (typeof interface[key] === "string") {
            interface[key] = input.value;
        }

        console.log(key, "-", interface[key], "-", input.type);
    }
}

function updateSettingsOnInterface() {
    for (let key of Object.keys(interface)) {
        let input = document.getElementById(key);

        if (input.classList.contains("inputlist")) { //inputlist
            let realInputs = input.getElementsByTagName("input");
            for (let i = 0; i < realInputs.length; i++) {
                if (Array.isArray(interface[key][i]))
                    realInputs[i].value = interface[key][i].join(", ")
            }

        } else if (Array.isArray(interface[key])) { //commas text
            input.value = interface[key].join(", ");

        } else if (typeof interface[key] === "boolean") {
            input.checked = interface[key];

        } else if (typeof interface[key] === "number") {
            input.value = interface[key];

            //sliders
            if (input.parentElement.className === "inputcombo")
                document.getElementById(key + "Range").value = interface[key];

        } else if (typeof interface[key] === "string") {
            input.value = interface[key];
        }

        //console.log("");
        //console.log(key, "-", interface[key], "-", input.type);
    }
}

function evalInterfaceSettings(cb) {
    var interface_str = JSON.stringify(interface);
    csInterface.evalScript("updateInterfaceSettings(" + interface_str + ")", function (v) {
        cb(v);
    });
}

function updateInterfaceSettings(cb = console.log) {
    getSettingsFromInterface();
    updateSettingsOnInterface();
    evalInterfaceSettings(function (v) {
        cb(v);
    });
}

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