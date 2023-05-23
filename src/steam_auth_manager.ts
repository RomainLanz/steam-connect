/**
 * @rlanz/steam-connect
 *
 * @license MIT
 * @copyright Romain Lanz <romain.lanz@pm.me>
 */

import got from 'got';
import openid from 'openid';
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { AuthUrlUndefined } from './exceptions/auth_url_undefined';
import { FailedAuthentication } from './exceptions/failed_authentication';
import { ContextNotBind } from './exceptions/context_not_bind';
import { ClaimedIdentityNotValid } from './exceptions/claimed_identity_not_valid';

interface AssertionResult {
	authenticated: boolean;
	claimedIdentifier?: string | undefined;
}

interface SteamAuthManagerConstructorParams {
	realm: string;
	callbackUrl: string;
	apiKey: string;
	ctx?: HttpContextContract;
}

interface SteamUser {
	steamid: string;
	communityvisibilitystate: number;
	profilestate: number;
	personaname: string;
	commentpermission: number;
	profileurl: string;
	avatar: string;
	avatarmedium: string;
	avatarfull: string;
	avatarhash: string;
	lastlogoff: number;
	personastate: number;
	primaryclanid: string;
	timecreated: number;
	personastateflags: number;
	loccountrycode: string;
	locstatecode: string;
}

export class SteamAuthManager {
	#ctx: HttpContextContract | null = null;
	readonly #realm: string;
	readonly #callbackUrl: string;
	readonly #apiKey: string;
	readonly #relyingParty: openid.RelyingParty;

	constructor(params: SteamAuthManagerConstructorParams) {
		this.#realm = params.realm;
		this.#callbackUrl = params.callbackUrl;
		this.#apiKey = params.apiKey;

		this.#relyingParty = new openid.RelyingParty(this.#callbackUrl, this.#realm, true, true, []);
	}

	static #convertSteamId64ToSteamId(steamId: string) {
		const v = BigInt('76561197960265728');
		let w = BigInt(steamId);
		const y = w % 2n;

		w = w - y - v;

		return `STEAM_0:${y}:${w / 2n}`;
	}

	async user() {
		const assertion = await this.#verifyAssertion();
		const steamId = assertion.claimedIdentifier?.split('/').pop();

		const { response } = await got(
			`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${
				this.#apiKey
			}&steamids=${steamId}`
		).json<{ response: { players: SteamUser[] } }>();

		const player = response.players[0];

		return {
			steamId: SteamAuthManager.#convertSteamId64ToSteamId(player.steamid),
			steamId64: player.steamid,
			username: player.personaname,
			avatar: {
				small: player.avatar,
				medium: player.avatarmedium,
				large: player.avatarfull,
			},
		};
	}

	async redirect() {
		if (!this.#ctx) {
			throw ContextNotBind.invoke();
		}

		const redirectUrl = await this.#redirectUrl();

		return this.#ctx.response.redirect(redirectUrl);
	}

	fromContext(ctx: HttpContextContract) {
		return new SteamAuthManager({
			ctx,
			realm: this.#realm,
			callbackUrl: this.#callbackUrl,
			apiKey: this.#apiKey,
		});
	}

	#verifyAssertion(): Promise<AssertionResult> {
		return new Promise((resolve, reject) => {
			if (!this.#ctx) {
				return reject(ContextNotBind.invoke());
			}

			this.#relyingParty.verifyAssertion(this.#ctx.request.url(true), (error, result) => {
				if (error) {
					return reject(error);
				}

				if (!result || !result.authenticated) {
					return reject(FailedAuthentication.invoke());
				}

				if (
					result.claimedIdentifier &&
					!/^https?:\/\/steamcommunity\.com\/openid\/id\/\d+$/.test(result.claimedIdentifier)
				) {
					return reject(ClaimedIdentityNotValid.invoke());
				}

				return resolve(result);
			});
		});
	}

	#redirectUrl(): Promise<string> {
		return new Promise((resolve, reject) => {
			this.#relyingParty.authenticate(
				'https://steamcommunity.com/openid',
				false,
				(error, authUrl) => {
					if (error) {
						return reject(error);
					}

					if (!authUrl) {
						return reject(AuthUrlUndefined.invoke());
					}

					return resolve(authUrl);
				}
			);
		});
	}
}
