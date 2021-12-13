const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const getAllRoles = require("../functions/getAllRoles");
const getCauseOfDeathString = require("../functions/getCauseOfDeathString");
const getPlayerChangeString = require("../functions/getPlayerChangeString");
const getWinRate = require("../functions/getWinRate");
const sendEmbed = require("../functions/sendEmbed");
const stringFormat = require("../functions/stringFormat");
const nameFormat = require("../data/nameFormat");
const usernameName = require("../data/usernameName");

function playerGameString(playerObj, win, number) {
    const roles = getAllRoles(playerObj);
    const finalAlignment = roles[roles.length - 1].Alignment;

    return `#${number}: ${
        finalAlignment === win ? "Win" : "Loss"
    } as ${getPlayerChangeString(roles)}, who ${getCauseOfDeathString(
        playerObj.Fate,
        playerObj["Cause of Death"],
        playerObj["Killed By"]
    )}`;
}

async function playerSummary(message, player, command) {
    // If no player given, set player to caller
    if (player === undefined) {
        player = usernameName[message.author.username];
    } else {
        player = nameFormat[stringFormat(player)];
    }

    // Get player avatar
    await message.guild.members.fetch();
    const nameUsername = _.invert(usernameName);
    const playerAvatar = message.guild.members.cache
        .find((member) => member.user.username === nameUsername[player])
        ?.displayAvatarURL();

    // Get player's games
    const playerGames = filterGames(message.client.games, {
        players: [player],
    });

    // Get player win rates
    const { result: winRate, wins: winCount, plays: playCount } = getWinRate(
        playerGames,
        player,
        {}
    );
    const {
        result: goodWinRate,
        wins: goodWinCount,
        plays: goodPlayCount,
    } = getWinRate(playerGames, player, {
        initialAlignment: "Good",
    });
    const {
        result: evilWinRate,
        wins: evilWinCount,
        plays: evilPlayCount,
    } = getWinRate(playerGames, player, {
        initialAlignment: "Evil",
    });
    const {
        result: townsfolkWinRate,
        wins: townsfolkWinCount,
        plays: townsfolkPlayCount,
    } = getWinRate(playerGames, player, {
        initialType: "Townsfolk",
    });
    const {
        result: outsiderWinRate,
        wins: outsiderWinCount,
        plays: outsiderPlayCount,
    } = getWinRate(playerGames, player, {
        initialType: "Outsider",
    });
    const {
        result: minionWinRate,
        wins: minionWinCount,
        plays: minionPlayCount,
    } = getWinRate(playerGames, player, {
        initialType: "Minion",
    });
    const {
        result: demonWinRate,
        wins: demonWinCount,
        plays: demonPlayCount,
    } = getWinRate(playerGames, player, {
        initialType: "Demon",
    });
    const {
        result: travellerWinRate,
        wins: travellerWinCount,
        plays: travellerPlayCount,
    } = getWinRate(playerGames, player, {
        initialType: "Traveller",
    });

    // Make embed
    const embed = new MessageEmbed()
        .setColor("#9d221a")
        .setAuthor("Player Summary", message.client.user.avatarURL())
        .setTitle(`${player}`)
        .setDescription(
            `**OVERALL WIN RATE:** ${winRate} (${winCount}/${playCount})`
        )
        .addFields(
            {
                name: "Good Win Rate",
                value: `${goodWinRate} (${goodWinCount}/${goodPlayCount})`,
                inline: true,
            },
            {
                name: "Evil Win Rate",
                value: `${evilWinRate} (${evilWinCount}/${evilPlayCount})`,
                inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b" },
            {
                name: "Townsfolk Win Rate",
                value: `${townsfolkWinRate} (${townsfolkWinCount}/${townsfolkPlayCount})`,
                inline: true,
            },
            {
                name: "Outsider Win Rate",
                value: `${outsiderWinRate} (${outsiderWinCount}/${outsiderPlayCount})`,
                inline: true,
            },
            {
                name: "Traveller Win Rate",
                value: `${travellerWinRate} (${travellerWinCount}/${travellerPlayCount})`,
                inline: true,
            },
            {
                name: "Minion Win Rate",
                value: `${minionWinRate} (${minionWinCount}/${minionPlayCount})`,
                inline: true,
            },
            {
                name: "Demon Win Rate",
                value: `${demonWinRate} (${demonWinCount}/${demonPlayCount})`,
                inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b" }
        )
        .setTimestamp();

    // Add player avatar if found
    if (playerAvatar !== undefined) embed.setThumbnail(playerAvatar);

    // Get and add game summary strings
    const gameSummaries = _.map(
        _.chunk(
            _.map(playerGames, (game) =>
                playerGameString(game.Players[player], game.Win, game.Number)
            ),
            20
        ),
        (arr, index) => {
            return {
                name: index === 0 ? "Game Summaries" : "\u200b",
                value: arr.join("\n"),
                inline: false,
            };
        }
    );
    // This creates 2 columns, if above inline set to true
    // const loopLength = gameSummaries.length / 3 - 1;
    // for (let i = 0; i <= loopLength; i++) {
    //     gameSummaries.splice(3 * i + 2, 0, {
    //         name: "\u200b",
    //         value: "\u200b",
    //         inline: false,
    //     });
    // }
    // gameSummaries.forEach((summary) =>
    //     embed.addField(summary.name, summary.value, summary.inline)
    // );
    embed.addFields(gameSummaries);

    // Send result
    await sendEmbed(message, embed);
}

function defPlayer(comm, message) {
    comm.command("player")
        .description("View a summary of the given player")
        .argument("[player]", "Player to find info of (default: caller)")
        .action(
            async (player, command) =>
                await playerSummary(message, player, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { player: playerSummary, defPlayer: defPlayer };
