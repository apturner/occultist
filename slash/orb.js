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
        ),
    // .setDefaultPermission(false), // Permissions V2 update broke this
    // giveMePermission: true, // Permissions V2 update broke this
    async execute(interaction) {
        // Only run for Cyberholmes
        if (interaction.user.id !== interaction.guild.ownerId) {
            await interaction.reply({
                content: "You are not powerful enough to ponder the orb",
                ephemeral: true,
            });
            return;
        }
        await interaction.reply({ content: "Will do!", ephemeral: true });
        await interaction.channel.sendTyping();
        await delay(2500);
        await interaction.channel.send(interaction.options.getString("input"));
    },
};
