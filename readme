# EAS Inject Env GitHub Action

![GitHub release](https://img.shields.io/github/v/release/Odaclick/eas-inject-env)
![GitHub marketplace](https://img.shields.io/badge/GitHub-Marketplace-blue)
![License](https://img.shields.io/github/license/Odaclick/eas-inject-env)

## About

This GitHub Action enables you to inject environment variables directly into Expo's `eas.json` file. It simplifies managing environment-specific configurations for `build`, `update`, and `submit` environments by automatically setting variables defined in your GitHub workflow.

## Usage

The Action identifies environment variables prefixed with `envkey_` in the `with` section of the workflow configuration. These variables are injected into the specified profile within `eas.json`, making environment management with Expo easier.

### Example

```yaml
name: Inject EAS Environment Variables

on: [push]

jobs:
  inject-eas-env:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set Environments in eas.json
        uses: Odaclick/eas-inject-env@v1.0
        with:
          profile_name: production
          operation_type: build
          envkey_DEBUG: false
          envkey_SOME_API_KEY: "123456abcdef"
          envkey_SECRET_KEY: ${{ secrets.SECRET_KEY }}
          directory: <directory_name>
          fail_on_empty: true
          sort_keys: true
```


## Inputs

In the example above, there are several key/value pairs that will be added to
the 'eas.json' file:

| Name                                  | Description                                                                                                                                                              |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `envkey_DEBUG`, `envkey_SOME_API_KEY` | These values can be whatever, and they will be added to the 'eas.json' file as `DEBUG` and `SOME_API_KEY` .                                                                  |
| `envkey_SECRET_KEY`                   | This one will use a secret stored in the repository's GitHub Secrets, and add it to the file as  `SECRET_KEY`                                                            |
| `directory` (**Optional**)            | This key will set the directory in which you want to create `eas.json` file. **Important: cannot start with `/`. Action will fail if the specified directory doesn't exist.** |
| `fail_on_empty` (**Optional**)        | If set to true, the Action will fail if any env key is empty. Default to `false`.                                                                                        |
| `sort_keys` (**Optional**)            | If set to true, the Action will sort the keys in the output 'eas.json' file. Default to `false`.                                                                             |

Assuming that the GitHub Secret that was used is `password123`, the 'eas.json' file
that is created from the config above would contain:

```text
DEBUG=false
SOME_API_KEY="123456abcdef"
SECRET_KEY=password123
```

### Multiline Secrets

This Action supports multiline secrets, as described in [the nodejs dotenv
readme](https://github.com/motdotla/dotenv#multiline-values).

You may have a secret that requres multiple lines, like a private key. You can
store this in a GitHub Secret, and use it as any other secret in this Action:

```sh
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----
...
Kh9NV...
...
-----END RSA PRIVATE KEY-----"
```

It will get stored as a single line in the 'eas.json' file. This line will start and
end with a `"` character, and will contain `\n` characters to represent the
newlines:

```sh
PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nKh9NV...\n-----END RSA PRIVATE KEY-----\n"
```

