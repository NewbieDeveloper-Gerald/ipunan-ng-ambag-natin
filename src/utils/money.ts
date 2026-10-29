export function parsePesos(input: string): number {
 const value = input.trim();
 if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error('Enter pesos with up to 2 decimal places.');
 const [whole, fraction = ''] = value.split('.');
 const cents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
 if (!Number.isSafeInteger(cents) || cents <= 0) throw new Error('Amount must be positive and within the supported range.');
 return cents;
}
export function formatPesos(cents: number): string {
 if (!Number.isSafeInteger(cents)) throw new Error('Money must be integer centavos.');
 return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(cents / 100);
}
