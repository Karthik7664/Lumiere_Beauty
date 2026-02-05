// Currency formatting utility for Indian market
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceCompact = (price: number): string => {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  }
  if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  }
  return formatPrice(price);
};
