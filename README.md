# GlanceAI

A Chrome extension that summarizes Google Search results on demand. Activate it with a keyboard shortcut, hover over a result link, and get an AI-generated summary of the article — without opening it. Every summary is **query-aware**: the AI knows what you searched for and frames the summary around your specific question, not just the article in general.

---

## How It Works

1. Press **Alt+Shift+G** (or click the extension icon) — a blue badge appears in the bottom-right corner confirming GlanceAI is active
2. Hover over any search result link — a tooltip appears with the summary
3. Click **Copy** in the tooltip to copy the text, or press **Alt+Shift+G** / **Escape** to dismiss

You can customize the shortcut at `chrome://extensions/shortcuts`.

---

## Setup

### 1. Load the Extension

1. Go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked** and select the `GlanceAI` folder

### 2. Get a Groq API Key

GlanceAI uses the [Groq](https://console.groq.com) API (free tier available).

1. Sign up at [console.groq.com](https://console.groq.com)
2. Go to **API Keys** and create a new key

### 3. Add Your API Key

Click the GlanceAI icon in the toolbar → **API Key** tab → paste your key → **Save Key**.

---

## Summary Formats

Choose how the AI structures each summary from the **Options** tab in the popup:

| Format | Output |
|---|---|
| **2 sentences** (default) | A concise 2-sentence overview framed around your search query |
| **Bullet points** | 3–4 key points from the article relevant to your query |
| **Explain like I'm 5** | A plain-language summary framed around your search query |
| **Pros & cons** | Structured pros and cons relevant to your query |

All formats pass your search query to the AI so the summary answers *why this result matters for what you searched*, not just what the article is about.

The format is saved automatically and persists across sessions.

---

## Tech Stack

- Manifest V3 Chrome Extension
- JavaScript (ES6+)
- [Groq API](https://groq.com) — `llama-3.1-8b-instant` model
- Chrome Extension Commands API for keyboard shortcut handling

---

## Notes

- Only works on `google.com/search` pages
- Summaries are cached in memory during a session — hovering the same link twice won't make a second API call
- Some sites block programmatic fetches (paywalled news, Cloudflare-protected sites) — those results will show an error in the tooltip
- PDF links are not supported
- Free tier Groq rate limit: ~6,000 tokens/minute (roughly 3 summaries per minute)
