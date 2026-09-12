import { SAMPLE_PRICES, rollingMean, chartPath } from "./features.js";

export function setupFeatureLab() {
  const input = document.getElementById("feature-window");
  if (!input) return;
  const average = document.getElementById("feature-average");
  const count = document.getElementById("feature-count");
  const path = document.getElementById("feature-path");
  function update() {
    const windowSize = Number(input.value);
    const means = rollingMean(SAMPLE_PRICES, windowSize);
    document.getElementById("window-value").value = `${windowSize} samples`;
    average.value = means.at(-1).toFixed(2);
    count.value = String(means.filter((value) => value !== null).length);
    path.setAttribute("d", chartPath(means));
    document.getElementById("feature-chart-description").textContent =
      `A ${windowSize}-sample rolling mean of 32 synthetic prices. Latest average ${means.at(-1).toFixed(2)}; ${means.filter((value) => value !== null).length} complete windows.`;
  }
  input.addEventListener("input", update);
  update();
}
