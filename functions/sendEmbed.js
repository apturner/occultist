async function sendEmbed(message, embed, reply = true) {
    if (reply === true) {
        return message.reply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: false,
            },
        });
    } else {
        return message.channel.send({
            embeds: [embed],
        });
    }
}

module.exports = sendEmbed;
