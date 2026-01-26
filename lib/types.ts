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

export type ViewState =
  | "CONNECTED"
  | "ACCOUNT_DETAILS"
  | "SELECT_PLATFORM"
  | "ADD_ACCOUNT";

export type AccountsView =
  | "CONNECTED"
  | "SELECT_PLATFORM"
  | "ADD_ACCOUNT"
  | "GROUPS";

export type PostsView = "LIST" | "CREATE";
