import { PRICES } from "../constants";

export const calculateQuote = (selectedAreas, quantities, carpets, appliances) => {
  let total = 0;

  // 1️⃣ Normal areas (no size)
  selectedAreas
    .filter(area => !["Kitchen", "Bedroom"].includes(area))
    .forEach(area => {
      const qty = quantities[area] ?? 1;
      const price = PRICES[area] ?? 0;
      total += price * qty;
    });

  // 2️⃣ Sized areas (Kitchen + Bedroom)
  ["Kitchen", "Bedroom"].forEach(area => {
    if (!selectedAreas.includes(area)) return;

    const sizes = ["Small", "Medium", "Large"];
    sizes.forEach(size => {
      const key = `${area}_${size}`;
      const qty = quantities[key] ?? 0;
      const price = PRICES[key] ?? 0;
      total += price * qty;
    });
  });

  // 3️⃣ Carpets
  Object.entries(carpets).forEach(([key, qty]) => {
    if (qty > 0) total += (PRICES[key] ?? 0) * qty;
  });

  // 4️⃣ Appliances
  Object.entries(appliances).forEach(([key, qty]) => {
    if (qty > 0) total += (PRICES[key] ?? 0) * qty;
  });

  return total;
};
