function stringFormat(str) {
    if (str === undefined) return undefined;

    return str.replace(/[ -]/g, "").toLowerCase();
}

module.exports = stringFormat;
