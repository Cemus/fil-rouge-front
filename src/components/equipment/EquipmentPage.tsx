import axios from "axios";
import { useFighter } from "../../hooks/useFighter";
import { FighterInterface, ItemInterface } from "../../types/types";
import { useEffect, useState } from "react";
import { useProfile } from "../../hooks/useProfile";
import { useFn } from "../../hooks/useFn";
import EquipmentView from "./EquipmentView";
import EquipmentEditor from "./EquipmentEditor";

export default function EquipmentPage() {
  const { selectedFighter } = useFighter();
  const [currentFighter, setCurrentFighter] = useState<FighterInterface | null>(
    null
  );
  const { fetchProfile } = useProfile();
  const stableFetchProfile = useFn(fetchProfile);

  const [selectedItem, setSelectedItem] = useState<ItemInterface | null>(null);

  const updateServerEquipment = async (
    fighterId: number,
    equipmentSlots: ItemInterface[]
  ) => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "/api/equipment/update",
        {
          fighterId,
          equipmentSlots,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error during the equipment update", error);
    }
  };

  useEffect(() => {
    if (!selectedFighter) {
      stableFetchProfile();
    }
    if (!currentFighter) {
      setCurrentFighter(selectedFighter);
    }
  }, [stableFetchProfile, selectedFighter, currentFighter]);

  return (
    <div className="flex-1 flex flex-col  p-4 select-none text-white pb-24 md:pb-0">
      {currentFighter && (
        <>
          <EquipmentView
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
          />
          <EquipmentEditor
            currentFighter={currentFighter}
            setCurrentFighter={setCurrentFighter}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
          />
          <button
            type="submit"
            className="button w-1/2 self-center"
            onClick={() =>
              updateServerEquipment(currentFighter.id, currentFighter.equipment)
            }
          >
            Submit
          </button>
        </>
      )}
    </div>
  );
}
