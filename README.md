# GlanceAI

A Chrome extension that summarizes Google Search results on demand. Activate it with a keyboard shortcut, hover over a result link, and get a 2-sentence AI summary of the article — without opening it.

---

## How It Works

1. Press **Alt+Shift+G** (or click the extension icon in the toolbar) — a blue badge appears in the bottom-right corner confirming GlanceAI is active
2. Hover over any search result link — a tooltip appears with "Summarizing..." then updates with the summary
3. Press **Alt+Shift+G** again, or press **Escape**, to dismiss the tooltip

You can also customize the shortcut at `chrome://extensions/shortcuts`.

---

## Setup

### 1. Load the Extension

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `GlanceAI` folder
4. The extension will appear in your extensions list

### 2. Get a Groq API Key

GlanceAI uses the [Groq](https://console.groq.com) API (free tier available).

1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to **API Keys** and create a new key
3. Copy the key

### 3. Add Your API Key

1. Right-click the GlanceAI icon in the toolbar → **Options** (or go to `chrome://extensions` → GlanceAI → **Details** → **Extension options**)
2. Paste your Groq API key and click **Save**

---

## Tech Stack

- Manifest V3 Chrome Extension
- JavaScript (ES6+)
- [Groq API](https://groq.com) — `llama-3.1-8b-instant` model
- Chrome Extension Commands API for keyboard shortcut handling

---

## Notes

- Only works on `google.com/search` pages
- Some sites block programmatic fetches (paywalled news, Cloudflare-protected sites) — those results will show an error in the tooltip
- PDF links are not supported
- Free tier Groq rate limit: ~6000 tokens/minute (roughly 3 summaries per minute)
