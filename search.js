function wordsCount (doc) {
    const words = doc.split(" ")
    return words.length
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
    let wordsCount = wordsCount(document)
    let wordOccurences = wordOccurences(document, word)
    return Math.log(1+(wordOccurences/wordsCount))
}

function idf(word) {
    // documents sera lié à la base de données
    const documents = {}
    let docAmount = documents.length
    let docsWithWord = 0

    documents.forEach(doc => {
        if (wordOccurences(doc, word) > 0) {
            docsWithWord += 1
        }
    })

    return Math.log(docAmount/docsWithWord)
}

function tf_idf(word, document) {
    return tf(word, document) * idf(word)
}