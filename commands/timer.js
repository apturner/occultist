const sendMessage = require("../functions/sendMessage");

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function timer(message, duration, options, command) {
    // Timer update frequency, in seconds (must be less than 60)
    const updateFrequency = 5;

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

    // Edit timer message loop
    while (minutesLeft > 0 || secondsLeft > 0) {
        // Sleep 5 seconds
        await sleep(updateFrequency * 1000);

        // Reduce the remaining time by 5 seconds
        if (secondsLeft > updateFrequency) {
            secondsLeft -= updateFrequency;
        } else if (minutesLeft > 0) {
            secondsLeft += 60 - updateFrequency;
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

    await timerMessage.edit(headerStr + "**TIME IS UP**");
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
            async (duration, options, command) =>
                await timer(message, duration, options, command)
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