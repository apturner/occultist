const { InvalidArgumentError } = require("commander");
const sendCodeBlock = require("../functions/sendCodeBlock");
const { stringFormat } = require("../functions/stringFormat");

async function findMember(message, memberString, complain = true) {
    await message.guild.members.fetch();

    let member = message.guild.members.cache.find((m) =>
        stringFormat(m.displayName).includes(stringFormat(memberString))
    );

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
