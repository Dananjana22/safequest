# Deploying SafeQuest to Azure

SafeQuest is a pure client-side app. `npm run build` produces a static `dist/`
folder and there is no server, no API and no database - all face analysis runs
in the browser via WebAssembly. That makes **Azure Static Web Apps** the right
host: it serves static files from a global CDN, gives free HTTPS, and its free
tier is enough for this app.

Nothing about a photo ever leaves the device, which is worth knowing for a
child-safety product: uploads are read into a canvas and processed by OpenCV
and ONNX Runtime locally. There is no server that could store them.

## What gets deployed

| | |
|---|---|
| Total `dist/` size | ~33 MB across 15 files |
| Largest file | `ort/ort-wasm-simd.wasm`, 10.1 MB |
| Next largest | `models/opencv.js`, 9.8 MB |

Both sit comfortably under the Static Web Apps limits (250 MB per app on Free,
25 MB per file).

Be aware of the **first-run download**: the OpenCV and ONNX Runtime WebAssembly
runtimes are ~20 MB combined and are only fetched when a parent first opens the
guardian step. They are served with `immutable` cache headers so it happens
once per browser, but on a slow mobile connection that first photo will take a
while. Everything else - the app shell - is about 1.5 MB.

## Prerequisites

- An Azure account with an active subscription (the free tier covers this app)
- Azure CLI (`az`) — install with `winget install -e --id Microsoft.AzureCLI`,
  then **open a new terminal** so `az` is on your PATH

## Deploy

Run these from the project root. Replace the names with your own; the app name
must be globally unique.

```bash
# 1. Sign in (opens a browser)
az login

# 2. If you have more than one subscription, pick the one to bill to
az account list --output table
az account set --subscription "<subscription-name-or-id>"

# 3. Create a resource group.
#    Static Web Apps Free is only offered in a few regions:
#    westus2, centralus, eastus2, westeurope, eastasia
az group create --name safequest-rg --location westeurope

# 4. Create the Static Web App (no repo needed - we deploy the folder directly)
az staticwebapp create \
  --name safequest-app \
  --resource-group safequest-rg \
  --location westeurope \
  --sku Free

# 5. Read the deployment token (treat it like a password - do not commit it)
az staticwebapp secrets list \
  --name safequest-app \
  --resource-group safequest-rg \
  --query "properties.apiKey" -o tsv

# 6. Build, then upload dist/
npm run build
npx @azure/static-web-apps-cli deploy ./dist \
  --deployment-token "<token-from-step-5>" \
  --env production
```

The deploy prints your live URL, of the form
`https://<name>-<hash>.<region>.azurestaticapps.net`.

To ship an update later, only steps 6 need repeating.

## Configuration

[`public/staticwebapp.config.json`](public/staticwebapp.config.json) is copied
into `dist/` by the build and does three things this app depends on:

- **`.wasm` served as `application/wasm`.** Without the right MIME type the
  browser refuses to compile the module and photo analysis fails with an
  opaque error.
- **SPA fallback** to `index.html`, excluding `/assets/*`, `/models/*` and
  `/ort/*` so a missing model returns a real 404 instead of the HTML page
  (which would fail to parse as WASM and be much harder to diagnose).
- **Immutable, one-year caching** on the hashed assets and the model files, so
  returning visitors don't re-download 20 MB.

## Custom domain

```bash
az staticwebapp hostname set \
  --name safequest-app \
  --resource-group safequest-rg \
  --hostname www.example.com
```

Add the CNAME record it asks for at your DNS provider. Azure provisions the
TLS certificate automatically.

## Tearing it down

```bash
az group delete --name safequest-rg --yes --no-wait
```

## Alternative: Azure Blob Storage static website

Cheaper still, but you would have to set the `.wasm` content type by hand on
upload and configure the 404 document as `index.html` to emulate SPA routing.
Static Web Apps handles both through the config file above, so it is only
worth considering if you are already standardised on Storage.
