"use client";

import { useState, useEffect } from "react";
import { Plus, Upload, Clock, DollarSign } from "lucide-react";
import { ethers } from "ethers";
import Layout from "../components/Layout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import {
  registerAdSpot,
  publishAd,
  getAvailableAdSpots,
} from "../utils/contractInteractions";
import { Badge } from "../components/Badge";

interface AdSpot {
  contractAddress: string;
  spotName: string;
  description: string;
  isAvailable: boolean;
}

interface Ad {
  title: string;
  description: string;
  videoUrl: string;
  adSpot: string;
  views: number;
  status: "active" | "pending" | "ended";
}

export default function AdvertiserPage() {
  const [activeTab, setActiveTab] = useState<"spots" | "ads">("spots");
  const [isRegistering, setIsRegistering] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [adSpots, setAdSpots] = useState<AdSpot[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [spotName, setSpotName] = useState("");
  const [spotDescription, setSpotDescription] = useState("");
  const [adTitle, setAdTitle] = useState("");
  const [adDescription, setAdDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSpot, setSelectedSpot] = useState("");
  const [fundAmount, setFundAmount] = useState("");
  const [spotAddress, setSpotAddress] = useState("");

  // Load ad spots
  useEffect(() => {
    const loadAdSpots = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const spots = await getAvailableAdSpots(signer);
        setAdSpots(spots);
      } catch (err) {
        console.error("Error loading ad spots:", err);
        setError("Failed to load ad spots");
      }
    };

    loadAdSpots();
  }, []);

  const handleRegisterSpot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    setError(null);

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      await registerAdSpot(signer, spotAddress, spotName, spotDescription);

      // Reset form
      setSpotName("");
      setSpotDescription("");
      setSpotAddress("");

      // Reload ad spots
      const spots = await getAvailableAdSpots(signer);
      setAdSpots(spots);
    } catch (err) {
      console.error("Error registering ad spot:", err);
      setError("Failed to register ad spot");
    } finally {
      setIsRegistering(false);
    }
  };

  const handlePublishAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    setError(null);

    if (!selectedFile || !selectedSpot) {
      setError("Please select a file and ad spot");
      setIsPublishing(false);
      return;
    }

    try {
      // Upload to Pinata first
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
      console.log("Uploaded to Pinata:", data);
      // Now publish the ad to the blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      await publishAd(
        signer,
        selectedSpot,
        adTitle,
        adDescription,
        data.cid,
        fundAmount
      );

      // Reset form
      setAdTitle("");
      setAdDescription("");
      setSelectedFile(null);
      setSelectedSpot("");
      setFundAmount("");
    } catch (err) {
      console.error("Error publishing ad:", err);
      setError("Failed to publish ad");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Advertiser Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your ad spots and campaigns
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            variant={activeTab === "spots" ? "default" : "ghost"}
            onClick={() => setActiveTab("spots")}
          >
            Ad Spots
          </Button>
          <Button
            variant={activeTab === "ads" ? "default" : "ghost"}
            onClick={() => setActiveTab("ads")}
          >
            My Ads
          </Button>
        </div>

        {/* Content */}
        {activeTab === "spots" ? (
          <div>
            {/* Register new spot form */}
            <Card variant="glass" className="mb-12 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Register New Ad Spot
              </h2>
              <form onSubmit={handleRegisterSpot} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Contract Address"
                    placeholder="Enter ad spot contract address"
                    required
                    value={spotAddress}
                    onChange={(e) => setSpotAddress(e.target.value)}
                  />
                  <Input
                    label="Name"
                    placeholder="Enter ad spot name"
                    required
                    value={spotName}
                    onChange={(e) => setSpotName(e.target.value)}
                  />
                  <Input
                    label="Description"
                    placeholder="Enter ad spot description"
                    required
                    value={spotDescription}
                    onChange={(e) => setSpotDescription(e.target.value)}
                    className="md:col-span-2"
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={isRegistering}
                  leftIcon={<Plus className="h-5 w-5" />}
                >
                  Register Ad Spot
                </Button>
              </form>
            </Card>

            {/* Ad spots list */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {adSpots.map((spot) => (
                <Card key={spot.contractAddress} variant="glass">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {spot.spotName}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {spot.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {spot.contractAddress}
                      </span>
                      <Badge
                        variant={spot.isAvailable ? "success" : "error"}
                        glow
                      >
                        {spot.isAvailable ? "Available" : "In Use"}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {/* Publish new ad form */}
            <Card variant="glass" className="mb-12 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
                Publish New Ad
              </h2>
              <form onSubmit={handlePublishAd} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Title"
                    placeholder="Enter ad title"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                  />
                  <Input
                    label="Description"
                    placeholder="Enter ad description"
                    required
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                  />
                  <Input
                    label="Fund Amount (ETH)"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    required
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                  />
                  <Select
                    label="Ad Spot"
                    value={selectedSpot}
                    onChange={(e) => setSelectedSpot(e.target.value)}
                    options={[
                      { value: "", label: "Select an ad spot" },
                      ...adSpots.map((spot) => ({
                        value: spot.contractAddress,
                        label: spot.spotName,
                      })),
                    ]}
                    required
                  />
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Video
                    </label>
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-slate-500 dark:text-slate-400" />
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedFile
                              ? selectedFile.name
                              : "Click to upload video"}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="video/*"
                          onChange={(e) =>
                            setSelectedFile(e.target.files?.[0] || null)
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  isLoading={isPublishing}
                  leftIcon={<Upload className="h-5 w-5" />}
                  disabled={
                    !selectedFile ||
                    !selectedSpot ||
                    !adTitle ||
                    !adDescription ||
                    !fundAmount
                  }
                >
                  Publish Ad
                </Button>
              </form>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}
