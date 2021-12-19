const { Option } = require("commander");
const getWinRate = require("../functions/getWinRate");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const stringFormat = require("../functions/stringFormat");
const alignmentFormat = require("../data/alignmentFormat");
const characterFormat = require("../data/characterFormat");
const characterTypeFormat = require("../data/characterTypeFormat");
const nameFormat = require("../data/nameFormat");
const scriptFormat = require("../data/scriptFormat");
const scriptTypeMap = require("../data/scriptType");
const scriptTypeFormat = require("../data/scriptTypeFormat");
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
        scriptFound,
        scriptTypeFound,
        initialCharacterFound,
        finalCharacterFound,
        initialTypeFound,
        finalTypeFound,
        initialAlignmentFound,
        finalAlignmentFound,
    } = getWinRate(message.client.games, player, {
        script: options.script,
        scriptType: options.scriptType,
        initialCharacter: options.initialCharacter,
        finalCharacter: options.finalCharacter,
        initialType: options.initialType,
        finalType: options.finalType,
        initialAlignment: options.initialAlignment,
        finalAlignment: options.finalAlignment,
    });

    let response;
    if (playerFound !== true) {
        response = `No player found with name "${player}".`;
    } else if (scriptFound !== true) {
        response = `No script found with name "${options.script}".`;
    } else if (scriptTypeFound !== true) {
        response = `No script type found with name "${options.scriptType}".`;
    } else if (
        options.script !== undefined &&
        options.scriptType !== undefined &&
        scriptTypeMap[scriptFormat[stringFormat(options.script)]] !==
            scriptTypeFormat[stringFormat(options.scriptType)]
    ) {
        response = `"${options.script}" is not a script of type "${options.scriptType}".`;
    } else if (initialCharacterFound !== true) {
        response = `No character found with name "${options.initialCharacter}".`;
    } else if (finalCharacterFound !== true) {
        response = `No character found with name "${options.finalCharacter}".`;
    } else if (initialTypeFound !== true) {
        response = `No character type found with name "${options.initialType}".`;
    } else if (finalTypeFound !== true) {
        response = `No character type found with name "${options.finalType}".`;
    } else if (initialCharacterFound !== true) {
        response = `No alignment found with name "${options.initialAlignment}".`;
    } else if (finalCharacterFound !== true) {
        response = `No alignment found with name "${options.finalAlignment}".`;
    } else {
        response = `${nameFormat[stringFormat(player)]}'s win rate${
            options.script
                ? " in " + scriptFormat[stringFormat(options.script)]
                : options.scriptType
                ? " in " +
                  scriptTypeFormat[stringFormat(options.scriptType)] +
                  " scripts"
                : ""
        }${
            options.initialCharacter ||
            options.initialType ||
            options.initialAlignment
                ? " starting as"
                : ""
        }${
            options.initialAlignment
                ? " " + alignmentFormat[stringFormat(options.initialAlignment)]
                : ""
        }${
            options.initialType
                ? " " + characterTypeFormat[stringFormat(options.initialType)]
                : ""
        }${
            options.initialCharacter
                ? " " + characterFormat[stringFormat(options.initialCharacter)]
                : ""
        }${
            (options.initialCharacter ||
                options.initialType ||
                options.initialAlignment) &&
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
        }${
            options.finalAlignment
                ? " " + alignmentFormat[stringFormat(options.finalAlignment)]
                : ""
        }${
            options.finalType
                ? " " + characterTypeFormat[stringFormat(options.finalType)]
                : ""
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
        .option("-s, --script <script>", "Script")
        .option("-S, --script-type <script type>", "Script type")
        .option("-k, --initial-character <character>", "Initial character")
        .option("-K, --final-character <character>", "Final character")
        .option("-t, --initial-type <type>", "Initial character type")
        .option("-T, --final-type <type>", "Final character type")
        .option("-a, --initial-alignment <alignment>", "Initial alignment")
        .option("-A, --final-alignment <alignment>", "Final alignment")
        .option("-f, --fraction", "Show result as unreduced fraction")
        .action(
            async (player, options, command) =>
                await winRate(message, player, options, command)
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
