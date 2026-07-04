/**
 * Decap CMS ↔ GitHub OAuth proxy — Cloudflare Worker
 *
 * GitHub Pages has no backend, so this worker performs the OAuth handshake
 * Decap needs to get a GitHub token for the person logging in at /admin/.
 *
 * Deploy steps in admin/SETUP.md. Secrets required (Worker settings → Variables):
 *   GITHUB_CLIENT_ID
 *   GITHUB_CLIENT_SECRET
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Step 1: Decap opens a popup at /auth → bounce to GitHub's consent page
    if (url.pathname === '/auth') {
      const gh = new URL('https://github.com/login/oauth/authorize');
      gh.searchParams.set('client_id', env.GITHUB_CLIENT_ID);
      gh.searchParams.set('scope', 'repo,user');
      return Response.redirect(gh.toString(), 302);
    }

    // Step 2: GitHub redirects back with ?code= → exchange for a token,
    // then hand it to the Decap window via postMessage.
    if (url.pathname === '/callback') {
      const code = url.searchParams.get('code');
      const resp = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const data = await resp.json();

      const payload = data.error
        ? 'authorization:github:error:' + JSON.stringify(data)
        : 'authorization:github:success:' +
          JSON.stringify({ token: data.access_token, provider: 'github' });

      // Standard Decap handshake: announce, wait for ack, deliver payload.
      const html = `<!doctype html><body><script>
        (function () {
          window.addEventListener('message', function (e) {
            window.opener.postMessage(${JSON.stringify(payload)}, e.origin);
          }, { once: true });
          window.opener.postMessage('authorizing:github', '*');
        })();
      <\/script></body>`;

      return new Response(html, { headers: { 'content-type': 'text/html' } });
    }

    return new Response('Holly\'s Pantry — Decap OAuth proxy. Nothing to see here.', {
      status: 200,
    });
  },
};
