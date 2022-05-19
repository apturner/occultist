const { MessageEmbed } = require("discord.js");
const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const _ = require("lodash");
const getAllRoles = require("../functions/getAllRoles");
const getCauseOfDeathString = require("../functions/getCauseOfDeathString");
const getPlayerChangeString = require("../functions/getPlayerChangeString");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendEmbed = require("../functions/sendEmbed");
const { stringFormat } = require("../functions/format");
const characterTypeMap = require("../data/characterType");
const snowflakeName = require("../data/snowflakeName");

function playerRolesString(playerName, playerObj) {
    return `• ${playerName} as ${getPlayerChangeString(
        getAllRoles(playerObj)
    )}, who ${getCauseOfDeathString(
        playerObj.Fate,
        playerObj["Cause of Death"],
        playerObj["Killed By"]
    )}`;
}

async function gameSummary(message, number, options, command) {
    // Get game
    const num = parseInt(number, 10);
    const game = message.client.games[num - 1];
    if (game === undefined) {
        sendCodeBlock(message, `Game ${num} not found.`);
        return;
    }

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
    const winCondition = game["Win Condition"];
    const storytellers = game.Storytellers;
    const bluffs = game.Bluffs;
    const players = game.Players;
    const playerChangesString = _.reduce(
        players,
        (str, playerObj, playerName) =>
            `${str}\n${playerRolesString(playerName, playerObj)}`,
        ""
    );

    // Make embed
    const embed = new MessageEmbed()
        .setColor("#9d221a")
        .setAuthor({
            name: `Game #${number}, Storytold by ${storytellers.join(", ")}`,
            iconURL: message.client.user.avatarURL(),
        })
        .setTitle(`${script}`)
        .setDescription(
            `**${win.toUpperCase()} WIN: ${winCondition}**${
                bluffs !== undefined ? "\nBluffs: " + bluffs.join(", ") : ""
            }`
        )
        .addFields({ name: "Featuring", value: playerChangesString })
        .setTimestamp(date);

    // Add Grimoire if found
    if (grimOk === true) embed.setImage(grim);

    // Add demon avatar if found
    await message.guild.members.fetch();
    const nameSnowflake = _.invert(snowflakeName);
    const firstDemonSnowflake = _.map(
        _.keys(
            _.pickBy(
                players,
                (player) => characterTypeMap[player.Character] === "Demon"
            )
        ),
        (name) => nameSnowflake[name]
    )[0];
    const firstDemonAvatar = message.guild.members.cache
        .find((member) => member.user.id === firstDemonSnowflake)
        ?.displayAvatarURL();
    if (firstDemonAvatar !== undefined) {
        embed.setThumbnail(firstDemonAvatar);
    } else {
        embed.setThumbnail(
            `https://raw.githubusercontent.com/bra1n/townsquare/develop/src/assets/icons/${stringFormat(
                players[snowflakeName[firstDemonSnowflake]]?.Character
            )}.png`
        );
    }

    // Send result
    await sendEmbed(message, embed);

    // Send notes embed if requested
    if (options.notes === true) {
        const notes = game.Notes;

        const notesEmbed = new MessageEmbed()
            .setColor("#9d221a")
            .setAuthor({
                name: `Game #${number}, Storytold by ${storytellers.join(
                    ", "
                )}`,
                iconURL: message.client.user.avatarURL(),
            })
            .setTitle("Game Notes")
            .setDescription(notes ?? "No game notes")
            .setTimestamp(date);

        await sendEmbed(message, notesEmbed, false);
    }
}

function defGame(comm, message) {
    comm.command("game")
        .description("View a summary of the given game")
        .argument("<number>", "Game number")
        .option("-n, --notes", "Include game notes")
        .action(
            async (number, options, command) =>
                await gameSummary(message, number, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { game: gameSummary, defGame: defGame };
