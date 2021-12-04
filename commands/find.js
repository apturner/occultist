const _ = require("lodash");
const { defHelper, actionHelper } = require("../functions/countFindHelper");
const sendMessage = require("../functions/sendMessage");

async function find(message, options, command) {
    result = _.map(
        actionHelper(message, options, command, false),
        (game) => game.Number
    );

    // Send result
    await sendMessage(
        message,
        `Game numbers of games satisfying given constraints: ${
            "[" + result.join(", ") + "]"
        }`
    );
}

function defFind(comm, message) {
    defHelper(
        comm,
        message,
        "find",
        "Find game numbers, subject to optional filters",
        find
    );
}

module.exports = { find: find, defFind: defFind };
