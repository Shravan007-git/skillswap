import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import WalletClient from "./WalletClient";

export default async function WalletPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: transactions }, { data: sessions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("swapcoin_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20),
    supabase.from("sessions")
      .select("*, teacher:profiles!teacher_id(full_name, avatar_url), learner:profiles!learner_id(full_name, avatar_url)")
      .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return <WalletClient profile={profile} transactions={transactions || []} sessions={sessions || []} userId={user.id} />;
}
