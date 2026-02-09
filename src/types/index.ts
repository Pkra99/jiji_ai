// User profile from Supabase
export interface Profile {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
}

// Learning resource (PPT or Video)
export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'ppt' | 'video';
  storage_path: string;
  public_url: string;
  tags: string[];
  created_at: string;
}

// Query record stored in database
export interface QueryRecord {
  id: string;
  user_id: string;
  query_text: string;
  response_text: string;
  created_at: string;
}

// API Request for /ask-jiji
export interface AskJijiRequest {
  query: string;
  userId?: string;
}

// Resource in API response
export interface ResourceResponse {
  id: string;
  title: string;
  type: 'ppt' | 'video';
  url: string;
}

// API Response for /ask-jiji
export interface AskJijiResponse {
  success: boolean;
  data?: {
    answer: string;
    resources: ResourceResponse[];
    queryId: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Health check response
export interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;
}
