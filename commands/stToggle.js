const { InvalidArgumentError } = require("commander");
const findMember = require("../functions/findMember");
const makeChoice = require("../functions/makeChoice");
const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");
const { stringFormat } = require("../functions/stringFormat");

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
