const core = require('@actions/core');
const { Octokit } = require('@octokit/core');
const sodium = require('tweetsodium');

(async () => {
  try {
    const secretName = core.getInput('secret_name', { required: true });
    const secretValue = core.getInput('secret_value', { required: true });
    const accessToken = core.getInput('access_token', { required: true });
    const owner = core.getInput('owner', { required: true });
    const repo = core.getInput('repo', { required: true });

    const octokit = new Octokit({ auth: accessToken });

    core.info('Fetching public key.');

    const {
      data: { key_id: publicKeyId, key: publicKey },
    } = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/secrets/public-key',
      { owner, repo },
    );

    core.info(`Public key fetched: ${publicKeyId}`);

    core.info('Encrypting secret value.');

    // Convert the message and key to Uint8Array (Buffer implements that interface)
    const messageBytes = Buffer.from(secretValue);
    const keyBytes = Buffer.from(publicKey, 'base64');
    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);
    // Base64 the encrypted secret
    const encryptedValue = Buffer.from(encryptedBytes).toString('base64');

    core.info(`Updating/creating secret: ${secretName}`);

    await octokit.request(
      'PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}',
      {
        owner,
        repo,
        secret_name: secretName,
        encrypted_value: encryptedValue,
        key_id: publicKeyId,
      },
    );
  } catch (error) {
    core.setFailed(`Action failed: ${error}`);
  }
})();
