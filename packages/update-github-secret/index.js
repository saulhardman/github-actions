const core = require('@actions/core');
const { Octokit } = require('@octokit/core');
const sodium = require('tweetsodium');

(async () => {
  try {
    const SECRET_NAME = core.getInput('secret_name', { required: true });
    const SECRET_VALUE = core.getInput('secret_value', { required: true });
    const ACCESS_TOKEN = core.getInput('access_token', { required: true });

    const octokit = new Octokit({ auth: ACCESS_TOKEN });

    core.info('Fetching public key.');

    const {
      data: { key_id: publicKeyId, key: publicKey },
    } = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/secrets/public-key',
      {
        owner: 'saulhardman',
        repo: 'viewsource.io',
      },
    );

    core.info(`Public key fetched: ${publicKeyId}`);

    core.info('Encrypting secret value.');

    // Convert the message and key to Uint8Array (Buffer implements that interface)
    const messageBytes = Buffer.from(SECRET_VALUE);
    const keyBytes = Buffer.from(publicKey, 'base64');
    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);
    // Base64 the encrypted secret
    const encryptedValue = Buffer.from(encryptedBytes).toString('base64');

    core.info(`Updating/creating secret: ${SECRET_NAME}`);

    await octokit.request(
      'PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}',
      {
        owner: 'saulhardman',
        repo: 'viewsource.io',
        secret_name: SECRET_NAME,
        encrypted_value: encryptedValue,
        key_id: publicKeyId,
      },
    );
  } catch (error) {
    core.setFailed(`Action failed: ${error}`);
  }
})();
