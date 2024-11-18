import { useState, useContext } from "react";
import axios, { AxiosError } from "axios";
import useExitSession from "../hooks/useExitSession";
import { FighterContext, FighterContextType } from "../contexts/FighterContext";
import { ProfileInterface } from "../types/types";

export const useProfile = () => {
  const [profile, setProfile] = useState<ProfileInterface | null>(null);
  const { setFighters, setSelectedFighter, currentFighter } = useContext(
    FighterContext
  ) as FighterContextType;
  const exitSession = useExitSession();

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("Pas de token :)");
        return;
      }

      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response);

      const profileData: ProfileInterface = response.data;
      const fightersWithReducedData = profileData.fighters;
      setProfile({ ...profileData, fighters: fightersWithReducedData });
      setFighters(fightersWithReducedData || null);
      setSelectedFighter(fightersWithReducedData[currentFighter]);
    } catch (error) {
      console.log(error);
      const e = error as AxiosError;
      const errorMessage =
        (e.response?.data as { error?: string })?.error || "An error occurred";
      console.log(errorMessage);
      if (e.response?.status === 401) {
        exitSession();
      }
    }
  };

  return { profile, fetchProfile };
};
