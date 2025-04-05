"use client";

import { useState } from "react";
import { Plus, Upload, Loader2, DollarSign, Clock } from "lucide-react";
import Layout from "../components/Layout";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import { Badge } from "../components/Badge";

interface AdSpot {
  address: string;
  name: string;
  description: string;
  isAvailable: boolean;
  price: string;
  duration: string;
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

  // Mock data - replace with actual contract data
  const myAdSpots: AdSpot[] = [
    {
      address: "0x123...",
      name: "Premium Homepage Banner",
      description: "High-visibility spot on the homepage",
      isAvailable: true,
      price: "0.1 ETH",
      duration: "30 days",
    },
  ];

  const myAds: Ad[] = [
    {
      title: "New DeFi Protocol Launch",
      description: "Experience the future of decentralized finance",
      videoUrl: "ipfs://...",
      adSpot: "0x123...",
      views: 1234,
      status: "active",
    },
  ];

  const handleRegisterSpot = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsRegistering(true);
    // Add contract interaction logic here
    setTimeout(() => setIsRegistering(false), 2000);
  };

  const handlePublishAd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPublishing(true);
    // Add contract interaction logic here
    setTimeout(() => setIsPublishing(false), 2000);
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
                    label="Name"
                    placeholder="Enter ad spot name"
                    required
                  />
                  <Input
                    label="Description"
                    placeholder="Enter ad spot description"
                    required
                  />
                  <Input
                    label="Price (ETH)"
                    type="number"
                    step="0.001"
                    placeholder="0.1"
                    required
                    leftIcon={<DollarSign className="h-5 w-5" />}
                  />
                  <Input
                    label="Duration (Days)"
                    type="number"
                    placeholder="30"
                    required
                    leftIcon={<Clock className="h-5 w-5" />}
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
              {myAdSpots.map((spot) => (
                <Card key={spot.address} variant="glass">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {spot.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {spot.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {spot.price}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {spot.duration}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {spot.address}
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
                  <Input label="Title" placeholder="Enter ad title" required />
                  <Input
                    label="Description"
                    placeholder="Enter ad description"
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
                            Click to upload video
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="video/*"
                        />
                      </label>
                    </div>
                  </div>
                  <Select
                    label="Ad Spot"
                    options={[
                      { value: "", label: "Select an ad spot" },
                      ...myAdSpots.map((spot) => ({
                        value: spot.address,
                        label: spot.name,
                      })),
                    ]}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  isLoading={isPublishing}
                  leftIcon={<Upload className="h-5 w-5" />}
                >
                  Publish Ad
                </Button>
              </form>
            </Card>

            {/* Ads list */}
            <div className="grid gap-6 md:grid-cols-2">
              {myAds.map((ad) => (
                <Card key={ad.title} variant="glass">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      {ad.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      {ad.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {ad.views} views
                        </span>
                        <Badge
                          variant={
                            ad.status === "active"
                              ? "success"
                              : ad.status === "pending"
                              ? "warning"
                              : "error"
                          }
                          glow
                        >
                          {ad.status.charAt(0).toUpperCase() +
                            ad.status.slice(1)}
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                        {ad.adSpot}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
