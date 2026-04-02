export type FormErrors = Record<string, string>;

export type RegisterSelection = {
  sport: string;
  level: string;
};

export type RegisterCredentialsInput = {
  username: string;
  email: string;
  password: string;
  sport: string;
  level: string;
};
