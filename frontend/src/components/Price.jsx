import { useCurrency } from "./CurrencyContext";

const Price = ({ amount }) => {
  const { currency, rate, loadingRate } = useCurrency();

  if (loadingRate) return "…";

  let displayValue;

  if (currency === "USD") {
    displayValue = amount.toFixed(4); // ✅ 2 decimals for USD
  } else {
    displayValue = Math.round(amount * rate).toLocaleString(); // ✅ no decimals for PKR
  }

  return (
    <span>
      {currency === "USD" ? "$" : "₨ "}
      {displayValue}
    </span>
  );
};

export default Price;
