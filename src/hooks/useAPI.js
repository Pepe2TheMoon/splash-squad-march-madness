import { useCallback } from 'react';

export function useAPI() {
  const callAPI = useCallback(async (system, prompt, useSearch = false) => {
    const body = {
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [{ role: "user", content: prompt }],
    };
    if (useSearch) {
      body.tools = [{ type: "web_search_20250305", name: "web_search" }];
    }
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("API error: " + response.status);
    const data = await response.json();
    return data.content?.map((block) => block.text || "").filter(Boolean).join("\n") || "No response.";
  }, []);
  return callAPI;
}
