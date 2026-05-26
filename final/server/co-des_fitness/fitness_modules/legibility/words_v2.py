# //lopes distance, by Danie'Lopes //Python

from Levenshtein import distance
import math

# string_distance("SMALL Daniel  is  and cool nice cool", "Daniel SMALL is is nice AnID CQOL")
def string_distance(a, b):
    #print("")
    #print("COMEÇA")

    # orig
    a = a.lower().split(" ")
    a = [x for x in a if x.strip() != '']  # garantir que o array nao tem casas vazias
    lettersInA = len(''.join(map(str,
                                 a)))  # length do texto inteiro sem espaços # map(str, a) só é preciso se os valores do array nao forem string
    wordsInA = len(a)

    print("frase original:", a)
    print("lettersInA:", lettersInA)
    print("wordsInA:", wordsInA)
    #print("")

    # detected
    b = b.lower().split(" ")
    b = [x for x in b if x.strip() != '']  # garantir que o array nao tem casas vazias
    lettersInB = len(''.join(map(str, b)))  # length do texto inteiro sem espaços
    wordsInB = len(b)
    print("frase detetada:", b)
    print("lettersInB:", lettersInB)
    print("wordsInB:", wordsInB)
    #print("")

    numLettersMatchesA = 0
    numLettersMatchesB = 0

    matches = []
    for i in range(len(b)):
        wb = b[i]  # word in b
        closer = ""
        minDist = math.inf
        order_a = -1  # para guardar a posição da palavra na frase A (para ver as palavras em A e B estao na mesma ordem)

        for j in range(len(a)):  # encontrar a palavra mais pareceida
            wa = a[j]  # word in a
            dist = distance(wb, wa)
            if dist < minDist:
                minDist = dist
                closer = wa
                order_a = j

        if closer != "":  # se ha match, remove a palavra em A +. no fim ficam apenas as que nao têm match
            a.remove(closer)
        else:  # se nao ha match, break aqui
            break

        next_detected = ''
        next_orig = ''
        if i < len(b) - 1:  # se nao é a ultima palavra de B
            next_detected = b[i + 1]
        if order_a < len(a) - 1:
            next_orig = a[order_a + 1]

        numLettersMatchesA += len(closer)
        numLettersMatchesB += len(wb)
        # para cada palavra em b, guarda um match
        matches.append({"detected": wb, "orig": closer, "dist": minDist, "order_b": i, "order_a": order_a,
                        "next_detected": next_detected, "next_orig": next_orig})

    #print("matches:", matches)
    #print("palavras de A sem match:", a)
    missingLettersInA = len(''.join(map(str, a)))
    #print("missingLettersInA", missingLettersInA)

    ##################
    # CALCULAR FITNESS:
    dist = 0
    maxDist = 0

    # 1: +num LETRAS nao detetadas (das palavras --nao detetadas-- )
    dist += missingLettersInA
    maxDist += lettersInA  # todo: faz sentido ser lettersInA ?
    #print("num letras das palavras sem match:", missingLettersInA, "max:", lettersInA)

    # 2: + levenstein, entre matches (originais com detetadas)
    maxLev = 0
    totalLev = 0
    for m in matches:
        thisLev = m['dist']  # lev dist entre wa e wb
        thisMaxLev = len(m['orig']) # num letras da palavra original (se for x3 piora a performance em comparação com as respostas dos users)
        if thisLev > thisMaxLev:
            thisMaxLev = thisLev
        maxLev += thisMaxLev
        totalLev += thisLev
    dist += totalLev

    if maxLev == 0:
        maxLev = 1 #para depois nao dividir o lev por 0

    maxDist += maxLev
    #print("lev letras erradas em palavras com match:", totalLev, "maxlev:", maxLev)

    # 3: + levenstein na frase toda, por cada palavra (por palavras trocadas). Só conta metade porque trocar nao é tão grave
    wrongNextWords = 0
    maxWrongNextWords = len(matches)
    for match in matches:
        if match['next_detected'] != match['next_orig']:
            wrongNextWords += 1
    # dist += wrongNextWords / 2 # so conta metade porque este  criteriio nao é mt importante
    # maxDist += maxWrongNextWords / 2 # so conta metade porque este  criteriio nao é mt importante
    # print("wrongNextWords:", wrongNextWords, "max", maxWrongNextWords)

    # final percentage
    percFinal = 1 - (dist / maxDist)
    percFinal = round(percFinal, 3)

    # TODO: usar a confiança com que ele detetou cada palavra para pesar a legibilidade de cada palavra
    return {
        "perc": percFinal,
        "missingLettersInA": missingLettersInA,
        "lettersInA": lettersInA,
        "lettersInB": lettersInB,
        "wordsInA": wordsInA,
        "wordsInB": wordsInB,
        "totalLev": totalLev,
        "maxLev": maxLev,
        "numLettersMatchesA": numLettersMatchesA,
        "numLettersMatchesB": numLettersMatchesA,
        "dist": dist,
        "maxDist": maxDist,
    }

def string_distance2(a, b):
    #print("")
    #print("COMEÇA")

    # orig
    a = a.lower().split(" ")
    a = [x for x in a if x.strip() != '']  # garantir que o array nao tem casas vazias
    lettersInA = len(''.join(map(str,
                                 a)))  # length do texto inteiro sem espaços # map(str, a) só é preciso se os valores do array nao forem string
    wordsInA = len(a)
    #print("frase original:", a)
    #print("lettersInA:", lettersInA)
    #print("wordsInA:", wordsInA)
    #print("")

    # detected
    b = b.lower().split(" ")
    b = [x for x in b if x.strip() != '']  # garantir que o array nao tem casas vazias
    lettersInB = len(''.join(map(str, b)))  # length do texto inteiro sem espaços
    wordsInB = len(b)
    #print("frase detetada:", b)
    #print("lettersInB:", lettersInB)
    #print("wordsInB:", wordsInB)
    #print("")

    remainingWordsInA = a[:]
    remainingWordsInB = b[:]
    initialLettersInB = initialLettersInA = 0
    #print('INITIAL')
    for ai in remainingWordsInB:
        initialLettersInB+=len(ai)
    for ai in remainingWordsInA:
        initialLettersInA += len(ai)
        #print(ai, initialLettersInA)
        if ai in remainingWordsInB:
            #remainingWordsInA.remove(ai)
            #remainingWordsInB.remove(ai)
            remainingWordsInA[remainingWordsInA.index(ai)] = None
            remainingWordsInB[remainingWordsInB.index(ai)] = None

    remainingLettersInB = remainingLettersInA = 0


    #print('REMAINING ')
    for ai in remainingWordsInA:
        if ai is not None:
            remainingLettersInA +=len(ai)
            #print(ai, len(ai))

    for bi in remainingWordsInB:

        if bi is not None:
            remainingLettersInB +=len(bi)

    #print('remainingLettersInA', remainingLettersInA, 'initialLettersInA', initialLettersInA)



    numLettersMatchesA = 0
    numLettersMatchesB = 0

    matches = []
    a_copia = a[:]

    for i in range(len(b)):
        wb = b[i]  # word in b
        closer = ""
        minDist = math.inf
        order_a = -1  # para guardar a posição da palavra na frase A (para ver as palavras em A e B estao na mesma ordem)

        for j in range(len(a)):  # encontrar a palavra mais pareceida
            wa = a[j]  # word in a
            dist = distance(wb, wa)
            if dist < minDist:
                minDist = dist
                closer = wa
                order_a = j

        if closer != "":  # se ha match, remove a palavra em A +. no fim ficam apenas as que nao têm match
            a.remove(closer)
            b[i] = None
        else:  # se nao ha match, break aqui
            break

        next_detected = ''
        next_orig = ''
        if i < len(b) - 1:  # se nao é a ultima palavra de B
            next_detected = b[i + 1]
        if order_a < len(a) - 1:
            next_orig = a[order_a + 1]

        numLettersMatchesA += len(closer)
        numLettersMatchesB += len(wb)
        # para cada palavra em b, guarda um match
        matches.append({"detected": wb, "orig": closer, "dist": minDist, "order_b": i, "order_a": order_a,
                        "next_detected": next_detected, "next_orig": next_orig})

    #remainingWordsInA = a_copia[:]
    sumDist=0
    #print('len matches', len(matches), len(remainingWordsInA), )
    for m in matches:
        #print('removing', m['orig'])
        sumDist+=m['dist']
        #try:
        #    remainingWordsInA.remove(m['orig'])
        #except:
        #    pass
    #print('Sum dist matches', sumDist)
    for ai in a:
        sumDist+=len(ai)
    #print('Sum Dist depois do matches', sumDist)

    #print('SUM DIST', sumDist, 'initialLettersInA', initialLettersInA, 1.0-sumDist/initialLettersInA)
    #print("matches:", matches)
    #print(remainingWordsInA)
    #exit()

    #print("palavras de A sem match:", a)
    missingLettersInA = len(''.join(map(str, a)))
    #print("missingLettersInA", missingLettersInA)

    ##################
    #bench mark: levenstein entre frase original e detected

    levAB = distance(a, b)

    ##################
    # CALCULAR FITNESS:
    dist = 0
    maxDist = 0

    # 1: +num LETRAS nao detetadas (das palavras --nao detetadas-- )
    dist += missingLettersInA
    #print('missingLettersInA', missingLettersInA)
    maxDist += lettersInA  # todo: faz sentido ser lettersInA ?
    #print("num letras das palavras sem match:", missingLettersInA, "max:", lettersInA)

    # 2: + levenstein, entre matches (originais com detetadas)
    maxLev = 0
    totalLev = 0
    for m in matches:
        thisLev = m['dist']  # lev dist entre wa e wb
        thisMaxLev = len(m['orig']) # num letras da palavra original (se for x3 piora a performance em comparação com as respostas dos users)
        if thisLev > thisMaxLev:
            thisMaxLev = thisLev
        maxLev += thisMaxLev
        totalLev += thisLev
    dist += totalLev
    #print('dist after matches', dist)

    if maxLev == 0:
        maxLev = 1 #para depois nao dividir o lev por 0

    maxDist += maxLev
    #print("lev letras erradas em palavras com match:", totalLev, "maxlev:", maxLev)

    # 3: + levenstein na frase toda, por cada palavra (por palavras trocadas). Só conta metade porque trocar nao é tão grave
    #wrongNextWords = 0
    #maxWrongNextWords = len(matches)
    #for match in matches:
    #    if match['next_detected'] != match['next_orig']:
    #        wrongNextWords += 1
    # dist += wrongNextWords / 2 # so conta metade porque este  criteriio nao é mt importante
    # maxDist += maxWrongNextWords / 2 # so conta metade porque este  criteriio nao é mt importante
    # print("wrongNextWords:", wrongNextWords, "max", maxWrongNextWords)

    # final percentage
    percFinal = 1 - (dist / maxDist)
    percFinal = round(percFinal, 3)
    #print('percfinal', percFinal, 'maxDist', maxDist)
    # TODO: usar a confiança com que ele detetou cada palavra para pesar a legibilidade de cada palavra
    levAB = 1.0-(levAB*1.0/max(lettersInA, lettersInB))
    if levAB < 0:
        levAB = 0

    return {
        "perc": percFinal,
        "missingLettersInA": missingLettersInA,
        "lettersInA": lettersInA,
        "lettersInB": lettersInB,
        "wordsInA": wordsInA,
        "wordsInB": wordsInB,
        "totalLevBetweenMatches": totalLev,
        "maxLevBetweenMatches": maxLev,
        "numLettersMatchesA": numLettersMatchesA,
        "numLettersMatchesB": numLettersMatchesA,
        "intDist": dist,
        "maxIntDist": maxDist,
        "levFullSentences": levAB,
        'macedoMIA': remainingLettersInA,
        'macedoLIA': initialLettersInA,
        'macedoMIB': remainingLettersInB,
        'macedoLIB': initialLettersInB,
        'macedoSumDIST':sumDist
    }
