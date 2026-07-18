# Kempes ML

Web app donde los managers arman su equipo y compiten en ligas y copas.
**Next.js 16** (App Router) · TypeScript · Tailwind v4 · shadcn/ui (Base UI) ·
TanStack Query · Supabase · next-intl · **pnpm**.

## Requisitos

- **Node.js** ≥ 20
- **pnpm** (gestor de paquetes del proyecto — **no usar `npm`/`yarn`**).
  Si no lo tenés: `npm install -g pnpm` o `corepack enable`.

## Puesta en marcha

```bash
# 1. Clonar e instalar dependencias (con pnpm, no npm)
git clone git@github.com:Polilla23/kempesml-pro.git
cd kempesml-pro
pnpm install

# 2. Variables de entorno
cp .env.example .env.local
#   Completá .env.local con las claves reales de Supabase.
#   ⚠️ .env.local NO está en el repo (está en .gitignore) — pedíselas a un
#      compañero del equipo. Se sacan de Supabase → Project Settings → API.

# 3. Levantar en desarrollo
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000). Sin sesión te redirige a `/sign-in`.

### Variables de entorno (`.env.local`)

| Variable | Dónde se usa |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase (cliente + server) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo server (scripts/migraciones que saltean RLS). **Nunca** exponer al browser |

> Sin `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY` la app no arranca.

## Scripts

```bash
pnpm dev            # desarrollo
pnpm build          # build de producción
pnpm typecheck      # tsc --noEmit
pnpm lint           # eslint
pnpm db:types:rest  # regenerar tipos de la DB desde el REST
pnpm ui:add <comp>  # agregar un componente de shadcn
```

**Antes de commitear**: `pnpm typecheck && pnpm lint && pnpm build` en verde.

## Convenciones

Ver [`CLAUDE.md`](./CLAUDE.md) — es la fuente de verdad de arquitectura y convenciones
(estructura por features, i18n con next-intl, acceso a datos con Supabase, etc.).
