# Research-Assistant

# 🔍 AI Search Summary Chrome Extension

A Chrome Extension that uses Together.ai to summarize articles linked in Google Search results in real time. When you hover over a link, it fetches the article, runs it through an LLM, and shows a summary based on your original search query.

---

## ✨ Features

- ⌛️ Instant AI-generated summaries of search results
- 🧠 Uses Together.ai LLMs (e.g., DeepSeek-V3) for accurate context matching
- ⚡️ No need to open each result — preview relevance instantly
- 🎯 Built for Google Search results
- 🧩 Lightweight and easy to use

---

## 🛠️ Tech Stack

- Manifest V3 Chrome Extension
- JavaScript (ES6+)
- Together.ai API (`deepseek-ai/DeepSeek-V3`)
- Vanilla DOM manipulation and event handling

---

## 🚧 Future Improvements

- 📚 **Support for research libraries**: Extend compatibility to academic databases like JSTOR, Springer, and Semantic Scholar so the extension can summarize scholarly articles directly from those sites.
- ⌨️ **Refined interaction trigger**: Require users to hold the `Ctrl` key while hovering over a link to reduce accidental summarization and give more intentional control.
- 💾 **Summary caching**: Implement local storage or caching so previously summarized links don’t regenerate every time, reducing load times and saving on API usage.

