export type SocialAccount = {
  id: string;
  platform: "YouTube" | "Instagram" | "Twitter/X";
  username: string;
};

export type AccountGroup = {
  id: string;
  name: string;
  accounts: SocialAccount[];
};
