const { InvalidArgumentError } = require("commander");
const sendCodeBlock = require("../functions/sendCodeBlock");
const { stringFormat } = require("../functions/format");

async function findMember(message, memberString, complain = true) {
    await message.guild.members.fetch();

    // Try to find someone with the given string in their display name
    let member = message.guild.members.cache.find((m) =>
        stringFormat(m.displayName).includes(stringFormat(memberString))
    );

    // If that didn't work, see if someone has the string in their username
    if (member === undefined) {
        member = message.guild.members.cache.find((m) =>
            stringFormat(m.user.username).includes(stringFormat(memberString))
        );
    }

    if (complain === true && member === undefined) {
        await sendCodeBlock(message, "Guild member not found.");
        throw new InvalidArgumentError("Guild member not found.");
    }

    return member;
}

module.exports = findMember;
