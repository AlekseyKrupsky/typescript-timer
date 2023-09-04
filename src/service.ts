import { getTimeParts } from './validator';
import { TIME_MULTIPLIERS } from './constants';
const notifier = require('node-notifier');

export const getTimeDiff = (startTime: string, endTime: string): number => {
  const startTimeParts = getTimeParts(startTime);
  const endTimeParts = getTimeParts(endTime);

  let diffInSeconds: number = 0;

  for (const timeMultiplierIndex of TIME_MULTIPLIERS.keys()) {
    diffInSeconds +=
      (parseInt(endTimeParts[timeMultiplierIndex], 10) -
        parseInt(startTimeParts[timeMultiplierIndex], 10)) *
      TIME_MULTIPLIERS[timeMultiplierIndex];
  }

  return diffInSeconds;
};

export const getTimeDiffFormatted = (diffInSeconds: number): string => {
  const zeroDate = new Date(0);
  zeroDate.setSeconds(diffInSeconds);

  return `${zeroDate.getUTCHours()}:${zeroDate.getUTCMinutes()}:${zeroDate.getUTCSeconds()}`;
};

export const getTimeDiffFromNow = (endTime: string): number => {
  return getTimeDiff(getCurrentLocaleTimeString(), endTime);
};

export const printTimerStatus = (diffInSecondsFromStart: number, endTime: string): boolean => {
  const timeDiffFromNow = getTimeDiffFromNow(endTime);

  if (timeDiffFromNow > 0) {
    const progress =
      Math.round((1 - timeDiffFromNow / diffInSecondsFromStart) * 10000) / 100;

    const remainTimeMessage = `Timer is running. Enter 'q' to exit. Remain time is: ${getTimeDiffFormatted(
      timeDiffFromNow
    )}. Progress: ${progress}%       \r`;

    process.stdout.write(remainTimeMessage);

    return false;
  }

  const timerEndMessage = 'It`s time!';

  try {
    notifier.notify({
      title: 'Timer',
      message: timerEndMessage
    });
  } catch (e: any) {
    console.log(e.message);
  }

  process.stdout.write(`\n${timerEndMessage}\n`);

  return true;
};

export const getCurrentLocaleTimeString = (): string => {
  return new Date().toLocaleTimeString('en-GB');
};
