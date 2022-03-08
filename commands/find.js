const _ = require("lodash");
const { defHelper, actionHelper } = require("../functions/countFindHelper");
const sendMessage = require("../functions/sendMessage");

async function find(message, options, command) {
    result = _.map(
        actionHelper(message, options, command, false),

        options.versus === undefined
            ? (game) => game.Number
            : (gameList) => _.map(gameList, (game) => game.Number)
    );

    // Send result
    await sendMessage(
        message,
        `Game numbers of games satisfying given constraints: ${
            options.versus === undefined
                ? "[" + result.join(", ") + "]"
                : "[" +
                  _.map(
                      result,
                      (gameList) => "[" + gameList.join(", ") + "]"
                  ).join(", ") +
                  "]"
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
