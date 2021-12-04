const { Command, Option } = require("commander");
const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const getWinRate = require("../functions/getWinRate");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const characterFormat = require("../data/characterFormat");
const nameFormat = require("../data/nameFormat");

function pairsParse(value, dummyPrevious) {
    if (value.some((val) => !val.includes("_"))) {
        throw new commander.InvalidArgumentError(
            "Pair elements must be separated by an underscore."
        );
    }

    return _.map(value, (str) => str.split(":"));
}

function defCount(comm, message) {
    comm.command("count")
        .description("Count games, subject to optional filters")
        .option("-d, --start-date <seconds>", "Start date, in Unix time")
        .option("-D, --end-date <seconds>", "End date, in Unix time")
        .option("-s, --script <scripts...>", "Scripts [OR]")
        .addOption(
            new Option(
                "-S, --script-type <script types...>",
                "Script types [OR]"
            ).choices(["Full", "Teensyville", "Weensyville"])
        )
        .addOption(
            new Option("-w, --win <alignment>", "Winning alignment").choices([
                "Good",
                "Evil",
            ])
        )
        .option("-g, --storyteller <storytellers...>", "Storytellers [OR]")
        .option("-p, --player <players...>", "Players [AND]")
        .option("-W, --winner <players...>", "Winning players [AND]")
        .option("-L, --loser <players...>", "Losing players [AND]")
        .option("-c, --character <character...>", "Characters [AND]")
        .option(
            "-k, --initial-character <player:character...>",
            "Player/initial character pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-K, --final-character <player:character...>",
            "Player/final character pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-t, --initial-type <player:character-type...>",
            "Player/initial character type pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-T, --final-type <player:character-type...>",
            "Player/final character type pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-a, --initial-alignment <player:alignment...>",
            "Player/initial alignment pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-A, --final-alignment <player:alignment...>",
            "Player/final alignment pairs, joined by ':' [AND]",
            pairsParse
        )
        .action(async (options, command) => count(message, options, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

async function count(message, options, command) {
    console.log("date: ", options.date);
    console.log("script: ", options.script);
    console.log("scriptType: ", options.scriptType);
    console.log("win: ", options.win);
    console.log("storyteller: ", options.storyteller);
    console.log("player: ", options.player);
    console.log("winner: ", options.winner);
    console.log("loser: ", options.loser);
    console.log("initialCharacter: ", options.initialCharacter);
    console.log("finalCharacter: ", options.finalCharacter);
    console.log("initialType: ", options.initialType);
    console.log("finalType: ", options.finalType);
    console.log("initialAlignment: ", options.initialAlignment);
    console.log("finalAlignment: ", options.finalAlignment);

    result = filterGames(message.client.games, {
        startDate: options.startDate,
        endDate: options.endDate,
        scripts: options.script,
        scriptTypes: options.scriptType,
        win: options.win,
        storytellers: options.storyteller,
        players: options.player,
        winningPlayers: options.winner,
        losingPlayers: options.loser,
        playerInitialCharacters: options.initialCharacter,
        playerFinalCharacters: options.finalCharacter,
        playerInitialCharacterTypes: options.initialType,
        playerFinalCharacterTypes: options.finalType,
        playerInitialAlignments: options.initialAlignment,
        playerFinalAlignments: options.finalAlignment,
        count: true,
    });

    let response;
    if (result !== NaN) {
        response = `Number of games satisfying given constraints: ${result}`;
    } else {
        response = "Invalid constraints given.";
    }

    // Send result
    sendMessage(message, response);
}

module.exports = { defCount: defCount, count: count };
