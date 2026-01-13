import type { D1Database } from "@cloudflare/workers-types";

export type ActorType = "practitioner" | "system" | "client";

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "read"
  | "login"
  | "logout";

export type AuditEntity =
  | "practitioners"
  | "availability"
  | "appointments"
  | "audit_logs"
  | string;

export type AuditLogInput = {
  actor_type: ActorType;
  actor_id?: string | null;
  action: AuditAction | string;
  entity: AuditEntity;
  entity_id?: string | null;

  // Must be safe/minimal. No PHI. No freeform therapy notes.
  metadata?: Record<string, unknown> | null;

  // Optional tracing/diagnostics (store hashes only for client fingerprinting)
  request_id?: string | null;
  ip_hash?: string | null;
  user_agent_hash?: string | null;
};

/**
 * Safe JSON stringify:
 * - Ensures metadata is either null or a JSON string
 * - Guards against accidentally passing huge/unsafe objects
 */
function safeMetadataStringify(
  metadata: Record<string, unknown> | null | undefined
): string | null {
  if (!metadata) return null;

  // Light guardrails: keep it small-ish; you can tighten later
  const json = JSON.stringify(metadata);
  if (json.length > 2000) {
    // Truncate by replacing with a safe summary
    return JSON.stringify({ truncated: true, keys: Object.keys(metadata).slice(0, 25) });
  }
  return json;
}

/**
 * Write a row into audit_logs. Never throw hard in request paths:
 * audit logging should not break core functionality.
 */
export async function writeAuditLog(
  db: D1Database,
  input: AuditLogInput
): Promise<void> {
  const stmt = db
    .prepare(
      `INSERT INTO audit_logs
        (id, actor_type, actor_id, action, entity, entity_id, metadata_json, request_id, ip_hash, user_agent_hash)
       VALUES
        (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`
    )
    .bind(
      crypto.randomUUID(),
      input.actor_type,
      input.actor_id ?? null,
      input.action,
      input.entity,
      input.entity_id ?? null,
      safeMetadataStringify(input.metadata),
      input.request_id ?? null,
      input.ip_hash ?? null,
      input.user_agent_hash ?? null
    );

  try {
    await stmt.run();
  } catch {  
   // Intentionally swallow errors: audit logging should be best-effort.
  // If you want visibility later, you can console.warn here.
  // console.warn("writeAuditLog failed", err);
  }
}
