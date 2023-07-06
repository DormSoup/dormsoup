"use client";

import { MouseEventHandler, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleSearchFilter } from "../redux/searchSlice";
import { RootState } from "../redux/store";

import styles from "./EventTagsBar.module.css";

type TagDisplayConfig = { color: string; icon: string };

const eventTagDisplayConfigs: { [tagName: string]: TagDisplayConfig } = {
  Theater: { color: "#824C71", icon: "\u{f630}" },
  Talk: { color: "#242F40", icon: "\u{f8cb}" },
  "Study Break": { color: "#6F4E37", icon: "\u{f0f4}" },
  "Movie Screening": { color: "#4A2545", icon: "\u{f8a9}" },
  Game: { color: "#FF6663", icon: "\u{e5a2}" },
  // TODO: use actual rainbow flags.
  Queer: { color: "#745296", icon: "\u{f75b}" },
  // Workshop: { color: "#5B3000", icon: "\u{f7d9}" },
  Rally: { color: "#A61C3C", icon: "\u{f757}" },
  "Class Presentation": { color: "#F7B801", icon: "\u{e3aa}" },
  Other: { color: "#A97C73", icon: "\u{003f}" },
  EECS: { color: "#FF8811", icon: "\u{f2db}" },
  AI: { color: "#3C91E6", icon: "\u{e0c6}" },
  Math: { color: "#342E37", icon: "\u{f68b}" },
  Biology: { color: "#1C5D99", icon: "\u{f471}" },
  Music: { color: "#C2E812", icon: "\u{f001}" },
  Concert: { color: "#F78154", icon: "\u{f8db}" },
  "Quant/Finance": { color: "#00A676", icon: "\u{0024}" },
  "East Asian": { color: "#FFA62B", icon: "\u{e3f7}" },
  FSILG: { color: "#F76F8E", icon: "\u{f7ae}" },
  Religion: { color: "#6A6262", icon: "\u{f684}" },
  HASS: { color: "#615055", icon: "\u{f19c}" },
  Dance: { color: "#F25F5C", icon: "D" },
  Entrepreneurship: { color: "#0B5563", icon: "\u{f2b5}" },
  "Free Food": { color: "#E03616", icon: "\u{f818}" },
  Boba: { color: "#E03616", icon: "\u{f818}" },
  Food: { color: "#E03616", icon: "\u{f818}" }
};

function getTagPriority(tag: string) {
  if (["Free Food", "Food", "Boba"].includes(tag)) return 2;
  if (tag === "Other" || eventTagDisplayConfigs[tag] === undefined) return 0;
  return 1;
}

type TagProp = { tag: string };

const Tag = ({ tag }: TagProp) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.search.filters);
  const inverted = filters.includes(tag);

  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    dispatch(toggleSearchFilter(tag));
    event.stopPropagation();
  };

  let config = eventTagDisplayConfigs[tag];
  if (config === undefined) config = eventTagDisplayConfigs["Other"]!!; // TODO: handle this

  const { color, icon } = config;
  return (
    <div
      className={`${styles.tagOuter} ${
        inverted ? styles.tagActivated : styles.tagInactivated
      } cursor-pointer`}
      onClick={onClick}
      style={{ ["--theme-color" as any]: color }}
      title={tag}
    >
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
    <div className="relative flex flex-row justify-end gap-3 px-4">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};

export const FilterTagsBar = () => {
  const allTags = Object.keys(eventTagDisplayConfigs);
  allTags.sort((a, b) => {
    const diff = getTagPriority(a) - getTagPriority(b);
    if (diff !== 0) return diff;
    return a < b ? -1 : a === b ? 0 : 1;
  });

  return (
    <div className="grid w-full grid-flow-col grid-rows-1 justify-center gap-3 max-lg:grid-rows-2 max-md:grid-rows-3">
      {allTags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};

export default TagsBar;
