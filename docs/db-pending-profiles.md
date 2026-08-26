# Pedido DB — lo que falta para cerrar los perfiles

Auditoría al 2026-08-26 de las páginas `/teams/[id]` y `/players/[id]` contra la
API actual de Supabase. Las formas JSON detalladas de cada función pedida están
en `db-contract-profiles.md` (se referencian como §N); acá está **qué falta,
dónde se nota en la pantalla y con qué prioridad**.

Convenciones: igual que todo lo existente — RPC que devuelve `jsonb` con claves
`snake_case`, dinero en enteros, temporadas `"T31"`, `null` si el id no existe,
listas vacías como `[]` (no `null`).

---

## A. Perfil de club — pestaña por pestaña

### A1. Resumen — conectado ✅, con estos huecos

| Bloque | Estado | Falta |
|---|---|---|
| Hero (nombre, DT, récord, forma, rating/valor/edad, posición) | ✅ real | color/escudo del club (**C4**) |
| Trofeos | ✅ real (`get_team_trophies`) | — |
| Próximos partidos | ✅ real (`get_team_fixtures`) | fecha o `plazo` (**C1**); opcional: contacto del rival (**C7**) |
| Últimos resultados | ✅ real (`get_team_results`) | fecha o `plazo` (**C1**) y `is_home` (**C2**) |
| Mejor XI | ✅ calculado en front desde `get_squad` | — |
| Clasificación | ✅ real (`get_standings_by_tournament`) | columna `note`/zona: "Campeón", "Clasifica", "Descenso" (**C5**, opcional) |
| Goleador / MVP | ✅ real (stats agregadas) | — |
| Transferibles | ⚠️ vacío siempre | flag `transferable` (**C3**) |

### A2. Plantilla — conectada ✅

- Falta el flag **`transferable`** (**C3**): hoy todos figuran "Intransferible" y
  el filtro "Transferibles" da vacío.
- Performance (opcional, **C6**): las stats por jugador se arman en el front
  sumando `get_player_stats_by_tournament` por cada torneo del equipo (6+
  llamadas por visita). Una función agregada evitaría eso:

```sql
get_team_player_stats(p_team_id text, p_season_id text default null) → jsonb
-- [{ "player_id": "...", "matches_played": 15, "goals": 24, "assists": 5,
--    "mvps": 2, "yellow_cards": 3, "red_cards": 0 }]
```

### A3. Historial — 100% MOCK ❌

No hay ninguna función. Los datos base existen (standings + tournaments +
trophies de temporadas viejas), falta exponerlos agregados:

- **`get_team_history(p_team_id)`** → spec **§8** de `db-contract-profiles.md`:
  una fila por (temporada, torneo) con posición/fase, PJ-G-E-P, GF:GC y logro.
  Con ids reales: `season: "T31"`, `competition: "Liga Mayores T31"`,
  `competition_kind: "LEAGUE"|"CUP"`, `division`.
- **`get_team_records(p_team_id)`** → spec **§9**: máximo goleador histórico y
  mejor temporada salen de lo que ya hay; "fichaje/venta más cara" depende de
  que exista la tabla de transferencias (**D1**) — si aún no está, devolver
  solo los récords calculables.

### A4. Finanzas — 100% MOCK ❌

No existen ni las tablas ni la función:

- Tablas (**D2**): movimientos (`team_id, season_id, kind in/out, concept,
  detail, amount, date`) y presupuesto por equipo/temporada.
- **`get_team_finances(p_team_id, p_season_id default null)`** → spec **§10**.
  ⚠️ Seguridad: validar adentro `manages_team(p_team_id) or is_admin()`.

---

## B. Perfil de jugador — todo MOCK salvo la bio disponible

### B1. Cabecera — `v_players_full` cubre parte

Ya hay: nombre, nacimiento, nacionalidad, posiciones, salario, club actual,
rating, valor de mercado, link sofifa/transfermarkt.

**Faltan campos** (spec **§11**; los scrapeables están en sofifa):
`height_cm`, `foot` (pie hábil), `weak_foot` (1–5), `skill_moves` (1–5),
`attacking_rate`/`defensive_rate` (low/medium/high), `potential`,
"en el club desde" (temporada de llegada al club actual), y para el bloque de
valor: `value_rank` (puesto por valor en la liga) y `position_avg_value`
(promedio de valor de su posición en la liga).

### B2. Atributos — la tabla YA EXISTE, falta exponerla

`players_scrapped_stats` tiene los 30 atributos + los 5 de arquero, por
`version` (FC 24/25/26) y fecha (hoy 1.248 filas; no todos los jugadores están
cubiertos — ej. `alejandro-frances-632896` no tiene filas). Pedido:

```sql
get_player_attributes(p_player_id text) → jsonb
-- la fila MÁS RECIENTE (última version_date) del jugador, tal cual la tabla;
-- null si no hay datos scrapeados.
```

Los promedios por grupo (Ritmo/Tiro/Pase/Regate/Defensa/Físico) los calcula el
front. Si pueden, sumar `weak_foot`/`skill_moves`/`height`/`foot`/`potential`
al scrapeo (sofifa los tiene) y devolverlos acá o en B1.

### B3. Historial por temporada — falta el dato de fondo

Spec **§12**. Las stats por torneo existen (`v_tournament_player_stats`), pero
**no hay registro de en qué club estuvo el jugador en temporadas pasadas**
(solo `current_team_id`). Hace falta o una tabla de historial de plantel por
temporada (**D3**) o derivarlo si tienen cómo. Sin eso, esta sección no se
puede armar.

### B4. Transferencias — falta modelar

Spec **§13**. **No existe tabla `transfers`** (**D1**): `player_id`,
`from_team_id`, `to_team_id`, `kind` (compra/cesión/libre), `fee`, `date`,
`season_id` + `get_player_transfers(p_player_id)`. También alimenta los récords
de A3 y (a futuro) los movimientos de A4.

### B5. Evolución de valor — falta el histórico

Spec **§14**. Hoy solo hay el valor actual (`players_scrapped_data`). Opciones:
guardar snapshot por temporada (`player_values`: `player_id, season_id, value,
team_id, rating`) (**D4**), o si conservan los scrapeos viejos, exponerlos:
`get_player_value_history(p_player_id)`.

### B6. Ranking de valor — calculable ya

Spec **§15**: `get_value_ranking(p_tournament_id, p_player_id, p_limit default 5)`
sobre `players` ordenado por `market_value` (jugadores de los equipos de ese
torneo), marcando `is_self` y agregando la fila del jugador si queda fuera del
top.

---

## C. Retoques rápidos (funciones existentes)

1. **`get_team_fixtures`**: agregar `plazo` (y `scheduled_at` si algún día se
   carga) para poder mostrar "Plazo N" en vez de "A confirmar".
2. **`get_team_results`**: agregar `is_home` (para el "vs/@") y `plazo`/fecha.
3. **`get_squad`**: agregar `transferable boolean` (o el estado que lo modele).
4. **`teams`**: columna `color` (hex) — y opcional `crest_url` — expuesta en
   `get_all_teams`, `get_team_profile` y en el rival de
   `get_team_fixtures`/`get_team_results`. Hoy el front inventa un color
   estable a partir del id.
5. **standings**: campo `note`/zona por fila ("Campeón", "Clasifica",
   "Descenso") — opcional.
6. **`get_team_player_stats`** agregada por temporada (A2) — opcional,
   performance.
7. **`get_team_fixtures`**: `rival_manager_whatsapp`/`mail` para el botón
   "Contactar rival" — opcional.

## D. Tablas nuevas a modelar

| # | Tabla | Alimenta |
|---|---|---|
| D1 | `transfers` | B4, récords de A3, movimientos de A4 |
| D2 | finanzas (movimientos + presupuestos) | A4 |
| D3 | historial de plantel por temporada (jugador ↔ equipo ↔ season) | B3, y B1 ("en el club desde") |
| D4 | `player_values` (valor por temporada) | B5 |

## Prioridad sugerida

1. **C1–C4** (retoques: plazo, is_home, transferable, color) — cierran el
   Resumen y la Plantilla del club.
2. **A3** (`get_team_history` + `get_team_records` con lo calculable) — cierra
   la pestaña Historial.
3. **B1 + B2 + B6** (campos de cabecera, exponer atributos, ranking) — dejan el
   perfil de jugador mayormente real.
4. **D1/D3/D4 + B3/B4/B5** (modelar transferencias, historial de plantel,
   valores) — completan jugador.
5. **D2 + A4** (finanzas) — lo más grande, va último.
