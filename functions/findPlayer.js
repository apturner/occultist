const { stringFormat, nameFormat } = require("../functions/stringFormat");

async function findPlayer(message, playerString) {
    const player =
        nameFormat[
            Object.keys(nameFormat).find((p) =>
                p.includes(stringFormat(playerString))
            )
        ];

    if (player === undefined) {
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
