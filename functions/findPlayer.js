const { InvalidArgumentError } = require("commander");
const findMember = require("../functions/findMember");
const sendCodeBlock = require("../functions/sendCodeBlock");
const nameFormatMap = require("../data/nameFormat");
const snowflakeName = require("../data/snowflakeName");
const { stringFormat, nameFormat } = require("../functions/format");

async function findPlayer(message, playerString, complain = true) {
    // Look for a player whose name contains the given string (formatted)
    let player = nameFormat(
        Object.keys(nameFormatMap).find((p) =>
            p.includes(stringFormat(playerString))
        )
    );

    // If that doesn't work, see if there is a member matching the given string
    // Then find the player corresponding to that member
    player = snowflakeName[findMember(message, playerString, false)?.id];

    if (complain === true && player === undefined) {
        await sendCodeBlock(
            message,
            `No player found matching ${playerString}.`
        );
        throw new InvalidArgumentError(
            `No player found matching ${playerString}.`
        );
    }

    return player;
}

module.exports = findPlayer;
