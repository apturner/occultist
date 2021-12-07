const { Option } = require("commander");
const getWinRate = require("../functions/getWinRate");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const stringFormat = require("../functions/stringFormat");
const characterFormat = require("../data/characterFormat");
const nameFormat = require("../data/nameFormat");
const usernameName = require("../data/usernameName");

async function winRate(message, player, options, command) {
    // If no player given, set player to caller
    if (player === undefined) {
        player = usernameName[message.author.username];
    }

    const {
        result,
        wins,
        plays,
        playerFound,
        initialCharacterFound,
        finalCharacterFound,
    } = getWinRate(message.client.games, player, {
        initialCharacter: options.character,
        finalCharacter: options.finalCharacter,
        initialType: options.type,
        finalType: options.finalType,
        initialAlignment: options.alignment,
        finalAlignment: options.finalAlignment,
    });

    let response;
    if (playerFound !== true) {
        response = `No player found with name "${player}".`;
    } else if (initialCharacterFound !== true) {
        response = `No character found with name "${options.character}".`;
    } else if (finalCharacterFound !== true) {
        response = `No character found with name "${options.finalCharacter}".`;
    } else {
        response = `${nameFormat[stringFormat(player)]}'s win rate${
            options.character || options.type || options.alignment
                ? " starting as"
                : ""
        }${options.alignment ? " " + options.alignment : ""}${
            options.type ? " " + options.type : ""
        }${
            options.character
                ? " " + characterFormat[stringFormat(options.character)]
                : ""
        }${
            (options.character || options.type || options.alignment) &&
            (options.finalCharacter ||
                options.finalType ||
                options.finalAlignment)
                ? " and"
                : ""
        }${
            options.finalCharacter ||
            options.finalType ||
            options.finalAlignment
                ? " ending as"
                : ""
        }${options.finalAlignment ? " " + options.finalAlignment : ""}${
            options.finalType ? " " + options.finalType : ""
        }${
            options.finalCharacter
                ? " " + characterFormat[stringFormat(options.finalCharacter)]
                : ""
        }: ${options.fraction ? `${wins}/${plays}` : result}`;
    }

    // Send result
    await sendMessage(message, response);
}

function defWinRate(comm, message) {
    comm.command("winrate")
        .description(
            "Get the win rate for the specified player, with optional filters"
        )
        .argument("[player]", "Player to find win rate of (default: caller)")
        .option("-k, --character <character>", "Initial character")
        .option("-K, --final-character <character>", "Final character")
        .option("-t, --type <type>", "Initial character type")
        .option("-T, --final-type <type>", "Final character type")
        .option("-a, --alignment <alignment>", "Initial alignment")
        .option("-A, --final-alignment <alignment>", "Final alignment")
        .option("-f, --fraction", "Show result as unreduced fraction")
        .action(async (player, options, command) =>
            winRate(message, player, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { winRate: winRate, defWinRate: defWinRate };
