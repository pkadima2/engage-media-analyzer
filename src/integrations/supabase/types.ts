export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      posts: {
        Row: {
          created_at: string
          goal: string | null
          hashtags: string[] | null
          id: string
          image_url: string | null
          niche: string | null
          platform: string
          selected_caption: string | null
          tone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          goal?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          niche?: string | null
          platform: string
          selected_caption?: string | null
          tone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          goal?: string | null
          hashtags?: string[] | null
          id?: string
          image_url?: string | null
          niche?: string | null
          platform?: string
          selected_caption?: string | null
          tone?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          current_plan_id: string | null
          email: string | null
          full_name: string | null
          id: string
          requests_remaining: number | null
          stripe_customer_id: string | null
          subscription_status: string | null
          total_requests_made: number | null
          trial_active: boolean | null
          trial_end_date: string | null
          trial_requests_remaining: number | null
          trial_start_date: string | null
        }
        Insert: {
          created_at?: string
          current_plan_id?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          requests_remaining?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          total_requests_made?: number | null
          trial_active?: boolean | null
          trial_end_date?: string | null
          trial_requests_remaining?: number | null
          trial_start_date?: string | null
        }
        Update: {
          created_at?: string
          current_plan_id?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          requests_remaining?: number | null
          stripe_customer_id?: string | null
          subscription_status?: string | null
          total_requests_made?: number | null
          trial_active?: boolean | null
          trial_end_date?: string | null
          trial_requests_remaining?: number | null
          trial_start_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_current_plan_id_fkey"
            columns: ["current_plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          features: Json | null
          id: string
          name: string
          price: number
          request_limit: number
          stripe_price_id: string
        }
        Insert: {
          created_at?: string
          currency?: string
          features?: Json | null
          id?: string
          name: string
          price: number
          request_limit: number
          stripe_price_id: string
        }
        Update: {
          created_at?: string
          currency?: string
          features?: Json | null
          id?: string
          name?: string
          price?: number
          request_limit?: number
          stripe_price_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          billing_cycle_end_date: string | null
          created_at: string
          id: string
          next_billing_date: string | null
          plan_name: string
          start_date: string | null
          status: string
          stripe_subscription_id: string
          trial_end_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          billing_cycle_end_date?: string | null
          created_at?: string
          id?: string
          next_billing_date?: string | null
          plan_name: string
          start_date?: string | null
          status: string
          stripe_subscription_id: string
          trial_end_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          billing_cycle_end_date?: string | null
          created_at?: string
          id?: string
          next_billing_date?: string | null
          plan_name?: string
          start_date?: string | null
          status?: string
          stripe_subscription_id?: string
          trial_end_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      usage_logs: {
        Row: {
          id: string
          request_type: string
          status: string
          subscription_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          id?: string
          request_type: string
          status: string
          subscription_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          id?: string
          request_type?: string
          status?: string
          subscription_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
