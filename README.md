snyk-broker-config
=================

Small utility to help with Universal Broker configuration and management


[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/snyk-broker-config.svg)](https://npmjs.org/package/snyk-broker-config)
[![Downloads/week](https://img.shields.io/npm/dw/snyk-broker-config.svg)](https://npmjs.org/package/snyk-broker-config)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g snyk-broker-config
$ snyk-broker-config COMMAND
running command...
$ snyk-broker-config (--version)
snyk-broker-config/0.0.0 linux-x64 node-v20.14.0
$ snyk-broker-config --help [COMMAND]
USAGE
  $ snyk-broker-config COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`snyk-broker-config hello PERSON`](#snyk-broker-config-hello-person)
* [`snyk-broker-config hello world`](#snyk-broker-config-hello-world)
* [`snyk-broker-config help [COMMAND]`](#snyk-broker-config-help-command)
* [`snyk-broker-config plugins`](#snyk-broker-config-plugins)
* [`snyk-broker-config plugins add PLUGIN`](#snyk-broker-config-plugins-add-plugin)
* [`snyk-broker-config plugins:inspect PLUGIN...`](#snyk-broker-config-pluginsinspect-plugin)
* [`snyk-broker-config plugins install PLUGIN`](#snyk-broker-config-plugins-install-plugin)
* [`snyk-broker-config plugins link PATH`](#snyk-broker-config-plugins-link-path)
* [`snyk-broker-config plugins remove [PLUGIN]`](#snyk-broker-config-plugins-remove-plugin)
* [`snyk-broker-config plugins reset`](#snyk-broker-config-plugins-reset)
* [`snyk-broker-config plugins uninstall [PLUGIN]`](#snyk-broker-config-plugins-uninstall-plugin)
* [`snyk-broker-config plugins unlink [PLUGIN]`](#snyk-broker-config-plugins-unlink-plugin)
* [`snyk-broker-config plugins update`](#snyk-broker-config-plugins-update)

## `snyk-broker-config hello PERSON`

Say hello

```
USAGE
  $ snyk-broker-config hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ snyk-broker-config hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/snyk/snyk-broker-config/blob/v0.0.0/src/commands/hello/index.ts)_

## `snyk-broker-config hello world`

Say hello world

```
USAGE
  $ snyk-broker-config hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ snyk-broker-config hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/snyk/snyk-broker-config/blob/v0.0.0/src/commands/hello/world.ts)_

## `snyk-broker-config help [COMMAND]`

Display help for snyk-broker-config.

```
USAGE
  $ snyk-broker-config help [COMMAND...] [-n]

ARGUMENTS
  COMMAND...  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for snyk-broker-config.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v6.2.8/src/commands/help.ts)_

## `snyk-broker-config plugins`

List installed plugins.

```
USAGE
  $ snyk-broker-config plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ snyk-broker-config plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/index.ts)_

## `snyk-broker-config plugins add PLUGIN`

Installs a plugin into snyk-broker-config.

```
USAGE
  $ snyk-broker-config plugins add PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into snyk-broker-config.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SNYK_BROKER_CONFIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SNYK_BROKER_CONFIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ snyk-broker-config plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ snyk-broker-config plugins add myplugin

  Install a plugin from a github url.

    $ snyk-broker-config plugins add https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ snyk-broker-config plugins add someuser/someplugin
```

## `snyk-broker-config plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ snyk-broker-config plugins inspect PLUGIN...

ARGUMENTS
  PLUGIN...  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ snyk-broker-config plugins inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/inspect.ts)_

## `snyk-broker-config plugins install PLUGIN`

Installs a plugin into snyk-broker-config.

```
USAGE
  $ snyk-broker-config plugins install PLUGIN... [--json] [-f] [-h] [-s | -v]

ARGUMENTS
  PLUGIN...  Plugin to install.

FLAGS
  -f, --force    Force npm to fetch remote resources even if a local copy exists on disk.
  -h, --help     Show CLI help.
  -s, --silent   Silences npm output.
  -v, --verbose  Show verbose npm output.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Installs a plugin into snyk-broker-config.

  Uses npm to install plugins.

  Installation of a user-installed plugin will override a core plugin.

  Use the SNYK_BROKER_CONFIG_NPM_LOG_LEVEL environment variable to set the npm loglevel.
  Use the SNYK_BROKER_CONFIG_NPM_REGISTRY environment variable to set the npm registry.

ALIASES
  $ snyk-broker-config plugins add

EXAMPLES
  Install a plugin from npm registry.

    $ snyk-broker-config plugins install myplugin

  Install a plugin from a github url.

    $ snyk-broker-config plugins install https://github.com/someuser/someplugin

  Install a plugin from a github slug.

    $ snyk-broker-config plugins install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/install.ts)_

## `snyk-broker-config plugins link PATH`

Links a plugin into the CLI for development.

```
USAGE
  $ snyk-broker-config plugins link PATH [-h] [--install] [-v]

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help          Show CLI help.
  -v, --verbose
      --[no-]install  Install dependencies after linking the plugin.

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ snyk-broker-config plugins link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/link.ts)_

## `snyk-broker-config plugins remove [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins remove [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins remove myplugin
```

## `snyk-broker-config plugins reset`

Remove all user-installed and linked plugins.

```
USAGE
  $ snyk-broker-config plugins reset [--hard] [--reinstall]

FLAGS
  --hard       Delete node_modules and package manager related files in addition to uninstalling plugins.
  --reinstall  Reinstall all plugins after uninstalling.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/reset.ts)_

## `snyk-broker-config plugins uninstall [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins uninstall [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins uninstall myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/uninstall.ts)_

## `snyk-broker-config plugins unlink [PLUGIN]`

Removes a plugin from the CLI.

```
USAGE
  $ snyk-broker-config plugins unlink [PLUGIN...] [-h] [-v]

ARGUMENTS
  PLUGIN...  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ snyk-broker-config plugins unlink
  $ snyk-broker-config plugins remove

EXAMPLES
  $ snyk-broker-config plugins unlink myplugin
```

## `snyk-broker-config plugins update`

Update installed plugins.

```
USAGE
  $ snyk-broker-config plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v5.4.2/src/commands/plugins/update.ts)_
<!-- commandsstop -->
