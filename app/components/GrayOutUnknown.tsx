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
  ) : (
    <span className={"truncate" + inlineClass}> {content} </span>
  );
}
