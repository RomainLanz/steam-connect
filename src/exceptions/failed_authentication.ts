/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { Exception } from '@poppinss/utils';

export class FailedAuthentication extends Exception {
	static invoke() {
		return new this('Failed to authenticate the user', 500, 'E_STEAM_FAILED_AUTHENTICATION');
	}
}
