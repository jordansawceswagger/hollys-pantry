# Decap admin — one-time setup

Everything in the repo is done. Three manual steps remain, ~20 minutes total.
After this, Holly edits the site at **hollyspantry.org/admin/** and never touches code.

## 1. GitHub OAuth App (2 min)

GitHub → Settings → Developer settings → OAuth Apps → **New OAuth App**

| Field | Value |
|---|---|
| Application name | Holly's Pantry Admin |
| Homepage URL | `https://hollyspantry.org` |
| Authorization callback URL | `https://<YOUR-WORKER>.workers.dev/callback` (fill in after step 2, or guess the name now and make it match) |

Save the **Client ID** and generate a **Client Secret**. Keep both handy.

## 2. Cloudflare Worker (10 min)

1. Cloudflare dashboard → Workers & Pages → Create Worker. Name it something like `hollys-pantry-oauth`.
2. Paste the contents of `admin/oauth-worker.js` (this folder) into the editor. Deploy.
3. Worker → Settings → Variables and Secrets → add two **secrets**:
   - `GITHUB_CLIENT_ID` — from step 1
   - `GITHUB_CLIENT_SECRET` — from step 1
4. Note the worker URL, e.g. `https://hollys-pantry-oauth.<account>.workers.dev`
5. Go back to the GitHub OAuth App and make sure the callback URL is exactly
   `<worker URL>/callback`.

## 3. Point the CMS at the worker (1 min)

In `admin/config.yml`, replace:

```yaml
base_url: https://REPLACE-ME.workers.dev
```

with your worker URL. Commit and push.

## 4. Holly's account (5 min)

The GitHub backend requires the person logging in to have **write access to the repo**:

1. Create Holly a GitHub account (or use one she has).
2. Repo → Settings → Collaborators → add her with **Write** access.
3. Have her accept the invite from her email.
4. She visits `hollyspantry.org/admin/`, clicks **Login with GitHub**, authorizes once,
   and saves the login in her browser. Done forever.

## What Holly can edit (today)

- **Meet Us page** — intro line, her story, headshot upload
- **Coming Up** — add/remove/reorder markets and events

Every save is a git commit (`Holly edit: content/meet.json`), so anything she breaks
is one `git revert` from fixed.

## Growing it later

Add a collection to `config.yml` and Holly gets a new editing screen. Zero code.
Planned: `products` (pantry grid) and `stockists` (map pins) once those move to JSON.
