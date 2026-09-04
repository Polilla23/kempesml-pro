# Pedido DB — Imágenes (verificado el 2026-08-28)

Decisión vigente: las imágenes quedan en **Firebase Storage** (URLs públicas
guardadas/armadas en la DB; el front nunca toca el SDK de Firebase). Una
migración futura a Supabase Storage sería solo copiar el bucket y actualizar
URLs.

## Estado

| Imagen | Estado |
|---|---|
| Escudos de clubes | ✅ Conectado (`club_logo` en `get_all_teams` desde `teams.crest_url`; también en `get_latest_transfers`). El front los muestra en toda la app con fallback a iniciales. **Falta cargar los archivos: la gran mayoría de los 93 equipos aún no tiene logo subido** |
| Fotos de jugadores | ⚠️ Parcial: vienen en `get_squad` y `get_player_by_id` ✅. Falta: reponerla en `get_latest_transfers` y que venga en el futuro `get_players` (ver `db-pending-profiles.md` §1a/§2). Algunas URLs dan 404 (archivo no subido) — el front tiene fallback, es solo cargar los archivos |
| Logos de torneos | Pendiente (opcional): `tournaments.logo_url` expuesto en `get_tournaments_by_season` y `get_season_champions` |
| Imagen de noticias | Va junto con la tabla `news` (`db-pending-home.md` §6) |

## Recordatorios técnicos

- URL **completa y pública** (sin exigir auth de Firebase), `null` cuando no
  hay imagen — el front no se rompe.
- Si un archivo no existe, la URL devuelve 404 y el front cae a iniciales:
  subir los archivos que falten con el nombre que arma la convención.
