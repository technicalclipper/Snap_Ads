import React from "react";
import VideoUploadForm from "../components/VideoUploadForm";

const PublishAdPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Publish Advertisement</h1>
      <VideoUploadForm />
    </div>
  );
};

export default PublishAdPage;
