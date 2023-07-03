import styles from "./EventTagsBar.module.css";

type TagDisplayConfig = { color: string; icon: string };

/*
Rally	FA:person-sign	#A61C3C
Showcase	FA:podium & gallery-thumbnails	#F7B801
Other 	FA: question	#A97C73
EECS	FA: microchip	#FF8811
AI	FA: brain-circuit	#3C91E6
Math	FA: sigma	#342E37
Biology	FA: dna	#1C5D99
Quant/finance	FA:dollar-sign	#00A676
East asia	FA:chopsticks	#FFA62B
FSILG	FA:party-horn / igloo	#F76F8E
Religon	FA:hands-praying	#6A6262
HASS	FA:building-columns	#615055
Dance	dancing human	#F25F5C
Entrepreneurship	FA:handshake	#0B5563
Free food	FA:pizza slice	#E03616
 */

const displayConfigs: { [tagName: string]: TagDisplayConfig } = {
  Show: { color: "#824C71", icon: "\u{f630}" },
  Talk: { color: "#242F40", icon: "\u{f8cb}" },
  "Study Break": { color: "#6F4E37", icon: "\u{f0f4}" },
  "Movie Screening": { color: "#4A2545", icon: "\u{f8a9}" },
  Workshop: { color: "#5B3000", icon: "\u{f7d9}" },
  Rally: { color: "#A61C3C", icon: "\u{f757}" },
  Showcase: { color: "#F7B801", icon: "\u{e3aa}" },
  Other: { color: "#A97C73", icon: "\u{003f}" },
  EECS: { color: "#FF8811", icon: "\u{f2db}" },
  AI: { color: "#3C91E6", icon: "\u{e0c6}" },
  Math: { color: "#342E37", icon: "\u{f68b}" },
  Biology: { color: "#1C5D99", icon: "\u{f471}" },
  "Quant/Finance": { color: "#00A676", icon: "\u{0024}" },
  "East Asian": { color: "#FFA62B", icon: "\u{e3f7}" },
  FSILG: { color: "#F76F8E", icon: "\u{f7ae}" },
  Religion: { color: "#6A6262", icon: "\u{f684}" },
  HASS: { color: "#615055", icon: "\u{f19c}" },
  Dance: { color: "#F25F5C", icon: "?" },
  Entrepreneurship: { color: "#0B5563", icon: "\u{f2b5}" },
  "Free Food": { color: "#E03616", icon: "\u{f818}" },
  Food: { color: "#E03616", icon: "\u{f818}" }
};

function getTagPriority(tag: string) {
  if (tag === "Free Food" || tag === "Food") return 2;
  if (tag === "Other" || displayConfigs[tag] === undefined) return 0;
  return 1;
}

type TagProp = { tag: string };

const Tag = ({ tag }: TagProp) => {
  let config = displayConfigs[tag];
  if (config === undefined) config = displayConfigs["Other"]!!; // TODO: handle this

  const { color, icon } = config;
  return (
    <div className={styles.tag} style={{ ["--theme-color" as any]: color }} title={tag}>
      <div className={styles.tagInner}>
        <span>{icon}</span>
      </div>
    </div>
  );
};

type TagBarProp = { tags: string[] };

const TagsBar = ({ tags }: TagBarProp) => {
  tags.sort((a, b) => {
    const diff = getTagPriority(a) - getTagPriority(b);
    if (diff !== 0) return diff;
    return a < b ? -1 : a === b ? 0 : 1;
  });
  return (
    <div className="relative mb-2 flex flex-row justify-end gap-3 px-4">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};

export default TagsBar;

/**
 * while true; do
    fswatch -1 ./
    rsync -auvz --delete \
        --exclude='/.git' --filter="dir-merge,- .gitignore" \
        ./ DormSoup:/home/ubuntu/dormsoup
done

 */
