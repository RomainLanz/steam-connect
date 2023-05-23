/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { SteamAuthManager } from '../steam_auth_manager';
import type { ApplicationContract } from '@ioc:Adonis/Core/Application';

export default class SteamConnectProvider {
	constructor(private app: ApplicationContract) {}

	public register() {
		this.app.container.singleton('Lanz/SteamConnect', (container) => {
			const config = container.resolveBinding('Adonis/Core/Config').get('steam', {});

			return new SteamAuthManager({
				realm: config.realm,
				callbackUrl: config.callbackUrl,
				apiKey: config.apiKey,
			});
		});
	}

	public boot() {
		this.app.container.withBindings(
			['Adonis/Core/HttpContext', 'Lanz/SteamConnect'],
			(HttpContext, SteamAuthManager) => {
				HttpContext.getter('steam', function () {
					return SteamAuthManager.fromContext(this);
				});
			}
		);
	}
}
