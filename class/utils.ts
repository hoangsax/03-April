function getDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getTime() {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function calculateTotalTimeBetween(startTime: string, endTime: string): number {
    let start = startTime.split(":").reduce((acc, time) => acc * 60 + parseInt(time), 0);
    let end = endTime.split(":").reduce((acc, time) => acc * 60 + parseInt(time), 0);
    let resultArr: number[] = [];
    let timeDiffInSeconds = end - start;
    // for (let i = 0; i < 3; i++) {
    //     resultArr.push(Math.floor(timeDiffInSeconds / (60 ** (2 - i))));
    //     timeDiffInSeconds %= 60 ** (2 - i);
    // }
    // return resultArr.map((t) => t.toString().padStart(2, '0')).join(":");
    return timeDiffInSeconds
}

export { getDate, getTime, calculateTotalTimeBetween };