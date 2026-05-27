# n8n-nodes-audexum

An [n8n](https://n8n.io) community node for the [Audexum](https://audexum.com) text-to-speech API.

## Features

- Convert text to speech using the Audexum API
- 43 voices across 33 languages
- WAV audio output
- Simple Bearer token authentication

## Installation

In your n8n instance: **Settings** → **Community Nodes** → Install → `n8n-nodes-audexum`

## Usage

1. Add an **Audexum TTS** node to your workflow
2. Create an **Audexum API** credential with your API key from [audexum.com/dashboard](https://audexum.com/dashboard)
3. Enter your text and select a voice
4. The node outputs a binary WAV file

## Free Tier

10,000 characters/month, no credit card required. [Sign up at audexum.com](https://audexum.com/signup)

## API Docs

[audexum.com/docs](https://audexum.com/docs)

## License

MIT
