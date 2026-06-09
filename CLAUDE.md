# Kempes ML — Guía del proyecto

> Web app donde +30 usuarios manejan su equipo de fútbol y compiten en ligas/copas
> con transferencias entre managers, balances, premios, multas, trofeos, rankings,
> historiales y ascensos/descensos. Migrada desde una app previa en Firebase.

Este archivo es la **fuente de verdad de las convenciones**. Respetarlo en cada cambio.

---

## 🎯 Regla de oro: REUTILIZACIÓN

La máxima prioridad del proyecto es **no duplicar código**. Antes de escribir algo, fijate si ya existe; si no existe pero se va a repetir, extraelo.

1. **Archivos chicos, una responsabilidad cada uno.** Un componente / hook / service por archivo.
2. **Si algo se repite 2+ veces → se extrae.** A `components/common/`, `hooks/`, o `lib/`.
3. **Cero duplicación** de tipos, lógica de acceso a datos, validaciones o UI.
4. **No sobre-anticipar.** Se extrae cuando el patrón aparece, no antes.

---

## 🏗️ Arquitectura

Stack: **Next.js 16** (App Router, Turbopack) · TypeScript · Tailwind v4 · **shadcn/ui**
(preset `base-nova` → usa **Base UI** `@base-ui/react`, NO Radix) · **TanStack Query** ·
**Supabase** (Auth/Postgres/Realtime/Storage) · **Zod** · **React Hook Form** ·
**next-intl** (i18n, prefijo `/es` `/en`). Gestor: **pnpm**.

### Flujo de datos por feature (3 capas)

```
service (Supabase puro, recibe el client por parámetro)
   → hook (TanStack Query: cache, invalidación)
      → componente (UI, solo consume el hook)
```

### Estructura

```
src/
├── app/[locale]/            # rutas (App Router) — finas, solo orquestan
│   ├── (auth)/              # sign-in, sign-up (públicas)
│   └── (dashboard)/         # protegidas (sidebar + header + guard de sesión)
├── features/<dominio>/      # ⭐ núcleo: cada feature es un módulo autocontenido
│   ├── components/  hooks/  services/  schemas.ts  types.ts
│   └── index.ts             # barrel = API pública (importar SIEMPRE desde acá)
├── components/
│   ├── ui/                  # shadcn (Base UI) — no editar a mano salvo necesidad
│   └── common/              # reutilizables propios (EmptyState, TextField, ...)
├── hooks/                   # hooks cross-feature
├── lib/                     # supabase/, query/, utils, constants, query-keys
├── i18n/                    # routing, navigation, request (next-intl)
├── providers/               # Query + Theme + Toaster
├── types/database.types.ts  # tipos de la DB (ver abajo)
└── proxy.ts                 # i18n + refresh de sesión + protección de rutas
messages/{es,en}.json        # traducciones
supabase/migrations/         # SQL de referencia (NO se pushea, ver abajo)
```

Features de referencia: **`src/features/profiles/`** y **`src/features/teams/`**.
Para una feature nueva, copiar ese molde.

---

## 🧱 Building blocks reutilizables (usar, no reescribir)

| Pieza | Ubicación | Para qué |
|---|---|---|
| `useSupabaseBrowser()` | `hooks/use-supabase.ts` | cliente Supabase del browser memoizado (en hooks client) |
| `TypedSupabaseClient` | `lib/supabase/types.ts` | tipo del client; param de todo service |
| `createClient()` (server) | `lib/supabase/server.ts` | client en Server Components / Actions |
| `queryKeys` | `lib/query-keys.ts` | claves centralizadas de TanStack (fetch + invalidación) |
| `<TextField>` | `components/common/text-field.tsx` | campo de form (RHF) completo en 1 línea |
| `<EmptyState>` | `components/common/empty-state.tsx` | estado vacío / error |
| `<ComingSoon>` | `components/common/coming-soon.tsx` | placeholder de secciones |

Candidatos a extraer cuando se repitan: `<DataTable>`, `<PageHeader>`, `<FormDialog>`,
`<StatusBadge>`, helpers de formato (fecha, moneda).

---

## 🌐 i18n (next-intl)

- Toda cadena visible va en `messages/es.json` + `messages/en.json` (mantener ambos en sync).
- Server Components: `getTranslations("ns")`. Client: `useTranslations("ns")`.
- Navegación: importar `Link`, `useRouter`, `usePathname`, `redirect` de **`@/i18n/navigation`** (no de `next/*`).
- Pages/layouts: `params` se tipa como `Promise<{ locale: string }>` (lo exige el validador de Next 16) y se castea `setRequestLocale(locale as Locale)`.

---

## 🗄️ Base de datos / tipos

- **No tenemos acceso DDL**: un compañero administra el esquema en Supabase y nos pasa
  el `database.types.ts` oficial (`supabase gen types`). Se reemplaza tal cual.
- Fallback sin él: `pnpm db:types:rest` (genera desde el endpoint REST en vivo).
- **No pusheamos migraciones**; `supabase/migrations/` es solo referencia.
- `.env.local` (git-ignored) tiene las claves; `.env.example` está versionado.
- Trigger `handle_new_user` crea el `profile` al registrarse; el form de registro
  **nunca** manda `role` (queda `manager` por defecto — nadie se auto-asigna admin).

---

## 🎨 Detalles de shadcn / Base UI

- Composición: Base UI usa **`render={<Componente/>}`**, NO el `asChild` de Radix.
- Botón como link/anchor: agregar **`nativeButton={false}`** al `<Button render={<Link/>}>`.
- Variantes de `Button`: default · outline · secondary · ghost · destructive · link.

---

## ⚙️ Comandos

```bash
pnpm dev            # desarrollo
pnpm build          # build de producción
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm db:types:rest  # regenerar tipos desde el REST (fallback)
pnpm ui:add <comp>  # agregar componente de shadcn
```

**Antes de commitear**: `pnpm typecheck && pnpm lint && pnpm build` en verde.

---

## 🔀 Git

- Trabajar sobre `main` (repo chico, 2 personas). `git fetch` + rebase antes de pushear
  (el compañero también pushea SQL/docs).
- Commits en inglés, descriptivos.
