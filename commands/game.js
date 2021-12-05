const { MessageEmbed } = require("discord.js");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const _ = require("lodash");
const getAllRoles = require("../functions/getAllRoles");
const sendEmbed = require("../functions/sendEmbed");
const stringFormat = require("../functions/stringFormat");
const characterTypeMap = require("../data/characterType");
const usernameName = require("../data/usernameName");

function playerChangeString(playerName, playerRole) {
    return `• ${playerName} as ${_.reduce(
        playerRole,
        (str, role) =>
            `${str}${str !== "" ? " turned " : ""}${role.Alignment} ${
                role.Character
            }`,
        ""
    )}`;
}

async function game(message, number, command) {
    // Get game
    const game = message.client.games[parseInt(number, 10) - 1];

    // Get grim and check it exists
    const grim = message.client.games[parseInt(number, 10) - 1]?.Grimoire;
    let grimOk;
    if (grim !== undefined) {
        grimOk = (await fetch(grim)).ok;
    } else {
        grimOk = false;
    }

    //Get game data
    const date = new Intl.DateTimeFormat("en-US").format(
        new Date(game.Date * 1e3)
    );
    const script = game.Script;
    const win = game.Win;
    const storytellers = game.Storytellers;
    const players = game.Players;
    const playerRoles = _.mapValues(players, (player) => getAllRoles(player));
    const playerChangesString = _.reduce(
        playerRoles,
        (str, role, player) => `${str}\n${playerChangeString(player, role)}`,
        ""
    );

    const embed = new MessageEmbed()
        .setColor("#9d221a")
        .setAuthor(`Game #${number}`, message.client.user.avatarURL())
        // .setURL(grimOk ? grim : "https://github.com/apturner/botc-game-grims")
        .setTitle(`${script}`)
        .setDescription(`**${win.toUpperCase()} WIN**`)
        .addFields({ name: "Featuring", value: playerChangesString })
        .setTimestamp(date);

    // Add Grimoire to embed
    if (grimOk === true) embed.setImage(grim);

    // Add demon avatar to embed
    await message.guild.members.fetch();
    const nameUsername = _.invert(usernameName);
    const firstDemonUsername = _.map(
        _.keys(
            _.pickBy(
                players,
                (player) => characterTypeMap[player.Character] === "Demon"
            )
        ),
        (name) => nameUsername[name]
    )[0];
    const firstDemonAvatar = message.guild.members.cache
        .find((member) => member.user.username === firstDemonUsername)
        ?.displayAvatarURL();
    if (firstDemonAvatar !== undefined) {
        embed.setThumbnail(firstDemonAvatar);
    } else {
        embed.setThumbnail(
            `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${stringFormat(
                players[usernameName[firstDemonUsername]].Character
            )}.png`
        );
    }

    // Send result
    await sendEmbed(message, embed);
}

function defGame(comm, message) {
    comm.command("game")
        .description("View a summary of the given game")
        .argument("<number>", "Game number")
        .action(async (number, command) => game(message, number, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { game: game, defGame: defGame };
