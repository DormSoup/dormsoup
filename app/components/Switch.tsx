import { Switch as HUSwitch } from "@headlessui/react";

type SwitchProps = {
  text: string;
  checked: boolean;
  onChange: () => void;
};

export default function Switch({ text, checked, onChange }: SwitchProps) {
  return (
    <HUSwitch
      checked={checked}
      onChange={() => onChange()}
      className={`${
        checked ? "bg-logo-red" : "bg-gray-300"
      } relative box-content inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">{text}</span>
      <span
        className={`${
          checked ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
    </HUSwitch>
  );
}
