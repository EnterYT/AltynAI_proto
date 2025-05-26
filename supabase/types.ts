export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          user_id: string
          display_name: string
          bio: string
          has_onboarded: boolean
          image_url: string
          image_path: string
          profile_context: string
          use_azure_openai: boolean
          username: string
          created_at: string
          updated_at: string | null
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_endpoint?: string | null
          google_gemini_api_key?: string | null
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          perplexity_api_key?: string | null
        }
        Insert: {
          id?: string
          user_id: string
          display_name: string
          bio: string
          has_onboarded: boolean
          image_url: string
          image_path: string
          profile_context: string
          use_azure_openai: boolean
          username: string
          created_at?: string
          updated_at?: string | null
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_endpoint?: string | null
          google_gemini_api_key?: string | null
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          perplexity_api_key?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          display_name?: string
          bio?: string
          has_onboarded?: boolean
          image_url?: string
          image_path?: string
          profile_context?: string
          use_azure_openai?: boolean
          username?: string
          created_at?: string
          updated_at?: string | null
          anthropic_api_key?: string | null
          azure_openai_35_turbo_id?: string | null
          azure_openai_45_turbo_id?: string | null
          azure_openai_45_vision_id?: string | null
          azure_openai_api_key?: string | null
          azure_openai_endpoint?: string | null
          google_gemini_api_key?: string | null
          mistral_api_key?: string | null
          openai_api_key?: string | null
          openai_organization_id?: string | null
          perplexity_api_key?: string | null
        }
      }
    }
  }
}

export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
