const _ = require("lodash");
const { defHelper, actionHelper } = require("../functions/countFindHelper");
const getCountFindString = require("../functions/getCountFindString");
const sendMessage = require("../functions/sendMessage");

async function find(message, options, command) {
    const result = _.map(
        actionHelper(message, options, command, false),
        options.versus === undefined
            ? (game) => game.Number
            : (gameList) => _.map(gameList, (game) => game.Number)
    );

    response =
        getCountFindString(options, false, result) +
        `${
            options.versus === undefined
                ? "**[" + result.join(", ") + "]**"
                : "\n" +
                  _.map(
                      result,
                      (gameList) => "**[" + gameList.join(", ") + "]**"
                  ).join("\n")
        }`;

    // Send result
    await sendMessage(message, response);
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
