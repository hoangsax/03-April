// 3. Write the function to count how many words appear in a string:
// oneTwoThree => 3

function countWords(str) {
    let strlength = str.length;
    let count = 0;
    for (let i = 0; i < strlength; i++) {
        if (str[i] === str[i].toUpperCase()) {
            count++;
        }
    }
    return count;
}
console.log(countWords("HelloWorldThisIsATest"));