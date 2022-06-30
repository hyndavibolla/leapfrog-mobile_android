export function getDecimals(number) {
  return Number.isInteger(number) ? number : Number(number).toFixed(2);
}

function getClosestMultiple(value: number, multiple: number) {
  return multiple * Math.ceil(value / multiple);
}

function getRange(minimum: number, maximum: number, multiple: number) {
  return Array(Math.floor((maximum - minimum) / multiple) + 1)
    .fill(null)
    .map((_, i) => i * multiple + minimum);
}

function getRangeWithMultiples(minimum: number, maximum: number, multiple: number) {
  return Array.from(new Set([minimum, ...getRange(minimum, maximum, multiple).map(value => Math.min(getClosestMultiple(value, multiple), maximum)), maximum]));
}

export function getNumberListFromRange({
  minimum,
  maximum,
  maxOptionCount,
  multiple
}: {
  minimum: number;
  maximum: number;
  maxOptionCount: number;
  multiple: number;
}): number[] {
  const safeMinimum = Number(minimum?.toFixed(2)) || 0;
  const safeMaximum = Number(maximum?.toFixed(2)) || safeMinimum;

  return Array(maxOptionCount)
    .fill(null)
    .reduce((total, _, index) => {
      if (total.length <= maxOptionCount) return total;
      const splitIndex = Math.floor(total.length / 4);
      const head = total.slice(0, splitIndex);
      const tail = total.slice(splitIndex, total.length);
      return [...head, ...getRangeWithMultiples(tail[0], tail[tail.length - 1], multiple * (index + 1))];
    }, getRangeWithMultiples(safeMinimum, safeMaximum, multiple));
}
