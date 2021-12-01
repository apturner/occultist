const printHelp = require("../functions/printHelp");

async function stToggle(message, options, command) {
    // Display help if requested
    // if (options.help) {
    //     printHelp(message, command);
    //     return;
    // }

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
        await message.reply({
            content: `${member.displayName} is no longer storytelling.`,
            allowedMentions: {
                repliedUser: false,
            },
        });
    } else {
        // Give it to them and tell them about it
        member.roles.add(st);
        await message.reply({
            content: `${member.displayName} is storytelling!`,
            allowedMentions: {
                repliedUser: false,
            },
        });
    }
}

module.exports = stToggle;
