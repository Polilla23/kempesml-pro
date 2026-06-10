import {
  ArrowLeftRight,
  Award,
  BarChart3,
  CalendarDays,
  CalendarRange,
  LayoutDashboard,
  ListOrdered,
  Newspaper,
  Shield,
  Trophy,
  UserCog,
  Users,
  UsersRound,
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

export type NavSection = {
  /** Matches a key under `nav.sections` in messages. */
  key: string;
  /** Only shown to users with role 'admin'. */
  adminOnly?: boolean;
  items: NavItem[];
};

export const NAV_SECTIONS: NavSection[] = [
  {
    key: "main",
    items: [
      { key: "dashboard", href: "/dashboard", icon: LayoutDashboard },
      { key: "standings", href: "/standings", icon: ListOrdered },
      { key: "fixtures", href: "/fixtures", icon: CalendarDays },
      { key: "teams", href: "/teams", icon: Users },
      { key: "players", href: "/players", icon: UsersRound },
      { key: "transfers", href: "/transfers", icon: ArrowLeftRight },
      { key: "statistics", href: "/statistics", icon: BarChart3 },
      { key: "finances", href: "/finances", icon: Wallet },
      { key: "trophies", href: "/trophies", icon: Award },
      { key: "news", href: "/news", icon: Newspaper },
    ],
  },
  {
    key: "admin",
    adminOnly: true,
    items: [
      { key: "adminUsers", href: "/admin/users", icon: UserCog },
      { key: "adminClubs", href: "/admin/clubs", icon: Shield },
      { key: "adminCompetitions", href: "/admin/competitions", icon: Trophy },
      { key: "adminSeasons", href: "/admin/seasons", icon: CalendarRange },
    ],
  },
];
