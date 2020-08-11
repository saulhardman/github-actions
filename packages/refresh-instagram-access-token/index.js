import * as core from '@actions/core';
import axios from 'axios';

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

  return error.message;
};

const run = async () => {
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

    core.info('New access token received.');

    core.setSecret(refreshedAccessToken);

    core.setOutput('access_token', refreshedAccessToken);
  } catch (error) {
    core.setFailed(handleAxiosError(error));
  }
};

if (process.env.NODE_ENV !== 'test') {
  run();
}

export default run;
