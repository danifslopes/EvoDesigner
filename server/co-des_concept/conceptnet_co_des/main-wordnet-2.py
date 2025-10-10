# https://www.geeksforgeeks.org/nlp-wupalmer-wordnet-similarity/
# https://github.com/gunthercox/ChatterBot/issues/930#issuecomment-322111087
# https://stackoverflow.com/questions/63514884/does-wordnet-python-nltk-interface-includes-any-measure-of-semantic-relatedness
from nltk.corpus import wordnet
from flask import Flask, jsonify, request
import numpy as np

app = Flask(__name__)

# SIMILARITY
def getSimilarity(w1, w2):
    syn1 = wordnet.synsets(w1)[0]
    syn2 = wordnet.synsets(w2)[0]
    return (syn1.wup_similarity(syn2))


# LABELS
def getLabelScores(label, keywords):
    allScores = []
    for k in keywords:
        allScores.append(getSimilarity(label, k))
    return allScores


def createLabel(label, keywords):
    scores = getLabelScores(label, keywords)
    return {
        "name": label,
        "probToRun": max(scores),
        "allScores": scores
    }


def getLabelsList(labels, keywords):
    labelScores = []
    for l in labels:
        labelScores.append(createLabel(l, keywords))
    return labelScores


# REQUESTS
@app.route('/similarity', methods=['POST', 'GET'])
def handleRequest():
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
    app.run()
