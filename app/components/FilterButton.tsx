"use client";

import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { setFilterPanelModal } from "../redux/modalSlice";
import { useAppDispatch } from "../redux/store";

const FilterButton = () => {
  const dispatch = useAppDispatch();

  return (
    <div
      className="fixed bottom-10 right-10 z-30 flex h-[3rem] w-[3rem] items-center justify-center rounded-full border-2 border-slate-400 bg-logo-yellow text-white shadow-xl transition-all duration-150 hover:-translate-y-0.5 hover:cursor-pointer lg:hidden"
      onClick={() => dispatch(setFilterPanelModal())}
    >
      <FontAwesomeIcon className="scale-150" icon={faFilter} />
    </div>
  );
};

export default FilterButton;
