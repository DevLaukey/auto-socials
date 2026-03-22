"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AIEngagementSettingsProps {
  settings?: {
    ai_comments_enabled: boolean;
    ai_comments_count: number;
    ai_comments_style: string;
    ai_comments_delay_minutes: number;
    ai_comments_spread: boolean;
    ai_dms_enabled: boolean;
    ai_dms_target_users: string[];
    ai_dms_message_style: string;
    ai_dms_delay_minutes: number;
  };
  onSettingsChange?: (settings: any) => void;
  onTargetUsersChange?: (users: string) => void;
  disabled?: boolean;
}

export default function AIEngagementSettings({
  settings = {
    ai_comments_enabled: false,
    ai_comments_count: 3,
    ai_comments_style: "casual",
    ai_comments_delay_minutes: 10,
    ai_comments_spread: true,
    ai_dms_enabled: false,
    ai_dms_target_users: [],
    ai_dms_message_style: "friendly",
    ai_dms_delay_minutes: 5,
  },
  onSettingsChange = () => {},
  onTargetUsersChange = () => {},
  disabled = false,
}: AIEngagementSettingsProps) {
  const [targetUsersInput, setTargetUsersInput] = useState(
    settings.ai_dms_target_users.join(", "),
  );

  const handleCommentsToggle = (enabled: boolean) => {
    onSettingsChange({ ai_comments_enabled: enabled });
  };

  const handleDMsToggle = (enabled: boolean) => {
    onSettingsChange({ ai_dms_enabled: enabled });
  };

  const handleTargetUsersChange = (value: string) => {
    setTargetUsersInput(value);
    onTargetUsersChange(value);
  };

  const handleSettingChange = (key: string, value: any) => {
    onSettingsChange({ [key]: value });
  };

  return (
    <div className="border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold text-lg">AI Engagement Automation</h3>
      <p className="text-sm text-muted-foreground">
        Let AI help you engage with your audience automatically
      </p>

      {/* Comments Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="font-medium">Auto-generate Comments</Label>
            <p className="text-xs text-muted-foreground">
              AI will post engaging comments on your content
            </p>
          </div>
          <Switch
            checked={settings.ai_comments_enabled}
            onCheckedChange={handleCommentsToggle}
            disabled={disabled}
          />
        </div>

        {settings.ai_comments_enabled && (
          <div className="ml-6 space-y-3 border-l-2 pl-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Number of Comments</Label>
                <Select
                  value={settings.ai_comments_count.toString()}
                  onValueChange={(v) =>
                    handleSettingChange("ai_comments_count", parseInt(v))
                  }
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 comment</SelectItem>
                    <SelectItem value="3">3 comments</SelectItem>
                    <SelectItem value="5">5 comments</SelectItem>
                    <SelectItem value="10">10 comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Comment Style</Label>
                <Select
                  value={settings.ai_comments_style}
                  onValueChange={(v) =>
                    handleSettingChange("ai_comments_style", v)
                  }
                  disabled={disabled}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="thoughtful">Thoughtful</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="supportive">Supportive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs">Delay (minutes)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={settings.ai_comments_delay_minutes}
                onChange={(e) =>
                  handleSettingChange(
                    "ai_comments_delay_minutes",
                    parseInt(e.target.value),
                  )
                }
                disabled={disabled}
                className="h-8 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How long to wait after posting before adding comments
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={settings.ai_comments_spread}
                onCheckedChange={(v) =>
                  handleSettingChange("ai_comments_spread", v)
                }
                disabled={disabled}
                id="spread-comments"
              />
              <Label
                htmlFor="spread-comments"
                className="text-xs cursor-pointer"
              >
                Spread comments over time
              </Label>
            </div>
          </div>
        )}
      </div>

      {/* DMs Section */}
      <div className="space-y-3 pt-2 border-t">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="font-medium">Send Promotional DMs</Label>
            <p className="text-xs text-muted-foreground">
              AI will send personalized DMs to target users
            </p>
          </div>
          <Switch
            checked={settings.ai_dms_enabled}
            onCheckedChange={handleDMsToggle}
            disabled={disabled}
          />
        </div>

        {settings.ai_dms_enabled && (
          <div className="ml-6 space-y-3 border-l-2 pl-4">
            <div>
              <Label className="text-xs">Target Users (usernames)</Label>
              <Textarea
                placeholder="username1, username2, username3"
                value={targetUsersInput}
                onChange={(e) => handleTargetUsersChange(e.target.value)}
                disabled={disabled}
                className="h-20 text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Separate multiple usernames with commas
              </p>
            </div>

            <div>
              <Label className="text-xs">DM Tone</Label>
              <Select
                value={settings.ai_dms_message_style}
                onValueChange={(v) =>
                  handleSettingChange("ai_dms_message_style", v)
                }
                disabled={disabled}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="helpful">Helpful</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Delay (minutes)</Label>
              <Input
                type="number"
                min="1"
                max="60"
                value={settings.ai_dms_delay_minutes}
                onChange={(e) =>
                  handleSettingChange(
                    "ai_dms_delay_minutes",
                    parseInt(e.target.value),
                  )
                }
                disabled={disabled}
                className="h-8 text-sm"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
