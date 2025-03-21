"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Input } from "../ui/input";

interface Comment {
  id: number;
  content: string;
  userId: string;
  createdAt: string;
  user: {
    name: string;
    image?: string;
  };
}

interface PostCardProps {
  post: {
    id: number;
    title: string;
    content: any;
    userId: string;
    createdAt: Date;
    user: {
      name: string;
      image?: string;
    };
    _count: {
      likes: number;
      comments: number;
    };
    isLiked?: boolean;
    comments: Comment[];
  };
  onLike: (postId: number) => Promise<void>;
  onComment: (postId: number, content: string) => Promise<void>;
}

export function PostCard({ post, onLike, onComment }: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    setIsLiking(true);
    try {
      await onLike(post.id);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;

    setIsCommenting(true);
    try {
      await onComment(post.id, comment);
      setComment("");
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={post.user?.image || undefined} />
          <AvatarFallback>{post.user?.name?.[0] || "?"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{post.user?.name || "Unknown User"}</h3>
          <p className="text-sm text-gray-500">
            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
          </p>
        </div>
      </CardHeader>

      <CardContent>
        <h2 className="text-xl font-bold mb-2">{post.title}</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center gap-6 w-full">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLike}
            disabled={isLiking}
          >
            <Heart
              className={`h-5 w-5 ${
                post.isLiked ? "fill-red-500 text-red-500" : ""
              }`}
            />
            <span>{post._count.likes}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-5 w-5" />
            <span>{post._count.comments}</span>
          </Button>

          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="w-full space-y-4">
            <div className="flex items-center gap-2 w-full">
              <Input
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleComment}
                disabled={!comment.trim() || isCommenting}
                size="sm"
              >
                {isCommenting ? "Posting..." : "Post"}
              </Button>
            </div>

            {/* Comments list */}
            <div className="space-y-3">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 p-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user?.image || undefined} />
                    <AvatarFallback>
                      {comment.user?.name?.[0] || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.user?.name || "Unknown User"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
