"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Wand2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const generateImage = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(`${data.imageUrl}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col" style={{
      backgroundImage: "linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%)"
    }}>
      <div className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="h-8 w-8 text-purple-600" />
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Vision AI
              </h1>
            </div>
            <p className="text-gray-700 max-w-2xl mx-auto text-lg">
              Transform your imagination into stunning visuals. Simply describe what you want to see, and watch as AI brings your vision to life.
            </p>
          </div>

          <Card className="p-8 bg-white/80 backdrop-blur-sm border-none shadow-xl">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Describe the image you want to create..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-grow bg-white/50 border-purple-200 focus:border-purple-400"
                />
                <Button
                  onClick={generateImage}
                  disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 transition-opacity"
                >
                  {loading ? (
                    "Generating..."
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>

              {loading && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-purple-700 mt-4 font-medium">Creating your masterpiece...</p>
                </div>
              )}

              {image && !loading && (
                <div className="mt-8">
                  <div className="rounded-xl overflow-hidden shadow-2xl">
                    <img
                      src={image}
                      alt="Generated image"
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    Click the image to view in full size
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
      
      <footer className="py-4 text-center bg-white/10 backdrop-blur-sm">
        <p className="text-gray-700 font-medium">
          All rights reserved by Vijay Dabhi
        </p>
      </footer>
    </main>
  );
}