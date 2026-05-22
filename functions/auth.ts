import {
  buildAuthorizeUrl,
  createState,
  createStateCookie,
  DecapOauthEnv,
  getOauthConfig,
  isGithubProvider,
  PagesFunctionContext,
} from "../lib/decap-oauth";

export const onRequestGet = async ({ request, env }: PagesFunctionContext<DecapOauthEnv>): Promise<Response> => {
  const url = new URL(request.url);

  if (!isGithubProvider(url)) {
    return new Response("Invalid provider.", { status: 400 });
  }

  try {
    const { clientId } = getOauthConfig(env);
    const scope = url.searchParams.get("scope") || "repo";
    const state = createState();
    const authorizeUrl = buildAuthorizeUrl({
      clientId,
      requestUrl: request.url,
      scope,
      state,
      loginHint: url.searchParams.get("login"),
    });

    return new Response(null, {
      status: 302,
      headers: {
        "Cache-Control": "no-store",
        Location: authorizeUrl,
        "Set-Cookie": createStateCookie(state),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start GitHub OAuth.";
    return new Response(message, { status: 500 });
  }
};