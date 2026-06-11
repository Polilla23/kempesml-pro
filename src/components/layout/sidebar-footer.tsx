import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

/**
 * Bottom section of the sidebar (and mobile drawer): language + theme toggles
 * and the user menu (avatar → sign out). Shared so both stay in sync.
 */
export function SidebarFooter({ name, email }: { name: string; email: string }) {
  return (
    <div className="border-t p-2">
      <div className="flex items-center justify-end gap-1 px-1 pb-1">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>
      <UserMenu name={name} email={email} />
    </div>
  );
}
