// Payment Status Constants
export const PAYMENT_STATUS = {
  PENDING: 1,
  PROCESSING: 2,
  COMPLETED: 3,
  FAILED: 4,
  REFUNDED: 5,
  PARTIALLY_REFUNDED: 6,
};

interface PaymentCourse {
  title: string;
  price: number;
}

export interface Payment {
  _id: string;
  status: number;
  gateway: string;
  taxes: number;
  discountAmount: number;
  amount: number;
  updatedAt: number;
  courses: PaymentCourse[];
}
