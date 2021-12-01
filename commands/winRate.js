const _ = require("lodash");
const getFinalRole = require("../functions/getFinalRole");
const printHelp = require("../functions/printHelp");

async function winRate(message, player, options, command) {
    // Display help if requested
    if (options.help) {
        printHelp(message, command);
        return;
    }

    // Get all games
    const games = message.client.games;

    // Get games containing player
    const playerGames = _.filter(games, (game) =>
        _.has(game, ["Players", player])
    );

    // Compute player win rate
    const result =
        _.sumBy(playerGames, (game) =>
            Number(game.Win === getFinalRole(game.Players[player]).Alignment)
        ) / playerGames.length;

    // Send result
    await message.reply({
        content: `${player}'s win rate: ${result}`,
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = winRate;
