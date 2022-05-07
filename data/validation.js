var Filter = require('bad-words'),
    filter = new Filter();

function checkInput(val, varName, varType) {
    if (val == undefined) throw `${varName} is not defined`;
    if (varType == "array") {
        if (!Array.isArray(val)) throw `${varName} is not an array`;
        let i = 0;
        let arr = [];
        val.forEach(element => {
            if (typeof element != 'string' && (varName != "songs")) throw `${varName} element is not a string`;
            let t = String.prototype.trim.call(element);
            if (t.length > 0) {
                i ++;
                arr.push(t);
            }
        });
        val = arr;
    }
    else if (varType == "string") {
        if (typeof val != 'string') throw `${varName} is not a string.`;
        val = String.prototype.trim.call(val);
        if (val.length == 0) throw `${varName} is empty.`;
        if(filterHateSpeech(val)) throw `${varName} contains profane language`;
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

/**
 * @description
 * Returns a function which will sort an
 * array of objects by the given key.
 *
 * @param  {String}  key
 * @param  {Boolean} reverse
 * @return {Function}
 */

//https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value?page=2&tab=trending#tab-top
 const sortBy = (key, reverse) => {

    // Move smaller items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    const moveSmaller = reverse ? 1 : -1;
  
    // Move larger items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    const moveLarger = reverse ? -1 : 1;
  
    /**
     * @param  {*} a
     * @param  {*} b
     * @return {Number}
     */
    return (a, b) => {
      if (a[key] < b[key]) {
        return moveSmaller;
      }
      if (a[key] > b[key]) {
        return moveLarger;
      }
      return 0;
    };
  };

function filterHateSpeech(input) {
    return filter.isProfane(input);
}

module.exports = {checkInput, filterHateSpeech, sortBy};