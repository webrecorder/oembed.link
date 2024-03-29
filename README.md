# Oembed.link

Oembed.link is a simple script, designed to run as a Cloudflare Worker, which renders embeds using the [oEmbed](https://oembed.com/) API and renders the embed.

It is designed primarily to make archiving embeds easier by providing a fixed URL which represents only the embed rendered on a page.

The URL is `https://oembed.link/<URL>` to be rendered.

The script uses the oEmbed providers JSON, [https://oembed.com/providers.json](https://oembed.com/providers.json)

The source for the oembed.com site can be found at: [https://github.com/iamcal/oembed](https://github.com/iamcal/oembed)

The system is designed to run as a [Cloudflare Worker](https://workers.cloudflare.com/). See [Cloudflare Docs](https://developers.cloudflare.com/workers/learning/getting-started) for more info on how to use this service.

#### Building

1. Install Wrangler 2 locally, eg. with `npm -g i wrangler` or `yarn global add wrangler`


2. Run the dev server with `wrangler dev` to test locally. You may be prompted to login to Cloudflare to authenticate.


3. Navigate to `http://localhost:8787/[URL]` to load the oEmbed view of `[URL]` via the local dev server.


4. Run `wrangler publish` to publish the worker code to Cloudflare.

