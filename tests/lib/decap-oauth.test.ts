import { describe, expect, it } from "vitest";

import {
  buildAuthorizeUrl,
  buildCallbackUrl,
  createStateCookie,
  getOauthConfig,
  readStateCookie,
} from "../../lib/decap-oauth";

describe("decap oauth helpers", () => {
  it("builds a callback URL on the same host", () => {
    expect(buildCallbackUrl("https://lumina.consulting/auth?provider=github")).toBe(
      "https://lumina.consulting/callback?provider=github"
    );
  });

  it("builds the GitHub authorize URL with the expected params", () => {
    const url = new URL(
      buildAuthorizeUrl({
        clientId: "client-123",
        requestUrl: "https://lumina.consulting/auth?provider=github",
        scope: "repo",
        state: "state-abc",
        loginHint: "lumina-admin",
      })
    );

    expect(url.origin + url.pathname).toBe("https://github.com/login/oauth/authorize");
    expect(url.searchParams.get("client_id")).toBe("client-123");
    expect(url.searchParams.get("redirect_uri")).toBe("https://lumina.consulting/callback?provider=github");
    expect(url.searchParams.get("scope")).toBe("repo");
    expect(url.searchParams.get("state")).toBe("state-abc");
    expect(url.searchParams.get("login")).toBe("lumina-admin");
  });

  it("creates and reads the oauth state cookie", () => {
    const cookie = createStateCookie("state-xyz");
    const request = new Request("https://lumina.consulting/callback?provider=github", {
      headers: {
        cookie,
      },
    });

    expect(cookie).toContain("HttpOnly");
    expect(cookie).toContain("SameSite=Lax");
    expect(cookie).toContain("Secure");
    expect(readStateCookie(request)).toBe("state-xyz");
  });

  it("returns oauth credentials when both secrets are present", () => {
    expect(
      getOauthConfig({
        GITHUB_OAUTH_CLIENT_ID: "client-123",
        GITHUB_OAUTH_CLIENT_SECRET: "secret-456",
      })
    ).toEqual({
      clientId: "client-123",
      clientSecret: "secret-456",
    });
  });
});