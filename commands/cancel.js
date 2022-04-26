const findMember = require("../functions/findMember");
const findPlayer = require("../functions/findPlayer");
const sendMessage = require("../functions/sendMessage");
const sleep = require("../functions/sleep");

async function cancel(message, member, options, command) {
    // Vote duration in seconds
    const voteDuration = 30;

    // Get member
    if (member === undefined) {
        member = await message.guild.members.fetch("263754010136281088");
    } else {
        member = await findMember(message, member);
    }
    const memberName = member.displayName;

    // Get Cancelled role
    const cancelled = message.guild.roles.cache.find(
        (role) => role.name === "Cancelled"
    );

    const isCancelled = member.roles.cache.some((role) => role === cancelled);

    const questionString = isCancelled
        ? `Should we uncancel ${memberName}? You have ${voteDuration} seconds to vote`
        : `Should we cancel ${memberName}? You have ${voteDuration} seconds to vote`;

    const poll = await sendMessage(message, questionString);
    await poll.react("765116502390603776");
    await poll.react("765116505246662657");

    await sleep(voteDuration * 1000);

    const yes = poll.reactions.cache.get("765116502390603776").count;
    const no = poll.reactions.cache.get("765116505246662657").count;

    if (yes > no) {
        if (isCancelled === true) {
            await sendMessage(
                poll,
                `${memberName} has been uncancelled! Until next time...`
            );
            member.roles.remove(cancelled);
        } else {
            await sendMessage(
                poll,
                `${memberName} has been cancelled! Good job everyone!`
            );
            member.roles.add(cancelled);
        }
    } else {
        await sendMessage(
            poll,
            `Vote unsuccessful, ${memberName} remains ${
                isCancelled ? "" : "un"
            }cancelled`
        );
    }
}

function defCancel(comm, message) {
    comm.command("cancel")
        .description("Create reaction poll to (un)cancel a guild member")
        .argument("[member]", "Guild member to cancel (default: Matt)")
        .action(
            async (members, options, command) =>
                await cancel(message, members, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { cancel: cancel, defCancel: defCancel };
