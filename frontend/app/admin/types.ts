export interface News {
  id: string;
  title: string;
  content: string;
  image_url?: string; // Optional because some news might not have images
  published: boolean;
  created_at: string;
  updated_at?: string;
}

export interface AdminAccount {
  id: string;
  email: string;
}

export interface UserAccount {
  id: string;
  name: string | null;
  surname: string | null;
  email: string;
  logo: string | null;
  created_at: string;
}
