# Send Pushover Notification JavaScript GitHub Action

This action allows you to send a Pushover notification to a given user.

## Installation

Add the following to your `.npmrc`:

```shell
@saulhardman:registry=https://npm.pkg.github.com
```

Using npm:

```shell
> npm install --save-dev @saulhardman/send-pushover-notification
```

Using Yarn:

```shell
> yarn add --dev @saulhardman/send-pushover-notification
```

## Inputs

### `token`

**Required** Your application's API token

### `user`

**Required** Your user token

### `message`

**Required** Your message

### `device`

Your user's device name to send the message directly to that device, rather than
all of the user's devices (multiple devices may be separated by a comma)

### `title`

Your message's title, otherwise your app's name is used

### `url`

A supplementary URL to show with your message

### `url_title`

A title for your supplementary URL, otherwise just the URL is shown

### `priority`

Send as -2 to generate no notification/alert, -1 to always send as a quiet
notification, 1 to display as high-priority and bypass the user's quiet hours,
or 2 to also require confirmation from the user

### `sound`

The name of one of the sounds supported by device clients to override the user's
default sound choice

### `timestamp`

A Unix timestamp of your message's date and time to display to the user, rather
than the time your message is received by our API

## Example Usage

```yml
- name: Send Pushover Notification (Success)
  uses: ./node_modules/@saulhardman/send-pushover-notification
  with:
    token: ${{ secrets.PUSHOVER_APP_TOKEN }}
    user: ${{ secrets.PUSHOVER_USER_KEY }}
    title:
      ✅ ${{ github.event.repository.name }} ${{ github.workflow }} (Success)
    url: ${{ env.DEPLOY_URL }}
    url_title: Deploy URL
    message:
      "The '${{ github.workflow }}' workflow on the '${{ github.repository }}'
      repository succeeded"

- name: Send Pushover Notification (Failure)
  if: failure()
  uses: ./node_modules/@saulhardman/send-pushover-notification
  with:
    token: ${{ secrets.PUSHOVER_APP_TOKEN }}
    user: ${{ secrets.PUSHOVER_USER_KEY }}
    title:
      💥 ${{ github.event.repository.name }} ${{ github.workflow }} (Failure)
    url:
      ${{
      format('https://github.com/{0}/actions/runs/{1}?check_suite_focus=true',
      github.repository, github.run_id) }}
    url_title: GitHub Action
    message:
      "The '${{ github.workflow }}' workflow on the '${{ github.repository }}'
      repository failed"
```
