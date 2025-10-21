import { type ReactNode, useState, useEffect } from "react";
import { CartContext } from "./CartContext";
import type { CourseResponse } from "../../services/course/types/course.types";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CourseResponse[]>(() => {
    // Load from localStorage (persistent cart)
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Derived count
  const cartCount = cart.length;

  // Helper — check if course is in cart
  const isInCart = (courseId: string) => cart.some((c) => c._id === courseId);

  // Add course
  const addToCart = (course: CourseResponse) => {
    if (!isInCart(course._id)) {
      const updatedCart = [...cart, course];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  // Remove course
  const removeFromCart = (courseId: string) => {
    const updatedCart = cart.filter((c) => c._id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  // Sync localStorage on changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
