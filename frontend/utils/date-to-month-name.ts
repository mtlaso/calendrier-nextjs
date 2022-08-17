/**
 * Convertie un mois (nombre) en nom de mois (string)
 * @param month Le mois à afficher
 * @returns Le nom du mois
 */
export const DateToMonthName = (month: number) => {
  const dt = new Date();

  dt.setMonth(month, 1);
  const monthName = dt.toLocaleDateString("en-CA", {
    month: "long",
  });

  return monthName;
};
