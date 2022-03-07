const dayDeath = require("../data/causeOfDeathDay");
const nightDeath = require("../data/causeOfDeathNight");
const fabledDeath = require("../data/causeOfDeathFabled");

function getCauseOfDeathString(fate, causeOfDeath, killedBy) {
    if (fate === "Alive") {
        return "survived!";
    } else {
        switch (causeOfDeath) {
            case "Execution":
                return "died by Execution";
            case "Demon Attack":
                return `was killed by ${killedBy} Attack`;
            case "Other Power (Day)":
                return dayDeath[killedBy]
                    ? `was killed by ${dayDeath[killedBy]}`
                    : `was killed by ${killedBy}`;
            case "Other Power (Night)":
                return nightDeath[killedBy]
                    ? `was killed by ${nightDeath[killedBy]}`
                    : `was killed by ${killedBy}`;
            case "Fabled":
                return fabledDeath[killedBy]
                    ? `was killed by ${fabledDeath[killedBy]}`
                    : `was killed by ${killedBy}`;
            case "Star Pass":
                return "Star Passed";
            case "Exile":
                return "was Exiled";
            case "Travelled Away":
                return "Travelled Away";
            case "Storyteller Discretion":
                return "died at Storyteller's Discretion";
            case undefined:
                return "died in an indeterminate fashion";
            default:
                return `died to ${causeOfDeath}`;
        }
    }
}

module.exports = getCauseOfDeathString;
