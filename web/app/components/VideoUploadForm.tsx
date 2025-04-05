"use client";

import { useState, useRef, useEffect } from "react";
import { useSnapAds } from "../../hooks/useSnapAds";

interface AdSpot {
  contractAddress: string;
  spotName: string;
  description: string;
}

interface VideoUploadFormProps {}

const VideoUploadForm: React.FC<VideoUploadFormProps> = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adSpots, setAdSpots] = useState<AdSpot[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<string>("");
  const [adName, setAdName] = useState<string>("");
  const [adDescription, setAdDescription] = useState<string>("");
  const [fundAmount, setFundAmount] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    isLoading: contractLoading,
    error: contractError,
    getAvailableAdSpots,
    publishAd,
  } = useSnapAds();

  useEffect(() => {
    const loadAdSpots = async () => {
      const spots = await getAvailableAdSpots();
      setAdSpots(spots);
    };
    loadAdSpots();
  }, [getAvailableAdSpots]);

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
    if (
      !selectedFile ||
      !selectedSpot ||
      !adName ||
      !adDescription ||
      !fundAmount
    ) {
      setError("Please fill in all fields");
      return;
    }

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

      // Publish ad to blockchain
      const success = await publishAd(
        adID,
        selectedSpot,
        adName,
        adDescription,
        data.ipfsCID,
        fundAmount
      );

      if (!success) {
        throw new Error("Failed to publish ad to blockchain");
      }

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setAdName("");
      setAdDescription("");
      setFundAmount("");
      setSelectedSpot("");
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
          Select Ad Spot
        </label>
        <select
          value={selectedSpot}
          onChange={(e) => setSelectedSpot(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={uploading || contractLoading}
        >
          <option value="">Select an ad spot</option>
          {adSpots.map((spot) => (
            <option key={spot.contractAddress} value={spot.contractAddress}>
              {spot.spotName} - {spot.description}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ad Name
        </label>
        <input
          type="text"
          value={adName}
          onChange={(e) => setAdName(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={uploading}
          placeholder="Enter ad name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Ad Description
        </label>
        <textarea
          value={adDescription}
          onChange={(e) => setAdDescription(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={uploading}
          placeholder="Enter ad description"
          rows={3}
        />
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Fund Amount (ETH)
        </label>
        <input
          type="number"
          value={fundAmount}
          onChange={(e) => setFundAmount(e.target.value)}
          className="w-full p-2 border rounded-md"
          disabled={uploading}
          placeholder="Enter amount in ETH"
          step="0.01"
          min="0"
        />
      </div>

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

      {(error || contractError) && (
        <div className="mb-4 text-red-500 text-sm">
          {error || contractError}
        </div>
      )}

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
        disabled={
          !selectedFile ||
          uploading ||
          contractLoading ||
          !selectedSpot ||
          !adName ||
          !adDescription ||
          !fundAmount
        }
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md
          font-semibold ${
            !selectedFile ||
            uploading ||
            contractLoading ||
            !selectedSpot ||
            !adName ||
            !adDescription ||
            !fundAmount
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
      >
        {uploading || contractLoading
          ? "Processing..."
          : "Publish Advertisement"}
      </button>
    </div>
  );
};

export default VideoUploadForm;
