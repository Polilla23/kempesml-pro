# Contrato DB — Perfil de club y perfil de jugador

> **➡️ La lista viva de pendientes está en `db-pending-profiles.md`** (auditoría
> pestaña por pestaña + prioridades). Este archivo queda como spec de formas.
>
> **Estado (2026-08-25):** el perfil de club ya está conectado a la API real
> (`get_team_profile`, `get_team_trophies`, `get_team_fixtures`,
> `get_team_results`, `get_squad`, `get_standings_by_tournament`,
> `get_player_stats_by_tournament`, `get_tournaments_by_season`,
> `get_active_season`, `get_all_teams`) — el front compone en la capa de
> services. Existe `players_scrapped_stats` con los atributos SoFIFA (falta una
> función/vista que la exponga para el perfil de jugador).
> **Sigue pendiente de backend:** historial multi-temporada del club (§8),
> récords (§9), finanzas (§10); del jugador: atributos (§11), historial por
> temporada (§12), transferencias (§13) y evolución de valor (§14). Detalles
> menores: flag `transferable`, color/escudo por club, fecha o plazo en
> `get_team_fixtures`/`get_team_results` y `is_home` en `get_team_results`.
> Las secciones de abajo valen como spec de lo pendiente.

Funciones de Postgres (RPC vía Supabase) que el front necesita para las páginas
`/teams/[id]` y `/players/[id]`. Hoy ambas páginas corren con datos mock que
tienen **exactamente** estas formas; cuando existan las funciones, el front solo
reemplaza el cuerpo de los services
(`src/features/teams/services/team-profile.service.ts` y
`src/features/players/services/player-profile.service.ts`).

## Convenciones (aplican a todas)

- Mismo patrón que `get_team_by_id`: `security definer`, `language sql/plpgsql`,
  `grant execute to authenticated`. El front llama `supabase.rpc("fn", { p_... })`.
- Retornan **`jsonb`** ya con la forma final (`jsonb_build_object` / `jsonb_agg`).
  Claves en `snake_case`. Listas vacías → `'[]'::jsonb`, no `null`.
- Si el `p_team_id` / `p_player_id` no existe → `null` (no excepción).
- **Dinero** en unidades enteras (euros), sin formatear: `180000000`, no `"€180M"`.
- **Fechas** ISO (`"2026-08-24T21:00:00"` / `"2026-08-24"`). El front las localiza.
- **Temporadas** como etiqueta corta `"T8"` (campo `season`/`season_label`).
- **Ids** como `text` (igual que `teams.id`).
- `competition_kind` es un enum de texto: `league | cup | youth | gold | silver`
  (Liga · Copa Kempes · Kempesita · Copa de Oro · Copa de Plata). Decide ícono y color.
- Referencia de club embebida (se repite en varios lugares):

```json
{ "id": "boca-juniors", "name": "Boca Juniors", "color": "#1d3f8a", "manager_name": "eltano_dt" }
```
`color` es el color primario del club (CSS). `manager_name` solo donde se indique.

- Campos que hoy no existen en `teams` y hacen falta: `color`, `division`/`competition`
  actual, `formation`. Y falta todo el dominio de jugadores/partidos (ver el final).

---

## A. Perfil de club

### 1. `get_team_profile(p_team_id text) → jsonb`
Cabecera de la página. Agregados de la temporada actual.

```json
{
  "id": "river-plate", "name": "River Plate", "color": "#d11b2e",
  "manager_name": "xPedro_92",
  "season_label": "T8", "formation": "4-3-3",
  "division_name": "Primera División Mayores", "division_position": 1,
  "squad_rating": 84, "squad_value": 612000000, "squad_size": 16, "avg_age": 26.4,
  "form": ["W", "W", "D", "W", "W"],
  "record": { "played": 18, "won": 14, "drawn": 3, "lost": 1, "points": 45 },
  "trophies": [
    { "competition": "Liga Primera División", "short_name": "Liga 1ª", "kind": "league", "seasons": ["T4", "T7"] },
    { "competition": "Copa Kempes", "short_name": "C. Kempes", "kind": "cup", "seasons": ["T6"] }
  ]
}
```
- `form`: últimos 5 resultados, del más viejo al más nuevo (`W|D|L`).
- `squad_rating`: promedio (o el criterio que usen) de la media del plantel.
- `trophies`: agrupados por competición; el front cuenta `seasons.length`.

### 2. `get_team_fixtures(p_team_id text, p_limit int default 5) → jsonb`
Próximos partidos no jugados, cualquier competición, ordenados por fecha.

```json
[
  { "id": "m-1031", "competition": "Liga", "competition_kind": "league",
    "kickoff_at": "2026-08-24T21:00:00", "is_home": true,
    "rival": { "id": "boca-juniors", "name": "Boca Juniors", "color": "#1d3f8a", "manager_name": "eltano_dt" } }
]
```

### 3. `get_team_results(p_team_id text, p_limit int default 5) → jsonb`
Últimos partidos jugados, más reciente primero, desde el punto de vista del equipo.

```json
[
  { "id": "m-1020", "result": "W", "is_home": true, "rival_name": "Boca Juniors",
    "competition": "Liga", "played_at": "2026-08-15", "goals_for": 3, "goals_against": 1 }
]
```

### 4. `get_team_best_xi(p_team_id text) → jsonb`
Mejor once por media según la formación del equipo. `slot` es la posición en la
formación: `0` = arquero, luego las líneas de atrás hacia adelante, de izquierda a
derecha (4-3-3: 1-4 defensas, 5-7 medios, 8-10 delanteros). El front dibuja la cancha.

```json
{ "formation": "4-3-3",
  "players": [
    { "player_id": "ederson", "short_name": "Ederson", "rating": 88, "slot": 0 },
    { "player_id": "haaland", "short_name": "Haaland", "rating": 94, "slot": 9 }
  ] }
```

### 5. `get_team_standings(p_team_id text) → jsonb`
Una tabla por cada competición **activa** en la que participa el equipo esta
temporada (liga, grupo de copa, grupo juvenil…). El front pagina entre ellas.

```json
[
  { "competition_id": "liga-1-t8", "competition_name": "Liga Primera Mayores",
    "rows": [
      { "position": 1, "team_id": "river-plate", "team_name": "River Plate",
        "played": 18, "goal_diff": 30, "points": 45, "note": "Campeón", "is_self": true },
      { "position": 6, "team_id": "velez", "team_name": "Vélez",
        "played": 18, "goal_diff": -12, "points": 17, "note": "Descenso", "is_self": false }
    ] }
]
```
- `note`: texto libre o `null` ("Campeón", "Copa Oro", "Clasifica", "Descenso").
- Alternativa: vista `v_standings(competition_id, …)` y el front hace el filtro.
  Preferimos la función por ahora (una sola llamada).

### 6. `get_team_squad(p_team_id text) → jsonb`
Plantel completo con stats de la temporada actual. Son ≤ 30 filas: filtro y orden
se hacen en el front.

```json
[
  { "player_id": "haaland", "name": "Erling Haaland", "nationality_flag": "🇳🇴",
    "position": "DC", "position_group": "FWD",
    "rating": 94, "played": 15, "goals": 24, "assists": 5,
    "salary": 450000, "value": 180000000, "transferable": false }
]
```
- `position`: código que usen (`POR`, `DFC`, `LI`, `MCD`, `DC`, …).
- `position_group`: `GK | DEF | MID | FWD` (para los filtros).
- `nationality_flag`: emoji de bandera. Si prefieren, devuelvan `nationality_code`
  (ISO-2) y lo convertimos en el front — avisen cuál.

### 7. `get_team_highlights(p_team_id text) → jsonb`
Goleador y MVP de la temporada actual.

```json
{
  "top_scorer": { "player_id": "haaland", "name": "Erling Haaland", "position": "DC", "rating": 94, "played": 15, "goals": 24 },
  "mvp": { "player_id": "de-bruyne", "name": "Kevin De Bruyne", "position": "MC", "rating": 91, "goals": 7, "assists": 14, "mvp_awards": 6 }
}
```

### 8. `get_team_history(p_team_id text) → jsonb`
Una fila por (temporada, competición). Temporada más reciente primero; dentro de
la temporada, liga primero.

```json
[
  { "season": "T8", "competition": "Liga Primera Mayores", "competition_kind": "league",
    "position_label": "1°", "played": 18, "won": 14, "drawn": 3, "lost": 1,
    "goals_for": 42, "goals_against": 12,
    "achievement": "🏆 Campeón (en curso)", "achievement_kind": "gold" },
  { "season": "T8", "competition": "Copa Kempes", "competition_kind": "cup",
    "position_label": "Semifinal", "played": 4, "won": 3, "drawn": 0, "lost": 1,
    "goals_for": 9, "goals_against": 4, "achievement": "En juego", "achievement_kind": "ok" }
]
```
- `position_label`: `"1°"` para ligas, fase para copas (`"Cuartos"`, `"Final"`, `"Campeón"`).
- `achievement_kind`: `gold` (título) · `ok` (subcampeón / clasificó / en juego) · `none`.

### 9. `get_team_records(p_team_id text) → jsonb`
Récords históricos del club. Lista abierta: el front muestra lo que venga.

```json
[
  { "key": "top_scorer",  "label": "Máximo goleador histórico", "value": "Haaland · 46 goles", "detail": "Desde T6 · 24 en T8", "tone": "green" },
  { "key": "top_signing", "label": "Fichaje más caro", "value": "€180M · Haaland", "detail": "Desde Manchester City · T8", "tone": "blue" },
  { "key": "top_sale",    "label": "Venta más cara", "value": "€95M · Julián Álvarez", "detail": "A Real Madrid · T6", "tone": "blue" },
  { "key": "best_season", "label": "Mejor temporada", "value": "T7 · 54 pts", "detail": "17G 3E 2P", "tone": "gold" }
]
```
`tone`: `green | blue | gold`.

### 10. `get_team_finances(p_team_id text, p_season_id text default null) → jsonb`
Finanzas de la temporada (`null` = actual). **Sensible**: validar adentro que
`auth.uid()` sea el manager del equipo (`manages_team(p_team_id)`) o admin
(`is_admin()`); si no, `raise exception 'forbidden'`.

```json
{
  "season_label": "T8",
  "income": 245000000, "expenses": 198000000, "balance": 47000000, "budget": 82000000,
  "movements": [
    { "id": "mv-1", "kind": "out", "concept": "Compra: Erling Haaland", "detail": "Transferencia desde Manchester City", "date": "2026-01-14", "amount": 180000000 },
    { "id": "mv-6", "kind": "out", "concept": "Salarios del plantel", "detail": "Acumulado Temporada 8", "date": null, "amount": 18000000 }
  ]
}
```
- `kind`: `in | out`. `amount` siempre positivo. `date` `null` para acumulados.

---

## B. Perfil de jugador

### 11. `get_player_profile(p_player_id text) → jsonb`
Cabecera + bloque de atributos.

```json
{
  "id": "haaland", "name": "Erling Haaland", "short_name": "Haaland",
  "position": "DC", "position_label": "Delantero Centro", "secondary_position": null,
  "nationality": "Noruega", "nationality_flag": "🇳🇴",
  "birth_date": "2000-07-21", "height_cm": 195, "foot": "left",
  "salary": 450000, "joined_season": "T8",
  "team": { "id": "river-plate", "name": "River Plate", "color": "#d11b2e", "division_name": "Primera División Mayores" },
  "value": 180000000, "value_rank": 1, "position_avg_value": 53000000,
  "overall": 94, "potential": 95, "skill_moves": 3, "weak_foot": 3,
  "attacking_rate": "high", "defensive_rate": "medium",
  "attributes": [
    { "key": "pace", "value": 89, "items": [ { "key": "acceleration", "value": 87 }, { "key": "sprint_speed", "value": 90 } ] },
    { "key": "shooting", "value": 95, "items": [ { "key": "positioning", "value": 96 }, { "key": "finishing", "value": 96 } ] }
  ]
}
```
- `foot`: `left | right | both`. `attacking_rate`/`defensive_rate`: `low | medium | high`.
- `value_rank`: puesto por valor dentro de la **liga** del equipo.
- `position_avg_value`: promedio de valor de los jugadores de la misma posición en la liga.
- `attributes`: siempre los 6 grupos en este orden: `pace, shooting, passing, dribbling,
  defending, physical`. Claves de sub-atributos (las traduce el front, tienen que
  ser exactamente estas):

| grupo | items |
|---|---|
| pace | acceleration, sprint_speed |
| shooting | positioning, finishing, shot_power, long_shots, volleys, penalties |
| passing | vision, crossing, fk_accuracy, short_passing, long_passing, curve |
| dribbling | agility, balance, reactions, ball_control, dribbling, composure |
| defending | interceptions, heading_accuracy, def_awareness, standing_tackle, sliding_tackle |
| physical | jumping, stamina, strength, aggression |

Si los atributos que cargan son otros, avisen y ajustamos la lista.

### 12. `get_player_seasons(p_player_id text) → jsonb`
Historial por temporada, más reciente primero, con desglose por competición anidado.
El front calcula totales y goles/partido.

```json
[
  { "season": "T8",
    "team": { "id": "river-plate", "name": "River Plate", "color": "#d11b2e" },
    "division_name": "Primera", "rating": 94,
    "played": 15, "goals": 24, "assists": 5, "yellow_cards": 2, "red_cards": 0,
    "value": 180000000,
    "competitions": [
      { "competition": "Liga Primera", "competition_kind": "league", "stage": "1° (en curso)",
        "played": 11, "goals": 18, "assists": 4, "yellow_cards": 2, "red_cards": 0 },
      { "competition": "Copa Kempes", "competition_kind": "cup", "stage": "Semifinal",
        "played": 4, "goals": 6, "assists": 1, "yellow_cards": 0, "red_cards": 0 }
    ] }
]
```
- `rating` y `value`: los del cierre de esa temporada (o actuales si está en curso).

### 13. `get_player_transfers(p_player_id text) → jsonb`
Más reciente primero. El front suma `fee`.

```json
[
  { "id": "tr-88", "season": "T8", "date": "2026-01-14",
    "from": { "id": "manchester-city", "name": "Manchester City", "color": "#6cabdd" },
    "to":   { "id": "river-plate", "name": "River Plate", "color": "#d11b2e" },
    "kind": "purchase", "fee": 180000000 }
]
```
`kind`: `purchase | loan | free`.

### 14. `get_player_value_history(p_player_id text) → jsonb`
Valor al cierre de cada temporada, **de la más vieja a la más nueva**, con el club
de ese momento (marca los cambios de club en el gráfico).

```json
[
  { "season": "T1", "value": 5000000,   "team": { "id": "rb-salzburgo", "name": "RB Salzburgo", "color": "#c8102e" } },
  { "season": "T8", "value": 180000000, "team": { "id": "river-plate", "name": "River Plate", "color": "#d11b2e" } }
]
```

### 15. `get_value_ranking(p_competition_id text, p_player_id text, p_limit int default 5) → jsonb`
Top N por valor de la liga. Si el jugador no entra en el top, agregar su fila al final.

```json
[
  { "position": 1, "player_id": "haaland", "name": "E. Haaland", "team_name": "River", "value": 180000000, "is_self": true },
  { "position": 2, "player_id": "mbappe",  "name": "K. Mbappé",  "team_name": "Boca",  "value": 175000000, "is_self": false }
]
```
Para poder llamarla, `get_player_profile` (11) debería devolver también
`"league_competition_id": "liga-1-t8"` dentro de `team`. Lo mismo sirve en
`get_team_profile` (1) como `"league_competition_id"`.

---

## C. Datos que tienen que existir para que esto sea posible

Hoy solo hay `teams` y `profiles`. Mínimo necesario (nombres orientativos):

- `teams`: + `color`, `formation`, `short_name`.
- `seasons` (`id`, `label` "T8", `is_current`).
- `competitions` (`id`, `season_id`, `name`, `kind`, `division_level`) y `competition_teams`.
- `matches` (`competition_id`, `home_team_id`, `away_team_id`, `kickoff_at`, `home_goals`, `away_goals`, `played`).
- `players` (bio, `team_id`, `position`, `position_group`, `nationality`, `foot`, `salary`, `value`, `overall`, `potential`, `transferable`, `joined_season_id`).
- `player_attributes` (una fila por jugador y temporada, 29 columnas de la tabla de arriba + `skill_moves`, `weak_foot`, rates).
- `player_competition_stats` (`player_id`, `competition_id`, `played`, `goals`, `assists`, `yellow_cards`, `red_cards`) — las stats por temporada salen de agregar esto.
- `player_values` (`player_id`, `season_id`, `value`, `team_id`, `rating`) — histórico.
- `transfers` (`player_id`, `from_team_id`, `to_team_id`, `kind`, `fee`, `date`, `season_id`).
- `titles` (`team_id`, `competition_id`) o derivarlo de `competitions.winner_team_id`.
- `finance_movements` (`team_id`, `season_id`, `kind`, `concept`, `detail`, `amount`, `date`) + `team_budgets`.
- `awards` (MVP por temporada) o columna en `player_competition_stats`.

**Índices** sugeridos: `matches(home_team_id, kickoff_at)`, `matches(away_team_id, kickoff_at)`,
`player_competition_stats(player_id)`, `player_competition_stats(competition_id, goals desc)`,
`player_values(player_id, season_id)`, `transfers(player_id, date desc)`,
`players(team_id)`, `players(position, value desc)`.

## D. Orden sugerido de entrega

1. `get_team_profile` + `get_team_squad` + `get_player_profile` (desbloquean ambas cabeceras).
2. `get_team_standings`, `get_team_fixtures`, `get_team_results`, `get_team_best_xi`, `get_team_highlights`.
3. `get_player_seasons`, `get_player_value_history`, `get_player_transfers`, `get_value_ranking`.
4. `get_team_history`, `get_team_records`, `get_team_finances`.

Cada función se puede entregar por separado: el front conmuta una a una.
