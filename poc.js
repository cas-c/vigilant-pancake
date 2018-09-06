// This allows:
// test2 = JSON.parse(JSON.stringify(options));
// console.log(new Map(new Map(test2).get("be").next));
Map.prototype.toJSON = function() {
    return Array.from(this.entries());
};

const findWord = options => {
    const word = options.get(
        Array.from(options.values())[Math.floor(options.size * Math.random())]
            .str
    );
    if (word.possibleEnding) {
        return findWord(options);
    }
    return word;
};

function generateSentence(seed, options) {
    if (!seed) {
        seed = findWord(options).str;
    }
    let opts = [
        options.get(seed),
        options.get(seed.toLowerCase()),
        options.get(seed.charAt(0).toUpperCase() + seed.slice(1))
    ].filter(n => n);
    let test = opts[Math.floor(opts.length * Math.random())];

    let sentence = [];

    while (test && test.next) {
        sentence.push(test.str);
        if (test.possibleEnding && sentence.length > 2) {
            if (sentence.join(" ").split(`"`).length - 1 === 1) {
                sentence.push(`"`);
            }
            break;
        }
        if (!test.next) break;
        let nextProb = [];
        test.next.forEach(n => {
            Array.from(Array(n.count)).forEach(c => {
                if (!test.str.includes(n.str) && !n.str.includes(test.str)) {
                    nextProb.push(n.str);
                }
            });
        });
        test = options.get(
            nextProb[Math.floor(nextProb.length * Math.random())]
        );
    }
    const output = sentence.join(" ");
    if (sentence.length < 3 || !output || output === undefined) {
        return generateSentence(findWord(options).str, options);
    } else {
        return output;
    }
}

module.exports = generateSentence;
