const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_ACCESS_TOKEN_URL = "https://github.com/login/oauth/access_token";
const STATE_COOKIE_NAME = "lumina_decap_oauth_state";
const STATE_COOKIE_MAX_AGE_SECONDS = 60 * 10;

export type DecapOauthEnv = {
  GITHUB_OAUTH_CLIENT_ID?: string;
  GITHUB_OAUTH_CLIENT_SECRET?: string;
};

export type PagesFunctionContext<Env> = {
  request: Request;
  env: Env;
};

type CallbackStatus = "success" | "error";

type CallbackPayload = {
  token?: string;
  message?: string;
};

type GithubAccessTokenResponse = {
  access_token?: string;
  error?: string;
  error_description?: string;
};

export function getOauthConfig(env: DecapOauthEnv): { clientId: string; clientSecret: string } {
  const clientId = env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = env.GITHUB_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Cloudflare Pages secrets: GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET.");
  }

  return { clientId, clientSecret };
}

export function isGithubProvider(url: URL): boolean {
  return url.searchParams.get("provider") === "github";
}

export function buildCallbackUrl(requestUrl: string): string {
  const callbackUrl = new URL("/callback", requestUrl);
  callbackUrl.searchParams.set("provider", "github");
  return callbackUrl.toString();
}

export function buildAuthorizeUrl(args: {
  clientId: string;
  requestUrl: string;
  scope: string;
  state: string;
  loginHint?: string | null;
}): string {
  const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);

  authorizeUrl.searchParams.set("client_id", args.clientId);
  authorizeUrl.searchParams.set("redirect_uri", buildCallbackUrl(args.requestUrl));
  authorizeUrl.searchParams.set("scope", args.scope);
  authorizeUrl.searchParams.set("state", args.state);

  if (args.loginHint && args.loginHint !== "true") {
    authorizeUrl.searchParams.set("login", args.loginHint);
  }

  return authorizeUrl.toString();
}

export function createState(): string {
  return crypto.randomUUID().replace(/-/g, "");
}

export function createStateCookie(state: string): string {
  return [
    `${STATE_COOKIE_NAME}=${state}`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Secure",
    `Max-Age=${STATE_COOKIE_MAX_AGE_SECONDS}`,
  ].join("; ");
}

export function clearStateCookie(): string {
  return [
    `${STATE_COOKIE_NAME}=`,
    "HttpOnly",
    "Path=/",
    "SameSite=Lax",
    "Secure",
    "Max-Age=0",
  ].join("; ");
}

export function readStateCookie(request: Request): string | null {
  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  for (const cookie of cookieHeader.split(";")) {
    const [name, ...valueParts] = cookie.trim().split("=");

    if (name === STATE_COOKIE_NAME) {
      return valueParts.join("=") || null;
    }
  }

  return null;
}

export async function exchangeCodeForAccessToken(args: {
  code: string;
  clientId: string;
  clientSecret: string;
  requestUrl: string;
}): Promise<GithubAccessTokenResponse> {
  const body = new URLSearchParams({
    client_id: args.clientId,
    client_secret: args.clientSecret,
    code: args.code,
    redirect_uri: buildCallbackUrl(args.requestUrl),
  });

  const response = await fetch(GITHUB_ACCESS_TOKEN_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    return {
      error: "github_oauth_exchange_failed",
      error_description: `GitHub returned ${response.status} ${response.statusText}.`,
    };
  }

  return (await response.json()) as GithubAccessTokenResponse;
}

export function renderCallback(status: CallbackStatus, payload: CallbackPayload): Response {
  const authorizationMessage = `authorization:github:${status}:${JSON.stringify(payload)}`;
  const authorizingMessage = "authorizing:github";

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>Lumina CMS Authorization</title>
  </head>
  <body>
    <p>Authorizing Decap...</p>
    <script>
      (() => {
        const authorizationMessage = ${JSON.stringify(authorizationMessage)};
        const authorizingMessage = ${JSON.stringify(authorizingMessage)};

        if (!window.opener) {
          document.body.innerHTML = "<p>This page must be opened by the Lumina CMS login flow.</p>";
          return;
        }

        const receiveMessage = () => {
          window.opener.postMessage(authorizationMessage, "*");
          window.removeEventListener("message", receiveMessage, false);
        };

        window.addEventListener("message", receiveMessage, false);
        window.opener.postMessage(authorizingMessage, "*");
      })();
    </script>
  </body>
</html>`,
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}

export function withCookie(response: Response, cookie: string): Response {
  response.headers.set("Set-Cookie", cookie);
  return response;
}