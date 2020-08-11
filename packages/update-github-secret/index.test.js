import * as core from '@actions/core';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { name } from './package.json';

import run from './index';

const DEFAULT_INPUTS = {
  secret_name: 'EXAMPLE_SECRET',
  secret_value: 'example-secret',
  access_token: 'abc123',
  repo: 'github-actions',
  owner: 'saulhardman',
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
    'https://api.github.com/repos/saulhardman/github-actions/actions/secrets/public-key',
    (req, res, ctx) =>
      res(ctx.json({ key_id: 'abc123', key: 'some-public-key' })),
  ),

  rest.put(
    'https://api.github.com/repos/saulhardman/github-actions/actions/secrets/EXAMPLE_SECRET',
    (req, res, ctx) => res(ctx.status(201)),
  ),
);

beforeAll(() => {
  server.listen();

  jest.spyOn(core, 'error').mockImplementation(jest.fn());
  jest.spyOn(core, 'warning').mockImplementation(jest.fn());
  jest.spyOn(core, 'info').mockImplementation(jest.fn());
  jest.spyOn(core, 'debug').mockImplementation(jest.fn());
});

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
});
