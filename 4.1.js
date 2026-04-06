const romanMap = { 
    1: ['I', 'V'],
    2: ['X', 'L'], 
    3: ['C', 'D']   
};
const romanMapLength = Object.keys(romanMap).length;
const maxNum = 10 ** romanMapLength;
function romanPatternMatch(num, pos) {
// pos: 1 for ones, 2 for tens, 3 for hundreds
        if (num <= 3) {
            return romanMap[pos][0].repeat(num);
        }
        else if (num === 4) {
            return romanMap[pos][0] + romanMap[pos][1];
        }
        else if (num === 5) {
            return romanMap[pos][1];
        }
        else if (num <= 8) {
            return romanMap[pos][1] + romanMap[pos][0].repeat(num - 5);
        }
        else if (num === 9) {
            return romanMap[pos][0] + romanMap[pos + 1][0];
        }
}

function intToRoman(num) {
    if (num <= 0 || num >= maxNum) {
        return 'Input must be between 1 and ' + (maxNum - 1);
    }
    let roman = '';
    let numStr = num.toString();
    for (let i = 0; i < numStr.length; i++) {
        roman += romanPatternMatch(parseInt(numStr[i]), romanMapLength - i);
    }
    return roman;
}
console.log(intToRoman(1000));