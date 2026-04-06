// 2. Write the function to get a random integer between 2 numbers: min, max;
// include both min and max
function randomNumber(min, max) {
    let possibleNumbers = max - min + 1;
    return Math.floor(Math.random() * possibleNumbers) + min;
}
console.log(randomNumber(10, 20));