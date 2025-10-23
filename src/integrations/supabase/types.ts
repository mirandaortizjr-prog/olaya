export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      couple_members: {
        Row: {
          couple_id: string
          id: string
          joined_at: string
          user_id: string
        }
        Insert: {
          couple_id: string
          id?: string
          joined_at?: string
          user_id: string
        }
        Update: {
          couple_id?: string
          id?: string
          joined_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "couple_members_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      couples: {
        Row: {
          anniversary_date: string | null
          couple_picture_url: string | null
          created_at: string
          created_by: string | null
          id: string
          invite_code: string
          invite_code_expires_at: string | null
          invite_code_used: boolean | null
          name: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          anniversary_date?: string | null
          couple_picture_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invite_code: string
          invite_code_expires_at?: string | null
          invite_code_used?: boolean | null
          name?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          anniversary_date?: string | null
          couple_picture_url?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          invite_code?: string
          invite_code_expires_at?: string | null
          invite_code_used?: boolean | null
          name?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      craving_board: {
        Row: {
          couple_id: string
          craving_type: string
          created_at: string
          custom_message: string | null
          fulfilled: boolean | null
          fulfilled_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          couple_id: string
          craving_type: string
          created_at?: string
          custom_message?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          couple_id?: string
          craving_type?: string
          created_at?: string
          custom_message?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "craving_board_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_notes: {
        Row: {
          content: string
          couple_id: string
          created_at: string
          id: string
          note_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          couple_id: string
          created_at?: string
          id?: string
          note_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          couple_id?: string
          created_at?: string
          id?: string
          note_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_notes_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      desire_vault: {
        Row: {
          category: string
          couple_id: string
          created_at: string
          description: string | null
          fulfilled: boolean | null
          fulfilled_at: string | null
          id: string
          is_private: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          couple_id: string
          created_at?: string
          description?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          is_private?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          couple_id?: string
          created_at?: string
          description?: string | null
          fulfilled?: boolean | null
          fulfilled_at?: string | null
          id?: string
          is_private?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      feeling_status: {
        Row: {
          couple_id: string
          created_at: string | null
          custom_message: string | null
          id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string | null
          custom_message?: string | null
          id?: string
          status: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string | null
          custom_message?: string | null
          id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flirts: {
        Row: {
          couple_id: string
          created_at: string | null
          flirt_type: string
          id: string
          sender_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string | null
          flirt_type: string
          id?: string
          sender_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string | null
          flirt_type?: string
          id?: string
          sender_id?: string
        }
        Relationships: []
      }
      game_responses: {
        Row: {
          answer: string
          couple_id: string
          created_at: string
          game_type: string
          id: string
          question_id: string
          session_id: string
          user_id: string
        }
        Insert: {
          answer: string
          couple_id: string
          created_at?: string
          game_type: string
          id?: string
          question_id: string
          session_id: string
          user_id: string
        }
        Update: {
          answer?: string
          couple_id?: string
          created_at?: string
          game_type?: string
          id?: string
          question_id?: string
          session_id?: string
          user_id?: string
        }
        Relationships: []
      }
      game_sessions: {
        Row: {
          couple_id: string
          created_at: string
          game_type: string
          id: string
          initiated_by: string
          partner_id: string
          session_id: string
          status: string
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          game_type: string
          id?: string
          initiated_by: string
          partner_id: string
          session_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          game_type?: string
          id?: string
          initiated_by?: string
          partner_id?: string
          session_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      love_languages: {
        Row: {
          created_at: string
          id: string
          primary_language: string
          secondary_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          primary_language: string
          secondary_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          primary_language?: string
          secondary_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      love_meter: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          interaction_count: number
          last_interaction_at: string | null
          updated_at: string
          week_start_date: string
          weekly_count: number
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          interaction_count?: number
          last_interaction_at?: string | null
          updated_at?: string
          week_start_date?: string
          weekly_count?: number
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          interaction_count?: number
          last_interaction_at?: string | null
          updated_at?: string
          week_start_date?: string
          weekly_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "love_meter_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: true
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      love_notes: {
        Row: {
          content: string
          couple_id: string
          created_at: string
          id: string
          note_type: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          couple_id: string
          created_at?: string
          id?: string
          note_type: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          couple_id?: string
          created_at?: string
          id?: string
          note_type?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "love_notes_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      memory_calendar: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string
          date: string
          event_type: string
          id: string
          notes: string | null
          recurring: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by: string
          date: string
          event_type: string
          id?: string
          notes?: string | null
          recurring?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string
          date?: string
          event_type?: string
          id?: string
          notes?: string | null
          recurring?: boolean | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "memory_calendar_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          couple_id: string
          created_at: string | null
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          couple_id: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          couple_id?: string
          created_at?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: []
      }
      mood_tracker: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          mood_type: string
          note: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          mood_type: string
          note?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          mood_type?: string
          note?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_tracker_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          comment: string
          couple_id: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          couple_id: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          couple_id?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      post_reactions: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          reaction_type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          reaction_type?: string
          user_id?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author_id: string
          content: string
          couple_id: string
          created_at: string
          id: string
          likes: Json | null
          media_urls: Json | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          couple_id: string
          created_at?: string
          id?: string
          likes?: Json | null
          media_urls?: Json | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          couple_id?: string
          created_at?: string
          id?: string
          likes?: Json | null
          media_urls?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      private_content: {
        Row: {
          content_type: string
          couple_id: string
          created_at: string | null
          description: string | null
          id: string
          is_shared: boolean | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_type: string
          couple_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared?: boolean | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_type?: string
          couple_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_shared?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birthday: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          location?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birthday?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string | null
          endpoint: string
          id: string
          p256dh: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string | null
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string | null
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quick_messages: {
        Row: {
          couple_id: string
          created_at: string
          id: string
          message_type: string
          sender_id: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          id?: string
          message_type: string
          sender_id: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          id?: string
          message_type?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quick_messages_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      relationship_timeline: {
        Row: {
          couple_id: string
          created_at: string
          created_by: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          photos: Json | null
          title: string
          updated_at: string
        }
        Insert: {
          couple_id: string
          created_at?: string
          created_by: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          photos?: Json | null
          title: string
          updated_at?: string
        }
        Update: {
          couple_id?: string
          created_at?: string
          created_by?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          photos?: Json | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_journal: {
        Row: {
          author_id: string
          content: string
          couple_id: string
          created_at: string
          id: string
          mood: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          couple_id: string
          created_at?: string
          id?: string
          mood?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          couple_id?: string
          created_at?: string
          id?: string
          mood?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      shared_media: {
        Row: {
          caption: string | null
          couple_id: string
          created_at: string
          file_path: string
          file_type: string
          id: string
          uploaded_by: string
        }
        Insert: {
          caption?: string | null
          couple_id: string
          created_at?: string
          file_path: string
          file_type: string
          id?: string
          uploaded_by: string
        }
        Update: {
          caption?: string | null
          couple_id?: string
          created_at?: string
          file_path?: string
          file_type?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "shared_media_couple_id_fkey"
            columns: ["couple_id"]
            isOneToOne: false
            referencedRelation: "couples"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      find_couple_by_invite_code: { Args: { code: string }; Returns: string }
      generate_invite_code: { Args: never; Returns: string }
      get_couple_invite_code: {
        Args: { couple_uuid: string }
        Returns: {
          expires_at: string
          invite_code: string
          is_used: boolean
        }[]
      }
      get_own_email: { Args: never; Returns: string }
      get_partner_profile: {
        Args: { c_id: string }
        Returns: {
          avatar_url: string
          email: string
          full_name: string
          user_id: string
        }[]
      }
      get_user_subscription_status: {
        Args: never
        Returns: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string
          status: string
          user_id: string
        }[]
      }
      increment_love_meter: {
        Args: { p_couple_id: string; p_points?: number }
        Returns: undefined
      }
      refresh_invite_code: { Args: { couple_uuid: string }; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
