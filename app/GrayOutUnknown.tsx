const LLM_UNKNOWN_VALUE = "unknown";
const DISPLAY_UNKNOWN_VALUE = "Unknown";

type Props = {
  inline: boolean,
  content: string
};

export default function GrayOutIfUnknown({ content, inline }: Props) {
  const inlineClass = inline ? " inline" : "";
  return content.trim().toLowerCase() === LLM_UNKNOWN_VALUE ? (
    <div className={" text-gray-500" + inlineClass}> {DISPLAY_UNKNOWN_VALUE} </div>
  ) : (
    <div className={"truncate" + inlineClass}> {content} </div>
  );
}