"use client";

import root from "react-shadow";
import { Parser } from "html-to-react";

export default function ContentPreview(props: { html: string | undefined }) {
  const parser = Parser();
  return (
    <iframe className="w-full" srcDoc={props.html} sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin">

    </iframe>
  );
}

