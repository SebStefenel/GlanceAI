chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "summarize") {
    const { url, query } = request;

    fetch(url)
      .then(res => res.text())
      .then(html => {
        const text = html.replace(/<[^>]*>?/gm, "").slice(0, 4000); // Simple text extraction
        return summarizeWithAI(text, query);
      })
      .then(summary => {
        chrome.tabs.sendMessage(sender.tab.id, {
          action: "displaySummary",
          summary: summary,
          url: url
        });
      })
      .catch(err => {
        console.error("Summarization failed", err);
      });
  }
});

async function summarizeWithAI(text, query) {
  const apiKey = "YOUR_OPENAI_API_KEY"; // Replace this
  const prompt = `Query: "${query}". Article: """${text}"""\n\nSummarize the article and explain how it answers the query.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", { // replace with deepseek
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No summary available.";
}
