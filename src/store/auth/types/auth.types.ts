export type User = {
  _id: string;
  firstName?: string | null;
  lastName?: string | null;
  phoneCode?: string | null;
  phone?: string | null;
  email: string | null;
  role: string | null;
  profileImg: {
    public_id: string | null;
    url: string | null;
  };
  has2FA: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: number | null;
  authProvider: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  fullName: string | null;
  mobile?: string | null;
};

export type UserResponse = {
  _id: string;
  firstName: string | null;
  lastName: string | null;
  phoneCode: string | null;
  phone: string | null;
  email: string | null;
  role: string | null;
  profileImg: {
    public_id: string | null;
    url: string | null;
  };
  has2FA: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  status: number | null;
  authProvider: string | null;
  createdAt: number | null;
  updatedAt: number | null;
  fullName: string | null;
  mobile?: string | null;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  phoneCode: string;
  phone: string;
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  message?: string;
  token: string;
  response: UserResponse;
};

export type ResetLinkResponse = {
  success: boolean;
  message?: string;
};

export type OAuth2Response = {
  success: boolean;
  response: UserResponse;
};

export type AuthLogoutResponse = {
  success: boolean;
  message?: string;
};

export type AuthSuccessResponse = {
  user: UserResponse;
  token: string;
};

export type GoogleAuthRedirect = {
  authUrl: string;
};

export type UserUpdateResponse = {
  success: boolean;
  message: string;
  response: UserResponse;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SocialProvider = "google" | "facebook";

export type SocialLoginPayload = {
  provider: SocialProvider;
  idToken?: string; // e.g., Google ID token (if applicable)
  accessToken?: string; // e.g., FB access token (if applicable)
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

// export type AuthResponse = {
//   user: User;
//   tokens: AuthTokens;
// };

export type AuthCheckResponse = {
  success: boolean;
  userId: string;
};

export type AuthState = {
  user: User | null;
  //   tokens: AuthTokens | null;
  // refreshToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  // Access Error in Component for showing Error Messages
  error: string | null;
  //   hydrated: boolean; // true after reading from storage once
  // currentPurchaseEnrollmentId?: string | null;
};
