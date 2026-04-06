function TimeDiff(startTime: number, endTime: number): string {
    let resultArr: number[] = [];
    let timeDiffInSeconds = endTime - startTime;
    for (let i = 0; i < 3; i++) {
        resultArr.push(Math.floor(timeDiffInSeconds / (60 ** (2 - i))));
        timeDiffInSeconds %= 60 ** (2 - i);
    }
    return resultArr.map((t) => t.toString().padStart(2, '0')).join(":");
}

console.log(TimeDiff(3600 * 5 + 60 * 30 + 45, 3600 * 17 + 60 * 30 + 45)); // Output: [12, 0, 0]
console.log('08:30:45' < '17:30:45'); // Output: false