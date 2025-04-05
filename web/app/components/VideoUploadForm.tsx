"use client";

import { useState, useRef } from "react";

interface VideoUploadFormProps {}

const VideoUploadForm: React.FC<VideoUploadFormProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setError("File size should be less than 100MB");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onload = () => {
          const base64String = reader.result as string;
          resolve(base64String.split(",")[1]); // Remove data URL prefix
        };
        reader.onerror = reject;
      });

      // Generate a unique ID for the ad
      const adID = `ad_${Date.now()}`;

      // Upload to Pinata
      const response = await fetch("/api/uploadToPinata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          videoBuffer: base64,
          adID,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      const data = await response.json();
      console.log("Upload successful:", data);

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Failed to upload video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Upload Video
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          disabled={uploading}
        />
      </div>

      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      {previewUrl && (
        <div className="mb-6">
          <h3 className="text-gray-700 text-sm font-bold mb-2">Preview</h3>
          <video
            src={previewUrl}
            controls
            className="w-full rounded"
            style={{ maxHeight: "400px" }}
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md
          font-semibold ${
            !selectedFile || uploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
      >
        {uploading ? "Uploading..." : "Upload to Pinata"}
      </button>
    </div>
  );
};

export default VideoUploadForm;
