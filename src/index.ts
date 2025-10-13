import { type SpawnOptions, spawn } from 'node:child_process';
import { platform } from 'node:os';
import { promisify } from 'node:util';
import { getAppxPath } from 'get-appx-path';

const spawnAsync = promisify(spawn);

/**
 * Execute an Appx application by its package ID.
 * @param appConfig the id of the Appx package, e.g.`"Mozilla.Firefox"`
 * @param spawnArgs an array of arguments to pass to `child_process.spawn`
 * @param spawnOptions options to pass to `child_process.spawn`
 * @returns
 */
export async function execAppx(
	appConfig: string | { appId: string; specifier?: number | string },
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

	const appId = typeof appConfig === 'string' ? appConfig : appConfig.appId;
	const appIndex = typeof appConfig === 'string' ? 0 : (appConfig.specifier ?? 0);

	const appx = await getAppxPath(appId);

	const pathIndex =
		typeof appIndex === 'number'
			? appIndex
			: appx.filenames.findIndex((filename: string) => filename.includes(appIndex));
	const appPath = appx.paths[pathIndex];

	if (!appPath) {
		throw new Error(`No application found at index ${appIndex}`);
	}

	return spawnAsync(appPath, spawnArgs, internalSpawnOptions);
}
