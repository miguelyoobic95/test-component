
export function format(first: string, middle: string, last: string): string {
  return (
    (first || '') +
    (middle ? ` ${middle}` : '') +
    (last ? ` ${last}` : '')
  );
}

export function isCordova() {
  return !!(typeof window !== 'undefined' && window && (window as any).cordova);
}