# Pedido DB — Home (verificado contra la DB el 2026-08-28)

La home ya consume datos reales en todo salvo **dos bloques** (plazos y
noticias) y un par de retoques que están listados en
`db-pending-profiles.md` §2 (photo_url en transferencias, nombre de torneo en
`get_latest_results`). Acá va solo lo propio de la home.

## §4 · Plazo vigente y su vencimiento (hoy MOCK)

Alimenta: la línea del hero ("Plazo 7 (Fechas 13–14) · vence en 2d 14h"), el
chip de "Tus partidos" y el pie "2 de 6 partidos del plazo ya cargados".
`matches.plazo` es solo texto: falta modelar plazos por temporada (plazo →
fechas que abarca + deadline).

```sql
get_current_plazo() → jsonb
{ "plazo": "7", "label": "Fechas 13-14", "deadline": "2026-08-29T23:59:00Z" }

get_team_plazo_progress(p_team_id text) → jsonb
{ "plazo": "7", "loaded": 2, "total": 6 }
```

## §6 · Noticias (hoy MOCK)

Dominio nuevo (las cargaría un admin):

```sql
create table news (
  id          text primary key,
  title       text not null,
  tag         text,              -- "Transferencia", "Anuncio", "Resultado"...
  image_url   text,
  body        text,
  created_at  timestamptz not null default now(),
  created_by  uuid references profiles(id)
);

get_news(p_limit int default 6) → jsonb   -- más recientes primero
add_news(p_news jsonb) → news             -- solo admin (is_admin())
```

## §7 · Forma (últimos 5) en las standings — opcional

La columna "Forma" del diseño necesita la racha W/D/L por fila de
`get_standings_by_tournament` (mismo dato que `team_form` de
`get_team_profile`, pero por torneo). Hoy la columna no se muestra.
