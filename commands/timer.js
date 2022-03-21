const sendMessage = require("../functions/sendMessage");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function timer(message, duration, command) {
    // Timer update frequency, in seconds (must be at most 60)
    const updatePeriod = 15;

    // Get ending time, in milliseconds
    const endTime = Math.round(message.createdTimestamp / 1000 + duration * 60);
    let minutesLeft = Math.floor(duration);
    let secondsLeft = Math.floor((duration * 60) % 60);

    // Set up message strings
    const headerStr = `${message.member.displayName} has set a timer that ends at <t:${endTime}:t>\n`;

    // Send timer message
    let timerMessage = await message.reply({
        content:
            headerStr +
            `**${minutesLeft}:${secondsLeft
                .toString()
                .padStart(2, "0")} REMAINING**`,
        allowedMentions: {
            repliedUser: false,
        },
    });

    let cancelled = false;

    await timerMessage.react("765116505246662657");

    const filter = (reaction, user) => {
        return (
            reaction.emoji.name === "disagree" && user.id === message.author.id
        );
    };

    const collector = timerMessage.createReactionCollector({
        filter,
        time: 1.5 * (duration * 60000),
    });

    collector.on("collect", (reaction, user) => {
        cancelled = true;
    });

    // Edit timer message loop
    while (cancelled === false && (minutesLeft > 0 || secondsLeft > 0)) {
        // Sleep updatePeriod seconds
        await sleep(updatePeriod * 1000);

        // Reduce the remaining time by updatePeriod seconds
        if (secondsLeft > updatePeriod) {
            secondsLeft -= updatePeriod;
        } else if (minutesLeft > 0) {
            secondsLeft += 60 - updatePeriod;
            minutesLeft -= 1;
        } else {
            secondsLeft = 0;
            minutesLeft = 0;
        }

        // Update timer message
        await timerMessage.edit(
            headerStr +
                `**${minutesLeft}:${secondsLeft
                    .toString()
                    .padStart(2, "0")} REMAINING**`
        );
    }

    collector.stop();

    if (cancelled === true) {
        await timerMessage.edit(headerStr + "**TIMER CANCELLED**");
    } else {
        await timerMessage.edit(headerStr + "**TIME IS UP**");
    }
}

function defTimer(comm, message) {
    comm.command("timer")
        .description(
            "Post countdown timer in the channel where the command was invoked"
        )
        .argument(
            "<duration>",
            "Duration of timer, from time of call, in minutes"
        )
        .action(
            async (duration, command) => await timer(message, duration, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { timer: timer, defTimer: defTimer };
