# -*- coding: utf-8 -*-

#to run: gunicorn -w 4 -b 127.0.0.1:5001 main:app

import easyocr  # https://jaided.ai/easyocr/tutorial/
from flask import Flask, request
import os
from words_v2 import *
import json
import csv

# SERVER
app = Flask(__name__)
# OCR
reader = easyocr.Reader(['en'])

def testPosters():
    file = open('posters_trans.csv')
    csvreader = csv.reader(file, delimiter=';')
    header = next(csvreader)
    results = []
    resultsCSV = \
        'index;' + \
        'form;' + \
        'type;' + \
        'url;' + \
        'missingLettersInA;' + \
        'lettersInA;' + \
        'lettersInB;' + \
        'wordsInA;' + \
        'wordsInB;' + \
        'totalLevBetweenMatches;' + \
        'maxLevBetweenMatches;' + \
        'numLettersMatchesA;' + \
        'numLettersMatchesB;' + \
        'perc;' + \
        'intDist;' + \
        'maxIntDist;' + \
        'levFullSentences;' + \
        'output' + \
        '\n'

    i = 0
    for cols in csvreader:
        if cols[1] == 'b' or cols[1] == '' or cols[3] == '':
            continue
        path = 'imgs/'+cols[2]
        orig_text = cols[3] or ''
        output = reader.readtext(path, detail=0)
        output = ' '.join(output)

        if os.path.exists("image.jpeg"):
            os.remove("image.jpeg")

        #2 — compare to original text
        orig_text = ''.join(map(str, orig_text))
        result = string_distance(orig_text, output)

        json_result = {'result': result, 'detected': output}
        resultsCSV = \
            resultsCSV + str(i) + ';' + \
            cols[0] + ';' + \
            cols[1] + ';' + \
            path + ';' + \
            str(result['missingLettersInA']) + ';' + \
            str(result['lettersInA']) + ';' + \
            str(result['lettersInB']) + ';' + \
            str(result['wordsInA']) + ';' + \
            str(result['wordsInB']) + ';' + \
            str(result['totalLevBetweenMatches']) + ';' + \
            str(result['maxLevBetweenMatches']) + ';' + \
            str(result['numLettersMatchesA']) + ';' + \
            str(result['numLettersMatchesB']) + ';' + \
            str(result['perc']) + ';' + \
            str(result['intDist']) + ';' + \
            str(result['maxIntDist']) + ';' + \
            str(result['levFullSentences']) + ';' + \
            output + \
            '\n'
        results.append(json_result)
        i += 1

    file.close()

    #csv
    f = open("words 2.csv", "w")
    f.write(resultsCSV)
    f.close()

    return json.dumps(results)

def evaluate_legibility(data):
    fileName = data['fileName']
    path = '../../api/receivedImgs/' + fileName
    output = reader.readtext(path, detail=0)
    output = ' '.join(output)
    orig_text = data['orig_text']
    result = string_distance2(orig_text, output)
    distance = max(0,1.0-(result['macedoSumDIST']/result['macedoLIA']))
    json_result = {'result': distance, 'detected': output}
    return json.dumps(json_result)

@app.route('/legibility', methods=['POST', 'GET'])
def handleRequest():
    if request.method == 'POST':
        data = request.get_json()
        return evaluate_legibility(data)

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5001)
