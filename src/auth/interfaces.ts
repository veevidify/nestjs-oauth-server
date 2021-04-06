export type JwtAuthenticatable = {
  username: string;
  roles: string[];
  sub: string;
};
