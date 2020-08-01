const core = require('@actions/core');
const axios = require('axios');

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

  return `Unknown error: ${error.message}`;
};

(async () => {
  try {
    core.debug('Parsing GitHub Action inputs.');

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

    core.debug('Initiating request to the Pushover API.');

    await axios.post(PUSHOVER_API_URL, data);

    core.debug('Request successful.');
  } catch (error) {
    core.setFailed(handleAxiosError(error));
  }
})();
