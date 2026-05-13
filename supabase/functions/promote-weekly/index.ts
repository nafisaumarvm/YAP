import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const week = getISOWeek(); // e.g. "2026-W20"

  // Get top voted question not yet promoted
  const { data } = await supabase
    .from("submissions")
    .select("id, question")
    .is("week_added", null)
    .order("votes", { ascending: false })
    .limit(1)
    .single();

  if (data) {
    await supabase.from("submissions").update({ week_added: week }).eq("id", data.id);
    // Optionally: write to a "promoted" table your app reads from
  }

  return new Response("ok");
});

function getISOWeek() {
  const now = new Date();
  const year = now.getFullYear();
  const week = Math.ceil(((now.getTime() - new Date(year, 0, 1).getTime()) / 86400000 + 1) / 7);
  return `${year}-W${week}`;
}