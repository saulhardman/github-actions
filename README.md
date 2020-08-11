# GitHub Actions

A collection of JavaScript-powered GitHub Actions.

These are pre-release in the sense that they're not on the
[GitHub Actions Marketplace](https://github.com/marketplace).

These actions were initially private, a playground for me to learn the platform
whilst using them across different private projects.

Feel free to use them and file issues if you find any bugs and, more
importantly, help me develop the tests and fixes to cover those cases in the
future.

If there is enough demand for any individual action I'll be sure to publish it
as a separate repository and make it available via the marketplace.

## Usage

The actions are installed from the GitHub Package Repository via
[Yarn](https://yarnpkg.com/) or [`npm`](https://www.npmjs.com/) – more details
are available in the individual package `README`s.

| Action                                                                       | Description                                                            |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [`refresh-instagram-access-token`](packages/refresh-instagram-access-token/) | A GitHub Action to create or update a GitHub repository secret         |
| [`update-github-secret`](packages/update-github-secret/)                     | A GitHub Action to refresh an Instagram Basic Display API access token |
| [`send-pushover-notification`](packages/send-pushover-notification/)         | A GitHub Action to send a Pushover notification to a user              |
