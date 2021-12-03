const { Command, Option } = require("commander");
const _ = require("lodash");
const getWinRate = require("../functions/getWinRate");
const sendCodeBlock = require("../functions/sendCodeBlock");
const characterMap = require("../data/characters");
const nameMap = require("../data/names");

function defWinRate(comm, message) {
    comm.command("winrate")
        .description(
            "Get the win rate for the specified player, with optional filters"
        )
        .argument("[player]", "Player to find win rate of")
        .option("-c, --character <character>", "Initial character")
        .option("-C, --final-character <character>", "Final character")
        .addOption(
            new Option("-t, --type <type>", "Initial character type").choices([
                "Townsfolk",
                "Outsider",
                "Minion",
                "Demon",
                "Traveller",
            ])
        )
        .addOption(
            new Option(
                "-T, --final-type <type>",
                "Final character type"
            ).choices(["Townsfolk", "Outsider", "Minion", "Demon", "Traveller"])
        )
        .addOption(
            new Option(
                "-a, --alignment <alignment>",
                "Initial alignment"
            ).choices(["Good", "Evil"])
        )
        .addOption(
            new Option(
                "-A, --final-alignment <alignment>",
                "Final alignment"
            ).choices(["Good", "Evil"])
        )
        .option("-f, --fraction", "Show result as unreduced fraction")
        .action(async (player, options, command) =>
            winRate(message, player, options, command)
        )
        .configureOutput({ writeOut: (str) => sendCodeBlock(message, str) })
        .helpOption("-h, --help", "Dislpay help for command")
        .allowUnknownOption()
        .exitOverride();
}

async function winRate(message, player, options, command) {
    if (player === undefined) {
        player = message.author.username;
    }

    const {
        result,
        wins,
        plays,
        nameFound,
        initialCharacterFound,
        finalCharacterFound,
    } = getWinRate(
        message.client.games,
        player,
        options.character,
        options.finalCharacter,
        options.type,
        options.finalType,
        options.alignment,
        options.finalAlignment
    );

    let response;
    if (nameFound !== true) {
        response = `No player found with name "${player}".`;
    } else if (initialCharacterFound !== true) {
        response = `No character found with name "${options.character}".`;
    } else if (finalCharacterFound !== true) {
        response = `No character found with name "${options.finalCharacter}".`;
    } else {
        response = `${nameMap[player.toLowerCase()]}'s win rate${
            options.character || options.type || options.alignment
                ? " starting as"
                : ""
        }${options.alignment ? " " + options.alignment : ""}${
            options.type ? " " + options.type : ""
        }${
            options.character
                ? " " + characterMap[options.character.toLowerCase()]
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
                ? " " + characterMap[options.finalCharacter.toLowerCase()]
                : ""
        }: ${options.fraction ? `${wins}/${plays}` : result}`;
    }

    // Send result
    await message.reply({
        content: response,
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = { defWinRate: defWinRate, winRate: winRate };
