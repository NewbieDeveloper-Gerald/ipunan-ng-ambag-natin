export function localDate(date = new Date()): string {
 return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function yesterday(date = new Date()): string {
 const copy = new Date(date); copy.setDate(copy.getDate()-1); return localDate(copy);
}
