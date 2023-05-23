The package has been configured successfully. The steam configuration stored inside `config/steam.ts` file relies on the following environment variables and hence we recommend validating them.

**Open the `env.ts` file and paste the following code inside the `Env.rules` object.**

```ts
STEAM_REALM: Env.schema.string(),
STEAM_CALLBACK_URL: Env.schema.string(),
STEAM_API_KEY: Env.schema.string(),
```