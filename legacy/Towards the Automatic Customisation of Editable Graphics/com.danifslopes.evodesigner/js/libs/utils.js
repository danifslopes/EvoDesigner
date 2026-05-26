/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(elementoDePesquisa, pontoInicial) {
        var k;

        //1. Deixe-o ser o resultado da chamada de toObject
        // passando o valor de this como argumento.
        if (this == null) {
            throw new TypeError('"this" é nulo (null) ou não foi definido (undefined)');
        }

        var O = Object(this);

        // 2. Deixar o tamanhoValor ser o resultado da
        // chamada do método interno Get de 0 com o
        // argumento "length"
        // 3. Deixar o  tamanhoValor ser um ToUint32(tamanhoValor).
        var tamanho = O.length >>> 0;

        // 4. se o tamanho é 0, retorna -1.
        if (tamanho === 0) {
            return -1;
        }

        // 5. Se o argumento pontoInicial for passado,
        // use o ToInteger(pontoInicial); senao use 0.
        var n = +pontoInicial || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        //6. Se n >= tamanho, retorna -1.
        if (n >= tamanho) {
            return -1;
        }

        // 7. Se n>= 0, entao k seja n.
        // 8. Senao, n<0, k seja tamanho - abs(n).
        // Se k é menor que 0, entao k seja 0.
        k = Math.max(n >= 0 ? n : tamanho - Math.abs(n), 0);

        // 9. Repita, enquanto k < tamanho
        while (k < tamanho) {
            // a. Deixe Pk ser ToString(k).
            //    isto é implicito para operandos LHS de um operador

            // b. Deixe o kPresent  ser o resultado da chamada do método
            //    interno de 0 com argumento Pk
            //    Este passo pode ser combinado com c.
            // c. Se kPresent é true, entao
            //    i.  Deixe o  elementK ser o resultado da chamada do metodo
            //        interno Get de 0 com argumento ToString(k)
            //   ii.  Deixe o resultado ser aplicado pelo Algoritmo de
            //        Comparação de Igualdade Estrita (Strict Equality Comparison)
            //        para o elementoDePesquisa e elementK
            //  iii.  caso verdadeiro, retorne k.
            if (k in O && O[k] === elementoDePesquisa) {
                return k;
            }
            k++;
        }
        return -1;
    };
}

Array.prototype.unique = function() {
    var r = new Array();
    o: for (var i = 0, n = this.length; i < n; i++) {
        for (var x = 0, y = r.length; x < y; x++) {
            if (r[x] == this[i]) continue o;
        }
        r[r.length] = this[i];
    }
    return r;
}

Array.prototype.findIn = function(search) {
    var r = Array();
    for (var i = 0; i < this.length; i++)
        if (this[i].indexOf(search) != -1) {
            //r.push(this[i].substr(this[i].indexOf("\t") + 1, this[i].length));
            r.push(this[i]);
        }
    return r;
}

Array.prototype.findFirst = function(checker) {
    var r;
    for (var i = 0; i < this.length; i++)
        if (checker(this[i])) {
            r = this[i];
            break;
        }
    return r;
}

Array.prototype.findAll = function(checker) {
    var r = [];
    for (var i = 0; i < this.length; i++)
        if (checker(this[i])) {
            r.push(this[i]);
        }
    return r;
}

Array.prototype.filter = function(test) {
    var results = [];
    for (var i = 0; i < this.length; i++) {
        if (test(this[i])) {
            results.push(this[i]);
        }
    }
    return results;
};

Array.prototype.randomIndex = function() {
    return randomInt(0, this.length - 1);
};

Array.prototype.spliceRandom = function() {
    return this.splice(this.randomIndex(), 1)[0];
};

Array.prototype.remove = function(index) {
    return this.splice(index, 1)[0];
};

//https://www.freecodecamp.org/news/how-array-prototype-map-works-b6b69379c3af/
/*Array.prototype.map implementation*/
Array.prototype.map = function (callback/*, thisArg*/) {
    var T, A, k;
    if (this == null) {
        throw new TypeError('this is null or not defined');
    }
    var O = Object(this);
    var len = O.length >>> 0;
    if (typeof callback !== 'function') {
        throw new TypeError(callback + ' is not a function');
    }
    if (arguments.length > 1) { 
        T = arguments[1];
    }
    A = new Array(len);
    k = 0;
    while (k < len) {
        var kValue, mappedValue;
        if (k in O) {
            kValue = O[k];
            mappedValue = callback.call(T, kValue, k, O);            
            A[k] = mappedValue;
        }
        k++;
    }
    return A;
};

function randomInt(min, max) {
    var r = Math.random();
    while (isNaN(r)) r = Math.random();
    return Math.round(r * (max - min)) + min;
}

function randomIndex(arr) {
    return randomInt(0, arr.length - 1);
}

function randomFloat(min, max) {
    var r = Math.random();
    while (isNaN(r)) r = Math.random();
    return (r * (max - min)) + min;
}

function removeDuplicated(a) {
    //https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
    var seen = {};
    var out = [];
    var len = a.length;
    var j = 0;
    for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
            seen[item] = 1;
            out[j++] = item;
        }
    }
    return out;
}

function limit(v, min, max) {
    if (v > max) v = max;
    if (v < min) v = min;
    return v;
}

function isObject(o) {
    return typeof o === 'object' && !isArray(o) && o !== null
}

function objPropsToArray(obj, propName) {
    var arr= [];
    forEach(obj, function(i) {
       arr.push(i[propName]);
    });
    return arr;
}

function HSVtoRGB(h, s, v) {
    //https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    /* accepts parameters: h  Object = {h:x, s:y, v:z} OR h, s, v*/

    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0:
            r = v, g = t, b = p;
            break;
        case 1:
            r = q, g = v, b = p;
            break;
        case 2:
            r = p, g = v, b = t;
            break;
        case 3:
            r = p, g = q, b = v;
            break;
        case 4:
            r = t, g = p, b = v;
            break;
        case 5:
            r = v, g = p, b = q;
            break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

//https://gist.github.com/ltfschoen/79ab3e98723e61660117
var getObjectKeys = function(associativeArrayObject) {
    var arrayWithKeys=[], associativeArrayObject;
    for (key in associativeArrayObject) {
      // Avoid returning these keys from the Associative Array that are stored in it for some reason
      if (key !== undefined && key !== "toJSONString" && key !== "parseJSON" ) {
        arrayWithKeys.push(key);
      }
    }
    return arrayWithKeys;
  }

function logToFile(txt) {
   // fileLog += "\n" + txt;
   // saveString(logPath, fileLog);
   // $.writeln(txt);
}

//nao funciona como queria
function equal(obj1, obj2) {
    var props1 = JSON.parse(JSON.stringify(obj1.properties));
    delete props1.id;
    delete props1.index;
    props1 = JSON.stringify(props1);

    var props2 = JSON.parse(JSON.stringify(obj2.properties));
    delete props2.id;
    delete props2.index;
    props2 = JSON.stringify(props2);

    return props1 == props2;
}



  