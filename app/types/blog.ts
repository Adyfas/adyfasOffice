export type BlogPost = {
  id: string;
  slug: string;
  category: string;
  title: string;
  intro: string;
  body: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
};
