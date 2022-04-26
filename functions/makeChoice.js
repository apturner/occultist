function makeChoice(choices) {
    return choices[Math.floor(Math.random() * choices.length)]
}

module.exports = makeChoice;
