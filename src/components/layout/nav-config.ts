import {
  ArrowLeftRight,
  ArrowUpDown,
  Award,
  BarChart3,
  CalendarDays,
  CalendarRange,
  CircleDollarSign,
  Clock,
  DollarSign,
  LayoutDashboard,
  ListOrdered,
  ListTree,
  Newspaper,
  Shield,
  SquarePen,
  Star,
  Trophy,
  Upload,
  UserCog,
  Users,
  UsersRound,
  Wallet,
  Zap,
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
      { key: "finances", href: "/finances", icon: Wallet },
      { key: "teams", href: "/teams", icon: Users },
      { key: "players", href: "/players", icon: UsersRound },
      { key: "standings", href: "/standings", icon: ListOrdered },
      { key: "fixtures", href: "/fixtures", icon: CalendarDays },
      { key: "submitResult", href: "/submit-result", icon: Upload },
      { key: "statistics", href: "/statistics", icon: BarChart3 },
      { key: "transfers", href: "/transfers", icon: ArrowLeftRight },
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
      { key: "adminPlayers", href: "/admin/players", icon: Users },
      { key: "salaryRates", href: "/admin/salary-rates", icon: CircleDollarSign },
      { key: "adminCompetitions", href: "/admin/competitions", icon: Trophy },
      { key: "adminFinances", href: "/admin/finances", icon: DollarSign },
      { key: "editResults", href: "/admin/edit-results", icon: SquarePen },
      { key: "plazos", href: "/admin/plazos", icon: Clock },
      { key: "playerRatings", href: "/admin/player-ratings", icon: Star },
    ],
  },
  {
    key: "fixtures",
    adminOnly: true,
    items: [
      { key: "createLeague", href: "/admin/fixtures/league", icon: ListTree },
      { key: "createCup", href: "/admin/fixtures/cup", icon: Award },
      { key: "postSeason", href: "/admin/fixtures/post-season", icon: ArrowUpDown },
    ],
  },
  {
    key: "configuration",
    adminOnly: true,
    items: [
      { key: "eventTypes", href: "/admin/event-types", icon: Zap },
      { key: "competitionTypes", href: "/admin/competition-types", icon: Trophy },
      { key: "adminSeasons", href: "/admin/seasons", icon: CalendarRange },
    ],
  },
];
