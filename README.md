# exec-appx

[![npm](https://flat.badgen.net/npm/license/exec-appx)](https://www.npmjs.org/package/exec-appx)
[![npm](https://flat.badgen.net/npm/v/exec-appx)](https://www.npmjs.org/package/exec-appx)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-exec-appx)](https://circleci.com/gh/idleberg/node-exec-appx)

Executes a Windows Store application (Appx)

## Prerequisites

This library requires PowerShell 5.0 (or higher) and support for the Windows Store

## Installation

`yarn add exec-appx || npm install exec-appx`

## Usage

`execAppx(appID: string, args: Array, options: Object)`

Example usage in script:

```js
const execAppx = require('exec-appx');

// Application ID
const appID = 'SpotifyAB.SpotifyMusic';

(async () => {
    try {
        await execAppx(appID);
    } catch (err) {
        console.error(err);
    }
})();

```

### Options

See [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) documentation for details

## Related

- [get-appx-manifest](https://www.npmjs.com/package/get-appx-manifest)
- [get-appx-path](https://www.npmjs.com/package/get-appx-path)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)
