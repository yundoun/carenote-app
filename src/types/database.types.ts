export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      announcement_attachments: {
        Row: {
          announcement_id: string | null;
          created_at: string | null;
          file_size: number | null;
          id: string;
          name: string;
          url: string;
        };
        Insert: {
          announcement_id?: string | null;
          created_at?: string | null;
          file_size?: number | null;
          id?: string;
          name: string;
          url: string;
        };
        Update: {
          announcement_id?: string | null;
          created_at?: string | null;
          file_size?: number | null;
          id?: string;
          name?: string;
          url?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'announcement_attachments_announcement_id_fkey';
            columns: ['announcement_id'];
            isOneToOne: false;
            referencedRelation: 'announcements';
            referencedColumns: ['id'];
          }
        ];
      };
      announcement_reads: {
        Row: {
          announcement_id: string | null;
          id: string;
          read_at: string | null;
          user_id: string | null;
        };
        Insert: {
          announcement_id?: string | null;
          id?: string;
          read_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          announcement_id?: string | null;
          id?: string;
          read_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'announcement_reads_announcement_id_fkey';
            columns: ['announcement_id'];
            isOneToOne: false;
            referencedRelation: 'announcements';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'announcement_reads_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      announcements: {
        Row: {
          author: string | null;
          category: string | null;
          content: string;
          created_at: string | null;
          id: string;
          important: boolean | null;
          read_count: number | null;
          target_facilities: string[] | null;
          target_roles: string[] | null;
          title: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          author?: string | null;
          category?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          important?: boolean | null;
          read_count?: number | null;
          target_facilities?: string[] | null;
          target_roles?: string[] | null;
          title: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          author?: string | null;
          category?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          important?: boolean | null;
          read_count?: number | null;
          target_facilities?: string[] | null;
          target_roles?: string[] | null;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      appointments: {
        Row: {
          accompanied_by: string | null;
          created_at: string | null;
          department: string | null;
          duration_minutes: number | null;
          hospital: string | null;
          id: string;
          location: string | null;
          notes: string | null;
          purpose: string | null;
          resident_id: string | null;
          scheduled_date: string;
          scheduled_time: string | null;
          status: string | null;
          title: string | null;
          transportation: string | null;
          type: string | null;
          updated_at: string | null;
          visitors: string[] | null;
        };
        Insert: {
          accompanied_by?: string | null;
          created_at?: string | null;
          department?: string | null;
          duration_minutes?: number | null;
          hospital?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          purpose?: string | null;
          resident_id?: string | null;
          scheduled_date: string;
          scheduled_time?: string | null;
          status?: string | null;
          title?: string | null;
          transportation?: string | null;
          type?: string | null;
          updated_at?: string | null;
          visitors?: string[] | null;
        };
        Update: {
          accompanied_by?: string | null;
          created_at?: string | null;
          department?: string | null;
          duration_minutes?: number | null;
          hospital?: string | null;
          id?: string;
          location?: string | null;
          notes?: string | null;
          purpose?: string | null;
          resident_id?: string | null;
          scheduled_date?: string;
          scheduled_time?: string | null;
          status?: string | null;
          title?: string | null;
          transportation?: string | null;
          type?: string | null;
          updated_at?: string | null;
          visitors?: string[] | null;
        };
        Relationships: [
          {
            foreignKeyName: 'appointments_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      care_schedules: {
        Row: {
          caregiver_id: string | null;
          created_at: string | null;
          description: string | null;
          duration_minutes: number | null;
          id: string;
          notes: string | null;
          priority: string | null;
          resident_id: string | null;
          scheduled_time: string;
          status: string | null;
          title: string;
          type: string | null;
          updated_at: string | null;
        };
        Insert: {
          caregiver_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          notes?: string | null;
          priority?: string | null;
          resident_id?: string | null;
          scheduled_time: string;
          status?: string | null;
          title: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Update: {
          caregiver_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration_minutes?: number | null;
          id?: string;
          notes?: string | null;
          priority?: string | null;
          resident_id?: string | null;
          scheduled_time?: string;
          status?: string | null;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'care_schedules_caregiver_id_fkey';
            columns: ['caregiver_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'care_schedules_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      education_categories: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          subcategories: string[] | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          subcategories?: string[] | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          subcategories?: string[] | null;
        };
        Relationships: [];
      };
      education_materials: {
        Row: {
          category_id: string | null;
          content_url: string | null;
          created_at: string | null;
          description: string | null;
          duration: number | null;
          id: string;
          learning_objectives: string[] | null;
          tags: string[] | null;
          thumbnail: string | null;
          title: string;
          type: string | null;
          updated_at: string | null;
          view_count: number | null;
        };
        Insert: {
          category_id?: string | null;
          content_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration?: number | null;
          id?: string;
          learning_objectives?: string[] | null;
          tags?: string[] | null;
          thumbnail?: string | null;
          title: string;
          type?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Update: {
          category_id?: string | null;
          content_url?: string | null;
          created_at?: string | null;
          description?: string | null;
          duration?: number | null;
          id?: string;
          learning_objectives?: string[] | null;
          tags?: string[] | null;
          thumbnail?: string | null;
          title?: string;
          type?: string | null;
          updated_at?: string | null;
          view_count?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'education_materials_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'education_categories';
            referencedColumns: ['id'];
          }
        ];
      };
      family_contacts: {
        Row: {
          created_at: string | null;
          id: string;
          is_primary: boolean | null;
          name: string;
          phone_number: string | null;
          relationship: string | null;
          resident_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          name: string;
          phone_number?: string | null;
          relationship?: string | null;
          resident_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_primary?: boolean | null;
          name?: string;
          phone_number?: string | null;
          relationship?: string | null;
          resident_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'family_contacts_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      medication_records: {
        Row: {
          actual_time: string | null;
          caregiver_id: string | null;
          created_at: string | null;
          dosage: string | null;
          id: string;
          medication_name: string;
          notes: string | null;
          recorded_at: string | null;
          resident_id: string | null;
          scheduled_time: string | null;
          status: string | null;
        };
        Insert: {
          actual_time?: string | null;
          caregiver_id?: string | null;
          created_at?: string | null;
          dosage?: string | null;
          id?: string;
          medication_name: string;
          notes?: string | null;
          recorded_at?: string | null;
          resident_id?: string | null;
          scheduled_time?: string | null;
          status?: string | null;
        };
        Update: {
          actual_time?: string | null;
          caregiver_id?: string | null;
          created_at?: string | null;
          dosage?: string | null;
          id?: string;
          medication_name?: string;
          notes?: string | null;
          recorded_at?: string | null;
          resident_id?: string | null;
          scheduled_time?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'medication_records_caregiver_id_fkey';
            columns: ['caregiver_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'medication_records_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      medications: {
        Row: {
          administration_time: string | null;
          created_at: string | null;
          dosage: string | null;
          frequency: string | null;
          id: string;
          name: string;
          notes: string | null;
          resident_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          administration_time?: string | null;
          created_at?: string | null;
          dosage?: string | null;
          frequency?: string | null;
          id?: string;
          name: string;
          notes?: string | null;
          resident_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          administration_time?: string | null;
          created_at?: string | null;
          dosage?: string | null;
          frequency?: string | null;
          id?: string;
          name?: string;
          notes?: string | null;
          resident_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'medications_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      nursing_notes: {
        Row: {
          attachments: Json | null;
          caregiver_id: string | null;
          content: string;
          created_at: string | null;
          id: string;
          note_type: string | null;
          priority: string | null;
          resident_id: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string | null;
        };
        Insert: {
          attachments?: Json | null;
          caregiver_id?: string | null;
          content: string;
          created_at?: string | null;
          id?: string;
          note_type?: string | null;
          priority?: string | null;
          resident_id?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string | null;
        };
        Update: {
          attachments?: Json | null;
          caregiver_id?: string | null;
          content?: string;
          created_at?: string | null;
          id?: string;
          note_type?: string | null;
          priority?: string | null;
          resident_id?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'nursing_notes_caregiver_id_fkey';
            columns: ['caregiver_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'nursing_notes_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      position_change_records: {
        Row: {
          caregiver_id: string | null;
          change_time: string;
          created_at: string | null;
          from_position: string | null;
          id: string;
          notes: string | null;
          resident_id: string | null;
          skin_condition: string | null;
          to_position: string | null;
        };
        Insert: {
          caregiver_id?: string | null;
          change_time: string;
          created_at?: string | null;
          from_position?: string | null;
          id?: string;
          notes?: string | null;
          resident_id?: string | null;
          skin_condition?: string | null;
          to_position?: string | null;
        };
        Update: {
          caregiver_id?: string | null;
          change_time?: string;
          created_at?: string | null;
          from_position?: string | null;
          id?: string;
          notes?: string | null;
          resident_id?: string | null;
          skin_condition?: string | null;
          to_position?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'position_change_records_caregiver_id_fkey';
            columns: ['caregiver_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'position_change_records_resident_id_fkey';
            columns: ['resident_id'];
            isOneToOne: false;
            referencedRelation: 'residents';
            referencedColumns: ['id'];
          }
        ];
      };
      residents: {
        Row: {
          age: number | null;
          birth_date: string | null;
          care_level: string | null;
          care_notes: string[] | null;
          care_requirements: string[] | null;
          created_at: string | null;
          gender: string | null;
          id: string;
          main_diagnosis: string | null;
          name: string;
          profile_image: string | null;
          room_number: string | null;
          status: string | null;
          sub_diagnosis: string[] | null;
          updated_at: string | null;
        };
        Insert: {
          age?: number | null;
          birth_date?: string | null;
          care_level?: string | null;
          care_notes?: string[] | null;
          care_requirements?: string[] | null;
          created_at?: string | null;
          gender?: string | null;
          id?: string;
          main_diagnosis?: string | null;
          name: string;
          profile_image?: string | null;
          room_number?: string | null;
          status?: string | null;
          sub_diagnosis?: string[] | null;
          updated_at?: string | null;
        };
        Update: {
          age?: number | null;
          birth_date?: string | null;
          care_level?: string | null;
          care_notes?: string[] | null;
          care_requirements?: string[] | null;
          created_at?: string | null;
          gender?: string | null;
          id?: string;
          main_diagnosis?: string | null;
          name?: string;
          profile_image?: string | null;
          room_number?: string | null;
          status?: string | null;
          sub_diagnosis?: string[] | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      staff_profiles: {
        Row: {
          created_at: string | null;
          department: string | null;
          email: string | null;
          employee_number: string | null;
          floor: number | null;
          id: string;
          join_date: string | null;
          name: string;
          phone_number: string | null;
          profile_image: string | null;
          role: string;
          status: string | null;
          unit: string | null;
          updated_at: string | null;
          user_id: string | null;
          username: string;
        };
        Insert: {
          created_at?: string | null;
          department?: string | null;
          email?: string | null;
          employee_number?: string | null;
          floor?: number | null;
          id?: string;
          join_date?: string | null;
          name: string;
          phone_number?: string | null;
          profile_image?: string | null;
          role: string;
          status?: string | null;
          unit?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          username: string;
        };
        Update: {
          created_at?: string | null;
          department?: string | null;
          email?: string | null;
          employee_number?: string | null;
          floor?: number | null;
          id?: string;
          join_date?: string | null;
          name?: string;
          phone_number?: string | null;
          profile_image?: string | null;
          role?: string;
          status?: string | null;
          unit?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      user_learning_progress: {
        Row: {
          completed: boolean | null;
          completed_at: string | null;
          completion_rate: number | null;
          created_at: string | null;
          id: string;
          last_position: number | null;
          material_id: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          completed?: boolean | null;
          completed_at?: string | null;
          completion_rate?: number | null;
          created_at?: string | null;
          id?: string;
          last_position?: number | null;
          material_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          completed?: boolean | null;
          completed_at?: string | null;
          completion_rate?: number | null;
          created_at?: string | null;
          id?: string;
          last_position?: number | null;
          material_id?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_learning_progress_material_id_fkey';
            columns: ['material_id'];
            isOneToOne: false;
            referencedRelation: 'education_materials';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_learning_progress_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      work_locations: {
        Row: {
          checked_in_at: string | null;
          checked_out_at: string | null;
          created_at: string | null;
          floor: number | null;
          id: string;
          location_lat: number | null;
          location_lng: number | null;
          resident_count: number | null;
          room_numbers: string[] | null;
          shift_end_time: string | null;
          shift_start_time: string | null;
          shift_type: string | null;
          unit: string | null;
          unit_name: string | null;
          user_id: string | null;
          work_date: string | null;
        };
        Insert: {
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string | null;
          floor?: number | null;
          id?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          resident_count?: number | null;
          room_numbers?: string[] | null;
          shift_end_time?: string | null;
          shift_start_time?: string | null;
          shift_type?: string | null;
          unit?: string | null;
          unit_name?: string | null;
          user_id?: string | null;
          work_date?: string | null;
        };
        Update: {
          checked_in_at?: string | null;
          checked_out_at?: string | null;
          created_at?: string | null;
          floor?: number | null;
          id?: string;
          location_lat?: number | null;
          location_lng?: number | null;
          resident_count?: number | null;
          room_numbers?: string[] | null;
          shift_end_time?: string | null;
          shift_start_time?: string | null;
          shift_type?: string | null;
          unit?: string | null;
          unit_name?: string | null;
          user_id?: string | null;
          work_date?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'work_locations_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'staff_profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
      DefaultSchema['Views'])
  ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
  ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
  ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
  ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
