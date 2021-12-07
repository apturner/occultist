const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");

async function choose(message, choice, command) {
    await sendMessage(
        message,
        choice[Math.floor(Math.random() * choice.length)]
    );
}

function defChoose(comm, message) {
    comm.command("choose")
        .description("Randomly choose from among given options")
        .argument("<choice...>", "Items to choose from")
        .action(async (choices, command) => choose(message, choices, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { choose: choose, defChoose: defChoose };
