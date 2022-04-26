function checkInput(val, varName, varType) {
    if (val == undefined) throw `${varName} is not defined`;
    if (varType == "array") {
        if (varName == "albumSongs") {
            val = val.split(" ");
        }
        if (!Array.isArray(val)) throw `${varName} is not an array`;
        let i = 0;
        let arr = [];
        val.forEach(element => {
            if (typeof element != 'string') throw `${varName} element is not a string`;
            let t = String.prototype.trim.call(element);
            if (t.length > 0) {
                i ++;
                arr.push(t);
            }
        });
        if (arr.length < 3) throw `${varName} is not a valid array.`;
        val = arr;
    }
    else if (varType == "string") {
        if (typeof val != 'string') throw `${varName} is not a string.`;
        val = String.prototype.trim.call(val);
        if (val.length == 0) throw `${varName} is empty.`;
        if (checkHateSpeech(val)) throw `${varName} contains inappropiate content.`;
        if (varName == "releaseDate") { //https://stackoverflow.com/questions/7445328/check-if-a-string-is-a-date-value
            let date = moment(val, "MM/DD/YYYY", true);
            if (!date.isValid()) throw `${varName} is not a valid date.`
            if (date.format('YYYY') > moment().year()+1) throw `${varName} is too far in advance to be a valid date.`;
            if (date.format('YYYY') < 1900) throw `${varName} is too far in history to be a valid date.`;
        }
    }
    else if (varType == "int") {
        if (typeof val != 'number') throw `${varName} is not a number.`
        if (val < 1 || val > 5) throw `${varName} is not a valid rating.`
    }
    return val;
}

function checkHateSpeech(input) {
    const badWords = ["bitch", "fuck", "stupid"];
    badWords.forEach(element => {
        if (input.includes(element)) {
            return true;
        }
    })
    return false;
}

module.exports = {checkInput, checkHateSpeech};