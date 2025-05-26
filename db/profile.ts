import { supabase } from "@/lib/supabase/browser-client"
import { TablesInsert, TablesUpdate } from "@/supabase/types"

export const getProfileByUserId = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)

  if (error) {
    throw new Error(error.message)
  }

  // If no profile exists, create one
  if (!profiles || profiles.length === 0) {
    const newProfile: TablesInsert<"profiles"> = {
      user_id: userId,
      display_name: `User ${userId.slice(0, 8)}`,
      bio: "Welcome to my profile!",
      has_onboarded: false,
      image_url: "",
      image_path: "",
      profile_context: "",
      use_azure_openai: false,
      username: `user_${userId.slice(0, 8)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return createProfile(newProfile)
  }

  // If multiple profiles exist, return the first one
  return profiles[0]
}

export const getProfilesByUserId = async (userId: string) => {
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)

  if (!profiles) {
    throw new Error(error.message)
  }

  return profiles
}

export const createProfile = async (profile: TablesInsert<"profiles">) => {
  const { data: createdProfile, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return createdProfile
}

export const updateProfile = async (
  profileId: string,
  profile: TablesUpdate<"profiles">
) => {
  const { data: updatedProfile, error } = await supabase
    .from("profiles")
    .update(profile)
    .eq("id", profileId)
    .select("*")
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return updatedProfile
}

export const deleteProfile = async (profileId: string) => {
  const { error } = await supabase.from("profiles").delete().eq("id", profileId)

  if (error) {
    throw new Error(error.message)
  }

  return true
}
