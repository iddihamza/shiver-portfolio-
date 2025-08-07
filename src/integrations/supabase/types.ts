export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chapter_tags: {
        Row: {
          chapter_id: string
          created_at: string
          id: string
          tag: string
        }
        Insert: {
          chapter_id: string
          created_at?: string
          id?: string
          tag: string
        }
        Update: {
          chapter_id?: string
          created_at?: string
          id?: string
          tag?: string
        }
        Relationships: []
      }
      chapter_visual_references: {
        Row: {
          alt_text: string | null
          caption: string | null
          chapter_id: string
          created_at: string
          id: string
          image_type: string | null
          image_url: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          chapter_id: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          chapter_id?: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
        }
        Relationships: []
      }
      chapters: {
        Row: {
          chapter_number: number
          content_plain: string | null
          content_xml: string | null
          cover_image_url: Json | null
          created_at: string
          emotional_impact: string | null
          id: string
          linked_characters: string[] | null
          linked_locations: string[] | null
          location: string | null
          motifs: string[] | null
          narrative_purpose: string | null
          notes: string | null
          plot_triggers: string[] | null
          status: string | null
          story_id: string
          summary: string | null
          themes: string[] | null
          title: string
          tone: string | null
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          chapter_number: number
          content_plain?: string | null
          content_xml?: string | null
          cover_image_url?: Json | null
          created_at?: string
          emotional_impact?: string | null
          id?: string
          linked_characters?: string[] | null
          linked_locations?: string[] | null
          location?: string | null
          motifs?: string[] | null
          narrative_purpose?: string | null
          notes?: string | null
          plot_triggers?: string[] | null
          status?: string | null
          story_id: string
          summary?: string | null
          themes?: string[] | null
          title: string
          tone?: string | null
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          chapter_number?: number
          content_plain?: string | null
          content_xml?: string | null
          cover_image_url?: Json | null
          created_at?: string
          emotional_impact?: string | null
          id?: string
          linked_characters?: string[] | null
          linked_locations?: string[] | null
          location?: string | null
          motifs?: string[] | null
          narrative_purpose?: string | null
          notes?: string | null
          plot_triggers?: string[] | null
          status?: string | null
          story_id?: string
          summary?: string | null
          themes?: string[] | null
          title?: string
          tone?: string | null
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      character_abilities: {
        Row: {
          ability_type: string
          character_id: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          ability_type: string
          character_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          ability_type?: string
          character_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_abilities_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_inspirations: {
        Row: {
          character_id: string
          created_at: string
          id: string
          influence_name: string
          influence_type: string | null
          why_they_matter: string | null
        }
        Insert: {
          character_id: string
          created_at?: string
          id?: string
          influence_name: string
          influence_type?: string | null
          why_they_matter?: string | null
        }
        Update: {
          character_id?: string
          created_at?: string
          id?: string
          influence_name?: string
          influence_type?: string | null
          why_they_matter?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_inspirations_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_profiles: {
        Row: {
          affiliations: string | null
          affiliations_array: string[] | null
          age: string | null
          aliases_nicknames: string | null
          alignment: string | null
          artifacts_items: string | null
          backstory: string | null
          birthplace: string | null
          catchphrases: string | null
          catchphrases_array: string[] | null
          confidence_score: number | null
          connected_locations: string | null
          core_motivation: string | null
          core_themes: string | null
          created_at: string
          emotional_tone: string | null
          full_name: string
          gender: string | null
          height: string | null
          id: string
          img_url: string | null
          inferred: boolean | null
          internal_conflict: string | null
          key_chapters: string | null
          notable_features: string | null
          notable_features_array: string[] | null
          notable_traits: string | null
          notable_traits_array: string[] | null
          outfit_breakdown: string | null
          pose_description: string | null
          pose_energy: string | null
          role_in_story: string | null
          signature_weapon_tools: string | null
          special_considerations: string | null
          species_race: string | null
          story_id: string | null
          summary_tagline: string | null
          timeline_anchor: string | null
          title: string | null
          updated_at: string
          user_id: string
          visual_motifs: string | null
          voice_tone: string | null
          weight: string | null
        }
        Insert: {
          affiliations?: string | null
          affiliations_array?: string[] | null
          age?: string | null
          aliases_nicknames?: string | null
          alignment?: string | null
          artifacts_items?: string | null
          backstory?: string | null
          birthplace?: string | null
          catchphrases?: string | null
          catchphrases_array?: string[] | null
          confidence_score?: number | null
          connected_locations?: string | null
          core_motivation?: string | null
          core_themes?: string | null
          created_at?: string
          emotional_tone?: string | null
          full_name: string
          gender?: string | null
          height?: string | null
          id?: string
          img_url?: string | null
          inferred?: boolean | null
          internal_conflict?: string | null
          key_chapters?: string | null
          notable_features?: string | null
          notable_features_array?: string[] | null
          notable_traits?: string | null
          notable_traits_array?: string[] | null
          outfit_breakdown?: string | null
          pose_description?: string | null
          pose_energy?: string | null
          role_in_story?: string | null
          signature_weapon_tools?: string | null
          special_considerations?: string | null
          species_race?: string | null
          story_id?: string | null
          summary_tagline?: string | null
          timeline_anchor?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          visual_motifs?: string | null
          voice_tone?: string | null
          weight?: string | null
        }
        Update: {
          affiliations?: string | null
          affiliations_array?: string[] | null
          age?: string | null
          aliases_nicknames?: string | null
          alignment?: string | null
          artifacts_items?: string | null
          backstory?: string | null
          birthplace?: string | null
          catchphrases?: string | null
          catchphrases_array?: string[] | null
          confidence_score?: number | null
          connected_locations?: string | null
          core_motivation?: string | null
          core_themes?: string | null
          created_at?: string
          emotional_tone?: string | null
          full_name?: string
          gender?: string | null
          height?: string | null
          id?: string
          img_url?: string | null
          inferred?: boolean | null
          internal_conflict?: string | null
          key_chapters?: string | null
          notable_features?: string | null
          notable_features_array?: string[] | null
          notable_traits?: string | null
          notable_traits_array?: string[] | null
          outfit_breakdown?: string | null
          pose_description?: string | null
          pose_energy?: string | null
          role_in_story?: string | null
          signature_weapon_tools?: string | null
          special_considerations?: string | null
          species_race?: string | null
          story_id?: string | null
          summary_tagline?: string | null
          timeline_anchor?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          visual_motifs?: string | null
          voice_tone?: string | null
          weight?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_profiles_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      character_relationships: {
        Row: {
          character_id: string
          character_name: string
          created_at: string
          description: string | null
          id: string
          is_bidirectional: boolean | null
          related_character_id: string | null
          relationship_type: string
        }
        Insert: {
          character_id: string
          character_name: string
          created_at?: string
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          related_character_id?: string | null
          relationship_type: string
        }
        Update: {
          character_id?: string
          character_name?: string
          created_at?: string
          description?: string | null
          id?: string
          is_bidirectional?: boolean | null
          related_character_id?: string | null
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_visual_references: {
        Row: {
          alt_text: string | null
          caption: string | null
          character_id: string
          created_at: string
          id: string
          image_type: string | null
          image_url: string | null
          notes: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          character_id: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          notes?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          character_id?: string
          created_at?: string
          id?: string
          image_type?: string | null
          image_url?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "character_visual_references_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      character_weaknesses: {
        Row: {
          character_id: string
          created_at: string
          description: string | null
          id: string
          weakness_name: string
        }
        Insert: {
          character_id: string
          created_at?: string
          description?: string | null
          id?: string
          weakness_name: string
        }
        Update: {
          character_id?: string
          created_at?: string
          description?: string | null
          id?: string
          weakness_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_weaknesses_character_id_fkey"
            columns: ["character_id"]
            isOneToOne: false
            referencedRelation: "character_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          access: string | null
          connected_characters: string[] | null
          core_symbolism: string | null
          created_at: string
          cultural_feel: string | null
          emotional_weight: string | null
          id: string
          key_scenes: string[] | null
          location_type: string | null
          name: string
          notes: string | null
          primary_function: string | null
          recurring_motifs: string[] | null
          related_artifacts: string[] | null
          sensory_details: string | null
          story_id: string | null
          story_importance: string | null
          summary: string | null
          updated_at: string
          user_id: string
          visual_mood: string | null
          visual_references: Json | null
          weather_effects: string | null
        }
        Insert: {
          access?: string | null
          connected_characters?: string[] | null
          core_symbolism?: string | null
          created_at?: string
          cultural_feel?: string | null
          emotional_weight?: string | null
          id?: string
          key_scenes?: string[] | null
          location_type?: string | null
          name: string
          notes?: string | null
          primary_function?: string | null
          recurring_motifs?: string[] | null
          related_artifacts?: string[] | null
          sensory_details?: string | null
          story_id?: string | null
          story_importance?: string | null
          summary?: string | null
          updated_at?: string
          user_id: string
          visual_mood?: string | null
          visual_references?: Json | null
          weather_effects?: string | null
        }
        Update: {
          access?: string | null
          connected_characters?: string[] | null
          core_symbolism?: string | null
          created_at?: string
          cultural_feel?: string | null
          emotional_weight?: string | null
          id?: string
          key_scenes?: string[] | null
          location_type?: string | null
          name?: string
          notes?: string | null
          primary_function?: string | null
          recurring_motifs?: string[] | null
          related_artifacts?: string[] | null
          sensory_details?: string | null
          story_id?: string | null
          story_importance?: string | null
          summary?: string | null
          updated_at?: string
          user_id?: string
          visual_mood?: string | null
          visual_references?: Json | null
          weather_effects?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      page_content: {
        Row: {
          content: string
          content_type: string | null
          created_at: string
          id: string
          page_id: string
          section_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          content_type?: string | null
          created_at?: string
          id?: string
          page_id: string
          section_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          content_type?: string | null
          created_at?: string
          id?: string
          page_id?: string
          section_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      page_images: {
        Row: {
          created_at: string
          height: number | null
          id: string
          image_url: string | null
          page_id: string
          pos_x: number | null
          pos_y: number | null
          section_key: string
          updated_at: string
          user_id: string
          width: number | null
        }
        Insert: {
          created_at?: string
          height?: number | null
          id?: string
          image_url?: string | null
          page_id: string
          pos_x?: number | null
          pos_y?: number | null
          section_key: string
          updated_at?: string
          user_id: string
          width?: number | null
        }
        Update: {
          created_at?: string
          height?: number | null
          id?: string
          image_url?: string | null
          page_id?: string
          pos_x?: number | null
          pos_y?: number | null
          section_key?: string
          updated_at?: string
          user_id?: string
          width?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      stories: {
        Row: {
          created_at: string
          estimated_read_time_minutes: number | null
          genre: string | null
          id: string
          narrative_devices: string[] | null
          notes: string | null
          series_id: string | null
          status: string | null
          structure: Json | null
          summary: string | null
          tags: string[] | null
          target_audience: string | null
          target_word_count: number | null
          themes: string[] | null
          title: string
          updated_at: string
          user_id: string
          word_count: number | null
        }
        Insert: {
          created_at?: string
          estimated_read_time_minutes?: number | null
          genre?: string | null
          id?: string
          narrative_devices?: string[] | null
          notes?: string | null
          series_id?: string | null
          status?: string | null
          structure?: Json | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_word_count?: number | null
          themes?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          word_count?: number | null
        }
        Update: {
          created_at?: string
          estimated_read_time_minutes?: number | null
          genre?: string | null
          id?: string
          narrative_devices?: string[] | null
          notes?: string | null
          series_id?: string | null
          status?: string | null
          structure?: Json | null
          summary?: string | null
          tags?: string[] | null
          target_audience?: string | null
          target_word_count?: number | null
          themes?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          word_count?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visual_references: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          image_url: string
          notes: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          image_url: string
          notes?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          image_url?: string
          notes?: string | null
          tags?: string[] | null
          title?: string
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
      get_chapter_user_id: {
        Args: { chapter_uuid: string }
        Returns: string
      }
      get_character_profile_user_id: {
        Args: { character_uuid: string }
        Returns: string
      }
      get_character_user_id: {
        Args: { character_uuid: string }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_story_user_id: {
        Args: { story_uuid: string }
        Returns: string
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
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
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
