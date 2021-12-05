const { Option, InvalidArgumentError } = require("commander");
const filterGames = require("../functions/filterGames");
const sendCodeBlock = require("../functions/sendCodeBlock");

function pairsParse(value, previous) {
    if (!value.includes(":")) {
        throw new InvalidArgumentError(
            "Pair elements must be separated by a colon."
        );
    }

    if (previous === undefined) {
        previous = [value.split(":")];
    } else {
        previous.push(value.split(":"));
    }

    return previous;
}

function actionHelper(message, options, command, count) {
    return filterGames(message.client.games, {
        startDate:
            options.startDate !== undefined
                ? Date.parse(options.startDate) / 1000
                : undefined,
        endDate:
            options.endDate !== undefined
                ? Date.parse(options.endDate) / 1000
                : undefined,
        scripts: options.scripts,
        scriptTypes: options.scriptTypes,
        win: options.winningTeam,
        storytellers: options.storytellers,
        players: options.players,
        winningPlayers: options.winners,
        losingPlayers: options.losers,
        characters: options.characters,
        initialCharacters: options.startingCharacters,
        finalCharacters: options.endingCharacters,
        playerInitialCharacters: options.initialCharacters,
        playerFinalCharacters: options.finalCharacters,
        playerInitialCharacterTypes: options.initialTypes,
        playerFinalCharacterTypes: options.finalTypes,
        playerInitialAlignments: options.initialAlignments,
        playerFinalAlignments: options.finalAlignments,
        count: count,
    });
}

function defHelper(comm, message, name, desc, act) {
    comm.command(name)
        .description(desc)
        .option("-d, --start-date <seconds>", "Start date")
        .option("-D, --end-date <seconds>", "End date")
        .option("-s, --scripts <script...>", "Scripts [OR]")
        .addOption(
            new Option(
                "-S, --script-types <script type...>",
                "Script types [OR]"
            ).choices(["Full", "Teensyville", "Weensyville"])
        )
        .addOption(
            new Option(
                "-W, --winning-team <alignment>",
                "Winning alignment"
            ).choices(["Good", "Evil"])
        )
        .option("-g, --storytellers <storyteller...>", "Storytellers [OR]")
        .option("-p, --players <player...>", "Players [AND]")
        .option("-w, --winners <player...>", "Winning players [AND]")
        .option("-l, --losers <player...>", "Losing players [AND]")
        .option("-c, --characters <character...>", "Characters [AND]")
        .option(
            "-x, --starting-characters <character...>",
            "Starting characters [AND]"
        )
        .option(
            "-X, --ending-characters <character...>",
            "Ending characters [AND]"
        )
        .option(
            "-k, --initial-characters <player:character...>",
            "Player/initial character pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-K, --final-characters <player:character...>",
            "Player/final character pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-t, --initial-types <player:character-type...>",
            "Player/initial character type pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-T, --final-types <player:character-type...>",
            "Player/final character type pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-a, --initial-alignments <player:alignment...>",
            "Player/initial alignment pairs, joined by ':' [AND]",
            pairsParse
        )
        .option(
            "-A, --final-alignments <player:alignment...>",
            "Player/final alignment pairs, joined by ':' [AND]",
            pairsParse
        )
        .action(async (options, command) => act(message, options, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { defHelper: defHelper, actionHelper: actionHelper };
