import { type } from "os";

export const getLocationLink = (content: string) => {
    const isMITLocationTest = new RegExp(".*-.*\\d$");
    const isLocation = isMITLocationTest.test(content)
    return isLocation ? `https://whereis.mit.edu/?go=${content}` : ""
}