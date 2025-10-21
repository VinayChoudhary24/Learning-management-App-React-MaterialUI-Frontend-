export type EnrollmentResponse = {
  _id: string;
  userId: string;
  _createdAtDate: Date | string;
  userDetails: {
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    phone: string | null;
    phoneCode: string | null;
  };
  totalAmount: number | null;
  taxes: number | null;
  subTotalAmount: number | null;
  refundedAmount: number | null;
  paymentId: string | null;
  id?: string | null;
  enrollmentStatus: number | null;
  enrollmentType: number | null;
  enrollmentDetails: string[] | [];
  discountAmount: number | null;
  cancellation: {
    cancellationFee: number | null;
    cancelledAt: number | null;
    cancelledBy: number | null;
    reason: string | null;
    refundAmount: number | null;
    refundEligible: boolean;
  };
  createdAt: number | null;
  updatedAt: number | null;
};

export type EnrollmentDataResponse = {
  success: boolean;
  message: string;
  response?: EnrollmentResponse;
};

export type EnrollmentsDataResponse = {
  success: boolean;
  message: string;
  response?: EnrollmentResponse[];
};
