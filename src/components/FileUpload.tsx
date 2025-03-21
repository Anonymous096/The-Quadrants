"use client";
import { uploadToS3 } from "@/lib/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const FileUpload = () => {
  const router = useRouter();
  const [uploading, setUploading] = React.useState(false);
  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // bigger than 10mb!
        toast.error("File too large");
        return;
      }

      try {
        setUploading(true);
        const data = await uploadToS3(file);
        console.log("meow", data);
        if (!data?.file_key || !data.file_name) {
          toast.error("Something went wrong");
          return;
        }
        mutate(data, {
          onSuccess: ({ chat_id }) => {
            toast.success("Chat created!");
            router.push(`/chat/${chat_id}`);
          },
          onError: (err) => {
            toast.error("Error creating chat");
            console.error(err);
          },
        });
      } catch (error) {
        console.log(error);
      } finally {
        setUploading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps({
          className:
            "border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800/70 transition-all duration-200",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center py-12 px-4">
          {uploading ? (
            <>
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-base font-medium text-gray-700 dark:text-gray-300 mb-1">
                Processing your document...
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please wait while we upload your file
              </p>
            </>
          ) : (
            <>
              <Inbox className="w-12 h-12 text-blue-500 mb-4" />
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
                Drop your file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                or click to browse (PDF only, max 10MB)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
