"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "../ui/button";
import { useState } from "react";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import {
  ImageIcon,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Bold,
  Italic,
} from "lucide-react";

interface PostEditorProps {
  onSubmit: (title: string, content: any) => Promise<void>;
}

export function PostEditor({ onSubmit }: PostEditorProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "prose prose-lg focus:outline-none max-w-full min-h-[200px] px-4 py-2",
      },
    },
  });

  const handleSubmit = async () => {
    if (!editor || !title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(title, editor.getJSON());
      editor.commands.clearContent();
      setTitle("");
    } catch (error) {
      console.error("Failed to submit post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6">
        <Input
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold mb-4 border-none focus:outline-none"
        />

        <div className="border rounded-lg mb-4">
          <div className="flex items-center gap-2 p-2 border-b">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 1 }).run()
              }
            >
              <Heading1 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level: 2 }).run()
              }
            >
              <Heading2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>
          </div>

          <EditorContent editor={editor} />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || isSubmitting}
            className="px-6"
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
