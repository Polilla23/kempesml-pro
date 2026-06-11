/**
 * Generate src/types/database.types.ts from the live Supabase REST (PostgREST)
 * OpenAPI endpoint. Use this while we don't have CLI access to the project:
 *
 *   pnpm db:types:rest
 *
 * Produces accurate Row types, FK relationships and nullability. Insert/Update
 * optionality is heuristic (column defaults aren't fully exposed over REST),
 * so prefer the official `supabase gen types typescript` dump when available.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env.local"), "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const res = await fetch(`${url}/rest/v1/`, {
  headers: { apikey: key, Authorization: `Bearer ${key}` },
});
if (!res.ok) {
  console.error(`REST request failed: HTTP ${res.status}`);
  process.exit(1);
}
const spec = await res.json();
const defs = spec.definitions ?? {};

const isView = (n) => n.startsWith("v_");

function tsType(p) {
  const fmt = p.format || "";
  const t = p.type;
  if (t === "integer" || t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (t === "array") {
    if (/^(integer|smallint|bigint|numeric|real|double)/.test(fmt)) return "number[]";
    if (/^boolean/.test(fmt)) return "boolean[]";
    if (/^json/.test(fmt)) return "Json[]";
    return "string[]";
  }
  if (/^(json|jsonb)/.test(fmt) || t === "object") return "Json";
  if (/^numeric/.test(fmt)) return "number";
  return "string";
}

function parseFk(desc = "") {
  const m = desc.match(/<fk table='([^']+)' column='([^']+)'\/>/);
  return m ? { table: m[1], column: m[2] } : null;
}

const hasDefault = (col, p) =>
  col === "created_at" ||
  col === "updated_at" ||
  (/<pk\/>/.test(p.description || "") && p.format === "uuid");

function emitTable(name, d) {
  const props = d.properties || {};
  const required = new Set(d.required || []);
  const rows = [];
  const ins = [];
  const upd = [];
  const rels = [];
  for (const [col, p] of Object.entries(props)) {
    const tt = tsType(p);
    const nullable = !required.has(col);
    rows.push(`          ${col}: ${tt}${nullable ? " | null" : ""};`);
    const insOptional = nullable || hasDefault(col, p);
    ins.push(`          ${col}${insOptional ? "?" : ""}: ${tt}${nullable ? " | null" : ""};`);
    upd.push(`          ${col}?: ${tt}${nullable ? " | null" : ""};`);
    const fk = parseFk(p.description);
    if (fk) {
      rels.push(
        `        {\n          foreignKeyName: "${name}_${col}_fkey";\n          columns: ["${col}"];\n          isOneToOne: false;\n          referencedRelation: "${fk.table}";\n          referencedColumns: ["${fk.column}"];\n        },`
      );
    }
  }
  const relBlock = rels.length ? `\n${rels.join("\n")}\n      ` : "";
  if (isView(name)) {
    return `      ${name}: {\n        Row: {\n${rows.join("\n")}\n        };\n        Relationships: [${relBlock}];\n      };`;
  }
  return `      ${name}: {\n        Row: {\n${rows.join("\n")}\n        };\n        Insert: {\n${ins.join("\n")}\n        };\n        Update: {\n${upd.join("\n")}\n        };\n        Relationships: [${relBlock}];\n      };`;
}

const tableNames = Object.keys(defs).filter((n) => !isView(n)).sort();
const viewNames = Object.keys(defs).filter(isView).sort();

function rpcArgType(p) {
  const t = p.type;
  const fmt = p.format || "";
  if (t === "integer" || t === "number") return "number";
  if (t === "boolean") return "boolean";
  if (/json/.test(fmt) || t === "object" || t === "array") return "Json";
  if (/^numeric/.test(fmt)) return "number";
  return "string";
}

const rpcNames = Object.keys(spec.paths ?? {})
  .filter((p) => p.startsWith("/rpc/"))
  .map((p) => p.slice("/rpc/".length))
  .sort();

const functionsBlock = rpcNames.length
  ? rpcNames
      .map((fn) => {
        const post = spec.paths["/rpc/" + fn]?.post ?? {};
        const body = (post.parameters || []).find((x) => x.in === "body");
        const args = Object.entries(body?.schema?.properties ?? {});
        const argsType = args.length
          ? `{ ${args.map(([k, v]) => `${k}: ${rpcArgType(v)}`).join("; ")} }`
          : "Record<PropertyKey, never>";
        return `      ${fn}: { Args: ${argsType}; Returns: unknown };`;
      })
      .join("\n")
  : "      [_ in never]: never;";

const out = `/**
 * Database schema types — AUTO-DERIVED from the live Supabase REST (PostgREST
 * OpenAPI) endpoint. Accurate for Row reads, FK relationships and nullability.
 *
 * ⚠️ Insert/Update column optionality is heuristic (DB column defaults are not
 * fully exposed over REST). When the DB owner can share an official dump from
 * \`supabase gen types typescript\`, replace this file with it.
 *
 * Regenerate: pnpm db:types:rest
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
${tableNames.length ? tableNames.map((n) => emitTable(n, defs[n])).join("\n") : "      [_ in never]: never;"}
    };
    Views: {
${viewNames.length ? viewNames.map((n) => emitTable(n, defs[n])).join("\n") : "      [_ in never]: never;"}
    };
    Functions: {
${functionsBlock}
    };
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];
export type Views<T extends keyof PublicSchema["Views"]> =
  PublicSchema["Views"][T]["Row"];
`;

writeFileSync(resolve(root, "src/types/database.types.ts"), out);
console.log(`Generated ${tableNames.length} tables + ${viewNames.length} views into src/types/database.types.ts`);
