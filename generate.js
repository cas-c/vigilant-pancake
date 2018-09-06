// options
// --word
// ----string form of word
// ----next children and how often they occur
// const options = new Map(["_end", { count: 1, next: null, str: "." }]);

const options = new Map();

const update = (word, index, arr) => {
    let next = null;
    let nextWord = "";
    let possibleEnding = false;
    if (index !== arr.length - 1) {
        nextWord = arr[index + 1];
        next = new Map().set(nextWord, {
            count: 1,
            str: nextWord,
            homo: true
        });
    } else {
        if (
            !["the", "and", "is"].some(s => word.endsWith(s) || word === s) &&
            arr.length > 4
        ) {
            possibleEnding = true;
        }
    }
    if (word.endsWith(".")) {
        possibleEnding = true;
    }
    if (!options.get(word)) {
        options.set(word, {
            count: 1,
            str: word,
            next,
            possibleEnding
        });
    } else {
        const current = options.get(word);
        possibleEnding = current.possibleEnding;
        if (current.next && !next) {
            next = current.next;
        } else if (current.next && next) {
            if (current.next.get(nextWord)) {
                next.set(nextWord, {
                    count: current.next.get(nextWord) + 1,
                    str: nextWord
                });
            } else {
                next.set(nextWord, {
                    count: 1,
                    str: nextWord
                });
                next = new Map([...next, ...current.next]);
            }
        }
        options.set(word, {
            str: word,
            ...current,
            count: current.count + 1,
            next,
            possibleEnding
        });
    }
};

function updateDatabase(sentence) {
    const tokens = sentence.split(" "); // convert corpus to tokens;
    tokens.forEach(update);
    const doubles = [];
    const doublesPlusOne = [];
    sentence.split(" ").forEach((word, index, ths) => {
        if (index !== ths.length && index % 2) {
            let doubleKey = `${word} ${ths[index + 1]}`;
            doubles.push(doubleKey);
            if (index < ths.length - 2) {
                doublesPlusOne.push(doubleKey);
                doublesPlusOne.push(ths[index + 2]);
            }
        }
    });
    doubles.forEach(update);
    doublesPlusOne.forEach(update);
}

const generate = require("./poc");
const fweddy = require("./fweddy");
fweddy.forEach(updateDatabase);
const fs = require("graceful-fs");
fs.readdir("./out", (err, items) => {
    items.forEach(blog => {
        let bleg = require("./out/" + blog);
        if (typeof bleg !== "object") {
            updateDatabase(bleg);
        } else {
            bleg.forEach(updateDatabase);
        }
    });
    fs.writeFile("brain.json", JSON.stringify(options), (err, options) => {
        if (err) throw err;
        console.log("saved brain.");
    });
});
