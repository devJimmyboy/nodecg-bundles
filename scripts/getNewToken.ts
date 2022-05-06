import { RefreshingAuthProvider } from "@twurple/auth";
import prompts from "prompts";
import chalk from "chalk";
import { writeFile } from "fs/promises";
import { join } from "path";
(async () => {
  console.log(
    chalk.bold.blueBright(
      "First, go to https://twitchtokengenerator.com/ and generate a token.\nThen come back here and paste the information below."
    )
  );
  const { accessToken, clientId, clientSecret, refreshToken } = await prompts([
    {
      type: "text",
      name: "accessToken",
      message: "Enter your access token:",
    },
    {
      type: "text",
      name: "refreshToken",
      message: "Enter your refresh token:",
    },
    {
      type: "text",
      name: "clientId",
      message: "Enter your client ID:",
    },
    {
      type: "text",
      name: "clientSecret",
      message: "Enter your client secret:",
    },
  ]);
  const auth = new RefreshingAuthProvider(
    {
      clientId,
      clientSecret,
    },
    {
      accessToken,
      expiresIn: 3600,
      obtainmentTimestamp: Date.now(),
      refreshToken,
      scope: [
        "analytics:read:extensions",
        "user:edit",
        "user:read:email",
        "clips:edit",
        "bits:read",
        "analytics:read:games",
        "user:edit:broadcast",
        "user:read:broadcast",
        "chat:read",
        "chat:edit",
        "channel:moderate",
        "channel:read:subscriptions",
        "whispers:read",
        "whispers:edit",
        "moderation:read",
        "channel:read:redemptions",
        "channel:edit:commercial",
        "channel:read:hype_train",
        "channel:read:stream_key",
        "channel:manage:extensions",
        "channel:manage:broadcast",
        "user:edit:follows",
        "channel:manage:redemptions",
        "channel:read:editors",
        "channel:manage:videos",
        "user:read:blocked_users",
        "user:manage:blocked_users",
        "user:read:subscriptions",
        "user:read:follows",
        "channel:manage:polls",
        "channel:manage:predictions",
        "channel:read:polls",
        "channel:read:predictions",
        "moderator:manage:automod",
        "channel:manage:schedule",
        "channel:read:goals",
        "moderator:read:automod_settings",
        "moderator:manage:automod_settings",
        "moderator:manage:banned_users",
        "moderator:read:blocked_terms",
        "moderator:manage:blocked_terms",
        "moderator:read:chat_settings",
        "moderator:manage:chat_settings",
      ],
    }
  );
  const newToken = await auth.refresh();
  console.log(chalk.bold.blueBright(JSON.stringify(newToken, undefined, 2)));
  await writeFile(
    join(__dirname, "token.json"),
    JSON.stringify(newToken, undefined, 2),
    {
      encoding: "utf-8",
    }
  );
})();
