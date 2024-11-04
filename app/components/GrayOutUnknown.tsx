import { getLocationLink } from "../util";

const LLM_UNKNOWN_VALUE = "unknown";
const DISPLAY_UNKNOWN_VALUE = "Unknown";

type Props = {
  inline: boolean;
  content: string;
};

export default function GrayOutIfUnknown({ content, inline }: Props) {
  const inlineClass = inline ? " inline line-clamp-1 overflow-hidden" : "";
  return content.trim().toLowerCase() === LLM_UNKNOWN_VALUE ? (
    <span className={" text-gray-500" + inlineClass}> {DISPLAY_UNKNOWN_VALUE} </span>
  ) : getLocationLink(content) ? (
    <a href={getLocationLink(content)} target="_blank" className="underline hover:text-logo-red">
      <span className={"truncate font-medium" + inlineClass}>{content}</span>
    </a>
  ) : (
    <span className={"truncate font-medium" + inlineClass}>{content}</span>
  );
}
