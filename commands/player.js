const { MessageEmbed } = require("discord.js");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const _ = require("lodash");
const filterGames = require("../functions/filterGames");
const getAllRoles = require("../functions/getAllRoles");
const getWinRate = require("../functions/getWinRate");
const sendEmbed = require("../functions/sendEmbed");
const stringFormat = require("../functions/stringFormat");
const nameFormat = require("../data/nameFormat");
const usernameName = require("../data/usernameName");

function playerGameString(player, win, number) {
    const roles = getAllRoles(player);
    const finalAlignment = roles[roles.length - 1].Alignment;

    return `#${number}: ${finalAlignment} ${
        finalAlignment === win ? "win" : "loss"
    } as ${_.reduce(
        roles,
        (str, role) =>
            `${str}${str !== "" ? " turned " : ""}${role.Alignment} ${
                role.Character
            }`,
        ""
    )}`;
}

async function player(message, player, command) {
    // If no player given, set player to caller
    if (player === undefined) {
        player = usernameName[message.author.username];
    } else {
        player = nameFormat[stringFormat(player)];
    }

    // Get player avatar
    const nameUsername = _.invert(usernameName);
    await message.guild.members.fetch();
    const playerAvatar = message.guild.members.cache
        .find((member) => member.user.username === nameUsername[player])
        ?.displayAvatarURL();

    // Get player's games
    const playerGames = filterGames(message.client.games, {
        players: [player],
    });

    // Get player win rates
    const winRate = getWinRate(playerGames, player, {}).result;
    const goodWinRate = getWinRate(playerGames, player, {
        initialAlignment: "Good",
    }).result;
    const evilWinRate = getWinRate(playerGames, player, {
        initialAlignment: "Evil",
    }).result;
    const townsfolkWinRate = getWinRate(playerGames, player, {
        initialType: "Townsfolk",
    }).result;
    const outsiderWinRate = getWinRate(playerGames, player, {
        initialType: "Outsider",
    }).result;
    const minionWinRate = getWinRate(playerGames, player, {
        initialType: "Minion",
    }).result;
    const demonWinRate = getWinRate(playerGames, player, {
        initialType: "Demon",
    }).result;
    const travellerWinRate = getWinRate(playerGames, player, {
        initialType: "Traveller",
    }).result;

    const embed = new MessageEmbed()
        .setColor("#9d221a")
        // .setURL()
        .setTitle(`${player}`)
        .setDescription(
            `**OVERALL WIN RATE:** ${winRate} across ${playerGames.length} games`
        )
        .addFields(
            {
                name: "Good Win Rate",
                value: `${goodWinRate}`,
                inline: true,
            },
            {
                name: "Evil Win Rate",
                value: `${evilWinRate}`,
                inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b" },
            {
                name: "Townsfolk Win Rate",
                value: `${townsfolkWinRate}`,
                inline: true,
            },
            {
                name: "Outsider Win Rate",
                value: `${outsiderWinRate}`,
                inline: true,
            },
            {
                name: "Traveller Win Rate",
                value: `${travellerWinRate}`,
                inline: true,
            },
            {
                name: "Minion Win Rate",
                value: `${minionWinRate}`,
                inline: true,
            },
            {
                name: "Demon Win Rate",
                value: `${demonWinRate}`,
                inline: true,
            },
            { name: "\u200b", value: "\u200b", inline: true },
            { name: "\u200b", value: "\u200b" }
        )
        // .setImage()
        .setTimestamp();

    // Add player avatar if found
    if (playerAvatar !== undefined) {
        embed
            .setAuthor("Player Summary", playerAvatar)
            .setThumbnail(playerAvatar);
    } else {
        embed.setAuthor("Player Summary");
    }

    // Get and add game summary strings
    const gameSummaries = _.map(
        _.chunk(
            _.map(playerGames, (game) =>
                playerGameString(game.Players[player], game.Win, game.Number)
            ),
            25
        ),
        (arr, index) => {
            return {
                name: index === 0 ? "Game Summaries" : "\u200b",
                value: arr.join("\n"),
                inline: true,
            };
        }
    );
    const loopLength = gameSummaries.length / 3 - 1;
    for (let i = 0; i <= loopLength; i++) {
        gameSummaries.splice(3 * i + 2, 0, {
            name: "\u200b",
            value: "\u200b",
            inline: false,
        });
    }
    gameSummaries.forEach((summary) =>
        embed.addField(summary.name, summary.value, summary.inline)
    );

    // Send result
    await sendEmbed(message, embed);
}

function defPlayer(comm, message) {
    comm.command("player")
        .description("View a summary of the given player")
        .argument("[player]", "Player to find info of (default: caller)")
        .action(async (number, command) => player(message, number, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { player: player, defPlayer: defPlayer };
