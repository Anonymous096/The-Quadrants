"use client";

import { useState } from "react";
import { PostEditor } from "@/components/post/PostEditor";
import { PostCard } from "@/components/post/PostCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function PostsPage() {
  const [showEditor, setShowEditor] = useState(false);
  const [posts, setPosts] = useState<any[]>([]); // Replace with proper type

  const handleCreatePost = async (title: string, content: any) => {
    try {
      // TODO: Implement API call to create post
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      setPosts([newPost, ...posts]);
      setShowEditor(false);
    } catch (error) {
      console.error("Error creating post:", error);
      // TODO: Show error toast
    }
  };

  const handleLike = async (postId: number) => {
    try {
      // TODO: Implement API call to like/unlike post
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to like post");
      }

      // Update posts state to reflect the new like count
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isLiked: !post.isLiked,
              _count: {
                ...post._count,
                likes: post.isLiked
                  ? post._count.likes - 1
                  : post._count.likes + 1,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error liking post:", error);
      // TODO: Show error toast
    }
  };

  const handleComment = async (postId: number, content: string) => {
    try {
      // TODO: Implement API call to create comment
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }

      // Update posts state to reflect the new comment count
      setPosts(
        posts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                comments: post._count.comments + 1,
              },
            };
          }
          return post;
        })
      );
    } catch (error) {
      console.error("Error creating comment:", error);
      // TODO: Show error toast
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts</h1>
        <Button
          onClick={() => setShowEditor(!showEditor)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-5 w-5" />
          Create Post
        </Button>
      </div>

      {showEditor && (
        <div className="mb-8">
          <PostEditor onSubmit={handleCreatePost} />
        </div>
      )}

      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
}
