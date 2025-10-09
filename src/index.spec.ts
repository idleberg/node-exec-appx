// biome-ignore-all lint/suspicious/noExplicitAny: it's a test
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { execAppx } from './index.ts';

// Mock dependencies
vi.mock('node:os', () => ({
	platform: vi.fn(),
}));

vi.mock('node:child_process', () => ({
	spawn: vi.fn(),
}));

vi.mock('get-appx-path', () => ({
	default: vi.fn(),
}));

import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import getAppxPath from 'get-appx-path';

describe('execAppx', () => {
	const mockGetAppxPath = vi.mocked(getAppxPath);
	const mockPlatform = vi.mocked(platform);
	const mockSpawn = vi.mocked(spawn);

	beforeEach(() => {
		vi.clearAllMocks();
		mockPlatform.mockReturnValue('win32');
		mockGetAppxPath.mockResolvedValue({
			filenames: ['main.exe', 'alternate.exe'],
			paths: ['C:\\Program Files\\WindowsApps\\App1\\main.exe', 'C:\\Program Files\\WindowsApps\\App2\\alternate.exe'],
		} as any);

		mockSpawn.mockImplementation(((_path: any, _args: any, _opts: any, callback: (arg0: any, arg1: any) => void) => {
			if (callback) callback(null as any, {} as any);
			return { pid: 1234 } as any;
		}) as any);
	});

	describe('API signature', () => {
		it('should accept a string as first argument (with implied index 0)', async () => {
			await execAppx('TestApp.ID');

			expect(mockGetAppxPath).toHaveBeenCalledWith('TestApp.ID');
			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				[],
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should accept an object with appId', async () => {
			await execAppx({ appId: 'TestApp.ID' });

			expect(mockGetAppxPath).toHaveBeenCalledWith('TestApp.ID');
			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				[],
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should accept an object with appId and specifier (number)', async () => {
			await execAppx({ appId: 'TestApp.ID', specifier: 1 });

			expect(mockGetAppxPath).toHaveBeenCalledWith('TestApp.ID');
			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App2\\alternate.exe',
				[],
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should accept an object with appId and specifier (string filename)', async () => {
			await execAppx({
				appId: 'TestApp.ID',
				specifier: 'alternate.exe',
			});

			expect(mockGetAppxPath).toHaveBeenCalledWith('TestApp.ID');
			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App2\\alternate.exe',
				[],
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should accept spawnArgs as second argument', async () => {
			await execAppx('TestApp.ID', ['--arg1', '--arg2']);

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				['--arg1', '--arg2'],
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should accept spawnOptions as third argument', async () => {
			await execAppx('TestApp.ID', [], { cwd: '/test' });

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				[],
				expect.objectContaining({ detached: true, cwd: '/test' }),
				expect.any(Function),
			);
		});

		it('should accept all arguments together', async () => {
			await execAppx({ appId: 'TestApp.ID', specifier: 1 }, ['--test'], {
				cwd: '/test',
			});

			expect(mockGetAppxPath).toHaveBeenCalledWith('TestApp.ID');
			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App2\\alternate.exe',
				['--test'],
				expect.objectContaining({ detached: true, cwd: '/test' }),
				expect.any(Function),
			);
		});
	});

	describe('platform validation', () => {
		it('should throw error on non-Windows platform', async () => {
			mockPlatform.mockReturnValue('darwin');

			await expect(execAppx('TestApp.ID')).rejects.toBe(
				'Error: This library requires PowerShell 5.0 (or higher) and support for the Windows Store',
			);
		});

		it('should work on Windows platform', async () => {
			mockPlatform.mockReturnValue('win32');

			await expect(execAppx('TestApp.ID')).resolves.toBeDefined();
		});
	});

	describe('app path resolution', () => {
		it('should use index 0 by default for string argument', async () => {
			await execAppx('TestApp.ID');

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				[],
				expect.any(Object),
				expect.any(Function),
			);
		});

		it('should use index 0 by default for object without specifier', async () => {
			await execAppx({ appId: 'TestApp.ID' });

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App1\\main.exe',
				[],
				expect.any(Object),
				expect.any(Function),
			);
		});

		it('should use specified numeric index', async () => {
			await execAppx({ appId: 'TestApp.ID', specifier: 1 });

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App2\\alternate.exe',
				[],
				expect.any(Object),
				expect.any(Function),
			);
		});

		it('should find path by filename match', async () => {
			await execAppx({ appId: 'TestApp.ID', specifier: 'alternate.exe' });

			expect(mockSpawn).toHaveBeenCalledWith(
				'C:\\Program Files\\WindowsApps\\App2\\alternate.exe',
				[],
				expect.any(Object),
				expect.any(Function),
			);
		});

		it('should throw error when path index is out of bounds', async () => {
			await expect(execAppx({ appId: 'TestApp.ID', specifier: 10 })).rejects.toThrow(
				'No application found at index 10',
			);
		});

		it('should throw error when filename is not found', async () => {
			const nonExistentFile = 'nonexistent.exe';
			await expect(execAppx({ appId: 'TestApp.ID', specifier: nonExistentFile })).rejects.toThrow(
				`No application found at index ${nonExistentFile}`,
			);
		});
	});

	describe('spawn options', () => {
		it('should always set detached to true', async () => {
			await execAppx('TestApp.ID');

			expect(mockSpawn).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Array),
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});

		it('should merge custom spawn options', async () => {
			await execAppx('TestApp.ID', [], { cwd: '/custom', env: { TEST: '1' } });

			expect(mockSpawn).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Array),
				expect.objectContaining({
					detached: true,
					cwd: '/custom',
					env: { TEST: '1' },
				}),
				expect.any(Function),
			);
		});

		it('should not override detached option', async () => {
			await execAppx('TestApp.ID', [], { detached: false } as any);

			expect(mockSpawn).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(Array),
				expect.objectContaining({ detached: true }),
				expect.any(Function),
			);
		});
	});
});
