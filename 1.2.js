// 2. Write a function for format money in shorten :
// 1000 => 1K, 1123400000 => 1.12B , 1342222 => 1.34M
function formatMoneyShorten(amount) {
    const units = ['', 'K', 'M', 'B', 'T'];
    let index = 0;
    while (amount >= 1000 && index < units.length - 1) {
        amount /= 1000;
        index++;
    }
    return amount.toFixed(2) + units[index];
}
console.log(formatMoneyShorten(12340));