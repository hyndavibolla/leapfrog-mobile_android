/** escaping chars that would break the regex */
export const prepareTermForReg = (str: string) =>
  str
    ?.trim()
    ?.split('')
    .map(s => (['\\', '+', '*', '?', '(', ')', '{', '}', '[', ']'].includes(s) ? `\\${s}` : s))
    .join('') || '';
