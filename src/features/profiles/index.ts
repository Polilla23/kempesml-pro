/**
 * Public API of the `profiles` feature. Import from "@/features/profiles",
 * never reach into its internal files from outside the module.
 */
export * from "./types";
export * from "./schemas";
export * from "./hooks/use-profile";
export { profilesService } from "./services/profiles.service";
export { ProfileSettingsDialog } from "./components/profile-settings-dialog";
