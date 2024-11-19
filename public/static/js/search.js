// search.js
function wordsCount(doc) {
    const words = doc.split(/\s+/); // Utilisation d'un regex pour gérer tous les types d'espaces
    return words.length;
}

function wordOccurences(doc, word) {
    const words = doc.split(/\s+/);
    let count = 0;
    words.forEach(w => {
        if (w.toLowerCase() === word.toLowerCase()) {  // Comparaison insensible à la casse
            count += 1;
        }
    });
    return count;
}

function tf(word, document) {
    let totalWords = wordsCount(document);
    let wordFrequency = wordOccurences(document, word);
    return wordFrequency / totalWords;  // TF : Fréquence du mot divisé par le total de mots
}

function idf(word, documents) {
    let docAmount = documents.length;
    let docsWithWord = documents.filter(doc => wordOccurences(doc.description, word) > 0).length;

    if (docsWithWord === 0) return 0;

    return Math.log(docAmount / docsWithWord);  // IDF : Log du ratio docs / docs contenant le mot
}

function tf_idf(word, document, documents) {
    return tf(word, document) * idf(word, documents);
}

module.exports = { tf, idf, tf_idf, wordsCount, wordOccurences };
