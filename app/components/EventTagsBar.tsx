"use client";

import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { MouseEventHandler, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toggleSearchFilter } from "../redux/searchSlice";
import { RootState } from "../redux/store";

import styles from "./EventTagsBar.module.css";

type TagDisplayConfig = {
  color: string;
  icon: string;
  type: "form" | "content" | "amenities" | "other";
  aliases?: string[];
};

const eventTagDisplayConfigs: { [tagName: string]: TagDisplayConfig } = {
  Theater: { color: "#824C71", icon: "\u{f630}", type: "form" },
  Talk: { color: "#242F40", icon: "\u{f8cb}", type: "form" },
  "Study Break": { color: "#6F4E37", icon: "\u{f0f4}", type: "form" },
  "Movie Screening": { color: "#4A2545", icon: "\u{f8a9}", type: "form" },
  Game: { color: "#FF6663", icon: "\u{e5a2}", type: "form" },
  Party: { color: "#F76F8E", icon: "\u{e31b}", type: "form" },
  Rally: { color: "#A61C3C", icon: "\u{f757}", type: "form" },
  "Class Presentation": { color: "#F7B801", icon: "\u{e3aa}", type: "form" },
  Concert: { color: "#C2E812", icon: "\u{f001}", type: "form" },
  Sale: { color: "#8BE8CB", icon: "\u{f54e}", type: "form" },
  Dance: { color: "#F25F5C", icon: "/icons/dance.svg", type: "form" },
  // TODO: use actual rainbow flags.
  Queer: { color: "#745296", icon: "\u{f75b}", type: "content" },
  Undefined: { color: "#A97C73", icon: "\u{003f}", type: "other" },
  EECS: { color: "#FF8811", icon: "\u{f2db}", type: "content" },
  AI: { color: "#3C91E6", icon: "\u{e0c6}", type: "content" },
  Math: { color: "#99D5C9", icon: "\u{f68b}", type: "content" },
  Biology: { color: "#1C5D99", icon: "\u{f471}", type: "content" },
  Finance: { color: "#00A676", icon: "\u{0024}", type: "content" },
  "East Asian": { color: "#FFA62B", icon: "\u{e3f7}", type: "content" },
  Religion: { color: "#6A6262", icon: "\u{f684}", type: "content" },
  Career: { color: "#0B5563", icon: "\u{f2b5}", type: "content", aliases: ["Entrepreneurship"] },
  Boba: { color: "#ab86b6", icon: "/icons/boba.svg", type: "amenities" },
  "Free Food": { color: "#E03616", icon: "\u{f818}", type: "amenities", aliases: ["Food"] },
  Liked: { color: "#ff0061", icon: "\u{f004}", type: "other" }
};

function getTagPriority(tag: string) {
  if (["Free Food", "Food", "Boba"].includes(tag)) return 2;
  if (tag === "Other" || eventTagDisplayConfigs[tag] === undefined) return 0;
  return 1;
}

type TagProp = {
  tag: string;
  shape: "bookmark" | "capsule";
  onClick?: (value: boolean) => void;
  initialValue?: boolean;
};

export const Tag = ({ tag, shape, onClick: handler, initialValue }: TagProp) => {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.search.filters);
  const [inverted, setInverted] = useState(handler ? initialValue : filters.includes(tag));
  useEffect(() => {
    if (!handler) setInverted(filters.includes(tag));
  }, [filters, handler, tag]);

  const [justInverted, setJustInverted] = useState(false);

  const classOuter = shape === "bookmark" ? styles.tagOuter : styles.tagOuterCapsule;
  const classInner = shape === "bookmark" ? styles.tagInner : styles.tagInnerCapsule;

  let config = eventTagDisplayConfigs[tag];
  if (config === undefined) config = eventTagDisplayConfigs["Undefined"]!!; // TODO: handle this

  const { color, icon } = config;
  const isSvgIcon = icon.startsWith("/");
  const solidIcon = icon.replace(".svg", "-solid.svg");
  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (handler) {
      handler(!inverted);
      setInverted(!inverted);
    } else {
      dispatch(toggleSearchFilter(tag));
    }
    setJustInverted(true);
    event.stopPropagation();
  };

  const iconPart = !isSvgIcon ? (
    <span>{icon}</span>
  ) : (
    <span className="w-full">
      <img className={styles.svgRegular} src={icon} alt={tag}></img>
      <img className={styles.svgSolid} src={solidIcon} alt={tag}></img>
    </span>
  );

  return (
    <div
      className={`${classOuter} ${
        inverted !== justInverted ? styles.tagActivated : styles.tagInactivated
      } cursor-pointer select-none font-semibold hover:-translate-y-0.5`}
      onClick={onClick}
      onMouseLeave={() => setJustInverted(false)}
      style={{ ["--theme-color" as any]: color }}
      title={tag}
    >
      <div className={classInner}>
        {shape === "bookmark" ? (
          <span>{iconPart} </span>
        ) : (
          <span>
            <span className="inline-block w-[1.125rem] text-center">{iconPart}</span>
            <span className="relative top-[-0.1rem] truncate font-sans text-xs">
              {shape === "capsule" ? ("  " + tag).replaceAll(" ", "\xa0") : ""}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export function toDisplayName(tags: string[]) {
  return tags
    .map((tag) => {
      let displayName = "";
      for (const prop of Object.keys(eventTagDisplayConfigs)) {
        if (tag === prop || eventTagDisplayConfigs[prop].aliases?.includes(tag)) {
          displayName = prop;
          break;
        }
      }
      return displayName;
    })
    .filter((displayName) => displayName.length > 0) // dedup
    .filter((value, index, self) => self.indexOf(value) === index);
}

export function sortTags(tags: string[]) {
  tags.sort((a, b) => {
    const diff = getTagPriority(a) - getTagPriority(b);
    if (diff !== 0) return diff;
    return a < b ? -1 : a === b ? 0 : 1;
  });
  return tags;
}

const TagsBar = ({ tags }: { tags: string[] }) => {
  tags = sortTags(toDisplayName(tags));
  return (
    <div className="relative flex flex-row justify-end gap-3 px-4">
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} shape="bookmark" />
      ))}
    </div>
  );
};

export const FilterPanel = () => {
  const tagsOfType = (type: string) =>
    Object.keys(eventTagDisplayConfigs)
      .filter((tag) => eventTagDisplayConfigs[tag].type === type)
      .filter((tag) => tag !== "Math")
      .map((tag) => <Tag key={tag} tag={tag} shape="capsule" />);

  return (
    <div className="flex flex-col">
      <div className="flex justify-between">
        <div className="text-2xl">
          {" "}
          <FontAwesomeIcon icon={faFilter} /> Filters
        </div>
        <div className="">
          {" "}
          <Tag tag="Liked" shape="capsule" />{" "}
        </div>
      </div>
      <div className="mt-2 flex gap-8">
        <div className="flex-col space-y-2">
          <div className="text-xl">Form</div>
          {tagsOfType("form")}
        </div>
        <div className="flex-col">
          <div className="flex-col space-y-2">
            <div className="gap-2 text-xl "> Amenities </div>
            {tagsOfType("amenities")}
          </div>
          <div className="mt-[9px] flex-col space-y-2">
            <div className="text-xl">Content</div>
            {tagsOfType("content")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagsBar;
