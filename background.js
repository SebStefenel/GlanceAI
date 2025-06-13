chrome.runtime.onMessage.addListener((request, sender) => {
  if (request.action === "summarize") {
    const { url, query } = request;

    fetch(url)
      .then(res => res.text())
      .then(html => {
        const text = html.replace(/<[^>]*>?/gm, "").slice(0, 4000); // naive text extraction
        return summarizeWithTogether(text, query);
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

async function summarizeWithTogether(text, query) {
  const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY; // Replace with your Together key

  const prompt = `Query: "${query}". Article: """${text}"""\n\nSummarize the article and explain how it answers the query.`;

  const body = {
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  };

  const response = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOGETHER_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "No summary available.";
}
