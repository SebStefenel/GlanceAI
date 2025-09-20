# AI-Research-Assistant

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

---

## 🔑 Setup: SetUp Your Own API Key

To use this extension, **you must generate your own API key from [Together.ai](https://www.together.ai)**. The extension relies on the Together API to generate AI summaries, and each user must authenticate with their own key.

### ✅ How to Get Started:

1. **Sign up at** [https://www.together.ai](https://www.together.ai)
2. Go to the **API Keys** section in your account dashboard
3. **Generate a new key**
4. Open the extension’s **Background page** 
5. **Paste your API key** and click **Save**

The extension will now use your key to summarize links via the `deepseek-ai/DeepSeek-V3` model.

> ⚠️ **Note:** Do not share your API key publicly — it is tied to your usage quota and billing.
