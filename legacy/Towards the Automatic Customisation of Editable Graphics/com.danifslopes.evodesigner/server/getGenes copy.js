const puppeteer = require('puppeteer');
const fs = require("fs");

async function getPropertiesFrom(pageID) {
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    page.on('console', consoleObj => console.log(consoleObj.text()));
    console.log("goto: " + pageID);

    await page.goto('https://www.indesignjs.de/extendscriptAPI/indesign-latest/#' + pageID + '.html', {
        waitUntil: 'networkidle2'
    });
    await page.exposeFunction("getPropertiesFrom", getPropertiesFrom);

    await page.waitForSelector('iframe');
    const elementHandle = await page.$('iframe[src="' + pageID + '.html"]');
    if (!elementHandle) return false;
    const iframe = await elementHandle.contentFrame();

    let content = await iframe.evaluate(async (pageID) => {

        function isEmpty(obj) {
            for (var prop in obj)
                if (obj.hasOwnProperty(prop)) return false;
            return JSON.stringify(obj) === JSON.stringify({});
        }

        //PROPERTIES TABLE
        async function tableRowToJSON(tableRow, headers) {
            let obj = {}
            let possibleValues = {}; //default because of headers' creation

            var columns = tableRow.innerText.split("\t");

            //Ignorar certos typos de linha
            if (["String", "Object", "Array of String", "Function"].includes(columns[1]) || columns[2] == "readonly") return false;

            for (let i in columns) {
                let columnInfo = [...columns[i]];
                //columnInfo = columnInfo.map(c => c.split('\n').filter(r => r).join(" "));

                //DEFINIR VALOR
                columns[i] = columnInfo[0];

                //se type
                if (i == 1) {
                    let type = columnInfo[0];

                    if (type == "Boolean") possibleValues.constants = [{
                            name: true
                        },
                        {
                            name: false
                        }
                    ];

                    else if (type == "Number" || type == "Real" || type == "Unit") {
                        possibleValues.from = Number.MAX_SAFE_INTEGER;
                        possibleValues.to = Number.MIN_SAFE_INTEGER;

                    } else if (type.indexOf("Array") > -1) {

                        let s = type.split(" ");
                        let ofIndex = s.indexOf("of");

                        if (s[ofIndex + 1]) {
                            let leng = Number(s[ofIndex + 1]);
                            if (leng) possibleValues.arrayLength = leng;
                            else {
                                type = s[ofIndex + 1];
                                columns[i] = type;
                                if (type == "Units") type = "Unit";
                            }
                        }

                        if (s[ofIndex + 2]) {
                            type = s[ofIndex + 2];
                            columns[i] = type;
                            if (type == "Units") type = "Unit";
                        }

                        possibleValues.arrayLength = Number.MAX_SAFE_INTEGER
                    }
                }


                //get ranges and array lengths from type or description
                let os = columnInfo;
                if (Array.isArray(os)) os = os.toString()
                os = os.toLowerCase();
                let s = os; //"s" sao os valores da coluna em string

                //ranges
                function removePontuation(s) {
                    s = s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                    s = s.replace(/\s{2,}/g, " ");
                    return s;
                }

                let rangeIndex1 = s.indexOf("range"),
                    rangeIndex2 = s.indexOf("(");

                if (rangeIndex1 > -1) {
                    s = os;
                    s = s.slice(rangeIndex1);
                    s = s.split(" ");

                    let index2 = s.indexOf("-");
                    if (index2 == -1) index2 = s.indexOf("to");
                    if (index2 > -1) {
                        possibleValues.from = Number(removePontuation(s[index2 - 1]));
                        possibleValues.to = Number(removePontuation(s[index2 + 1]));
                        columns[1] = "Number Range";
                    }
                } else if (rangeIndex2 > -1) {
                    s = os;
                    s = s.slice(rangeIndex2);

                    let nextParenthesisIndex = s.indexOf(")");
                    if (nextParenthesisIndex - 1) {
                        s = s.slice(0, nextParenthesisIndex);
                        s = s.split(" ");
                        let index2 = s.indexOf("-");
                        if (index2 == -1) index2 = s.indexOf("to");
                        if (index2 > -1) {
                            possibleValues.from = Number(removePontuation(s[index2 - 1]));
                            possibleValues.to = Number(removePontuation(s[index2 + 1]));
                            columns[1] = "Number Range";
                        }

                    }

                }

                //disable value
                let useNeg1Index = s.indexOf("use -1");
                if (useNeg1Index > -1) possibleValues.disable = -1;

                //array lengths
                let search = "in the format";
                let formatIndex = s.indexOf(search);
                if (formatIndex > -1) {
                    s = s.slice(formatIndex + search.length);
                    s = s.slice(0, s.indexOf("]"));
                    s = s.split(",");
                    possibleValues.arrayLength = s.length

                }

                //no final de analisar cada linha, entrar na dococumentação do type, se necessário
                if (i == 3 && isEmpty(possibleValues)) {
                    let type = columns[1];
                    if (Array.isArray(type)) type = type[0];

                    let toIgnore = ["Number", "Number Range", "Boolean", ""];
                    toIgnore.push(pageID);
                    if (!toIgnore.includes(type)) {
                        let foundPossibleValues = await getPropertiesFrom(type, headers);
                        if (foundPossibleValues) possibleValues = foundPossibleValues;
                    }
                }

                obj[headers[i]] = columns[i];

            }

            if (isEmpty(possibleValues)) return false;
            obj.possibleValues = possibleValues;
            return obj;
        }

        //VALUES TABLE
        function valuesRowToJSON(valuesRaw) {
            var columns = valuesRaw.innerText.split("\t");
            var row = {};
            columns = columns.map(c => c.split('\n').filter(r => r).join(" "))

            row.name = columns[0];
            row.description = columns[1].replace(".", "");
            return row;
        }
        async function valuesTableToPossibleValues(table) {
            var data = {
                constants: []
            };
            for (let i = 1; i < table.rows.length; i++) {
                let row = table.rows[i];
                let valueJSON = valuesRowToJSON(row);
                data.constants.push(valueJSON);
            }
            return data;
        }

        //HEADERS
        async function getHeaders(table) {
            var columns = table.rows[0].innerText.split("\t");
            columns = columns.map(c => c.split('\n').filter(r => r).join(" "))
            return columns;
        }

        async function tableToJson(table) {
            var data = {};
            var headers = await getHeaders(table);
            let isProperties = headers[0] == "Property";
            let isValues = headers[0] == "Name";

            if (isProperties) {
                for (let i = 1; i < table.rows.length; i++) {
                    let row = table.rows[i];
                    let columns = await tableRowToJSON(row, headers);
                    /*if (columns) {
                        let obj = {}
                        for (let j = 0; j < headers.length; j++) obj[headers[j]] = columns[j];
                        data[columns[0]] = obj;
                    }*/
                }

            } else if (isValues) data = await valuesTableToPossibleValues(table);

            else console.log("Is not properties nor values!");

            return data;
        }



        let sections = Array.from(document.getElementsByClassName("section"));
        let tableSection = sections.find(s => s.id.indexOf("iProps") > -1);
        if (!tableSection) return {};
        let table = tableSection.getElementsByTagName("table");

        table = table[0];
        table = await tableToJson(table);
        return table

    }, pageID);

    page.close();

    browser.close();

    return content;

}

async function getGenes() {
    let json = await getPropertiesFrom("PageItem");
    if (!json) json = {};

    //WRITE FILE
    let content = JSON.stringify(json);
    //console.log(content)

    try {
        content = "let genes = " + content;
        fs.writeFileSync('./js/genes.js', content)
    } catch (err) {
        console.error(err)
    }
}


module.exports = {
    'getGenes': getGenes,
}