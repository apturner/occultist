async function sendMessage(message, str) {
    await message.reply({
        content: str,
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = sendMessage;
