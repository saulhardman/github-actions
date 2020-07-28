const core = require('@actions/core');
const axios = require('axios');

const INSTAGRAM_REFRESH_ACCESS_TOKEN_URL =
  'https://graph.instagram.com/refresh_access_token';

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
    const ACCESS_TOKEN = core.getInput('access_token', { required: true });

    core.info('Requesting new access token.');

    const {
      data: { access_token: accessToken },
    } = await axios.get(INSTAGRAM_REFRESH_ACCESS_TOKEN_URL, {
      params: {
        access_token: ACCESS_TOKEN,
        grant_type: 'ig_refresh_token',
      },
    });

    core.setOutput('access_token', accessToken);
  } catch (error) {
    core.setFailed(handleAxiosError(error));
  }
})();
