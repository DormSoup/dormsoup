"use client";

import { SyntheticEvent, use, useEffect, useRef } from "react";

export default function ContentPreview(props: { html: string | undefined }) {
  const iframe = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframe.current === null) return;
    const currentIframe = iframe.current;
    if (
      (currentIframe.contentDocument?.body.childNodes.length ?? 0 > 0) &&
      currentIframe.getAttribute("adjusted") === null
    ) {
      currentIframe.setAttribute("adjusted", "true");
      regularizeEmailContent(currentIframe.contentDocument!);
    }
  }, [props.html]);

  return (
    <iframe
      className="w-full"
      ref={iframe}
      srcDoc={props.html}
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
    />
  );
}

function regularizeEmailContent(emailDocument: Document) {
  function convertFontTags(node: HTMLElement) {
    if (node.nodeName === "FONT") {
      const span = emailDocument.createElement("SPAN");
      for (const child of node.childNodes) span.appendChild(child);

      const size = node.getAttribute("size");
      if (size !== null) {
        // prettier-ignore
        const sizeLookup: { [key: number]: number } = {
          1: 10, 2: 13, 3: 16, 4: 18, 5: 24, 6: 32, 7: 48
        };
        span.style.fontSize = sizeLookup[parseInt(size)] + "px";
      }
      const color = node.getAttribute("color");
      if (color !== null) span.style.color = color;
      const face = node.getAttribute("face");
      if (face !== null) span.style.fontFamily = face;
      node.parentNode?.replaceChild(span, node);
    }

    for (const child of node.children) convertFontTags(child as HTMLElement);
  }

  function adjustTextNode(node: HTMLElement) {
    const textWalker = emailDocument.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    const sizeVotes = new Map<number, number>();
    const familyVotes = new Map<string, number>();

    let textNode: Node | null;
    while ((textNode = textWalker.nextNode()) !== null) {
      const style = window.getComputedStyle(textNode.parentNode as HTMLElement);
      const length = textNode.textContent?.length ?? 0;
      const fontSize = parseFloat(style.fontSize);
      sizeVotes.set(fontSize, (sizeVotes.get(fontSize) ?? 0) + length);
      const fontFamily = style.fontFamily;
      familyVotes.set(fontFamily, (familyVotes.get(fontFamily) ?? 0) + length);
    }

    const expectedFontSize = 13;
    const majorityFontSize = getMajorityKey(sizeVotes) ?? expectedFontSize;
    const ratio = expectedFontSize / majorityFontSize;

    const expectedFamily = "IBM Plex Sans, sans-serif";
    const majorityFamily = getMajorityKey(familyVotes) ?? "sans-serif";
    console.log(majorityFamily);

    const nodeWalker = emailDocument.createTreeWalker(node, NodeFilter.SHOW_ELEMENT);

    emailDocument.body.style.fontSize = expectedFontSize + "px";
    emailDocument.body.style.fontFamily = expectedFamily;
    let elementNode: Node | null;
    while ((elementNode = nodeWalker.nextNode()) !== null) {
      const style = (elementNode as HTMLElement).style;
      if (style.fontSize !== "") {
        const computedStyle = window.getComputedStyle(elementNode as HTMLElement);
        style.fontSize = parseFloat(computedStyle.fontSize) * ratio + "px";
      }
      style.fontFamily = style.fontFamily.replace(majorityFamily, expectedFamily);
    }

    const link = emailDocument.createElement("link");
    link.type = "text/css";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css?family=IBM Plex Sans&display=swap";
    emailDocument.head.appendChild(link);
  }

  convertFontTags(emailDocument.body);
  adjustTextNode(emailDocument.body);
}

function getMajorityKey<K>(map: Map<K, number>): K | undefined {
  let max = 0;
  let ret = undefined;
  for (const [key, value] of map) {
    if (value > max) {
      max = value;
      ret = key;
    }
  }
  return ret;
}