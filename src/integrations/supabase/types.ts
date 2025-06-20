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
      background_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          is_public: boolean
          name: string | null
          prompt: string
          style_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          is_public?: boolean
          name?: string | null
          prompt: string
          style_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          is_public?: boolean
          name?: string | null
          prompt?: string
          style_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "background_images_style_id_fkey"
            columns: ["style_id"]
            isOneToOne: false
            referencedRelation: "background_styles"
            referencedColumns: ["id"]
          },
        ]
      }
      background_styles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          preview_image: string | null
          prompt: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          preview_image?: string | null
          prompt: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          preview_image?: string | null
          prompt?: string
        }
        Relationships: []
      }
      gradients: {
        Row: {
          angle: number
          colors: Json
          created_at: string
          id: string
          is_public: boolean
          name: string
          user_id: string | null
        }
        Insert: {
          angle?: number
          colors: Json
          created_at?: string
          id?: string
          is_public?: boolean
          name: string
          user_id?: string | null
        }
        Update: {
          angle?: number
          colors?: Json
          created_at?: string
          id?: string
          is_public?: boolean
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          api_access: boolean
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          plan: string
          playground_access: boolean
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_status: string | null
          tokens: number
          updated_at: string
        }
        Insert: {
          api_access?: boolean
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          plan?: string
          playground_access?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          tokens?: number
          updated_at?: string
        }
        Update: {
          api_access?: boolean
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          plan?: string
          playground_access?: boolean
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          tokens?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      consume_token: {
        Args: { user_id: string }
        Returns: boolean
      }
      reset_monthly_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_user_plan: {
        Args: {
          user_id: string
          new_plan: string
          new_tokens: number
          api_access_enabled: boolean
          playground_access_enabled: boolean
          customer_id?: string
          subscription_id?: string
          sub_status?: string
          sub_end?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
