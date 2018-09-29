'use strict';

const getAppxPath = require('get-appx-path');
const { platform } = require('os');
const { promisify } = require('util');
const { spawn } = require('child_process');

const spawnAsync = promisify(spawn);

module.exports = (appID, args = [], options = {}) => {
    if (platform() !== 'win32') {
        throw 'Error: This library requires PowerShell 5.0 (or higher) and support for the Windows Store';
    }

    options = Object.assign({
        detached: true
    }, options);

    return getAppxPath(appID).then(appx => {
        return spawnAsync(appx.path, args, options);
    });
};
