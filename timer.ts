import * as readline from 'node:readline';
import {stdin as input, stdout as output} from 'node:process';
import {validateTimeString} from "./timerValidator.js";
import {promisify} from "util";
import {getTimeDiff, getTimeDiffFormatted, getTimeDiffFromNow} from "./timerService.js";
import {ValidationError} from "./errors.js";

const run = async () => {
    try {
        const rl = readline.createInterface({input, output});

        const question = promisify(rl.question);

        const currentDateTime = new Date();
        const currentTimeFormatted = currentDateTime.toLocaleTimeString();
        const startTimeQuestion = `Please enter start time (default ${currentTimeFormatted}):`;
        const endTimeQuestion = 'Please enter end time:';

        let startTime: string = await question.call(rl, startTimeQuestion) as string;

        if (startTime === '') {
            startTime = currentTimeFormatted;
        } else {
            validateTimeString(startTime, 'Invalid start time');
            const startTimeDiffWithCurrent = getTimeDiff(startTime, currentTimeFormatted);

            if (startTimeDiffWithCurrent < 0) {
                throw new ValidationError('Start time shouldn\'t be in a future');
            }
        }

        const endTime: string = await question.call(rl, endTimeQuestion) as string;

        validateTimeString(endTime, 'Invalid end time');

        const diffInSeconds = getTimeDiff(startTime, endTime);

        if (diffInSeconds < 0) {
            throw new ValidationError('End time should be after start time');
        }

        const startMessage = `Total timer time is: ${getTimeDiffFormatted(diffInSeconds)}`;
        console.info(startMessage);

        setInterval(() => {
            const timeDiffFromNow = getTimeDiffFromNow(endTime);
            const progress = Math.round((1 - timeDiffFromNow / diffInSeconds) * 10000) / 100;
            const remainTimeMessage = `Remain time is: ${getTimeDiffFormatted(timeDiffFromNow)}. Progress: ${progress}%\r`;

            process.stdout.write(remainTimeMessage);
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
