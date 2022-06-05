const _ = require("lodash");
const { guildId } = require("../config.json");
const sendMessage = require("../functions/sendMessage");

// Settings
// Relative likelihoods of each outcome
const outcomeShares = {
    switch: 2,
    kick: 1,
    timeout: 5,
    cancel: 3,
    nickname: 5,
    tts: 5,
    mute: 5,
    move: 5,
};
// Probability that trying as not-Jakes will make you Jakes
const swapProb = 0.05;
// Time between allowed calls
const timeBetween = 60 * 1; // Seconds
// Timeout time
const timeoutMinutes = 5; // Minutes

// Computing probabilities from the above
const totalShares = _.reduce(
    outcomeShares,
    (result, value) => result + value,
    0
);
const outcomeProbs = _.mapValues(outcomeShares, (share) => share / totalShares);

// For checking if Jakes is allowed to roll again
let isDuring = false; // Are we still between allowed calls?
const duringString = "Naughty naughty, no double powerups!";

// let jakesId = "224631074981019658";
// Getting the Jakes role
function getJakesRole(message) {
    return message.guild.roles.cache.find((role) => role.name === "Jakes");
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Should make this smarter about random pick
async function switchJakes(message, otherMember = undefined) {
    if (otherMember === undefined) {
        await message.guild.members.fetch();
        const botcMembers = message.guild.roles.cache.find(
            (role) => role.name === "botc"
        ).members;
        console.log(botcMembers);
        console.log(_.size(botcMembers));

        // Pick random botc member
        otherMember = _.sample(Array.from(botcMembers.values()));
        console.log(otherMember);
    }

    // Get Jakes role and Jakeses
    const jakesRole = getJakesRole(message);
    const jakesMembers = jakesRole.members;

    // Remove all old Jakeses
    jakesMembers.map((m) => m.roles.remove(jakesRole));

    // Make new Jakes
    otherMember.roles.add(jakesRole);
}

async function kickJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Kick them
    const invite = await message.guild.invites.create("673383756886704141");
    await jakesMembers.map(
        async (m) =>
            await m.send(
                `Hey, you got kicked. Bad luck! Here's an invite back: ${invite}`
            )
    );
    await sendMessage(message, "Jakes has been kicked.");
    jakesMembers.map((m) => m.kick());
    switchJakes(message);
}

async function timeoutJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Message to send later
    let timeoutMessage =
        "I would time you out, but you're in a voice channel so I guess I'll be nice...";

    // Time them out if they aren't in a voice channel
    jakesMembers.map((m) => {
        if (!m.voice.channel) {
            m.timeout(timeoutMinutes * 60 * 1000);
            timeoutMessage = `Jakes has been timed out for ${timeoutMinutes} minutes.`;
        }
    });
    await sendMessage(message, timeoutMessage);
}

async function cancelJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Get Cancelled role
    const cancelled = message.guild.roles.cache.find(
        (role) => role.name === "Cancelled"
    );

    // Cancel them
    jakesMembers.map((m) => m.roles.add(cancelled));
    await sendMessage(message, "Jakes has been cancelled.");
}

async function nicknamePowerupJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Get Nicknamer role
    const nicknamer = message.guild.roles.cache.find(
        (role) => role.name === "Nicknamer"
    );

    // Give them nickname powers
    jakesMembers.map((m) => m.roles.add(nicknamer));
    isDuring = true;
    await sendMessage(
        message,
        "Jakes can now change other members' nicknames."
    );

    // Sleep for a while
    await sleep(timeBetween * 1000);

    // Take the powers away
    jakesMembers.map((m) => m.roles.remove(nicknamer));
    isDuring = false;
    await sendMessage(message, "Jakes is back to normal.");
}

async function ttsPowerupJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Get TTS role
    const tts = message.guild.roles.cache.find((role) => role.name === "TTS");

    // Give them TTS powers
    jakesMembers.map((m) => m.roles.add(tts));
    isDuring = true;
    await sendMessage(message, "Jakes can now send TTS messages.");

    // Sleep for a while
    await sleep(timeBetween * 1000);

    // Take the powers away
    jakesMembers.map((m) => m.roles.remove(tts));
    isDuring = false;
    await sendMessage(message, "Jakes is back to normal.");
}

async function movePowerupJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Get Mover role
    const mover = message.guild.roles.cache.find(
        (role) => role.name === "Mover"
    );

    // Give them move powers
    jakesMembers.map((m) => m.roles.add(mover));
    isDuring = true;
    await sendMessage(message, "Jakes can now move other members.");

    // Sleep for a while
    await sleep(timeBetween * 1000);

    // Take the powers away
    jakesMembers.map((m) => m.roles.remove(mover));
    isDuring = false;
    await sendMessage(message, "Jakes is back to normal.");
}

async function mutePowerupJakes(message) {
    // Get Jakeses
    const jakesMembers = getJakesRole(message).members;

    // Get Muter role
    const muter = message.guild.roles.cache.find(
        (role) => role.name === "Muter"
    );

    // Give them mute powers
    jakesMembers.map((m) => m.roles.add(muter));
    isDuring = true;
    await sendMessage(message, "Jakes can now mute other members.");

    // Sleep for a while
    await sleep(timeBetween * 1000);

    // Take the powers away
    jakesMembers.map((m) => m.roles.remove(muter));
    isDuring = false;
    await sendMessage(message, "Jakes is back to normal.");
}

async function jakes(message, options, command) {
    // Who sent the message
    const messageMember = message.member;

    // Does the sender have the Jakes role?
    const jakesRole = getJakesRole(message);
    const isJakes = messageMember.roles.cache.some(
        (role) => role === jakesRole
    );

    //If it's Jakes
    if (isJakes && !isDuring) {
        await sendMessage(message, "Hey, Jakes!");

        // Get random fate
        fate = Math.random();

        // Use this variable to track the bounds for fate.
        // This is safer than making a bounds object because iteration
        // order over objects is not always guaranteed
        let outcomeBound = 0;
        if (fate < (outcomeBound += outcomeProbs.switch)) {
            // Switch Jakes
            switchJakes(message);
            await sendMessage(message, "You're no longer Jakes!");
        } else if (fate < (outcomeBound += outcomeProbs.kick)) {
            // Kick Jakes
            kickJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.timeout)) {
            // Timeout Jakes
            timeoutJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.cancel)) {
            // Cancel Jakes
            cancelJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.nickname)) {
            // Nickname powerup Jakes
            nicknamePowerupJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.tts)) {
            // TTS powerup Jakes
            ttsPowerupJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.mute)) {
            // Mute powerup Jakes
            mutePowerupJakes(message);
        } else if (fate < (outcomeBound += outcomeProbs.move)) {
            // Move powerup Jakes
            movePowerupJakes(message);
        } else {
            // This should happen with probability 0
            await sendMessage(message, "It seems that nothing happened...");
        }
    } else if (isJakes && isDuring) {
        await sendMessage(message, duringString);
    } else {
        if (Math.random() < swapProb) {
            switchJakes(message, messageMember);
            await sendMessage(message, "You are now Jakes!");
        } else {
            await sendMessage(message, "You're not Jakes...");
        }
    }
}

function defJakes(comm, message) {
    comm.command("jakes")
        .description("For jakes")
        .action(
            async (members, options, command) =>
                await jakes(message, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { jakes: jakes, defJakes: defJakes };
