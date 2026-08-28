# Pedido DB — Perfiles (solo lo que falta)

Lista accionable al 2026-08-28. Todo lo que no está acá ya fue entregado y
conectado. Formas JSON detalladas: `db-contract-profiles.md` (§N).
Convenciones de siempre: `jsonb` snake_case, dinero en enteros, `[]` para
listas vacías, `null` si el id no existe.

---

## 1 · Jugador — reponer lo que se fue en la reestructura (URGENTE: `/players` y el perfil están caídos)

### 1a. `get_player_by_id(p_player_id text) → jsonb` ✅ (entregada y conectada 2026-08-28)

Quedan dos flecos: **falta `salary`** en el payload (el hero lo oculta
mientras tanto), y confirmar el mapping de `foot` numérico (asumimos
1 = derecho, 2 = izquierdo). Referencia de lo que pedía:

Bio de `players` + bloque `sofifa` con la fila `is_current_roster = true` de
`player_sofifa_data` tal cual (`to_jsonb(psd)` sirve):

```json
{
  "id": "cody-gakpo-143505",
  "name": "Cody Gakpo",
  "birth_date": "1999-05-07",
  "nationality": "Netherlands",
  "nationality_code": "nl",          // ISO-2 de players, NO el country_id numérico
  "photo_url": "https://firebasestorage...",
  "salary": 6000000,
  "status": "active", "status_label": "Active",
  "category": "senior", "category_label": "Senior",
  "primary_position": "LM",
  "positions": ["LM", "LW"],
  "current_team_id": "REINCIDENTES-FC",
  "loaned_team_id": null,
  "sofifa_link": "https://sofifa.com/player/242516",
  "market_value": 65000000,
  "rating": 83,
  "sofifa": { "overall_rating": 83, "potential": 85, "height": 193, "foot": 1,
              "skill_moves": 4, "weak_foot": 3, "pace": 80, "...": "todas las columnas de player_sofifa_data" }
}
```

`sofifa: null` si no hay datos scrapeados. `foot` es numérico: pasar el
mapping (¿1 = derecho?) o devolverlo como texto.

### 1b. `get_players(p_team_id, p_status, p_category, p_search)`

Como era antes, ideal `SETOF` de una vista recreada (necesitamos que PostgREST
deje ordenar/paginar/contar sobre el resultado). Columnas: las de 1a **sin**
el bloque `sofifa`.

### 1c. `get_player_transfers(p_player_id text) → jsonb`

Misma forma que `get_latest_transfers` pero filtrada por jugador, más
reciente primero (+ `season_id` si está).

### 1d. Fix en `get_squad`

`nationality_code` está devolviendo el `country_id` numérico de SoFIFA (ej.
`34`) → que salga el ISO-2 de `players.nationality_code` (sin eso no hay
banderas). Aplica igual a 1a/1b.

---

## 2 · Club — las 3 pestañas que siguen sin backend

### 2a. `get_team_history(p_team_id text) → jsonb`  (spec §8)

Una fila por (temporada, torneo), temporada más reciente primero: posición o
fase, PJ-G-E-P, GF:GC y logro. Los datos ya existen en
standings/tournaments/trophies de temporadas viejas.

### 2b. `get_team_records(p_team_id text) → jsonb`  (spec §9)

Récords históricos. Con lo que ya hay se puede: máximo goleador histórico,
mejor temporada, y ahora también fichaje/venta más cara (tabla `transfers`).

### 2c. Finanzas  (spec §10)

Falta modelar: tabla de movimientos (`team_id, season_id, kind in/out,
concept, detail, amount, date`) + presupuesto por equipo/temporada, y
`get_team_finances(p_team_id, p_season_id default null)`.
⚠️ Validar adentro `manages_team(p_team_id) or is_admin()`.

---

## 3 · Retoques a funciones existentes

1. `get_team_fixtures` y `get_team_results`: agregar `plazo` (y fecha si
   algún día se carga). Hoy las cards dicen "A confirmar".
2. `get_team_results`: agregar `is_home` (para el "vs/@").
3. `get_squad`: agregar flag `transferable` (hoy todos figuran
   "Intransferible" y el filtro Transferibles da vacío).
4. `get_latest_results`: `competition` devuelve el TIPO ("CUP") en vez del
   nombre del torneo; y confirmar orden `loaded_at desc`.
5. `get_latest_transfers`: reponer `photo_url` (se cayó del payload al
   agregar los escudos).

---

## 4 · A modelar (para completar el perfil de jugador a futuro)

1. **Historial de plantel por temporada** (jugador ↔ equipo ↔ season): sin
   esto no hay "Historial por temporada" completo ni "en el club desde".
2. **`player_values`** (valor por temporada): alimenta el gráfico de
   evolución del valor.

## Orden sugerido

1 (jugador caído) → 3 (retoques) → 2a/2b (historial club) → 4 → 2c (finanzas).
