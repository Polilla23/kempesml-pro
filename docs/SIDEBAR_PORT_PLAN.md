# Plan de portado del Sidebar (kempes-web → kempesml-pro)

> **Objetivo**: que el sidebar de kempesml-pro tenga la misma UX que el de la app vieja
> (`kempes-web`): **colapsable a iconos** (con atajo y persistencia), **logo + frase** en
> el header, **sección admin completa** con subgrupos (Fixtures, Configuración), y un
> **menú de usuario unificado** abajo (perfil + tema + idioma + cerrar sesión).
>
> **Restricciones**: se respeta el stack del destino → **Base UI** (`render={...}`, no `asChild`),
> **next-intl**, **Supabase**, **Tailwind v4**. **Sin buscador.** Los **iconos actuales se
> mantienen** (se afinan más adelante).

---

## 1. Decisión de arquitectura

❌ **NO** instalar el primitivo `ui/sidebar.tsx` de shadcn que usa kempes-web: es **Radix**
y el destino es **Base UI** (preset `base-nova`). Mezclarlos rompe la convención del repo
(ver `CLAUDE.md` §"Detalles de shadcn / Base UI").

✅ **SÍ**: extender los componentes que **ya existen** en `src/components/layout/`, agregándoles
el comportamiento de colapso con un **contexto liviano propio + cookie**. Tomamos el sidebar de
kempes-web como **referencia de diseño**, no como código a copiar.

Esto mantiene: arquitectura actual (AppSidebar desktop + MobileNav drawer + `NavLinks`
compartido), idioma Base UI, y las reglas de `CLAUDE.md` (responsive, reutilización).

---

## 2. Lo que YA existe en el destino (se conserva)

| Pieza | Archivo | Estado |
|---|---|---|
| Sidebar desktop | `components/layout/app-sidebar.tsx` | ✅ (ancho fijo `w-64`, sin colapso) |
| Drawer mobile | `components/layout/mobile-nav.tsx` + `mobile-header.tsx` | ✅ |
| Links compartidos | `components/layout/nav-links.tsx` | ✅ (secciones, role gating, active) |
| Config de items | `components/layout/nav-config.ts` | ✅ (`NAV_SECTIONS`: main + admin) |
| Footer | `components/layout/sidebar-footer.tsx` | ✅ (lang + theme + user, 3 controles sueltos) |
| User menu | `components/layout/user-menu.tsx` | ✅ (dropdown con solo "cerrar sesión") |
| Lang / Theme | `language-switcher.tsx` / `theme-toggle.tsx` | ✅ |
| Tokens CSS `--sidebar-*` | `app/globals.css` (light + dark) | ✅ ya presentes |
| Namespaces i18n | `messages/{es,en}.json` → `common, nav, userMenu, theme, language` | ✅ |
| Montaje | `app/[locale]/(dashboard)/layout.tsx` | ✅ (pasa `role/name/email` desde Supabase) |

> El rol viene de `profile.role` y por defecto es **`manager`** (no `ADMIN`). Admin = `"admin"`.
> El gating ya está hecho en `nav-links.tsx` con `role === "admin"`.

---

## 3. Brecha a cubrir (kempes-web tiene, destino no)

1. **Colapso a iconos** (desktop): botón + atajo `Ctrl/Cmd+B` + persistencia en cookie. Labels
   ocultos y tooltips al pasar el mouse cuando está colapsado.
2. **Header con logo + título + frase** (hoy es solo el texto `appName`). El logo cambia de
   tamaño al colapsar; título y frase se ocultan.
3. **Estructura de items completa**: subgrupo **Fixtures** (crear liga/copa/post-temporada) y
   grupo **Configuración** (tipos de evento/competencia, temporadas) + items admin faltantes.
4. **Menú de usuario unificado**: hoy hay 3 controles sueltos (idioma, tema, user). Pasar a **un
   solo dropdown** con submenús de idioma y tema + ítem de **perfil** + cerrar sesión (como kempes-web).
5. **Diálogo de edición de perfil** (no existe; la key `userMenu.profile` ya está traducida).

---

## 4. Pre-requisitos / dependencias nuevas

- [ ] **Tooltip UI**: `pnpm ui:add tooltip` (para los labels colapsados). Base UI.
- [ ] **Logo**: agregar el asset a `public/` (ej. `public/images/logo.png`). Hoy no hay.
- [ ] **Diálogo de perfil**: construir `features/profiles/components/profile-settings-dialog.tsx`
      usando el `use-profile.ts` + `profiles.service.ts` existentes y `<TextField>`/`<Dialog>`.
- [ ] **Frase/branding**: definir el texto del subtítulo (ej. "Donde el fútbol es vida...") como
      key i18n `common.appTagline`.

---

## 5. Cambios por archivo

### 5.1 `nav-config.ts` — reestructurar items
Pasar de 2 secciones planas a la estructura de kempes-web. Soportar **subgrupos** dentro de admin
(Fixtures, Configuración). Propuesta de tipo:

```ts
export type NavSection = {
  key: string;              // → messages nav.sections.<key>
  adminOnly?: boolean;
  items: NavItem[];
};
// NAV_SECTIONS: main | admin | fixtures(adminOnly) | configuration(adminOnly)
```

**Mapeo de items** (origen kempes-web → destino). ⚠️ = ruta inexistente hoy:

| Sección | key | href destino | Ruta existe? |
|---|---|---|---|
| main | dashboard | `/dashboard` | ✅ |
| main | myFinances | `/finances` | ✅ (es "mis finanzas") |
| main | news | `/news` | ✅ |
| main | standings | `/standings` | ✅ |
| main | fixtures | `/fixtures` | ✅ |
| main | submitResult | `/submit-result` | ⚠️ nueva |
| main | statistics | `/statistics` | ✅ |
| main | transfers | `/transfers` | ✅ |
| main | teams | `/teams` | ✅ (extra del destino, se mantiene) |
| main | players | `/players` | ✅ (extra del destino, se mantiene) |
| main | trophies (palmarés) | `/trophies` | ✅ |
| admin | adminUsers | `/admin/users` | ✅ |
| admin | adminClubs | `/admin/clubs` | ✅ |
| admin | adminPlayers | `/admin/players` | ⚠️ nueva |
| admin | salaryRates | `/admin/salary-rates` | ⚠️ nueva |
| admin | adminCompetitions | `/admin/competitions` | ✅ |
| admin | adminFinances | `/admin/finances` | ⚠️ nueva |
| admin | editResults | `/admin/edit-results` | ⚠️ nueva |
| admin | plazos | `/admin/plazos` | ⚠️ nueva |
| admin | playerRatings | `/admin/player-ratings` | ⚠️ nueva |
| fixtures (admin) | createLeague | `/admin/fixtures/league` | ⚠️ nueva |
| fixtures (admin) | createCup | `/admin/fixtures/cup` | ⚠️ nueva |
| fixtures (admin) | postSeason | `/admin/fixtures/post-season` | ⚠️ nueva |
| configuration (admin) | eventTypes | `/admin/event-types` | ⚠️ nueva |
| configuration (admin) | competitionTypes | `/admin/competition-types` | ⚠️ nueva |
| configuration (admin) | seasons | `/admin/seasons` | ✅ |

> **Decisión pendiente (D1)**: las rutas ⚠️ no existen. Para que los links no tiren 404, crear
> páginas placeholder con `<ComingSoon>` (ya existe en `components/common/`). Alternativa: cablear
> ahora solo los items con ruta y agregar el resto a medida que se construyan.

### 5.2 `messages/es.json` + `messages/en.json` — nuevas keys
- `nav.sections`: agregar `fixtures`, `configuration` (ya están `main`, `admin`).
- `nav`: agregar `myFinances, submitResult, trophies` (ya está como tal), admin nuevos
  (`adminPlayers, salaryRates, adminFinances, editResults, plazos, playerRatings`), fixtures
  (`createLeague, createCup, postSeason`), config (`eventTypes, competitionTypes`).
- `common.appTagline`: la frase del header.
- `userMenu`: ya tiene `account, profile, signOut`. Agregar `language`, `theme` si el dropdown
  unificado los muestra como labels de submenú (o reusar los namespaces `language`/`theme`).
- Mantener **es y en en sync** (regla de `CLAUDE.md`).

### 5.3 NUEVO: `components/layout/sidebar-context.tsx` — estado de colapso
Contexto cliente liviano (reemplaza al `SidebarProvider` de kempes-web, sin Radix):

```tsx
"use client";
// Provee: { collapsed, toggle, setCollapsed }
// - estado inicial desde prop defaultCollapsed (leído de cookie en el layout server)
// - persiste en cookie `sidebar_collapsed` (max-age 7d)
// - listener global Ctrl/Cmd + B → toggle
// - hook useSidebar() que tira error si se usa fuera del provider
```
Montar el provider en `(dashboard)/layout.tsx` envolviendo `AppSidebar` + contenido. Leer la
cookie en el server component para evitar parpadeo (patrón SSR).

### 5.4 `app-sidebar.tsx` — colapso + header con logo/frase
- Ancho animado: `w-64` ↔ `w-[3.25rem]` con `transition-[width]` (consume `useSidebar()`).
- Header: `<Image>` del logo (resize según `collapsed`), `appName` + `appTagline` (ocultos al
  colapsar), y botón toggle (`PanelLeftClose/PanelLeftOpen`).
- Pasar `collapsed` a `<NavLinks>` y al footer.

### 5.5 `nav-links.tsx` — modo icono + tooltips + subgrupos
- Aceptar prop `collapsed`. Si está colapsado: ocultar labels de sección y texto del item, dejar
  solo el icono centrado, y envolver cada link en `<Tooltip>` (label al hover, lado derecho).
- Renderizar las nuevas secciones/subgrupos de `NAV_SECTIONS`.
- En mobile el drawer siempre va expandido (no se le pasa `collapsed`).

### 5.6 Footer → menú de usuario unificado
Refactor de `sidebar-footer.tsx` + `user-menu.tsx` para imitar el dropdown único de kempes-web:
- Un solo `<DropdownMenu>` con trigger = avatar + nombre + email.
- Contenido: cabecera con datos, `DropdownMenuSub` **Idioma** (locales), `DropdownMenuSub` **Tema**
  (claro/oscuro/sistema), separador, ítem **Perfil** (abre el diálogo), separador, **Cerrar sesión**
  (`useSignOut`, variant destructive).
- Base UI ya soporta `DropdownMenuSub/SubTrigger/SubContent` ✅ (verificado en `ui/dropdown-menu.tsx`).
- En estado colapsado: mostrar solo el avatar (sin nombre/email), dropdown hacia la derecha.
- `language-switcher.tsx` / `theme-toggle.tsx` quedan **absorbidos** en el dropdown (se pueden
  borrar o dejar para el header mobile, a decidir → **D2**).

### 5.7 NUEVO: `features/profiles/components/profile-settings-dialog.tsx`
Diálogo para editar perfil (nombre, avatar, etc.) con `<Dialog>` + `<TextField>` + `use-profile`.
Exponerlo desde `features/profiles/index.ts` (barrel). El `UserMenu` lo abre con estado local.

### 5.8 Rutas placeholder (si D1 = ComingSoon)
Crear `page.tsx` mínimos con `<ComingSoon>` para cada ruta ⚠️ del §5.1, bajo
`app/[locale]/(dashboard)/...` y `.../admin/...`.

---

## 6. Orden de implementación sugerido

1. `pnpm ui:add tooltip` + agregar logo a `public/`.
2. `sidebar-context.tsx` + montar provider en el layout (con lectura de cookie).
3. `app-sidebar.tsx`: colapso + header (logo/título/frase/toggle).
4. `nav-links.tsx`: modo icono + tooltips.
5. `nav-config.ts` + traducciones (es/en): nueva estructura de items.
6. Footer: dropdown unificado (idioma/tema/perfil/logout).
7. `profile-settings-dialog.tsx`.
8. Páginas placeholder `<ComingSoon>` para rutas nuevas (según D1).
9. Verificación (§7).

---

## 7. Verificación

- `pnpm typecheck && pnpm lint && pnpm build` en verde (regla de `CLAUDE.md`).
- Probar en `pnpm dev`: colapso (botón + `Ctrl/Cmd+B`), persistencia tras refresh, tooltips en
  colapsado, drawer mobile (`md:hidden`) expandido, dark mode, cambio de idioma, abrir diálogo de
  perfil, cerrar sesión, gating admin (loguear como `manager` vs `admin`).
- Responsive en mobile/tablet/desktop sin desbordes (regla de `CLAUDE.md`).

---

## 8. Decisiones pendientes (confirmar antes de implementar)

- **D1 — Rutas inexistentes**: ¿creamos páginas placeholder con `<ComingSoon>` para todos los
  items nuevos, o cableamos solo los que ya tienen página? *(recomendado: ComingSoon)*
- **D2 — Lang/Theme sueltos**: ¿los absorbemos del todo en el dropdown de usuario (como kempes-web)
  o los dejamos también accesibles en el header mobile? *(recomendado: absorber en el dropdown;
  mantener un acceso en el header mobile)*
- **D3 — Perfil**: ¿diálogo modal (como kempes-web) o página `/profile`? *(recomendado: diálogo)*
- **D4 — Frase del header**: texto exacto del `appTagline`.
- **D5 — Logo**: ¿qué asset usamos? (proveer archivo).
```
