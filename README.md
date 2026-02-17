# exec-appx

[![License](https://img.shields.io/github/license/idleberg/node-exec-appx?color=blue&style=for-the-badge)](https://github.com/idleberg/node-exec-appx/blob/main/LICENSE)
[![Version: npm](https://img.shields.io/npm/v/exec-appx?style=for-the-badge)](https://www.npmjs.org/package/exec-appx)
![GitHub branch check runs](https://img.shields.io/github/check-runs/idleberg/node-exec-appx/main?style=for-the-badge)

Executes a Windows Store application (Appx).

## Prerequisites

This library requires PowerShell 5.0 (or higher) and support for the Windows Store.

## Installation

`npm install exec-appx`

## Usage

`execAppx(appID, args = [], options = {})`

Example usage in script:

```typescript
import { execAppx } from 'exec-appx';

await execAppx('Mozilla.Firefox');
```

> [!IMPORTANT]  
> For some applications, the AppX manifest specifies multiple executables. To deal with this special case, pass an object as the first argument.
>
> ```typescript
> await execAppx({
>		appId: 'Mozilla.Firefox',
>		specifier: 'firefox.exe' // or the index in the filenames array
>	})
> ```

### Options

See [`child_process.spawn`](https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options) documentation for details.

## Related

- [get-appx-manifest](https://www.npmjs.com/package/get-appx-manifest)
- [get-appx-path](https://www.npmjs.com/package/get-appx-path)

## License

This work is licensed under [The MIT License](https://opensource.org/licenses/MIT).
