const sendMessage = require("../functions/sendMessage");
const sleep = require("../functions/sleep");

function getPosMaxIndices(arr) {
    let indices = [],
        max = 0,
        cur;
    for (let i = 0; i < arr.length; i++) {
        cur = arr[i];
        if (cur > max) {
            max = cur;
            indices = [i];
        } else if (cur == max) {
            indices.push(i);
        }
    }
    return indices;
}

async function scriptPoll(message, member, options, command) {
    // Vote duration in seconds
    const voteDuration = 5;

    // const tbEmoteID = "812144685170688030";
    const tbEmoteID = "968577751869173851";
    const scriptEmotes = [`<:imp:${tbEmoteID}>`, "🌙", "🥀", "🛃"];
    const scriptStrings = [
        "Trouble Brewing",
        "Bad Moon Rising",
        "Sects & Violets",
        "a custom script",
    ];
    const questionString = `What script should we play?\n${scriptEmotes[0]}: ${scriptStrings[0]}\n${scriptEmotes[1]}: ${scriptStrings[1]}\n${scriptEmotes[2]}: ${scriptStrings[2]}\n${scriptEmotes[3]}: Custom script`;

    const poll = await message.reply({
        content: questionString,
        allowedMentions: {
            repliedUser: false,
        },
    });
    await poll.react(tbEmoteID);
    await poll.react(scriptEmotes[1]);
    await poll.react(scriptEmotes[2]);
    await poll.react(scriptEmotes[3]);

    await sleep(voteDuration * 1000);

    const tb = poll.reactions.cache.get(tbEmoteID).count;
    const bmr = poll.reactions.cache.get(scriptEmotes[1]).count;
    const snv = poll.reactions.cache.get(scriptEmotes[2]).count;
    const custom = poll.reactions.cache.get(scriptEmotes[3]).count;

    const winIndices = getPosMaxIndices([tb, bmr, snv, custom]);

    if (winIndices.length > 1) {
        await sendMessage(poll, `It's a ${winIndices.length}-way tie:`);
        await sendMessage(
            poll,
            winIndices.map((i) => scriptEmotes[i]).join(""),
            false
        );
    } else {
        await sendMessage(
            poll,
            `We're playing ${scriptStrings[winIndices[0]]}!`
        );
        await sendMessage(poll, scriptEmotes[winIndices[0]], false);
    }
}

function defScriptPoll(comm, message) {
    comm.command("poll")
        .description("Create reaction poll to choose a script")
        .action(
            async (options, command) =>
                await scriptPoll(message, options, command)
        )
        .configureOutput({
            writeOut: (str) => sendCodeBlock(message, str),
            writeErr: (str) => sendCodeBlock(message, str),
        })
        .helpOption("-h, --help", "Display help for command")
        .allowUnknownOption()
        .exitOverride();
}

module.exports = { scriptPoll: scriptPoll, defScriptPoll: defScriptPoll };
