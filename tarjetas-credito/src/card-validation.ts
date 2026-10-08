import validator from 'card-validator';

export function validateCardNumber(value: unknown): { brand: string; last4: string; cardNumber: string } | undefined {
  // Se recibe como texto para no perder precisión con números largos.
  if (typeof value !== 'string' || value.length > 40 || !/^[0-9 -]+$/.test(value)) return;
  const number = value.replace(/[ -]/g, '');
  // La librería comprueba marca, longitud y Luhn. UnionPay permite números sin Luhn.
  const result = validator.number(number);
  if (!result.isValid || !result.card) return;
  return { brand: result.card.type, last4: number.slice(-4), cardNumber: number };
}
