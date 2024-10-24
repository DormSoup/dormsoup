import { type } from "os";

export const getLocationLink = (content: string) => {
    const isMITLocationTest = new RegExp(".*-.*\\d$");
    const isLocation = isMITLocationTest.test(content)
    return isLocation ? `https://whereis.mit.edu/?go=${content}` : ""
}

export const compareIgnoreCase = (str1: string, str2: string) => {
    return str1.toUpperCase() == str2.toUpperCase();
}