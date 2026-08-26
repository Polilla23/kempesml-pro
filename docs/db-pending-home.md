# Pedido DB — Home

Lo que falta del lado de la DB para completar la **home** (`/dashboard`,
diseño "Home" de Claude Design). Ya conectado con lo existente: línea de
temporada activa (`get_active_season`), carrusel de tablas de todas las ligas
de la temporada (`get_tournaments_by_season` + `get_standings_by_tournament`)
y "Tus partidos" del equipo del manager (`get_team_fixtures`).

Convenciones: las mismas de siempre (`jsonb` snake_case, dinero en enteros,
listas vacías `[]`, `null` si no hay datos). Cada sección indica el `TODO(db)`
que la referencia en el código.

## §1 · KPIs del hero — `get_season_summary`

```sql
get_season_summary(p_season_id text default null) → jsonb
-- null = temporada activa
{
  "season_id": "T31",
  "matches_played": 847,
  "matches_total": 1050,
  "transfers_count": 234,       -- de la temporada ANTERIOR (o null si no hay tabla transfers)
  "transfers_amount": 1200000000
}
```
- `matches_played/total` sale de `matches` (status PLAYED vs todos) de los
  torneos de la temporada. Si sirve, pueden exponer también
  `v_tournament_general_stats` como `get_tournament_general_stats(p_season_id)`.
- Las dos métricas de transferencias dependen de la tabla `transfers`
  (pedido D1 de `db-pending-profiles.md`); mientras no exista, devolver `null`
  y el front las oculta.

## §2 · Campeones vigentes — `get_season_champions`

```sql
get_season_champions(p_season_id text default null) → jsonb
-- null = ÚLTIMA temporada terminada (los "campeones vigentes")
[
  { "tournament_id": "T30-LMY-A", "tournament_name": "Liga Mayores T30",
    "tournament_type": "LEAGUE", "division": "A", "category": "senior",
    "team_id": "CMG-FC", "team_name": "CMG FC" }
]
```
Sale de `trophies` + `tournaments`. Orden sugerido: ligas senior primero.

## §3 · Últimos resultados globales — `get_latest_results`

Como `get_team_results` pero de TODA la liga (el carrusel de la home):

```sql
get_latest_results(p_limit int default 12) → jsonb
[
  { "id": "T31-LMY-B-M55", "tournament_id": "T31-LMY-B",
    "competition": "Liga Mayores T31", "competition_kind": "LEAGUE",
    "competition_division": "B", "plazo": "12",
    "home_team_id": "RE...", "home_team_name": "Reincidentes FC", "home_score": 3,
    "away_team_id": "CMG-FC", "away_team_name": "CMG FC", "away_score": 1,
    "loaded_at": "2026-08-25T21:14:00Z" }   -- updated_at del match: ordena el feed
]
```

## §4 · Plazo vigente y su vencimiento

Hoy `matches.plazo` es solo un texto; no hay fechas límite. Para el hero
("Plazo 7 (Fechas 13–14) · vence en 2d 14h"), el chip de "Tus partidos" y el
pie "2 de 6 partidos del plazo ya cargados":

```sql
get_current_plazo() → jsonb
{ "plazo": "7", "label": "Fechas 13-14", "deadline": "2026-08-29T23:59:00Z" }

get_team_plazo_progress(p_team_id text) → jsonb
{ "plazo": "7", "loaded": 2, "total": 6 }
```
Seguramente implique una tabla de plazos por temporada (plazo → fechas que
abarca + deadline) — hoy esa data no está modelada.

## §5 · Últimas transferencias — `get_latest_transfers`

Depende de la tabla `transfers` (pedido D1 de `db-pending-profiles.md`).

```sql
get_latest_transfers(p_limit int default 12) → jsonb
[
  { "id": "tr-1", "player_id": "erling-haaland-239085", "player_name": "Erling Haaland",
    "position": "DC", "kind": "purchase",             -- purchase | loan | free
    "fee": 180000000, "date": "2026-08-25",
    "from_team_id": "...", "from_team_name": "...",
    "to_team_id": "...", "to_team_name": "..." }
]
```

## §6 · Noticias — tabla `news` + `get_news`

Dominio nuevo (las cargaría un admin):

```sql
create table news (
  id          text primary key,
  title       text not null,
  tag         text,              -- "Transferencia", "Anuncio", "Resultado"...
  body        text,
  created_at  timestamptz not null default now(),
  created_by  uuid references profiles(id)
);

get_news(p_limit int default 6) → jsonb   -- más recientes primero
add_news(p_news jsonb) → news             -- solo admin (is_admin())
```

## §7 · Forma (últimos 5) en las tablas

La columna "Forma" del diseño necesita la racha W/D/L de los últimos 5
partidos por fila de standings. Opciones: campo `form: ["W","D","L","W","W"]`
en `get_standings_by_tournament`, o una función aparte. (Es el mismo dato que
`team_form` de `get_team_profile`, pero por torneo.)

## §8 · Menores (opcional)

`v_standings_full` no trae el DT: hoy lo resolvemos con `get_all_teams` en el
front — si lo agregan a la vista, ahorramos una llamada. Ídem color/escudo de
club (retoque C4 del pedido de perfiles).

## Prioridad sugerida

1. **§3 + §7** — completan "Últimos resultados" y la columna Forma (solo datos
   que ya existen).
2. **§4** — plazos: desbloquea los vencimientos del hero y de "Tus partidos"
   (modelado chico pero nuevo).
3. **§1 + §2** — KPIs y campeones del hero.
4. **§5 + §6** — dependen de modelar `transfers` y `news`.
