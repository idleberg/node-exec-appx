# exec-appx

[![npm](https://flat.badgen.net/npm/license/exec-appx)](https://www.npmjs.org/package/exec-appx)
[![npm](https://flat.badgen.net/npm/v/exec-appx)](https://www.npmjs.org/package/exec-appx)
[![CircleCI](https://flat.badgen.net/circleci/github/idleberg/node-exec-appx)](https://circleci.com/gh/idleberg/node-exec-appx)
[![David](https://flat.badgen.net/david/dev/idleberg/node-exec-appx)](https://david-dm.org/idleberg/node-exec-appx?type=dev)

Executes a Windows Store app (Appx)

## Prerequisites

This library requires PowerShell 5.0 (or higher) and a Windows version with support for Windows Store apps

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

- [get-appx-path](https://github.com/idleberg/node-get-appx-path)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT)

## Donate

You are welcome to support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/node-exec-appx) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`
