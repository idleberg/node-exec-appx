import { type SpawnOptions, spawn } from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';
import getAppxPath from 'get-appx-path';

const spawnAsync = promisify(spawn);

export async function execAppx(
	appID: string,
	appIndex: number | string = 0,
	spawnArgs: readonly string[] = [],
	spawnOptions: SpawnOptions = {},
) {
	if (platform() !== 'win32') {
		throw 'Error: This library requires PowerShell 5.0 (or higher) and support for the Windows Store';
	}

	const internalSpawnOptions = {
		detached: true,
		...spawnOptions,
	};

	const appx = await getAppxPath(appID);
	const pathIndex = typeof appIndex === 'number' ? appIndex : appx.paths.indexOf(appIndex);
	const appPath = appx.paths[pathIndex];

	if (!appPath) {
		throw new Error(`No application found at index ${appIndex}`);
	}

	return spawnAsync(appPath, spawnArgs, internalSpawnOptions);
}
