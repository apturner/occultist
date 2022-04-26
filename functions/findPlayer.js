const nameFormatMap = require("../data/nameFormat");
const { stringFormat, nameFormat } = require("../functions/stringFormat");

async function findPlayer(message, playerString, complain = true) {
    const player =
        nameFormat(
            Object.keys(nameFormatMap).find((p) =>
                p.includes(stringFormat(playerString))
            )
        );

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
