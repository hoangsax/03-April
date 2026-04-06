// 1. Write the function to calculate the combination (Cnk)
function factorial(num) {
    if (num === 0 || num === 1) {
        return 1;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    return result;
}

function combination(n, k) {
    if (k > n || k < 0) {
        return 0;
    }
    return factorial(n) / (factorial(k) * factorial(n - k));
}

console.log(combination(5, 0));