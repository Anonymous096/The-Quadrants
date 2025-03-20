"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import FileUpload from "@/components/FileUpload";

export default function ExamPage() {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useUser();

  console.log("Clerk User ID:", user?.id);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const newMessages = [
      ...messages,
      { role: "user" as const, content: input },
    ];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          documentUrl: pdfUrl,
        }),
      });

      const data = await response.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex h-screen bg-gray-100">
        {/* Left side - PDF Upload and Preview */}
        <FileUpload />

        {/* Right side - Chat Interface */}
        <div className="w-1/3 p-4 bg-white rounded-lg shadow-lg m-4 flex flex-col">
          <div className="flex-1 overflow-auto mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-blue-100 ml-auto"
                    : "bg-gray-100"
                } max-w-[80%] ${
                  message.role === "user" ? "ml-auto" : "mr-auto"
                }`}
              >
                {message.content}
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about the document..."
              className="flex-1 p-2 border rounded"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
