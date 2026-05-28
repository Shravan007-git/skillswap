import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: mySkills }, { data: certificates }, { data: sessions }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_skills").select("*").eq("user_id", user.id),
    supabase.from("certificates").select("*").eq("user_id", user.id),
    supabase.from("sessions")
      .select("*")
      .or(`teacher_id.eq.${user.id},learner_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return <DashboardClient profile={profile} mySkills={mySkills || []} certificates={certificates || []} recentSessions={sessions || []} userId={user.id} />;
}
