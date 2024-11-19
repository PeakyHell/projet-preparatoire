function wordsCount (doc) {
    if (doc.length === 0) {
        return 0
    }
    else if (doc.length === 1) {
        return 1
    }
    else {
        const words = doc.split(" ")
        return words.length
    }
}

function wordOccurences (doc, word) {
    const words = doc.split(" ")
    let count = 0
    words.forEach (w => {
        if (w === word) {
            count += 1
        }
    })
    return count
}

function tf(word, document) {
    let countOfWords = wordsCount(document)
    let occurencesOfWord = wordOccurences(document, word)
    if (countOfWords === 0) {
        return 0
    }
    return Math.log(1+(occurencesOfWord/countOfWords))
}

function idf(word, documents) {
    // documents sera lié à la base de données
    let docAmount = documents.length
    let docsWithWord = 0

    documents.forEach(doc => {
        if (wordOccurences(doc, word) > 0) {
            docsWithWord += 1
        }
    })
    if (docsWithWord === 0) {
        return 0
    }
    return Math.log(docAmount/docsWithWord)
}

function tf_idf(word, document, documents) {
    return tf(word, document) * idf(word, documents)
}

module.exports = { tf_idf }
