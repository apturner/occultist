const { codeBlock } = require("@discordjs/builders");

async function sendCodeBlock(message, str) {
    await message.reply({
        content: codeBlock(str),
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = sendCodeBlock;
