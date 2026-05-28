import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [{ data: profile }, { data: mySkills }, { data: ratings }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("user_skills").select("*").eq("user_id", user.id),
    supabase.from("ratings").select("*, rater:profiles!rater_id(full_name)").eq("rated_id", user.id).order("created_at", { ascending: false }).limit(10),
  ]);

  return <ProfileClient profile={profile} mySkills={mySkills || []} ratings={ratings || []} userId={user.id} />;
}
