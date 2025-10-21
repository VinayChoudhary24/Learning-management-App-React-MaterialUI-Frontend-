import { createContext, useContext } from "react";
import type { CourseResponse } from "../../services/course/types/course.types";

interface CartContextType {
  cart: CourseResponse[];
  cartCount: number;
  addToCart: (course: CourseResponse) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
}

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext must be used within CartProvider");
  }
  return context;
};
