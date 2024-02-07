export const formatNumber = (number: number) =>
  new Intl.NumberFormat("en", { minimumFractionDigits: 2 }).format(number);
