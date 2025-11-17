import { useContext } from "react";
import { SiteSettingsContext } from "./contexts";

export const useSiteSettings = () => useContext(SiteSettingsContext);