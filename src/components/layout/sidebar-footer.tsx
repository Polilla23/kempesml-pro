import { UserMenu } from "./user-menu";

/**
 * Bottom section of the sidebar (and mobile drawer): the user menu, which holds
 * the profile dialog, theme and language switchers, and sign out. Shared so the
 * desktop sidebar and the mobile drawer stay in sync.
 */
export function SidebarFooter({
  name,
  email,
  collapsed = false,
}: {
  name: string;
  email: string;
  collapsed?: boolean;
}) {
  return (
    <div className="border-t p-2">
      <UserMenu name={name} email={email} collapsed={collapsed} />
    </div>
  );
}
