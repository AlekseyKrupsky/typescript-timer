import { ValidationError } from './errors';

export const TIME_PARTS = 3;

export const validateTimeString = (
  time: string,
  errorMessage: string = 'Invalid time format'
) => {
  const startTimeParts = getTimeParts(time);

  if (startTimeParts.length !== TIME_PARTS) {
    throw new ValidationError(errorMessage);
  }

  for (const timePart of Object.keys(startTimeParts)) {
    validateTimePart(timePart, errorMessage);
  }
};

export const getTimeParts = (time: string) => {
  return time.trim().split(':');
};

const validateTimePart = (timePart: string, errorMessage: string) => {
  if (timePart.length > 2) {
    throw new ValidationError(errorMessage);
  }

  for (let i = 0; i < timePart.length; i++) {
    if (isNaN(parseInt(timePart[i], 10))) {
      throw new ValidationError(errorMessage);
    }
  }

  const time = parseInt(timePart, 10);

  if (time < 0 || time > 59) {
    throw new ValidationError(errorMessage);
  }
};
