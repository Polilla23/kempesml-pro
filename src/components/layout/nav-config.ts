import {
  ArrowLeftRight,
  Award,
  BarChart3,
  LayoutDashboard,
  Trophy,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  /** Matches a key under the `nav` namespace in messages. */
  key: string;
  /** Locale-agnostic href (next-intl adds the locale prefix). */
  href: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
  { key: "teams", href: "/teams", icon: Users },
  { key: "competitions", href: "/competitions", icon: Trophy },
  { key: "transfers", href: "/transfers", icon: ArrowLeftRight },
  { key: "rankings", href: "/rankings", icon: BarChart3 },
  { key: "finances", href: "/finances", icon: Wallet },
  { key: "trophies", href: "/trophies", icon: Award },
];
