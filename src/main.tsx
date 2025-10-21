// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeContextProvider } from "./context/theme/ThemeProvider.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { CartProvider } from "../src/context/cart/CartProvider.tsx";
import { LastPurchaseProvider } from "./context/lastPurchase/LastPurchaseProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // GLOBAL REDUX STATE
  <Provider store={store}>
    {/* <StrictMode> */}
    <ThemeContextProvider>
      <CartProvider>
        <LastPurchaseProvider>
          <App />
        </LastPurchaseProvider>
      </CartProvider>
    </ThemeContextProvider>
    {/* </StrictMode> */}
  </Provider>
);
