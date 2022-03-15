const { stringFormat } = require("../functions/stringFormat");

async function findMember(message, memberString) {
    await message.guild.members.fetch();
    const member = message.guild.members.cache.find((m) =>
        stringFormat(m.displayName).includes(stringFormat(memberString))
    );

    if (member === undefined) {
        await sendCodeBlock(message, "Guild member not found.");
        throw new InvalidArgumentError("Guild member not found.");
    }

    return member;
}

module.exports = findMember;
