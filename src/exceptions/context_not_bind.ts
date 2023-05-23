/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { Exception } from '@poppinss/utils';

export class ContextNotBind extends Exception {
	static invoke() {
		return new this(
			'You must bind the HttpContext to the SteamAuthManager before using it',
			500,
			'E_HTTP_CONTEXT_NOT_BIND'
		);
	}
}
