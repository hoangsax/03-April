// Exercise 1
//1. Write a function to format money string:
//10000000 => “10,000,000" || 123456 => “123,456" || 12000.02 => "12,000.02"
function formatMoneyString(amount) {
    let [moneyString, notDecimalPart] = amount.toString().split('.');
    let formattedString = '';
    let index = moneyString.length - 1;
    while (index >= 0) {
        formattedString = moneyString.slice(index - 2 < 0 ? 0: index - 2, index + 1) + (formattedString ? ',' : '') + formattedString;
        index -= 3;
    }
    return notDecimalPart? formattedString + '.' + notDecimalPart : formattedString;
}
console.log(formatMoneyString(112345.222));