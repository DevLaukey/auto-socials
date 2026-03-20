// components/posts/AIEngagementSettings.tsx

import { useState } from "react";

interface AIEngagementSettingsProps {
  onSettingsChange: (settings: any) => void;
  disabled?: boolean;
}

export default function AIEngagementSettings({
  onSettingsChange,
  disabled = false,
}: AIEngagementSettingsProps) {
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [dmsEnabled, setDmsEnabled] = useState(false);
  const [targetUsers, setTargetUsers] = useState("");

  const handleCommentsToggle = (enabled: boolean) => {
    setCommentsEnabled(enabled);
    onSettingsChange({
      ai_comments_enabled: enabled,
      ai_comments_count: 3,
      ai_comments_style: "casual",
      ai_comments_delay_minutes: 10,
    });
  };

  const handleDMsToggle = (enabled: boolean) => {
    setDmsEnabled(enabled);
    const users = targetUsers
      .split(",")
      .map((u) => u.trim())
      .filter(Boolean);
    
    onSettingsChange({
      ai_dms_enabled: enabled,
      ai_dms_target_users: users,
      ai_dms_message_style: "friendly",
      ai_dms_delay_minutes: 5,
    });
  };

  return (
    <div className="border rounded-xl p-4 space-y-4">
      <h3 className="font-semibold">AI Engagement Automation</h3>
      
      {/* Comments Section */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={commentsEnabled}
            onChange={(e) => handleCommentsToggle(e.target.checked)}
            disabled={disabled}
            className="rounded"
          />
          <span className="text-sm font-medium">Auto-generate comments</span>
        </label>
        
        {commentsEnabled && (
          <div className="ml-6 space-y-2 text-sm">
            <p className="text-muted-foreground">
              AI will generate and post engaging comments on your content
            </p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <span>Count:</span>
                <select
                  className="border rounded px-2 py-1"
                  defaultValue="3"
                  onChange={(e) => onSettingsChange({ ai_comments_count: parseInt(e.target.value) })}
                >
                  <option value="1">1</option>
                  <option value="3">3</option>
                  <option value="5">5</option>
                  <option value="10">10</option>
                </select>
              </label>
              
              <label className="flex items-center gap-2">
                <span>Style:</span>
                <select
                  className="border rounded px-2 py-1"
                  defaultValue="casual"
                  onChange={(e) => onSettingsChange({ ai_comments_style: e.target.value })}
                >
                  <option value="casual">Casual</option>
                  <option value="funny">Funny</option>
                  <option value="thoughtful">Thoughtful</option>
                  <option value="question">Question</option>
                  <option value="supportive">Supportive</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* DMs Section */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={dmsEnabled}
            onChange={(e) => handleDMsToggle(e.target.checked)}
            disabled={disabled}
            className="rounded"
          />
          <span className="text-sm font-medium">Send promotional DMs</span>
        </label>
        
        {dmsEnabled && (
          <div className="ml-6 space-y-2">
            <p className="text-sm text-muted-foreground">
              AI will send DMs to target users promoting your content
            </p>
            <input
              type="text"
              placeholder="Target usernames (comma-separated)"
              value={targetUsers}
              onChange={(e) => {
                setTargetUsers(e.target.value);
                const users = e.target.value
                  .split(",")
                  .map((u) => u.trim())
                  .filter(Boolean);
                onSettingsChange({ ai_dms_target_users: users });
              }}
              className="w-full border rounded px-3 py-2 text-sm"
              disabled={disabled}
            />
            <select
              className="w-full border rounded px-3 py-2 text-sm"
              defaultValue="friendly"
              onChange={(e) => onSettingsChange({ ai_dms_message_style: e.target.value })}
              disabled={disabled}
            >
              <option value="friendly">Friendly</option>
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="helpful">Helpful</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}