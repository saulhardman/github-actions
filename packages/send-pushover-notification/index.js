import * as core from '@actions/core';
import axios from 'axios';

const PUSHOVER_API_URL = 'https://api.pushover.net/1/messages.json';

const PUSHOVER_PARAMETERS = [
  { name: 'token', required: true },
  { name: 'user', required: true },
  { name: 'message', required: true },
  { name: 'device' },
  { name: 'title' },
  { name: 'url' },
  { name: 'url_title' },
  { name: 'priority' },
  { name: 'sound' },
  { name: 'timestamp' },
];

const handleAxiosError = (error) => {
  if (error.response) {
    const {
      data: {
        error: { message },
      },
      status,
    } = error.response;

    return `${status} ${message}`;
  }

  if (error.request) {
    return 'No response received';
  }

  return error.message;
};

const run = async () => {
  try {
    core.info('Parsing inputs.');

    const data = PUSHOVER_PARAMETERS.reduce(
      (acc, { name, required = false }) => {
        const value = core.getInput(name, { required });

        if (typeof value === 'undefined') {
          return acc;
        }

        return {
          ...acc,

          [name]: value,
        };
      },
      {},
    );

    core.info('Initiating request to the Pushover API.');

    await axios.post(PUSHOVER_API_URL, data);

    core.info('Request successful.');
  } catch (error) {
    core.setFailed(handleAxiosError(error));
  }
};

if (process.env.NODE_ENV !== 'test') {
  run();
}

export default run;
