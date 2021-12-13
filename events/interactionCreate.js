const { codeBlock } = require("@discordjs/builders");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isCommand()) return;

        // Get command
        const command = interaction.client.commands.get(
            interaction.commandName
        );
        if (!command) return;

        // Execute command
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: codeBlock(
                    "There was an error while executing this command!"
                ),
                ephemeral: true,
            });
        }
    },
};
