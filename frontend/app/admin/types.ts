export interface News {
  id: string;
  title: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAccount {
  id: string;
  email: string;
}