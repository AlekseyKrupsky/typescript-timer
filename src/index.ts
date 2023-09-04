import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import { validateTimeString } from './validator';
import { promisify } from 'util';
import {
  getCurrentLocaleTimeString,
  getTimeDiff,
  getTimeDiffFormatted,
  printTimerStatus
} from './service';
import { ValidationError } from './errors';
import { QUIT_LINE } from './constants';

const run = async (): Promise<void> => {
  try {
    const rl = readline.createInterface({ input, output });

    const question = promisify(rl.question);

    const currentTimeFormatted = getCurrentLocaleTimeString();

    const startTimeQuestion = `Please enter start time (default ${currentTimeFormatted}): `;
    const endTimeQuestion = 'Please enter end time: ';

    let startTime: string = await question.call(
      rl,
      startTimeQuestion
    ) as unknown as string;

    if (startTime === '') {
      startTime = currentTimeFormatted;
    } else {
      validateTimeString(startTime, 'Invalid start time');

      const startTimeDiffWithCurrent = getTimeDiff(
        startTime,
        currentTimeFormatted
      );

      if (startTimeDiffWithCurrent < 0) {
        throw new ValidationError("Start time shouldn't be in a future");
      }
    }

    const endTime: string = (await question.call(
      rl,
      endTimeQuestion
    )) as unknown as string;

    validateTimeString(endTime, 'Invalid end time');

    const diffInSecondsFromStart = getTimeDiff(startTime, endTime);

    if (diffInSecondsFromStart < 0) {
      throw new ValidationError('End time should be after start time');
    }

    const startMessage = `Total timer time is: ${getTimeDiffFormatted(
      diffInSecondsFromStart
    )}`;

    console.info(startMessage);

    rl.on('line', (line: string) => {
      if (line === QUIT_LINE) {
        process.stdout.write('Exit...\n');

        process.exit(0);
      }
    });

    printTimerStatus(diffInSecondsFromStart, endTime);

    setInterval(() => {
      printTimerStatus(diffInSecondsFromStart, endTime);
    }, 1000);
  } catch (e) {
    if (e instanceof ValidationError) {
      console.error(e.message);
    } else {
      console.error('Unknown error occurred. Exit with code 1');
    }

    process.exit(1);
  }
};

run();
