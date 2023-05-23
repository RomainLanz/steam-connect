/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

type SteamConfig = {
	realm: string;
	callbackUrl: string;
	apiKey: string;
};

export function steamConfig<T extends SteamConfig>(config: T): T {
	return config;
}
