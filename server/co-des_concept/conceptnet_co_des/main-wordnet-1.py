# https://www.geeksforgeeks.org/nlp-wupalmer-wordnet-similarity/
# https://github.com/gunthercox/ChatterBot/issues/930#issuecomment-322111087
from nltk.corpus import wordnet
from flask import Flask, jsonify, request

app = Flask(__name__)

#SIMILARITY
def getSimilarity(w1, w2):
    syn1 = wordnet.synsets(w1)[0]
    syn2 = wordnet.synsets(w2)[0]
    return( syn1.wup_similarity(syn2) )

#SERVER
@app.route('/similarity')
def with_parameters():
    w1 = request.args.get('w1')
    w2 = request.args.get('w2')
    s = getSimilarity(w1, w2)
    return jsonify(value=s)

if __name__ == '__main__':
    app.run()
