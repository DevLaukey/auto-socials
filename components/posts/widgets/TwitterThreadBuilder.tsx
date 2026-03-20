"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";

interface TwitterThreadBuilderProps {
  onThreadChange: (thread: { enabled: boolean; tweets: string[] }) => void;
  initialTweets?: string[];
  disabled?: boolean;
}

export default function TwitterThreadBuilder({
  onThreadChange,
  initialTweets = [],
  disabled = false,
}: TwitterThreadBuilderProps) {
  const [enabled, setEnabled] = useState(false);
  const [tweets, setTweets] = useState<string[]>(
    initialTweets.length > 0 ? initialTweets : [""],
  );

  useEffect(() => {
    onThreadChange({ enabled, tweets: tweets.filter((t) => t.trim()) });
  }, [enabled, tweets, onThreadChange]);

  const handleToggle = () => {
    setEnabled(!enabled);
    if (!enabled) {
      // When enabling, make sure we have at least one tweet
      if (tweets.length === 0 || (tweets.length === 1 && !tweets[0].trim())) {
        setTweets([""]);
      }
    }
  };

  const updateTweet = (index: number, value: string) => {
    const newTweets = [...tweets];
    newTweets[index] = value;
    setTweets(newTweets);
  };

  const addTweet = () => {
    setTweets([...tweets, ""]);
  };

  const removeTweet = (index: number) => {
    if (tweets.length > 1) {
      const newTweets = tweets.filter((_, i) => i !== index);
      setTweets(newTweets);
    }
  };

  const moveTweetUp = (index: number) => {
    if (index > 0) {
      const newTweets = [...tweets];
      [newTweets[index - 1], newTweets[index]] = [
        newTweets[index],
        newTweets[index - 1],
      ];
      setTweets(newTweets);
    }
  };

  const moveTweetDown = (index: number) => {
    if (index < tweets.length - 1) {
      const newTweets = [...tweets];
      [newTweets[index], newTweets[index + 1]] = [
        newTweets[index + 1],
        newTweets[index],
      ];
      setTweets(newTweets);
    }
  };

  if (!enabled) {
    return (
      <div className="border rounded-lg p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="font-medium">Twitter Thread</h4>
            <span className="text-xs text-muted-foreground">
              Post a thread of multiple tweets
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleToggle}
            disabled={disabled}
          >
            Enable Thread
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Create a thread to post multiple tweets in sequence. Each tweet will
          be a reply to the previous one.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Twitter Thread</h4>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            {tweets.filter((t) => t.trim()).length} tweet
            {tweets.filter((t) => t.trim()).length !== 1 ? "s" : ""}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleToggle}
          disabled={disabled}
        >
          Disable Thread
        </Button>
      </div>

      <div className="space-y-3">
        {tweets.map((tweet, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Tweet {index + 1}
                </span>
                <span className="text-xs text-muted-foreground">
                  {tweet.length}/280
                </span>
                {tweet.length > 280 && (
                  <span className="text-xs text-red-500">Exceeds limit</span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {tweets.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveTweetUp(index)}
                      disabled={disabled || index === 0}
                    >
                      <ChevronUp className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => moveTweetDown(index)}
                      disabled={disabled || index === tweets.length - 1}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-700"
                      onClick={() => removeTweet(index)}
                      disabled={disabled}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <Textarea
              placeholder={`Tweet ${index + 1} content...`}
              value={tweet}
              onChange={(e) => updateTweet(index, e.target.value)}
              className={`min-h-[80px] resize-y ${tweet.length > 280 ? "border-red-500 focus:border-red-500" : ""}`}
              disabled={disabled}
              maxLength={300}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addTweet}
        disabled={disabled}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another Tweet
      </Button>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>💡 Tips for threads:</p>
        <ul className="list-disc list-inside space-y-0.5 ml-2">
          <li>First tweet should hook readers to continue</li>
          <li>Each tweet should flow naturally to the next</li>
          <li>Keep tweets concise (under 280 characters)</li>
          <li>Add a clear conclusion or call-to-action in the final tweet</li>
        </ul>
      </div>
    </div>
  );
}
