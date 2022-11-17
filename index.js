const micromatch = require('micromatch');

const PROVIDERS_URL = "https://oembed.com/providers.json";


addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});


// ===========================================================================
function handleRequest(request) {
  if (request.method !== "GET") {
    return error("Only GET supported");
  }

  const pathWithQuery = request.url.split(request.headers.get("host"), 2)[1];

  if (pathWithQuery === "/" || pathWithQuery === "/index.html") {
    return handleHomePage();
  }

  return handleOembedRequest(pathWithQuery.slice(1));
}


// ===========================================================================
async function handleHomePage() {

  let providers = null;

  try {
    providers = await fetchJson(PROVIDERS_URL);
  } catch (e) {
    providers = [];
  }

  const HOME = `\
<!doctype>
<html>
  <head>
    <style>
      body {
        font-family: sans-serif;
        margin: 3em;
        max-width: 1000px;
      }

      input {
        font-size: 24px;
        width:100%;
      }

      .small {
        font-size: 12px;
      }

      details {
        margin: 2em 0;
      }
    </style>
    <script>
      function showEmbed(event) {
        event.preventDefault();
        window.location.href = "/" + document.querySelector("#url").value;
        return false;
      }
    </script>
  </head>
  <body>
    <h1>OEmbed Link Viewer</h1>
    <p>Enter a URL below, and click 'Show Embed' to render embed of that URL, if it is publicly available.</p>
    <form onsubmit="showEmbed(event)">
      <input id="url" type="url" placeholder="Enter an embeddable URL"></input>
      <button type="submit" value="Show Embed">Show Embed</button>
    </form>
    <p class="info">The system uses the <a href="https://oembed.com">OEmbed API</a> to load publicly available embeds.</p>
    <details>
      <summary>Currently supported OEmbed Providers, loaded from: <a target="_blank" href="${PROVIDERS_URL}">${PROVIDERS_URL}</a></summary>
      <ul>
        ${providers.map((p) => `
          <li>
            <a target="_blank" href="${p.provider_url}">${p.provider_name}</a>
          </li>
        `).join("")}
      </ul>
    </details>
    <p class="small">
      <b>oembed.link</b> is a project of <a href="https://webrecorder.net/">Webrecorder</a>
    </p>
    <p class="small"><a href="https://github.com/webrecorder/oembed.link">Source code on Github</a></p>
  </body>
</html>
`;

  return success(HOME);
}


// ===========================================================================
async function handleOembedRequest(url) {
  let providers = null;

  try {
    providers = await fetchJson(PROVIDERS_URL);
  } catch (e) {
    return error(`Providers JSON ${PROVIDERS_URL} could not be loaded`);
  }

  let apiUrl = null;

  for (const prov of providers) {
    for (const endpoint of prov["endpoints"]) {
      if (endpoint.schemes && micromatch.isMatch(url, endpoint.schemes)) {
        apiUrl = endpoint.url.replace("{format}", "json");
        break;
      } else if (!endpoint.schemes && prov.provider_url && url.startsWith(prov.provider_url)) {
        apiUrl = endpoint.provider_url;
        break;
      }
    }
  }

  if (!apiUrl) {
    return error(`No Oembed Provider found for: <i>${url}</i>

This URL may not be publicly embeddable. See the <a href"/">list of support providers on the home page</a>

`);
  }

  const params = new URLSearchParams();
  params.set("url", url);
  params.set("format", "json");
  params.set("maxwidth", 640);
  params.set("maxheight", 480);

  apiUrl += "?" + params.toString();

  console.log(apiUrl);

  let oembed = null;

  try {
    oembed = await fetchJson(apiUrl);
  } catch (e) {
    console.log(e);
    return error("Oembed API Json could not be loaded: " + apiUrl);
  }

  let style = "";

  if (oembed.width) {
    style += `width: ${oembed.width};`;
  }

  if (oembed.height) {
    style += `height: ${oembed.height};`;
  }

  const respHtml= `\
<!doctype html>
<html>
  <head>
    ${oembed.title? `<title>${oembed.title}</title>` : ``}
  </head>
  <body>
    <div style="${style} display: flex; justify-content: center;">
      ${oembed.html}
    </div>
  </body>
</html>
  `;

  return success(respHtml);
}


// ===========================================================================
async function fetchJson(url) {
  const resp = await fetch(url);
  if (resp.status !== 200) {
    throw new Error("Non 200 response");
  }

  return await resp.json();
}


// ===========================================================================
function error(msg) {
  const headers = new Headers();
  headers.set("Content-Type", "text/html; charset='utf-8'");

  const status = 400;
  const statusText = "Invalid Request";
  return new Response("<h3>An error has occured:</h3>\n" + msg, {headers, status, statusText});
}


// ===========================================================================
function success(html) {
  const headers = new Headers();
  headers.set("Content-Type", "text/html; charset='utf-8'");

  return new Response(html, {headers});
}

