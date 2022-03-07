async function sendEmbed(message, embed, reply = true) {
    if (reply === true) {
        await message.reply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: false,
            },
        });
    } else {
        await message.channel.send({
            embeds: [embed],
        });
    }
}

module.exports = sendEmbed;
