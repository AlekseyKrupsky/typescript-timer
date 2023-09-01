import { getTimeParts } from './validator';

export const SECONDS_IN_HOUR = 3600;
export const SECONDS_IN_MINUTE = 60;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_SECOND = 1;

const timeMultipliers = [SECONDS_IN_HOUR, SECONDS_IN_MINUTE, SECONDS_IN_SECOND];

export const getTimeDiff = (startTime: string, endTime: string): number => {
  const startTimeParts = getTimeParts(startTime);
  const endTimeParts = getTimeParts(endTime);

  let diffInSeconds: number = 0;

  for (const timeMultiplierIndex of Object.keys(timeMultipliers)) {
    diffInSeconds +=
      (parseInt(endTimeParts[timeMultiplierIndex], 10) -
        parseInt(startTimeParts[timeMultiplierIndex], 10)) *
      timeMultipliers[timeMultiplierIndex];
  }

  return diffInSeconds;
};

export const getTimeDiffFormatted = (diffInSeconds: number): string => {
  const zeroDate = new Date(0);
  zeroDate.setSeconds(diffInSeconds);

  return `${zeroDate.getUTCHours()}:${zeroDate.getUTCMinutes()}:${zeroDate.getUTCSeconds()}`;
};

export const getTimeDiffFromNow = (endTime: string): number => {
  return getTimeDiff(new Date().toLocaleTimeString(), endTime);
};

export const printTimerStatus = (diffInSecondsFromStart, endTime): void => {
  const timeDiffFromNow = getTimeDiffFromNow(endTime);
  const progress = Math.round((1 - timeDiffFromNow / diffInSecondsFromStart) * 10000) / 100;

  const remainTimeMessage = `Remain time is: ${getTimeDiffFormatted(
      timeDiffFromNow
  )}. Progress: ${progress}%\r`;

  process.stdout.write(remainTimeMessage);
};
