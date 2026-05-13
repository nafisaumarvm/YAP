import React from "react";
import { supabase } from "../lib/supabase";

type Submission = { id: string; question: string; votes: number };

export default function VotePage() {
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [voted, setVoted] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    supabase
      .from("submissions")
      .select("id, question, votes")
      .order("votes", { ascending: false })
      .then(({ data }) => setSubmissions(data ?? []));
  }, []);

  async function vote(id: string, delta: 1 | -1) {
    if (delta === 1 && voted.has(id)) return; // simple dupe guard
    await supabase.rpc("increment_votes", { row_id: id, delta });
    setVoted(prev => new Set([...prev, id]));
    setSubmissions(prev =>
      prev.map(s => s.id === id ? { ...s, votes: s.votes + delta } : s)
        .sort((a, b) => b.votes - a.votes)
    );
  }

  return (
    <div>
      <h2>Vote on questions</h2>
      {submissions.map(s => (
        <div key={s.id}>
          <p>{s.question}</p>
          <button onClick={() => vote(s.id, 1)} disabled={voted.has(s.id)}>▲</button>
          <span>{s.votes}</span>
          <button onClick={() => vote(s.id, -1)}>▼</button>
        </div>
      ))}
    </div>
  );
}