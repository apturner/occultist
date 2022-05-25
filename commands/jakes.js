const sendMessage = require("../functions/sendMessage");

jakesId = "224631074981019658";

async function jakes(message, options, command) {
    if (message.member.id === jakesId) {
        jakes = await message.guild.members.fetch(jakesId);
        jakes.timeout(1000 * 60 * 5);
        await sendMessage(message, "Jakes has been timed out for 5 minutes.");
    } else {
        await sendMessage(message, "You're not Jakes...");
    }
}

function defJakes(comm, message) {
    comm.command("jakes")
        .description("For jakes")
        .action(
            async (members, options, command) =>
                await jakes(message, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { jakes: jakes, defJakes: defJakes };
