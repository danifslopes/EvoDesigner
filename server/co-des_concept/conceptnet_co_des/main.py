import requests
from flask import Flask, jsonify, request, redirect, url_for

app = Flask(__name__)

# SIMILARITY
def getSimilarity(w1, w2):
    #http://beatrix.dei.uc.pt:8080/relatedness?node1=/c/en/sun&node2=/c/en/yellow
    url = 'http://bumblebee.dei.uc.pt:8080/relatedness?node1=/c/en/' + w1 + '&node2=/c/en/' + w2
    data = requests.get(url).json()
    #print(w1, w2, data["value"])
    return data["value"]

# LABELS
def getLabelScores(label, keywords):
    allScores = {"all":[]}
    for k in keywords:
        sim = getSimilarity(label, k)
        allScores[k] = sim
        allScores["all"].append(sim)
    return allScores

def createLabel(label, keywords):
    scores = getLabelScores(label, keywords)
    return {
        "name": label,
        "probToRun": max(scores["all"]),
        "allScores": scores
    }

def getLabelsList(labels, keywords):
    labelScores = {}
    for l in labels:
        labelScores[l] = (createLabel(l, keywords))
    return labelScores

# REQUESTS
# post body example: {"labels":["blue", "yellow"], "keywords": ["sea", "beach"]}
@app.route('/similarity', methods=['POST', 'GET'])
def handleRequest():

    print("request")

    if request.method == 'POST':
        data = request.get_json()
        labels = data['labels']
        keywords = data['keywords']
        return jsonify(getLabelsList(labels, keywords))

    else:
        w1 = request.args.get('w1')
        w2 = request.args.get('w2')
        return jsonify(value=getSimilarity(w1, w2))

if __name__ == '__main__':
    app.run(host='10.3.2.112', port=9002)
