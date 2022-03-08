const { defHelper, actionHelper } = require("../functions/countFindHelper");
const sendMessage = require("../functions/sendMessage");

async function count(message, options, command) {
    const result = actionHelper(message, options, command, true);

    let response;
    if (result === NaN) {
        response = "Invalid constraints given.";
    } else if (options.versus === undefined) {
        response = `Number of games satisfying given constraints: ${result}`;
    } else {
        response = `Number of games satisfying given constraints: ${result}`;
    }

    // Send result
    await sendMessage(message, response);
}

function defCount(comm, message) {
    defHelper(
        comm,
        message,
        "count",
        "Count games, subject to optional filters",
        count
    );
}

module.exports = { count: count, defCount: defCount };
