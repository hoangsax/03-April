// 3. Write the function get a random element from an arrays.

function randomElement(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}
console.log(randomElement([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));