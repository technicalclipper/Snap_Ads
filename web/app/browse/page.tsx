import React from "react";
import AvailableAds from "../components/AvailableAds";

export default function BrowsePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Browse Advertisements</h1>
      <AvailableAds />
    </div>
  );
}
