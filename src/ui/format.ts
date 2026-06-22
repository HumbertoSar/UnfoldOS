// Formatação pt-BR (moeda, número, percentual).
export function moeda(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function numero(v: number): string {
  return v.toLocaleString('pt-BR');
}
