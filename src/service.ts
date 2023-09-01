import { getTimeParts } from './validator';
import { TIME_MULTIPLIERS } from './constants';
import * as notifier from 'node-notifier';

export const getTimeDiff = (startTime: string, endTime: string): number => {
  const startTimeParts = getTimeParts(startTime);
  const endTimeParts = getTimeParts(endTime);

  let diffInSeconds: number = 0;

  for (const timeMultiplierIndex of Object.keys(TIME_MULTIPLIERS)) {
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

export const printTimerStatus = (diffInSecondsFromStart, endTime): void => {
  const timeDiffFromNow = getTimeDiffFromNow(endTime);

  if (timeDiffFromNow > 0) {
    const progress =
      Math.round((1 - timeDiffFromNow / diffInSecondsFromStart) * 10000) / 100;

    const remainTimeMessage = `Timer is running. Enter 'q' to exit. Remain time is: ${getTimeDiffFormatted(
      timeDiffFromNow
    )}. Progress: ${progress}%       \r`;

    process.stdout.write(remainTimeMessage);

    return;
  }

  const timerEndMessage = 'It`s time!';

  try {
    notifier.notify({
      title: 'Timer',
      message: timerEndMessage
    });
  } catch (e) {
    console.log(e.message);
  }

  process.stdout.write(`\n${timerEndMessage}\n`);
  process.exit(0);
};

export const getCurrentLocaleTimeString = () => {
  return new Date().toLocaleTimeString('en-GB');
};
