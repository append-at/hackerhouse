export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      ai_conversation: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          last_message_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          data?: Json;
          id?: string;
          last_message_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          last_message_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_conversation_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      ai_intimacy: {
        Row: {
          at: string;
          delta: number;
          id: string;
          reason: string;
          user_id: string;
        };
        Insert: {
          at?: string;
          delta: number;
          id?: string;
          reason: string;
          user_id: string;
        };
        Update: {
          at?: string;
          delta?: number;
          id?: string;
          reason?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'ai_intimacy_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      consideration: {
        Row: {
          consideration: string;
          created_at: string;
          embedding: string;
          id: string;
          user_id: string;
        };
        Insert: {
          consideration: string;
          created_at?: string;
          embedding: string;
          id?: string;
          user_id: string;
        };
        Update: {
          consideration?: string;
          created_at?: string;
          embedding?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'consideration_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      insight: {
        Row: {
          created_at: string;
          embedding: string;
          id: string;
          quote: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          embedding: string;
          id?: string;
          quote: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          embedding?: string;
          id?: string;
          quote?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'insight_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      push_subscription: {
        Row: {
          created_at: string;
          id: string;
          subscription: Json;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          subscription: Json;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          subscription?: Json;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'push_subscription_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      user: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          id: string;
          name: string;
          topics: string[] | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id: string;
          name: string;
          topics?: string[] | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          id?: string;
          name?: string;
          topics?: string[] | null;
          username?: string;
        };
        Relationships: [];
      };
      user_conversation: {
        Row: {
          created_at: string;
          id: string;
          last_message_at: string;
          other_user_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          last_message_at?: string;
          other_user_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          last_message_at?: string;
          other_user_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'user_conversation_other_user_id_fkey';
            columns: ['other_user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_conversation_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
      user_message: {
        Row: {
          at: string;
          conversation_id: string;
          id: string;
          message: string;
          user_id: string | null;
        };
        Insert: {
          at?: string;
          conversation_id: string;
          id?: string;
          message: string;
          user_id?: string | null;
        };
        Update: {
          at?: string;
          conversation_id?: string;
          id?: string;
          message?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'user_message_conversation_id_fkey';
            columns: ['conversation_id'];
            isOneToOne: false;
            referencedRelation: 'user_conversation';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'user_message_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'user';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize:
        | {
            Args: {
              '': string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      halfvec_avg: {
        Args: {
          '': number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      l2_norm:
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          };
      l2_normalize:
        | {
            Args: {
              '': string;
            };
            Returns: string;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: unknown;
          };
      search_insights: {
        Args: {
          query_embedding: string;
          match_threshold: number;
          match_count: number;
        };
        Returns: {
          id: string;
          quote: string;
          user_id: string;
          username: string;
          avatar_url: string;
          bio: string;
          similarity: number;
        }[];
      };
      send_push_for_daily_question: {
        Args: {
          to_topics: string[];
          message: string;
        };
        Returns: {
          user_id: string;
          username: string;
          subscription: Json;
        }[];
      };
      sparsevec_out: {
        Args: {
          '': unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          '': unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          '': number[];
        };
        Returns: string;
      };
      vector_dims:
        | {
            Args: {
              '': string;
            };
            Returns: number;
          }
        | {
            Args: {
              '': unknown;
            };
            Returns: number;
          };
      vector_norm: {
        Args: {
          '': string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          '': string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          '': string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          '': unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;
