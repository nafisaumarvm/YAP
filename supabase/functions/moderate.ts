export async function onRequest(context: any) {
  const { question } = await context.request.json();

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": context.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `Is this a genuine, thoughtful conversation question suitable for a social card game? Reply only with JSON: {"ok": true} or {"ok": false, "reason": "..."}.\n\nQuestion: "${question}"`,
        },
      ],
    }),
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
