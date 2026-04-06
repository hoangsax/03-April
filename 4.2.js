// 2. print how to read number in vietnamese: n integer < 1,000,000
function numberPartPerUnit (number) {
    let numString = number.toString();
    let parts = [];
    let length = numString.length;
    while (length > 0) {
        parts.unshift(numString.slice(length - 3 >= 0? length - 3 : 0, length));
        length -= 3;
    }
    return parts;
}

function read3DigitsInVietnamese(numString) {
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    const digits2 = ['không', 'một', 'hai', 'ba', 'bốn', 'lăm', 'sáu', 'bảy', 'tám', 'chín'];
    if (numString.length === 1) {
        return digits[parseInt(numString)];
    }
    else if (numString.length === 2) {
        if (numString[0] === '1') {
            if (numString[1] === '0') {
                return 'mười';
            }
            else {
                return 'mười ' + digits2[parseInt(numString[1])];
            }
        }
        else {
            if (numString[1] === '0') {
                return digits[parseInt(numString[0])] + ' mươi';
            }
            else {
                return digits[parseInt(numString[0])] + ' mươi' + ' ' + digits2[parseInt(numString[1])];
            }
        }
    }
    else if (numString.length === 3) {
        let result = '';
        if (numString[1] === '0') {
            if (numString[2] !== '0') {
                result += ' linh ' + digits[parseInt(numString[2])];
            }
            if (numString[0] !== '0') {
                result = digits[parseInt(numString[0])] + ' trăm' + result;
            }
        }
        else {
            result += digits[parseInt(numString[0])] + ' trăm' + ' ' + read3DigitsInVietnamese(numString.slice(1));
        }
        return result;
    }
}

function howToReadNumberInVietnamese(number) {
    if (number < 0 || number >= 1000000) {
        return 'Input must be between 0 and 999,999';
    }
    const units = ['', ' nghìn', ' vạn'];
    const digits = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    let result = '';
    let parts = numberPartPerUnit(number);
    if (parts.length === 2) {
        if (parts[0].length >= 2) {
            result = read3DigitsInVietnamese(parts[0].slice(0, -1)) + units[2] + (parts[0].slice(-1) === '0' ? '' : ' ' + digits[parseInt(parts[0].slice(-1))] + units[1]) + ' ' + read3DigitsInVietnamese(parts[1]);
        }
        else {
            result = digits[parseInt(parts[0])] + units[1] + ' ' + read3DigitsInVietnamese(parts[1]);
        }
    }
    else {
        result = read3DigitsInVietnamese(parts[0]);
    }
    return result;
}
console.log(howToReadNumberInVietnamese(15));
console.log(howToReadNumberInVietnamese(200));
console.log(howToReadNumberInVietnamese(20021));

console.log(howToReadNumberInVietnamese(112345));
