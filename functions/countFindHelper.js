const { Option, InvalidArgumentError } = require("commander");
const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const sendCodeBlock = require("../functions/sendCodeBlock");

function pairParse(value) {
    if (!value.includes(":")) {
        throw new InvalidArgumentError(
            "Pair elements must be separated by a colon."
        );
    }

    return value.split(":");
}

function pairsParse(value, previous) {
    if (previous === undefined) {
        previous = [];
    }
    previous.push(pairParse(value));

    return previous;
}

function actionHelper(message, options, command, count) {
    const filterDict = {
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
    };

    if (options.versus !== undefined) {
        let winWinDict = _.mergeWith(
            {},
            filterDict,
            {
                winningPlayers: options.versus,
            },
            (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );
        let loseLoseDict = _.mergeWith(
            {},
            filterDict,
            {
                losingPlayers: options.versus,
            },
            (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );
        let winLoseDict = _.mergeWith(
            {},
            filterDict,
            {
                winningPlayers: [options.versus[0]],
                losingPlayers: [options.versus[1]],
            },
            (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );
        let loseWinDict = _.mergeWith(
            {},
            filterDict,
            {
                winningPlayers: [options.versus[1]],
                losingPlayers: [options.versus[0]],
            },
            (objValue, srcValue) => {
                if (_.isArray(objValue)) {
                    return objValue.concat(srcValue);
                }
            }
        );

        return [
            filterGames(message.client.games, winWinDict),
            filterGames(message.client.games, loseLoseDict),
            filterGames(message.client.games, winLoseDict),
            filterGames(message.client.games, loseWinDict),
        ];
    } else {
        return filterGames(message.client.games, filterDict);
    }
}

function defHelper(comm, message, name, desc, act) {
    comm.command(name)
        .description(desc)
        .option("-d, --start-date <seconds>", "Start date")
        .option("-D, --end-date <seconds>", "End date")
        .option("-s, --scripts <script...>", "Scripts [OR]")
        .option("-S, --script-types <script type...>", "Script types [OR]")
        .option("-W, --winning-team <alignment>", "Winning alignment")
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
        .option(
            "-v, --versus <player:player>",
            "Player/player pair, joined by ':'",
            pairParse
        )
        .action(
            async (options, command) => await act(message, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { defHelper: defHelper, actionHelper: actionHelper };
