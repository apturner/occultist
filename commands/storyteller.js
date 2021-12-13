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

async function storytellerSummary(message, st, command) {
    // If no player given, set player to caller
    if (st === undefined) {
        st = usernameName[message.author.username];
    } else {
        st = nameFormat[stringFormat(st)];
    }

    // Get player avatar
    await message.guild.members.fetch();
    const nameUsername = _.invert(usernameName);
    const stAvatar = message.guild.members.cache
        .find((member) => member.user.username === nameUsername[st])
        ?.displayAvatarURL();

    // Get storyteller's info
    const stGames = filterGames(message.client.games, { storytellers: [st] });
    const { Good: goodWins, Evil: evilWins } = _.countBy(
        stGames,
        (game) => game.Win
    );
    const scripts = _.orderBy(
        _.map(
            _.countBy(stGames, (game) => game.Script),
            (count, script) => {
                return { script: script, count: count };
            }
        ),
        ["count", "script"],
        ["desc", "asc"]
    );
    const characters = _.orderBy(
        _.map(
            _.countBy(
                _.flatMap(stGames, (game) =>
                    _.map(game.Players, (player) => player.Character)
                )
            ),
            (count, character) => {
                return { character: character, count: count };
            }
        ),
        ["count", "character"],
        ["desc", "asc"]
    );
    const splitCharacters = _.chunk(
        characters,
        Math.ceil(characters.length / 2)
    );
    const bluffs = _.orderBy(
        _.map(
            _.countBy(
                _.flatMap(
                    _.filter(stGames, (game) => _.has(game, "Bluffs")),
                    (game) => game.Bluffs
                )
            ),
            (count, bluff) => {
                return { bluff: bluff, count: count };
            }
        ),
        ["count", "bluff"],
        ["desc", "asc"]
    );
    const winConditions = _.orderBy(
        _.map(
            _.countBy(_.map(stGames, (game) => game["Win Condition"])),
            (count, condition) => {
                return { condition: condition, count: count };
            }
        ),
        ["condition"],
        ["desc"]
    );
    const drunks = _.orderBy(
        _.map(
            _.countBy(
                _.map(
                    _.filter(
                        _.flatMap(stGames, (game) => _.values(game.Players)),
                        (player) => player.Character === "Drunk"
                    ),
                    (drunk) => drunk["Believed They Were"]
                )
            ),
            (count, drunk) => {
                return { drunk: drunk, count: count };
            }
        ),
        ["count", "drunk"],
        ["desc", "asc"]
    );

    // Make embed
    const embed = new MessageEmbed()
        .setColor("#9d221a")
        .setAuthor("Storyteller Summary", message.client.user.avatarURL())
        .setTitle(`${st}`)
        .setDescription(`${goodWins} Good Wins, ${evilWins} Evil Wins`)
        .addFields(
            {
                name: "Win Conditions",
                value: `${_.map(
                    winConditions,
                    ({ condition, count }) => `${condition}: ${count}`
                ).join("\n")}`,
                inline: true,
            },
            {
                name: "Scripts",
                value: `${_.map(
                    scripts,
                    ({ script, count }) => `${script}: ${count}`
                ).join("\n")}`,
                inline: true,
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: false,
            },
            {
                name: "Characters",
                value: `${_.map(
                    splitCharacters[0],
                    ({ character, count }) => `${character}: ${count}`
                ).join("\n")}`,
                inline: true,
            },
            {
                name: "\u200b",
                value: `${_.map(
                    splitCharacters[1],
                    ({ character, count }) => `${character}: ${count}`
                ).join("\n")}`,
                inline: true,
            },
            {
                name: "\u200b",
                value: "\u200b",
                inline: false,
            },
            {
                name: "Bluffs",
                value: `${_.map(
                    bluffs,
                    ({ bluff, count }) => `${bluff}: ${count}`
                ).join("\n")}`,
                inline: true,
            },
            {
                name: "Drunks",
                value: `${_.map(
                    drunks,
                    ({ drunk, count }) => `${drunk}: ${count}`
                ).join("\n")}`,
                inline: true,
            }
        )
        .setTimestamp();

    // Add player avatar if found
    if (stAvatar !== undefined) embed.setThumbnail(stAvatar);

    // Send result
    await sendEmbed(message, embed);
}

function defStoryteller(comm, message) {
    comm.command("storyteller")
        .description("View a summary of the given storyteller")
        .argument(
            "[storyteller]",
            "Storyteller to find info of (default: caller)"
        )
        .action(
            async (number, command) =>
                await storytellerSummary(message, number, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = {
    storyteller: storytellerSummary,
    defStoryteller: defStoryteller,
};
