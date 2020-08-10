process.env.NODE_ENV = 'test';

const processStdoutWrite = process.stdout.write.bind(process.stdout);

process.stdout.write = (str, encoding, cb) => {
  if (!str.match(/^::(debug|error)::/)) {
    return processStdoutWrite(str, encoding, cb);
  }

  return false;
};

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  verbose: true,
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
};
