import { LanguageSwitcher } from "./language-switcher";
import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function AppHeader({ name, email }: { name: string; email: string }) {
  return (
    <header className="bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur md:px-6">
      <MobileNav />
      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeToggle />
        <UserMenu name={name} email={email} />
      </div>
    </header>
  );
}
