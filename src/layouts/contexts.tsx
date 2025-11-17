import { SiteSettings } from "@/types/entities";
import { createContext } from "react";

export const SiteSettingsContext = createContext<{
    siteSettings: SiteSettings | null;
    loading: boolean;
}>({
    siteSettings: null,
    loading: true,
});

