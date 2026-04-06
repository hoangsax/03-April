// 4. Given two arrays of integers,
// find which elements in the second array are missing from the first array.
function findMissingElements(arr1, arr2) {
    const missingElements = [];
    for (let i = 0; i < arr2.length; i++) {
        if (!arr1.includes(arr2[i])) {
            missingElements.push(arr2[i]);
        }
    }
    return missingElements;
}