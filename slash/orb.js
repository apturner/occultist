const { SlashCommandBuilder } = require("@discordjs/builders");

function delay(t) {
    return new Promise((r) => setTimeout(r, t));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("orb")
        .setDescription("Ponder my orb")
        .addStringOption((option) =>
            option
                .setName("input")
                .setDescription("The input to echo back")
                .setRequired(true)
        )
        .setDefaultPermission(false),
    giveMePermission: true,
    async execute(interaction) {
        await interaction.reply({ content: "Will do!", ephemeral: true });
        await interaction.channel.sendTyping();
        await delay(2500);
        await interaction.channel.send(interaction.options.getString("input"));
    },
};
