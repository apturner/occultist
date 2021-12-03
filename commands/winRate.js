const { Command, Option } = require("commander");
const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const getFinalRole = require("../functions/getFinalRole");
const sendCodeBlock = require("../functions/sendCodeBlock");

function defWinRate(comm, message) {
    comm.command("winrate")
        .description(
            "Get the win rate for the specified player, with optional filters"
        )
        .argument("<player>", "Player to find win rate of")
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
        .action(async (player, options, command) =>
            winRate(message, player, options, command)
        )
        .configureOutput({ writeOut: (str) => sendCodeBlock(message, str) })
        .helpOption("-h, --help", "Dislpay help for command")
        .allowUnknownOption()
        .exitOverride();
}

async function winRate(message, player, options, command) {
    // Get all games
    const games = message.client.games;

    const playerGames = filterGames(games, {
        players: [player],
        playerInitialCharacters: options.character
            ? [[player, options.character]]
            : undefined,
        playerFinalCharacters: options.finalCharacter
            ? [[player, options.finalCharacter]]
            : undefined,
        playerInitialCharacterTypes: options.type
            ? [[player, options.type]]
            : undefined,
        playerFinalCharacterTypes: options.finalType
            ? [[player, options.finalType]]
            : undefined,
        playerInitialAlignments: options.alignment
            ? [[player, options.alignment]]
            : undefined,
        playerFinalAlignments: options.finalAlignment
            ? [[player, options.finalAlignment]]
            : undefined,
    });

    const playerGamesCount = filterGames(games, {
        players: [player],
        playerInitialCharacters: options.character
            ? [[player, options.character]]
            : undefined,
        playerFinalCharacters: options.finalCharacter
            ? [[player, options.finalCharacter]]
            : undefined,
        playerInitialCharacterTypes: options.type
            ? [[player, options.type]]
            : undefined,
        playerFinalCharacterTypes: options.finalType
            ? [[player, options.finalType]]
            : undefined,
        playerInitialAlignments: options.alignment
            ? [[player, options.alignment]]
            : undefined,
        playerFinalAlignments: options.finalAlignment
            ? [[player, options.finalAlignment]]
            : undefined,
        count: true,
    });

    // Compute player win rate
    // const result =
    //     _.sumBy(playerGames, (game) =>
    //         Number(game.Win === getFinalRole(game.Players[player]).Alignment)
    //     ) / playerGames.length;

    const oldResult =
        _.sumBy(playerGames, (game) =>
            Number(game.Win === getFinalRole(game.Players[player]).Alignment)
        ) / playerGamesCount;

    const playerWinsCount = filterGames(games, {
        players: [player],
        playerInitialCharacters: options.character
            ? [[player, options.character]]
            : undefined,
        playerFinalCharacters: options.finalCharacter
            ? [[player, options.finalCharacter]]
            : undefined,
        playerInitialCharacterTypes: options.type
            ? [[player, options.type]]
            : undefined,
        playerFinalCharacterTypes: options.finalType
            ? [[player, options.finalType]]
            : undefined,
        playerInitialAlignments: options.alignment
            ? [[player, options.alignment]]
            : undefined,
        playerFinalAlignments: options.finalAlignment
            ? [[player, options.finalAlignment]]
            : undefined,
        winningPlayers: [player]
        count: true,
    });

    const result =
        playerWinsCount / playerGamesCount;

    // Send result
    await message.reply({
        content: `${player}'s win rate${
            options.character || options.type || options.alignment
                ? " starting as"
                : ""
        }${options.alignment ? " " + options.alignment : ""}${
            options.type ? " " + options.type : ""
        }${options.character ? " " + options.character : ""}${
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
            options.finalCharacter ? " " + options.finalCharacter : ""
        }: ${result.toFixed(2)}`,
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = { defWinRate: defWinRate, winRate: winRate };
