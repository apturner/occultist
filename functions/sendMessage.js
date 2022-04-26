async function sendMessage(message, str, reply = true) {
    if (reply === true) {
        return message.reply({
            content: str,
            allowedMentions: {
                repliedUser: false,
            },
        });
    } else {
        return message.channel.send({
            content: str,
        });
    }
}

module.exports = sendMessage;
