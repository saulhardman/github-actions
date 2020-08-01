# Update GitHub Secret JavaScript GitHub Action

This action updates (or creates) a GitHub secret based on input values of
`secret_name` and `secret_value`.

## Inputs

### `secret_name`

**Required** The name of the GitHub secret.

### `secret_value`

**Required** The value to assign to the GitHub secret.

### `access_token`

**Required** Personal Access Token with the `repo` scope.

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
    secret_value: ${{ steps.instagram.output.access_token }}
    access_token: ${{ secrets.PERSONAL_ACCESS_TOKEN }}
```
