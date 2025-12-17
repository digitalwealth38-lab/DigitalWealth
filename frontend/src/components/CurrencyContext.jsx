import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [rate, setRate] = useState(1);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await axios.get(
          "https://open.er-api.com/v6/latest/USD"
        );
        setRate(res.data.rates.PKR);
      } catch (error) {
        console.error("Exchange rate fetch failed");
      }
    };

    fetchRate();
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "PKR" : "USD"));
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, rate, toggleCurrency }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
