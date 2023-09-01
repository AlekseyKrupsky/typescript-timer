import { getTimeParts } from "./timerValidator.js";

export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_SECOND = 1;

const timeMultipliers = [
    SECONDS_IN_HOUR,
    SECONDS_IN_MINUTE,
    SECONDS_IN_SECOND,
]

export const getTimeDiff = (startTime: string, endTime: string): number => {
    const startTimeParts = getTimeParts(startTime);
    const endTimeParts = getTimeParts(endTime);

    let diffInSeconds: number = 0;

    for (let timeMultiplierIndex in timeMultipliers) {
        diffInSeconds+= (parseInt(endTimeParts[timeMultiplierIndex]) - parseInt(startTimeParts[timeMultiplierIndex])) * timeMultipliers[timeMultiplierIndex];
    }

    return diffInSeconds;
}

export const getTimeDiffFormatted = (diffInSeconds: number): string => {
    const zeroDate = new Date(0);
    zeroDate.setSeconds(diffInSeconds);

    return `${zeroDate.getUTCHours()}:${zeroDate.getUTCMinutes()}:${zeroDate.getUTCSeconds()}`;
}

export const getTimeDiffFromNow = (endTime: string): number => {
    return getTimeDiff((new Date()).toLocaleTimeString(), endTime);
}

export const printTimerStatus = (endTime): void => {
    const remainTimeMessage = `Remain time is: ${getTimeDiffFormatted(getTimeDiffFromNow(endTime))}`;

}
