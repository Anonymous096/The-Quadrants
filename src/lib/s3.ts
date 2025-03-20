import { PutObjectCommandOutput, S3 } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  return new Promise((resolve, reject) => {
    try {
      const s3 = new S3({
        region: "eu-north-1",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
          secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
        },
      });

      const file_key =
        "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

      // Convert File to Buffer
      const fileBuffer = new Promise<Buffer>((resolveBuffer, rejectBuffer) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
            resolveBuffer(Buffer.from(reader.result));
          } else {
            rejectBuffer(new Error("Failed to read file"));
          }
        };
        reader.onerror = (error) => rejectBuffer(error);
        reader.readAsArrayBuffer(file);
      });

      fileBuffer.then((buffer) => {
        const params = {
          Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
          Key: file_key,
          Body: buffer,
          ContentDisposition: "inline",
          ContentType: file.type || "application/octet-stream",
        };

        return s3.putObject(params);
      })
      .then((data: PutObjectCommandOutput) => {
        console.log("Successfully uploaded file to S3:", file_key);
        resolve({
          file_key,
          file_name: file.name,
        });
      })
      .catch((error) => {
        console.error("Error uploading to S3:", error);
        reject(error);
      });
    } catch (error) {
      console.error("Error in uploadToS3:", error);
      reject(error);
    }
  });
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.eu-north-1.amazonaws.com/${file_key}`;
  return url;
}