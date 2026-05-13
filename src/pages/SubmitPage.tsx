import React from "react";
import { supabase } from "../lib/supabase";

export default function SubmitPage() {
  const [question, setQuestion] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    // 1. Moderate with Claude via Anthropic API
    const modRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 100,
        messages: [{
          role: "user",
          content: `Is this a genuine, thoughtful conversation question suitable for a social card game? Reply only with JSON: {"ok": true} or {"ok": false, "reason": "..."}.\n\nQuestion: "${question}"`
        }]
      })
    });
    const modData = await modRes.json();
    const modText = modData.content?.[0]?.text ?? "{}";
    const { ok, reason } = JSON.parse(modText.replace(/```json|```/g, "").trim());

    if (!ok) {
      setStatus("error");
      alert(`Question rejected: ${reason}`);
      return;
    }

    // 2. Save to Supabase
    const { error } = await supabase.from("submissions").insert({ question });
    if (error) { setStatus("error"); return; }

    // 3. Notify via Web3Forms
    await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: import.meta.env.VITE_WEB3FORMS_KEY,
        subject: "New YAP question submitted",
        message: question,
      })
    });

    setStatus("success");
    setQuestion("");
  }

  return (
    <div>
      <h2>Submit a question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask something meaningful..."
          maxLength={200}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Checking..." : "Submit"}
        </button>
      </form>
      {status === "success" && <p>Submitted! Others can now vote on it.</p>}
    </div>
  );
}