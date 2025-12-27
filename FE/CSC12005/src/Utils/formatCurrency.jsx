export function formatCurrencyVND(amount) {
  if (isNaN(amount)) return "0 ₫";
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
}