# Pedido DB — Imágenes (Firebase Storage)

Qué necesita el front para mostrar escudos, fotos y logos que hoy viven en
Firebase Storage. El front **no** va a integrar el SDK de Firebase: solo
necesita **URLs públicas** servidas desde la DB, así que el contrato de abajo
vale igual si en el futuro migran los archivos a otro lado.

## 0 · Decisión: nos quedamos en Firebase Storage (por ahora)

Decidido el 2026-08-26: las imágenes siguen en Firebase Storage. Como el
contrato de abajo son URLs públicas guardadas en la DB, una eventual migración
futura a Supabase Storage (un solo proveedor, mismas policies) sería solo
copiar el bucket y actualizar las URLs — sin tocar nada del front.

## 1 · El contrato: una URL por entidad, expuesta en las funciones

Una columna con la **URL completa y pública** (tal cual se pega en un `<img>`)
por entidad, incluida en las funciones que ya consumimos:

| Entidad | Columna | Exponerla en |
|---|---|---|
| Clubes (escudo) | `teams.crest_url` ✅ | ✅ Entregado (2026-08-27) como `club_logo` en `get_all_teams` — con eso alcanza: el front resuelve todos los escudos de la app desde ahí (no hace falta sumarlo a las demás funciones). Falta cargar los archivos: hoy 1 de 93 equipos tiene logo |
| Jugadores (foto) | `players.photo_url` | ⚠️ Parcial (2026-08-28): ya viene en `get_latest_transfers` ✅. Falta en `v_players_full` (cubre `get_players` y `get_player_by_id`) y `get_squad` — con eso las fotos aparecen en el listado, la plantilla y el perfil. Ojo: algunas URLs dan 404 (archivo no subido); el front tiene fallback |
| Torneos (logo, si existen) | `tournaments.logo_url` | `get_tournaments_by_season`, `get_season_champions` |
| Noticias (portada, a futuro) | `news.image_url` | `get_news` cuando exista (§6 de `db-pending-home.md`) |

`null` cuando no hay imagen — el front ya tiene fallback (iniciales sobre
color) y no se rompe nada.

⚠️ Detalle clave de Firebase: las URLs de descarga tienen la forma
`https://firebasestorage.googleapis.com/v0/b/<bucket>/o/<ruta-encodeada>?alt=media&token=…`.
**Si cada archivo tiene token propio, una convención de nombres no sirve** —
hay que guardar la URL completa en la DB. Si las rutas son públicas sin token
y siguen una convención determinística (ej. `escudos/{team_id}.png`), alcanza
con pasar bucket + convención y el front arma las URLs; igual la columna en DB
es más robusta ante renombres.

## 2 · Accesibilidad

Confirmar que las reglas de Storage permiten **lectura pública sin
autenticación de Firebase** para esas rutas. Los usuarios de nuestra app están
logueados en Supabase, no en Firebase: si la regla exige `request.auth`, el
navegador no va a poder cargar ninguna imagen.

## 3 · Inventario + ejemplos

- ¿Qué imágenes existen hoy? (¿escudos de los 93 clubes? ¿fotos de jugadores o
  se usan las de SoFIFA/Transfermarkt? ¿logos de torneos?)
- **2–3 URLs de ejemplo** (un escudo, una foto) para probar acceso y formato
  antes de cablear nada.
- Formato/tamaño aproximado de los archivos (png/webp, dimensiones), por si
  conviene fijar `sizes` en `next/image`.

## Qué hace el front cuando esté

- `ClubAvatar` renderiza el escudo con fallback a las iniciales de color
  actuales (si la URL falta o falla, se ve como hoy).
- Ídem avatar de jugador (iniciales → foto).
- Host agregado a `images.remotePatterns` de `next.config` para `next/image`.
- Tipos y services actualizados para leer `crest_url` / `photo_url` de los
  RPCs. Nada más: sin SDK de Firebase, sin credenciales nuevas en `.env`.
