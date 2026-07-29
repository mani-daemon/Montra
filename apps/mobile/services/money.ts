export const toMinorUnits = (value: string | number): number | null => {
  const normalized = String(value).trim().replace(',', '.');
  if (!/^\d+(\.\d{1,2})?$/.test(normalized)) return null;
  const amount = Number(normalized);
  const minor = Math.round(amount * 100);
  return Number.isSafeInteger(minor) && minor > 0 ? minor : null;
};

export const formatMoney = (minor: number, currency = 'USD', locale = 'en-US') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(minor / 100);
