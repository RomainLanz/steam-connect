/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { Exception } from '@poppinss/utils';

export class AuthUrlUndefined extends Exception {
	static invoke() {
		return new this(
			'The auth url returned by Steam is undefined',
			500,
			'E_STEAM_AUTH_URL_UNDEFINED'
		);
	}
}
