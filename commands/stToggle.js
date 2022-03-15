const { InvalidArgumentError } = require("commander");
const findMember = require("../functions/findMember");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const { stringFormat } = require("../functions/stringFormat");

async function stToggle(message, member, options, command) {
    // If no guild member given, set member to caller
    // Otherwise, find the first guild member whose name roughly matches the given name
    if (member === undefined) {
        member = message.member;
        // This is the old way to do this
        // member = message.guild.members.cache.find(
        //     (m) => m.id === message.author.id
        // );
    } else {
        member = await findMember(message, member);
    }

    // Get ST role
    const st = message.guild.roles.cache.find(
        (role) => role.name === "Storyteller"
    );

    // If they already have the ST role...
    if (member.roles.cache.some((role) => role === st)) {
        // Take it away and tell them about it
        member.roles.remove(st);
        await sendMessage(
            message,
            `${member.displayName} is no longer storytelling.`
        );
    } else {
        // Give it to them and tell them about it
        member.roles.add(st);
        await sendMessage(message, `${member.displayName} is storytelling!`);
    }
}

function defStToggle(comm, message) {
    comm.command("st")
        .description("Toggle whether the guild member has the ST role")
        .argument(
            "[member]",
            "Guild member to toggle ST role of (default: caller)"
        )
        .action(
            async (member, options, command) =>
                await stToggle(message, member, options, command)
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
