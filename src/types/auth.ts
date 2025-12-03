export type LoginState = {
  message?: string;
  errors?: {
    username?: string[];
    password?: string[];
  };
  success?: boolean;
};
