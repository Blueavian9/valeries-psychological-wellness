import type { D1Database } from "@cloudflare/workers-types";

export type PractitionerPublic = {
  id: string;
  display_name: string;
  public_slug: string;
  timezone: string;
  email: string | null;
  is_active: number;
};

export class PractitionerRepository {
  constructor(private readonly db: D1Database) {}

  async getBySlug(slug: string): Promise<PractitionerPublic | null> {
    return await this.db
      .prepare(
        `
        SELECT id, display_name, public_slug, timezone, email, is_active
        FROM practitioners
        WHERE public_slug = ?
        LIMIT 1
        `
      )
      .bind(slug)
      .first<PractitionerPublic | null>();
  }
}
