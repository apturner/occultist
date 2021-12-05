async function sendEmbed(message, embed) {
    await message.reply({
        embeds: [embed],
        allowedMentions: {
            repliedUser: false,
        },
    });
}

module.exports = sendEmbed;
