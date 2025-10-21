import type {
  AuthResponse,
  UserResponse,
} from "../../store/auth/types/auth.types";

export function mapAuthResponse(user: AuthResponse): UserResponse {
  const userData = user.response;

  return {
    _id: userData._id,
    firstName: userData.firstName || null,
    lastName: userData.lastName || null,
    phoneCode: userData.phoneCode || null,
    phone: userData.phone || null,
    email: userData.email || null,
    role: userData.role,
    profileImg: {
      public_id: userData.profileImg?.public_id || null,
      url: userData.profileImg?.url || null,
    },
    has2FA: userData.has2FA ?? false, // safer default than `|| true`
    isEmailVerified: userData.isEmailVerified ?? false,
    isPhoneVerified: userData.isPhoneVerified ?? false,
    status: userData.status,
    authProvider: userData.authProvider,
    createdAt: userData.createdAt,
    updatedAt: userData.updatedAt,
    fullName: userData.fullName || null,
    mobile: userData.mobile || null,
  };
}
