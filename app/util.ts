import { type } from "os";

export const getLocationLink = (content: string) => {
  const isMITLocationTest = new RegExp(".*-.*\\d$");
  const isLocation = isMITLocationTest.test(content);
  return isLocation ? `https://whereis.mit.edu/?go=${content}` : "";
};

export const compareIgnoreCase = (str1: string, str2: string) => {
  return str1.toUpperCase() == str2.toUpperCase();
};

function removeBase64(input: string) {
  const startKeyword = ";base64,";
  const start = input.indexOf(";base64,");
  if (start === -1) return input;
  let end = start + startKeyword.length;
  while (end < input.length) {
    const charCode = input.charCodeAt(end);
    if (65 <= charCode && charCode <= 90) end++;
    else if (97 <= charCode && charCode <= 122) end++;
    else if (48 <= charCode && charCode <= 57) end++;
    else if (charCode === 43 || charCode === 47 || charCode === 61) end++;
    else break;
  }
  return removeBase64(input.slice(0, start) + input.slice(end));
}

function removeImageTags(input: string) {
  return input.replace(/\[(cid|data):[^\]]+\]/g, "");
}

function removeConsecutiveLinebreaks(input: string) {
  return input.replace(/(\n\s*){3,}/g, "\n\n");
}

function removeURL(input: string) {
  return input.replace(/(https?:\/\/[^\s]+)|(\[https?:\/\/[^\s]+\])/g, "");
}

export function removeArtifacts(input: string) {
  return removeConsecutiveLinebreaks(removeImageTags(removeURL(removeBase64(input))));
}
