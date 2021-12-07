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
                return `killed by ${killedBy} attack`;
            case "Other Power (Day)":
                return `died by ${dayDeath[killedBy]}`;
            case "Other Power (Night)":
                return `died by ${nightDeath[killedBy]}`;
            case "Fabled":
                return `died by ${nightDeath[killedBy]}`;
            case "Star Pass":
                return `Star Passed`;
            case "Exile":
                return `was Exiled`;
            case "Travelled Away":
                return `Travelled Away`;
            case "Storyteller Discretion":
                return `died at Storyteller's Discretion`;
            default:
                return `died to ${causeOfDeath}`;
        }
    }
}

module.exports = getCauseOfDeathString;
