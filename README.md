# n8n-nodes-audexum

An [n8n](https://n8n.io) community node for the [Audexum](https://audexum.com) text-to-speech API.

Convert text to speech with **43 voices** across **33 languages** directly inside your n8n workflows.

## Installation

In your n8n instance: **Settings → Community Nodes → Install → `n8n-nodes-audexum`**

Or via CLI:

```bash
npm install n8n-nodes-audexum
```

## Setup

1. [Sign up at audexum.com](https://audexum.com/signup) — free tier is 10,000 characters/month, no credit card required
2. Copy your API key from the [dashboard](https://audexum.com/dashboard)
3. In n8n, create a new **Audexum API** credential and paste your key

## Usage

Add an **Audexum TTS** node to your workflow:

| Parameter | Description |
|-----------|-------------|
| Text | The text to synthesize (up to 5,000 characters) |
| Voice | Select from 43 voices (e.g. `af_heart`, `am_michael`) |

The node outputs a **binary WAV file** — connect it to a Write Binary File node, an email attachment, or any downstream node that accepts binary data.

## Example workflow

```
HTTP Request → Audexum TTS → Write Binary File
```

or

```
Schedule Trigger → Read Database → Audexum TTS → Send Email (with attachment)
```

## Pricing

| Plan | Price | Characters |
|------|-------|------------|
| Free | €0 | 10K/mo |
| Starter | €4/mo | 100K/mo |
| Pro | €12/mo | 500K/mo |
| Scale | €30/mo | 2M/mo |
| PAYG | €3 | 1M credits |

Full pricing at [audexum.com/pricing](https://audexum.com/pricing)

## API docs

[audexum.com/docs](https://audexum.com/docs)

## License

MIT
