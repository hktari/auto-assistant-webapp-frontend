function compareArraysEqualShallow(firstArr, secondArr) {
    return firstArr.length === secondArr.length &&
        firstArr.every(firstEl =>
            secondArr.some(secondEl =>
                Object.keys(firstEl).every(key => firstEl[key] === secondEl[key])))
}

module.exports = {
    compareArraysEqualShallow
}
