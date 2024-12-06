import { useState } from "react";
import { ItemInterface } from "../../types/types";
import { useDrag } from "react-dnd";

interface EquipmentProps {
  equipment: ItemInterface;
  selectedItem: ItemInterface | null;
  setSelectedItem: React.Dispatch<React.SetStateAction<ItemInterface | null>>;
  fighterId: number;
}

export default function Equipment({
  equipment,
  selectedItem,
  setSelectedItem,
}: EquipmentProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ITEM",
    item: { id: equipment.id, equipment },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  const [equipmentStat] = useState({
    hp: equipment.hp,
    atk: equipment.atk,
    spd: equipment.spd,
    mag: equipment.mag,
    range: equipment.range,
  });

  const displayStat = () => {
    return Object.entries(equipmentStat)
      .filter(([, value]) => value !== 0)
      .map(([key, value]) => (
        <p key={key}>
          {key.toUpperCase()}: {value}
        </p>
      ));
  };

  const getImage = (type: string) => {
    switch (type) {
      case "dagger":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/curvy-knife.svg";
      case "sword":
        return "https://game-icons.net/icons/ffffff/000000/1x1/skoll/stiletto.svg";
      case "staff":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/wizard-staff.svg";
      case "axe":
        return "https://game-icons.net/icons/ffffff/000000/1x1/lorc/battle-axe.svg";
      default:
        break;
    }
  };
  return (
    <div
      ref={drag}
      className={`relative flex flex-col text-center justify-center items-center bg-black m-1 p-1 border-2 border-black w-32 rounded-md hover:border-slate-500 cursor-pointer  ${
        selectedItem === equipment ? "border-white" : "border-black"
      }`}
      onClick={() =>
        setSelectedItem(() => (selectedItem !== equipment ? equipment : null))
      }
    >
      <p className="bg-slate-800 w-full">{equipment.name}</p>
      <div className="w-16 h-16">
        <img src={getImage(equipment.type)} alt={equipment.name} />
      </div>
      <div className="bg-slate-800 w-full">{displayStat()}</div>

      <div className="absolute top-1 left-1 bg-yellow-400 text-black font-bold p-2 rounded-full w-5 h-5 flex items-center justify-center text-xs">
        E
      </div>
    </div>
  );
}
