import { useCurrency } from "./CurrencyContext";

const Price = ({ amount }) => {
  const { currency, rate, loadingRate } = useCurrency();

  if (loadingRate) return "…";

  let displayValue;

  if (currency === "USD") {
    displayValue = amount.toFixed(3); // 3 decimal places for USD
  } else {
    // For PKR: round to nearest integer, add commas, no decimals
    displayValue = Math.round(amount * rate).toLocaleString('en-PK', {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    });
  }

  return (
    <span>
      {currency === "USD" ? "$" : "₨ "}
      {displayValue}
    </span>
  );
};

export default Price;
