const sendCodeBlock = require("../functions/sendCodeBlock");
const sendMessage = require("../functions/sendMessage");

async function stToggle(message, options, command) {
    // Get author of message as a guild member
    const member = message.guild.members.cache.find(
        (member) => member.id === message.author.id
    );

    // Get ST role
    const st = message.guild.roles.cache.find((role) => role.name === "test");

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
        .action(async (options, command) => stToggle(message, options, command))
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { stToggle: stToggle, defStToggle: defStToggle };
