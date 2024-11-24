import { convert } from "html-to-text";

export const getLocationLink = (content: string) => {
  const isMITLocationTest = new RegExp(".*-.*\\d$");
  const isLocation = isMITLocationTest.test(content);
  return isLocation ? `https://whereis.mit.edu/?go=${content}` : "";
};

export const compareIgnoreCase = (str1: string, str2: string) => {
  return str1.toUpperCase() == str2.toUpperCase();
};

function removeConsecutiveLinebreaks(input: string) {
  return input
    .replace(/(\n\s*){3,}/g, '\n\n')  // Replace 3+ line breaks with 2
    .trim();  // Remove leading/trailing whitespace and line breaks
}

export function removeArtifacts(input: string) {
  const plainText = convert(input, {
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" }
    ],
    wordwrap: false,
    preserveNewlines: true
  });

  return removeConsecutiveLinebreaks(plainText);
}
