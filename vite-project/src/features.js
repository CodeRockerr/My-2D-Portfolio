export const SAMPLE_PRICES = [
  100, 100.8, 100.3, 101.5, 102.1, 101.7, 102.4, 103.6, 103.1, 102.5, 103.4,
  104.2, 103.8, 105.1, 104.7, 104, 103.5, 104.6, 105.8, 105.2, 106.4, 105.9,
  107.1, 106.6, 107.8, 108.1, 107.4, 108.6, 109.2, 108.7, 109.8, 110.4,
];

export function rollingMean(values, windowSize) {
  if (
    !Number.isInteger(windowSize) ||
    windowSize < 1 ||
    windowSize > values.length
  )
    throw new RangeError("Window must be an integer within the series length.");
  if (!values.every(Number.isFinite))
    throw new TypeError("Prices must be finite numbers.");
  let sum = 0;
  return values.map((value, index) => {
    sum += value;
    if (index >= windowSize) sum -= values[index - windowSize];
    return index < windowSize - 1 ? null : sum / windowSize;
  });
}

export function chartPath(values, { min = 98, max = 112 } = {}) {
  return values
    .map((value, index) =>
      value === null
        ? ""
        : `${index === 0 || values[index - 1] === null ? "M" : "L"}${(20 + (index / (values.length - 1)) * 600).toFixed(2)},${(170 - ((value - min) / (max - min)) * 150).toFixed(2)}`,
    )
    .join(" ");
}
