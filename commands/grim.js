const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");

async function grim(message, number, options, command) {
    const grim = message.client.games[parseInt(number, 10) - 1]?.Grimoire;
    let grimOk;
    if (grim !== undefined) {
        grimOk = (await fetch(grim)).ok;
    } else {
        grimOk = false;
    }

    if (grimOk) {
        await sendMessage(message, grim);
    } else {
        await sendMessage(message, "404: Grimoire not found!");
    }
}

function defGrim(comm, message) {
    comm.command("grim")
        .description("View the grimoire of the given game")
        .argument("<number>", "Game number")
        .action(async (number, options, command) => await grim(message, number, options, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { grim: grim, defGrim: defGrim };
