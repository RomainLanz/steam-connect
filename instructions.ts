/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { join } from 'node:path';
import * as sinkStatic from '@adonisjs/sink';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

function getStub(...relativePaths: string[]) {
	return join(__dirname, 'src/templates', ...relativePaths);
}

export default async function instructions(
	projectRoot: string,
	app: ApplicationContract,
	sink: typeof sinkStatic
) {
	// Setup Config
	const configPath = app.configPath('steam.ts');
	new sink.files.MustacheFile(projectRoot, configPath, getStub('config.txt')).commit();
	const configDir = app.directoriesMap.get('config') || 'config';
	sink.logger.action('create').succeeded(`${configDir}/steam.ts`);

	// Setup Environment Variables
	const env = new sink.files.EnvFile(projectRoot);
	env.set('STEAM_REALM', 'http://localhost:3333');
	env.set('STEAM_CALLBACK_URL', 'http://localhost:3333/auth/steam/callback');
	env.set('STEAM_API_KEY', '');
	env.commit();

	sink.logger.action('update').succeeded('.env, .env.example');
}
