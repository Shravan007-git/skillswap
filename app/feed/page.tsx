import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FeedClient from "./FeedClient";

export default async function FeedPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: mySkills }, { data: allUsers }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_skills").select("*").eq("user_id", user.id),
    supabase.from("profiles").select("*, user_skills(*)").neq("id", user.id).limit(50),
  ]);

  if (profile && !profile.onboarding_complete) redirect("/onboarding");

  return <FeedClient profile={profile} mySkills={mySkills || []} allUsers={allUsers || []} />;
}
