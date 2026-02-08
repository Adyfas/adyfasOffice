import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BlogPost } from "~/types/blog";
import { blogPosts as initialPosts } from "~/data/blogPosts";

export const useBlogPosts = create<{
  posts: BlogPost[];
  setPosts: (posts: BlogPost[]) => void;
  addPost: (post: BlogPost) => void;
  updatePost: (id: string, post: Partial<BlogPost>) => void;
  deletePost: (id: string) => void;
  getPostBySlug: (slug: string) => BlogPost | undefined;
  getPostById: (id: string) => BlogPost | undefined;
}>()(
  persist(
    (set, get) => ({
      posts: initialPosts,
      setPosts: (posts) => set({ posts }),
      addPost: (post) =>
        set((state) => ({ posts: [...state.posts, post] })),
      updatePost: (id, updates) =>
        set((state) => ({
          posts: state.posts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((p) => p.id !== id),
        })),
      getPostBySlug: (slug) =>
        get().posts.find((p) => p.slug === slug),
      getPostById: (id) => get().posts.find((p) => p.id === id),
    }),
    { name: "blog-posts" }
  )
);
