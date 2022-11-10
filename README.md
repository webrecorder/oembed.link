# Oembed.link

Oembed.link is a simple script, designed to run as a Cloudflare Worker, which renders embeds using the [oEmbed](https://oembed.com/) API and renders the embed.

It is designed primarily to make archiving embeds easier by providing a fixed URL which represents only the embed rendered on a page.

The URL is `https://oembed.link/<URL>` to be rendered.

The script uses the oEmbed providers JSON, [https://oembed.com/providers.json](https://oembed.com/providers.json)

The source for the oembed.com site can be found at: [https://github.com/iamcal/oembed](https://github.com/iamcal/oembed)

#### Building for development

1. Install Wrangler locally if you don't have it installed already using [Homebrew](https://brew.sh/) (shown here) or your package manager of choice.

```shell
brew install cloudflare-wrangler
```

2. Copy `wrangler.sample.toml` to `wrangler.toml`.

```shell
cp wrangler.sample.toml wrangler.toml
```

3. Run the dev server.

```shell
wrangler dev
```

4. Navigate to http://localhost:8787 and start building!

#### Deployment (via Cloudflare Workers)

The system is designed to run as a [Cloudflare Worker](https://workers.cloudflare.com/). See [Cloudflare Docs](https://developers.cloudflare.com/workers/learning/getting-started) for more info on how to use this service.


1. Copy `wrangler.sample.toml` to `wrangler.toml`.

2. Fill in account id.

3. Run `wrangler publish` to run on Cloudflare.

