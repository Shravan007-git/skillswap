export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  college?: string;
  company?: string;
  bio?: string;
  user_type: "student" | "professional";
  swapcoin_balance: number;
  total_sessions_taught: number;
  total_sessions_learned: number;
  average_rating: number;
  streak_days: number;
  onboarding_complete: boolean;
  created_at: string;
}

export interface UserSkill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_type: "teach" | "learn";
  is_verified: boolean;
  sessions_count: number;
  level: "beginner" | "intermediate" | "expert";
}

export interface Match {
  id: string;
  user: Profile;
  teach_overlap: string[];
  learn_overlap: string[];
  compatibility: number;
  is_requested: boolean;
}

export interface Session {
  id: string;
  teacher_id: string;
  learner_id: string;
  skill_name: string;
  scheduled_at: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  teacher_confirmed: boolean;
  learner_confirmed: boolean;
  coin_deposit: number;
  created_at: string;
  teacher?: Profile;
  learner?: Profile;
}

export interface Rating {
  id: string;
  session_id: string;
  rater_id: string;
  rated_id: string;
  stars: number;
  review?: string;
  created_at: string;
}

export interface SwapCoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "earn" | "spend" | "deposit" | "refund";
  description: string;
  session_id?: string;
  created_at: string;
}
