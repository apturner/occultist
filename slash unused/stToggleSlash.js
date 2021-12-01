const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("st")
        .setDescription("Toggles the ST role"),
    async execute(interaction) {
        // Get author of message as a guild member
        const member = interaction.member;
        console.log(member);

        // Get ST role
        const st = interaction.guild.roles.cache.find(
            (role) => role.name === "test"
        );
        console.log(st);

        // If they already have the ST role...
        if (member.roles.cache.some((role) => role === st)) {
            // Take it away
            member.roles.remove(st);
            console.log("boop");
        } else {
            // Give it to them
            member.roles.add(st);
            console.log("beep");
        }
    },
};
