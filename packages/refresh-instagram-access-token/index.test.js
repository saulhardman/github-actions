import * as core from '@actions/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { name } from './package.json';

import run from './index';

const DEFAULT_INPUTS = {
  access_token: 'abc123',
};

const setInputs = (inputs) => {
  Object.entries({ ...DEFAULT_INPUTS, ...inputs }).forEach(([key, value]) => {
    process.env[`INPUT_${key.toUpperCase()}`] = value;
  });
};

const unsetInputs = (inputKeys = []) => {
  [...Object.keys(DEFAULT_INPUTS), ...inputKeys].forEach((keys) => {
    delete process.env[`INPUT_${keys.toUpperCase()}`];
  });
};

const server = setupServer(
  rest.get(
    'https://graph.instagram.com/refresh_access_token',
    (req, res, ctx) => {
      const accessToken = req.url.searchParams.get('access_token');

      if (accessToken === 'abc123') {
        return res(ctx.json({ access_token: 'xyz789' }));
      }

      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'Invalid OAuth access token.',
            type: 'OAuthException',
            code: 190,
          },
        }),
      );
    },
  ),
);

beforeAll(() => server.listen());
beforeEach(() => {
  jest.resetModules();

  setInputs();
});
afterEach(() => {
  server.resetHandlers();

  unsetInputs();
});
afterAll(() => server.close());

describe(name, () => {
  it('runs', async () => {
    await expect(run()).resolves.not.toThrow();
  });

  it('fails when `access_token` input is omitted', async () => {
    unsetInputs();

    const setFailedMock = jest.spyOn(core, 'setFailed');

    await run();

    expect(setFailedMock).toHaveBeenCalledWith(
      'Input required and not supplied: access_token',
    );
  });

  it('sets `access_token` as output', async () => {
    const setOutputMock = jest.spyOn(core, 'setOutput');

    await run();

    expect(setOutputMock).toHaveBeenCalledWith('access_token', 'xyz789');
  });

  it('sets `access_token` output as secret', async () => {
    const setSecretMock = jest.spyOn(core, 'setSecret');

    await run();

    expect(setSecretMock).toHaveBeenCalledWith('xyz789');
  });

  it('fails if invalid `access_token` passed', async () => {
    setInputs({ access_token: 'def456' });

    const setFailedMock = jest.spyOn(core, 'setFailed');

    await run();

    expect(setFailedMock).toHaveBeenCalledWith(
      '400 Invalid OAuth access token.',
    );
  });
});
