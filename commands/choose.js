const makeChoice = require("../functions/makeChoice");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");

async function choose(message, choices, options, command) {
    await sendMessage(
        message,
        makeChoice(choices)
    );
}

function defChoose(comm, message) {
    comm.command("choose")
        .description("Randomly choose from among given options")
        .argument("<choice...>", "Items to choose from")
        .action(
            async (choices, options, command) => await choose(message, choices, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { choose: choose, defChoose: defChoose };
