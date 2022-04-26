const sendMessage = require("../functions/sendMessage");

async function toggleRole(message, options, command) {
    // Get member
    let member = message.member;

    // Get BotC role
    const botc = message.guild.roles.cache.find((role) => role.name === "botc");

    const hasRole = member.roles.cache.some((role) => role === botc);

    if (hasRole === true) {
        await sendMessage(
            message,
            `${member.displayName} no longer has the botc role`
        );
        member.roles.remove(botc);
    } else {
        await sendMessage(message, `${member.displayName} now has the botc role`);
        member.roles.add(botc);
    }
}

function defToggleRole(comm, message) {
    comm.command("toggleRole")
        .description("Add/remove the guild botc role")
        .action(
            async (options, command) =>
                await toggleRole(message, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { toggleRole: toggleRole, defToggleRole: defToggleRole };
