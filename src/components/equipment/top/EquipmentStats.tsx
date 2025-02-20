import { useCallback } from "react";
import { FighterInterface, ItemInterface } from "../../../types/types";

interface EquipmentStatsInterface {
  currentFighter: FighterInterface | null;
  selectedItem: ItemInterface | null;
}

interface StatsPreview {
  hp: number;
  atk: number;
  spd: number;
  mag: number;
  range: number;
}

export default function EquipmentStats({
  currentFighter,
  selectedItem,
}: EquipmentStatsInterface) {
  const getCurrentStats = useCallback(
    (useSelectedItem: boolean): StatsPreview => {
      if (!currentFighter) return { hp: 0, atk: 0, spd: 0, mag: 0, range: 0 };

      const fStat = currentFighter.stats;
      let hp = fStat.hp,
        atk = fStat.atk,
        spd = fStat.spd,
        mag = fStat.mag,
        range = 1;

      for (const key in currentFighter.equipment) {
        const element =
          currentFighter.equipment[
            key as keyof typeof currentFighter.equipment
          ];
        if (element) {
          hp += element.hp;
          atk += element.atk;
          spd += element.spd;
          mag += element.mag;
          range += element.range - 1;
        }
      }

      if (selectedItem && useSelectedItem) {
        const currentSlotItem =
          currentFighter.equipment[
            selectedItem.slot as keyof typeof currentFighter.equipment
          ];

        hp += selectedItem.hp - (currentSlotItem?.hp || 0);
        atk += selectedItem.atk - (currentSlotItem?.atk || 0);
        spd += selectedItem.spd - (currentSlotItem?.spd || 0);
        mag += selectedItem.mag - (currentSlotItem?.mag || 0);
        range += selectedItem.range - (currentSlotItem?.range || 1);
      }

      return { hp, atk, spd, mag, range };
    },
    [currentFighter, selectedItem]
  );

  const statPreview = (stat: keyof StatsPreview) => {
    const currentStat = getCurrentStats(false);
    const newStat = getCurrentStats(true);

    const triangleDownIcon =
      "w-0 h-0 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-red-500 animate-bounce";
    const triangleUpIcon =
      "w-0 h-0 border-l-[6px] border-r-[6px] border-b-[12px] border-l-transparent border-r-transparent border-b-green-500 animate-bounce";
    const equalIcon = "w-3 h-1 bg-blue-500";

    let statStyle = "text-white";
    let growth = "";

    if (currentStat[stat] > newStat[stat]) {
      statStyle = "text-red-500";
      growth = triangleDownIcon;
    } else if (currentStat[stat] < newStat[stat]) {
      statStyle = "text-green-500";
      growth = triangleUpIcon;
    } else {
      statStyle = "text-white";
      growth = equalIcon;
    }

    return (
      <div className="flex items-center gap-3">
        <span className={statStyle}>{newStat[stat]}</span>
        {selectedItem && <div className={growth}></div>}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center m-2">
      <h3>Stats</h3>
      <ul className="flex justify-around w-full">
        <div className="flex flex-col">
          <li className="flex justify-between gap-2">
            <span>HP</span>
            {statPreview("hp")}
          </li>
          <li className="flex justify-between gap-2">
            <span>ATK</span>
            {statPreview("atk")}
          </li>
        </div>
        <div className="flex flex-col">
          <li className="flex justify-between gap-2">
            <span>SPD</span>
            {statPreview("spd")}
          </li>
          <li className="flex justify-between gap-2">
            <span>MAG</span>
            {statPreview("mag")}
          </li>
        </div>
        <li className="flex justify-between items-center gap-2">
          <span>RNG</span>
          {statPreview("range")}
        </li>
      </ul>
    </div>
  );
}
