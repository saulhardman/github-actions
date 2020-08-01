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
    const accessToken = core.getInput('access_token', { required: true });

    core.info('Requesting new access token.');

    const {
      data: { access_token: refreshedAccessToken },
    } = await axios.get(INSTAGRAM_REFRESH_ACCESS_TOKEN_URL, {
      params: {
        access_token: accessToken,
        grant_type: 'ig_refresh_token',
      },
    });

    core.setOutput('access_token', refreshedAccessToken);
  } catch (error) {
    core.setFailed(handleAxiosError(error));
  }
})();
