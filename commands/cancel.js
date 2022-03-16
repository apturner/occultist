const findMember = require("../functions/findMember");
const sendMessage = require("../functions/sendMessage");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function cancel(message, command) {
    // Vote duration in seconds
    const voteDuration = 30;

    // Get Matt
    matt = await message.guild.members.fetch("263754010136281088");

    // Get Cancelled role
    const cancelled = message.guild.roles.cache.find(
        (role) => role.name === "Cancelled"
    );

    const isCancelled = matt.roles.cache.some((role) => role === cancelled);

    const questionString = isCancelled
        ? `Should we uncancel Matt? You have ${voteDuration} seconds to vote`
        : `Should we cancel Matt? You have ${voteDuration} seconds to vote`;

    const poll = await message.reply({
        content: questionString,
        allowedMentions: {
            repliedUser: false,
        },
    });
    await poll.react("765116502390603776");
    await poll.react("765116505246662657");

    await sleep(voteDuration * 1000);

    const yes = poll.reactions.cache.get("765116502390603776").count;
    const no = poll.reactions.cache.get("765116505246662657").count;

    if (yes > no) {
        if (isCancelled === true) {
            await poll.reply({
                content: "Matt has been uncancelled! Until next time...",
                allowedMentions: {
                    repliedUser: false,
                },
            });
            matt.roles.remove(cancelled);
        } else {
            await poll.reply({
                content: "Matt has been cancelled! Good job everyone!",
                allowedMentions: {
                    repliedUser: false,
                },
            });
            matt.roles.add(cancelled);
        }
    } else {
        await poll.reply({
            content: `Vote unsuccessful, Matt remains ${
                isCancelled ? "" : "un"
            }cancelled`,
            allowedMentions: {
                repliedUser: false,
            },
        });
    }
}

function defCancel(comm, message) {
    comm.command("cancel")
        .description("Create reaction poll to (un)cancel Matt")
        .action(async (command) => await cancel(message, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { cancel: cancel, defCancel: defCancel };
