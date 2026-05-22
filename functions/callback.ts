import {
  clearStateCookie,
  DecapOauthEnv,
  exchangeCodeForAccessToken,
  getOauthConfig,
  isGithubProvider,
  PagesFunctionContext,
  readStateCookie,
  renderCallback,
  withCookie,
} from "../lib/decap-oauth";

export const onRequestGet = async ({ request, env }: PagesFunctionContext<DecapOauthEnv>): Promise<Response> => {
  const url = new URL(request.url);

  if (!isGithubProvider(url)) {
    return new Response("Invalid provider.", { status: 400 });
  }

  const clearCookie = clearStateCookie();
  const githubError = url.searchParams.get("error");

  if (githubError) {
    const errorResponse = renderCallback("error", {
      message: url.searchParams.get("error_description") || githubError,
    });
    return withCookie(errorResponse, clearCookie);
  }

  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const expectedState = readStateCookie(request);

  if (!code) {
    return withCookie(renderCallback("error", { message: "GitHub did not return an authorization code." }), clearCookie);
  }

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    return withCookie(renderCallback("error", { message: "OAuth state validation failed." }), clearCookie);
  }

  try {
    const { clientId, clientSecret } = getOauthConfig(env);
    const tokenResponse = await exchangeCodeForAccessToken({
      code,
      clientId,
      clientSecret,
      requestUrl: request.url,
    });

    if (!tokenResponse.access_token) {
      return withCookie(
        renderCallback("error", {
          message: tokenResponse.error_description || tokenResponse.error || "GitHub did not return an access token.",
        }),
        clearCookie
      );
    }

    return withCookie(renderCallback("success", { token: tokenResponse.access_token }), clearCookie);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to complete GitHub OAuth.";
    return withCookie(renderCallback("error", { message }), clearCookie);
  }
};