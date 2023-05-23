/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import { Exception } from '@poppinss/utils';

export class ClaimedIdentityNotValid extends Exception {
	static invoke() {
		return new this(
			'The claimed identity returned by Steam is not valid',
			500,
			'E_STEAM_CLAIMED_IDENTITY_NOT_VALID'
		);
	}
}
