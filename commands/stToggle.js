const { InvalidArgumentError } = require("commander");
const findMember = require("../functions/findMember");
const makeChoice = require("../functions/makeChoice");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const { stringFormat } = require("../functions/format");

async function tryChangeNickname(message, member, nickname) {
    // Don't try to change the guild owner's nickname
    if (member.id === member.guild.ownerId) {
        await sendMessage(
            message,
            "Can't change the nickname of the guild owner 😭"
        );
        return;
    }
    await member.setNickname(nickname);
}

async function stToggle(message, members, options, command) {
    // If no guild member given, set member to caller
    // Otherwise, choose one of the given options and find the first guild member whose name roughly matches the chosen name
    let member;
    if (members === undefined || members.length == 0) {
        member = message.member;
        // This is the old way to do this
        // member = message.guild.members.cache.find(
        //     (m) => m.id === message.author.id
        // );
    } else {
        member = await findMember(message, makeChoice(members));
    }

    // Get ST role
    const st = message.guild.roles.cache.find(
        (role) => role.name === "Storyteller"
    );

    // Get member display name
    const originalMemberName = member.displayName;
    const hasPrefix = originalMemberName.slice(0, 5) === "(ST) ";

    // If they already have the ST role...
    if (member.roles.cache.some((role) => role === st)) {
        // Take it away
        await member.roles.remove(st);

        // If they have the prefix, remove it
        if (hasPrefix) {
            await tryChangeNickname(
                message,
                member,
                originalMemberName.slice(5)
            );
        }

        // Tell them about it
        await sendMessage(
            message,
            `${member.displayName} is no longer storytelling.`
        );
    } else {
        // Give it to them
        await member.roles.add(st);

        // If they don't have the prefix, add it
        if (!hasPrefix) {
            await tryChangeNickname(
                message,
                member,
                "(ST) " + originalMemberName
            );
        }

        // Tell them about it
        await sendMessage(message, `${member.displayName} is storytelling!`);
    }
}

function defStToggle(comm, message) {
    comm.command("st")
        .description("Toggle whether the guild member has the ST role")
        .argument(
            "[member...]",
            "Guild member(s) to toggle ST role of; if multiple given, one will be chosen randomly (default: caller)"
        )
        .action(
            async (members, options, command) =>
                await stToggle(message, members, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { stToggle: stToggle, defStToggle: defStToggle };
