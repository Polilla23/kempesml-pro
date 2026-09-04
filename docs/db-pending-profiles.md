# Pedido DB — lo que falta (verificado contra la DB el 2026-08-28)

Lista accionable y completa. Todo lo que no figura acá ya está entregado y
conectado. Formas JSON detalladas de referencia: `db-contract-profiles.md`
(§N). Convenciones de siempre: `jsonb` snake_case, dinero en enteros, `[]`
para listas vacías, `null` si el id no existe.

---

## 1 · Funciones que faltan CREAR

### 1a. `get_players` ✅✅ (tipada con v_players_full y conectada 2026-09-04)

Perfecta: `SETOF v_players_full` con salary incluido. El listado volvió al
modo paginado en servidor (búsqueda por `normalized_name`, orden y count en
la DB). Sin flecos.

### 1b. `get_player_transfers` ✅ (entregada y conectada 2026-09-04) — con 2 flecos

- 🐛 **Mismo bug de duplicados que tenía `get_latest_transfers`**: devuelve
  filas repetidas (probado: Upamecano 26 filas, 13 ids únicos). El front las
  muestra tal cual (política acordada: se arregla en la función).
- Devuelve `null` cuando el jugador no tiene transferencias → mejor `[]`
  (el front lo tolera igual).

### 1c. `get_team_history(p_team_id text) → jsonb`  (forma: spec §8)

Pestaña "Historial" del club. Una fila por (temporada, torneo), más reciente
primero: posición o fase, PJ-G-E-P, GF:GC y logro. Los datos ya existen en
standings/tournaments/trophies de temporadas viejas.

### 1d. `get_team_records(p_team_id text) → jsonb`  (forma: spec §9)

Récords históricos del club: máximo goleador, mejor temporada, y fichaje/
venta más cara (la tabla `transfers` ya existe).

### 1e. Finanzas  (forma: spec §10)

Pestaña "Finanzas" del club. Falta modelar: movimientos (`team_id,
season_id, kind in/out, concept, detail, amount, date`) + presupuesto por
equipo/temporada, y `get_team_finances(p_team_id, p_season_id default null)`.
⚠️ Validar adentro `manages_team(p_team_id) or is_admin()`.

---

## 1f · Página "Historia" (palmarés) — mejoras opcionales

La página ya funciona componiendo `get_seasons` × `get_season_champions`
(~32 llamadas, cacheadas). Cuando puedan:

1. **`get_palmares() → jsonb`**: todos los títulos en una sola llamada
   (`[{ team_id, team_name, tournament_id, tournament_name, tournament_type,
   division, category, season_id }]`).
2. **Puntaje por título en la DB** (ej. columna `palmares_points` en
   `tournament_types` o tabla de config): hoy los puntos del ranking son
   provisorios, definidos en el front (`src/features/history/points.ts`).
3. Para la pestaña "Récords" (hoy "próximamente"): récords globales de la
   liga (goleador histórico, más títulos, transferencia récord, etc.).

## 2 · Retoques a funciones que YA existen (una línea cada uno)

| Función | Retoque |
|---|---|
| `get_player_by_id` | falta **`salary`** en el payload; confirmar mapping de `foot` numérico (asumimos 1 = derecho, 2 = izquierdo) |
| `get_squad` | ~~ISO-2~~ ✅ corregido (2026-09-04). Falta solo: agregar flag **`transferable`** (hoy el filtro "Transferibles" da vacío) |
| `get_latest_transfers` | reponer **`photo_url`** (se cayó al agregar los escudos) |
| `get_latest_results` | `competition` devuelve el TIPO (`"CUP"`) → mandar el **nombre del torneo** |
| `get_team_fixtures` / `get_team_results` | agregar **`plazo`** (hoy las cards dicen "A confirmar"); results además **`is_home`** (para el "vs/@") |

---

## 3 · A modelar (completan el perfil de jugador a futuro)

1. **Historial de plantel por temporada** (jugador ↔ equipo ↔ season): sin
   esto no hay "Historial por temporada" completo ni "en el club desde".
2. **`player_values`** (valor por temporada + club): alimenta el gráfico de
   evolución del valor.

## Orden sugerido

1a (caído) → 2 (retoques) → 1b → 1c/1d → 3 → 1e (finanzas).
