# Refresh Instagram Access Token JavaScript GitHub Action

This action refreshes an Instagram access token read from an input and sets the
returned access token as an output.

## Installation

Add the following to your `.npmrc`:

```shell
@saulhardman:registry=https://npm.pkg.github.com
```

Using npm:

```shell
> npm install --save-dev @saulhardman/refresh-instagram-access-token
```

Using Yarn:

```shell
> yarn add --dev @saulhardman/refresh-instagram-access-token
```

## Inputs

### `access_token`

**Required** An existing, valid Instagram access token.

## Outputs

### `access_token`

The refreshed Instagram access token.

## Example Usage

```yml
- name: Refresh Instagram Access Token
  id: instagram
  uses: ./node_modules/@saulhardman/refresh-instagram-access-token
  with:
    access_token: ${{ secrets.INSTAGRAM_ACCESS_TOKEN }}

- name: Update GitHub Secret
  uses: ./node_modules/@saulhardman/update-github-secret
  with:
    secret_name: INSTAGRAM_ACCESS_TOKEN
    secret_value: ${{ steps.instagram.outputs.access_token }}
    access_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```
