const filterStr = (str) => {
    let returnStr = ''
    const allowedChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-".split("");
    for (let char of str) {
        if(allowedChars.includes(char)){
            returnStr += char
        }
    }
    return returnStr;
}

module.exports = {
    filterStr
}