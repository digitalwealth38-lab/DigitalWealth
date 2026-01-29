import { useCurrency } from "./CurrencyContext";

// normalize float noise → business value
const normalizeMoney = (num) => Math.floor(num * 10) / 10;

const Price = ({ amount }) => {
  const { currency, rate, loadingRate } = useCurrency();

  if (loadingRate) return "…";

  const normalized = normalizeMoney(amount);
  let displayValue;

  if (currency === "USD") {
    displayValue = normalized.toFixed(2); // 12.90
  } else {
    displayValue = Math.floor(normalized * rate).toLocaleString();
  }

  return (
    <span>
      {currency === "USD" ? "$" : "₨ "}
      {displayValue}
    </span>
  );
};

export default Price;

