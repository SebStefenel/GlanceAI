const summaryCache = new Map();

function sendToggle() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "toggleMode" }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Could not reach content script:", chrome.runtime.lastError.message);
        }
      });
    }
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-glance") {
    console.log("Command fired: toggle-glance");
    sendToggle();
  }
});


chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "summarize") {
    const { url, query } = request;
    console.log("Received summarize request for:", url, "with query:", query);

    if (summaryCache.has(url)) {
      console.log("Cache hit for:", url);
      if (sender.tab?.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "displaySummary",
          summary: summaryCache.get(url),
          url: url
        });
      }
      return;
    }

    fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36"
        }
      })
      .then(res => {
        console.log("Fetch response status:", res.status);
        if (!res.ok) {
          throw new Error(`Article fetch failed (${res.status})`);
        }
        return res.text();
      })
      .then(html => {
        console.log("HTML fetched, length:", html.length);
        const text = extractText(html);
        console.log("Text extracted, length:", text.length);
        return summarizeWithGroq(text, query);
      })
      .then(summary => {
        console.log("Summary generated:", summary.substring(0, 100) + "...");
        summaryCache.set(url, summary);
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "displaySummary",
            summary: summary,
            url: url
          });
        } else {
          console.error("Sender tab is undefined.");
        }
      })
      .catch(err => {
        console.error("Summarization failed", err);
        const message = err.message?.includes("Failed to fetch")
          ? "Could not fetch article (site may block requests)"
          : err.message || "Unknown error";
        if (sender.tab?.id) {
          chrome.tabs.sendMessage(sender.tab.id, {
            action: "displaySummary",
            summary: "Error: " + message,
            url: url
          });
        }
      });
  }
});

async function summarizeWithGroq(text, query) {
  const { apiKey: GROQ_API_KEY, summaryFormat = 'concise' } = await new Promise((resolve) => {
    chrome.storage.sync.get({ apiKey: '', summaryFormat: 'concise' }, resolve);
  });

  if (!GROQ_API_KEY) {
    throw new Error("No API key found. Please set one in the extension options page.");
  }

  const prompts = {
    concise: `Query: "${query}". Article: """${text}"""\n\nIn 2 sentences explain how this article reflects the search query.`,
    bullets: `Query: "${query}". Article: """${text}"""\n\nList 3-4 key points from this article relevant to the search query. Use • as the bullet character, one point per line.`,
    eli5: `Query: "${query}". Article: """${text}"""\n\nExplain what this article is about in simple terms a 10-year-old would understand. Keep it to 2 sentences.`,
    'pros-cons': `Query: "${query}". Article: """${text}"""\n\nList the main pros and cons from this article relevant to the search query. Format as "Pros: ..." and "Cons: ..." on separate lines.`,
  };

  const prompt = prompts[summaryFormat] || prompts.concise;

  const body = {
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "user", content: prompt }
    ]
  };

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      throw new Error(`API error ${response.status}: ${errBody?.error?.message || "unknown"}`);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error("Invalid API response structure");
    }

    return data.choices[0].message.content;

  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

function extractText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<aside[\s\S]*?<\/aside>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 2750);
}
