import { neon } from "@neondatabase/serverless";
import type { PrismaClient } from "@prisma/client";

function cleanConnectionString(url: string): string {
  return url
    .replace("&channel_binding=require", "")
    .replace("?channel_binding=require&", "?")
    .replace("?channel_binding=require", "");
}

function getSql() {
  const rawUrl = process.env.DATABASE_URL || "";
  const connectionString = cleanConnectionString(rawUrl);
  return neon(connectionString);
}

function genId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return "c" + Math.random().toString(36).substring(2, 15);
}

// -------------------------------------------------------------
// 1. Post Model Operations
// -------------------------------------------------------------
const post = {
  async findMany(args: any = {}) {
    const sql = getSql();
    const conditions: string[] = [];
    const values: any[] = [];

    if (args.where) {
      const w = args.where;
      if (w.status && w.status !== "all") {
        values.push(w.status);
        conditions.push(`status = $${values.length}`);
      }
      if (typeof w.featured === "boolean") {
        values.push(w.featured);
        conditions.push(`featured = $${values.length}`);
      }
      if (typeof w.isSyndicated === "boolean") {
        values.push(w.isSyndicated);
        conditions.push(`"isSyndicated" = $${values.length}`);
      }
      if (w.slug) {
        values.push(w.slug);
        conditions.push(`slug = $${values.length}`);
      }
      if (w.id) {
        values.push(w.id);
        conditions.push(`id = $${values.length}`);
      }
      if (w.createdAt) {
        if (w.createdAt.gt) {
          values.push(new Date(w.createdAt.gt));
          conditions.push(`"createdAt" > $${values.length}`);
        }
        if (w.createdAt.lt) {
          values.push(new Date(w.createdAt.lt));
          conditions.push(`"createdAt" < $${values.length}`);
        }
      }
      if (Array.isArray(w.OR) && w.OR.length > 0) {
        const orClauses: string[] = [];
        for (const item of w.OR) {
          if (item.title?.contains) {
            values.push(`%${item.title.contains}%`);
            orClauses.push(`title ILIKE $${values.length}`);
          } else if (item.excerpt?.contains) {
            values.push(`%${item.excerpt.contains}%`);
            orClauses.push(`excerpt ILIKE $${values.length}`);
          } else if (item.content?.contains) {
            values.push(`%${item.content.contains}%`);
            orClauses.push(`content ILIKE $${values.length}`);
          } else if (item.tags?.has) {
            values.push(item.tags.has);
            orClauses.push(`$${values.length} = ANY(tags)`);
          }
        }
        if (orClauses.length > 0) {
          conditions.push(`(${orClauses.join(" OR ")})`);
        }
      }
    }

    let query = `SELECT * FROM "Post"`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    if (args.orderBy) {
      const ob = args.orderBy;
      if (ob.createdAt) {
        const dir = String(ob.createdAt).toUpperCase() === "ASC" ? "ASC" : "DESC";
        query += ` ORDER BY "createdAt" ${dir}`;
      } else {
        query += ` ORDER BY "createdAt" DESC`;
      }
    } else {
      query += ` ORDER BY "createdAt" DESC`;
    }

    if (typeof args.take === "number") {
      values.push(args.take);
      query += ` LIMIT $${values.length}`;
    }
    if (typeof args.skip === "number") {
      values.push(args.skip);
      query += ` OFFSET $${values.length}`;
    }

    return sql.query(query, values);
  },

  async count(args: any = {}) {
    const sql = getSql();
    const conditions: string[] = [];
    const values: any[] = [];

    if (args.where) {
      const w = args.where;
      if (w.status && w.status !== "all") {
        values.push(w.status);
        conditions.push(`status = $${values.length}`);
      }
      if (typeof w.featured === "boolean") {
        values.push(w.featured);
        conditions.push(`featured = $${values.length}`);
      }
      if (typeof w.isSyndicated === "boolean") {
        values.push(w.isSyndicated);
        conditions.push(`"isSyndicated" = $${values.length}`);
      }
    }

    let query = `SELECT count(*)::int as count FROM "Post"`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    const res = await sql.query(query, values);
    return Number(res[0]?.count || 0);
  },

  async findFirst(args: any = {}) {
    const rows = await post.findMany({ ...args, take: 1 });
    return rows[0] || null;
  },

  async findUnique(args: { where: { slug?: string; id?: string } }) {
    const sql = getSql();
    if (args.where.slug) {
      const rows = await sql.query(`SELECT * FROM "Post" WHERE slug = $1 LIMIT 1`, [args.where.slug]);
      return rows[0] || null;
    }
    if (args.where.id) {
      const rows = await sql.query(`SELECT * FROM "Post" WHERE id = $1 LIMIT 1`, [args.where.id]);
      return rows[0] || null;
    }
    return null;
  },

  async create(args: { data: any }) {
    const sql = getSql();
    const d = args.data;
    const id = d.id || genId();
    const now = new Date();
    const createdAt = d.createdAt ? new Date(d.createdAt) : now;
    const updatedAt = now;
    const publishedAt = d.publishedAt ? new Date(d.publishedAt) : d.status === "published" ? now : null;

    const res = await sql.query(
      `INSERT INTO "Post" (
        id, slug, title, excerpt, content, "coverImage", category, tags,
        "readTime", status, featured, "isSyndicated", "syndicationPlatform",
        "syndicationUrl", "syndicatedTime", "createdAt", "updatedAt", "publishedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8,
        $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18
      ) RETURNING *`,
      [
        id,
        d.slug,
        d.title,
        d.excerpt || "",
        d.content || "",
        d.coverImage || "/24.jpg",
        d.category || "Tech",
        d.tags || [],
        d.readTime || "4 min read",
        d.status || "published",
        Boolean(d.featured),
        Boolean(d.isSyndicated),
        d.syndicationPlatform || null,
        d.syndicationUrl || null,
        d.syndicatedTime || null,
        createdAt,
        updatedAt,
        publishedAt,
      ]
    );
    return res[0];
  },

  async update(args: { where: { id: string }; data: any }) {
    const sql = getSql();
    const d = args.data;
    const setClauses: string[] = [];
    const values: any[] = [];

    const fieldMap: Record<string, string> = {
      title: "title",
      slug: "slug",
      excerpt: "excerpt",
      content: "content",
      coverImage: '"coverImage"',
      category: "category",
      tags: "tags",
      readTime: '"readTime"',
      status: "status",
      featured: "featured",
      isSyndicated: '"isSyndicated"',
      syndicationPlatform: '"syndicationPlatform"',
      syndicationUrl: '"syndicationUrl"',
      syndicatedTime: '"syndicatedTime"',
      publishedAt: '"publishedAt"',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (d[key] !== undefined) {
        values.push(d[key]);
        setClauses.push(`${col} = $${values.length}`);
      }
    }

    setClauses.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const res = await sql.query(
      `UPDATE "Post" SET ${setClauses.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return res[0] || null;
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const res = await sql.query(`DELETE FROM "Post" WHERE id = $1 RETURNING *`, [args.where.id]);
    return res[0] || null;
  },

  async deleteMany(args?: any) {
    const sql = getSql();
    return sql.query(`DELETE FROM "Post"`);
  },
};

// -------------------------------------------------------------
// 2. AdminUser Model Operations
// -------------------------------------------------------------
const adminUser = {
  async findUnique(args: { where: { email?: string; id?: string }; select?: any }) {
    const sql = getSql();
    if (args.where.email) {
      const rows = await sql.query(`SELECT * FROM "AdminUser" WHERE email = $1 LIMIT 1`, [args.where.email]);
      return rows[0] || null;
    }
    if (args.where.id) {
      const rows = await sql.query(`SELECT * FROM "AdminUser" WHERE id = $1 LIMIT 1`, [args.where.id]);
      return rows[0] || null;
    }
    return null;
  },

  async findFirst() {
    const sql = getSql();
    const rows = await sql.query(`SELECT * FROM "AdminUser" LIMIT 1`);
    return rows[0] || null;
  },

  async update(args: { where: { id: string }; data: { passwordHash?: string; name?: string } }) {
    const sql = getSql();
    const updates: string[] = [];
    const values: any[] = [];

    if (args.data.passwordHash !== undefined) {
      values.push(args.data.passwordHash);
      updates.push(`"passwordHash" = $${values.length}`);
    }
    if (args.data.name !== undefined) {
      values.push(args.data.name);
      updates.push(`name = $${values.length}`);
    }

    updates.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const rows = await sql.query(
      `UPDATE "AdminUser" SET ${updates.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async upsert(args: { where: { email: string }; update: any; create: any }) {
    const sql = getSql();
    const existing = await adminUser.findUnique({ where: { email: args.where.email } });
    if (existing) {
      return adminUser.update({ where: { id: existing.id }, data: args.update });
    }
    const id = genId();
    const rows = await sql.query(
      `INSERT INTO "AdminUser" (id, email, "passwordHash", name, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [id, args.create.email, args.create.passwordHash, args.create.name || "Divine Adesiyan"]
    );
    return rows[0];
  },
};

// -------------------------------------------------------------
// 3. SiteSetting Model Operations
// -------------------------------------------------------------
const siteSetting = {
  async findMany() {
    const sql = getSql();
    return sql.query(`SELECT * FROM "SiteSetting"`);
  },

  async findUnique(args: { where: { key: string } }) {
    const sql = getSql();
    const rows = await sql.query(`SELECT * FROM "SiteSetting" WHERE key = $1 LIMIT 1`, [args.where.key]);
    return rows[0] || null;
  },

  async upsert(args: { where: { key: string }; update: { value: string }; create: { key: string; value: string } }) {
    const sql = getSql();
    const id = genId();
    const rows = await sql.query(
      `INSERT INTO "SiteSetting" (id, key, value, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (key) DO UPDATE SET value = $3, "updatedAt" = NOW()
       RETURNING *`,
      [id, args.where.key, String(args.create.value ?? args.update.value)]
    );
    return rows[0];
  },

  async create(args: { data: { key: string; value: string } }) {
    return siteSetting.upsert({ where: { key: args.data.key }, update: { value: args.data.value }, create: args.data });
  },

  async deleteMany() {
    const sql = getSql();
    return sql.query(`DELETE FROM "SiteSetting"`);
  },
};

// -------------------------------------------------------------
// 4. TimelineEvent Model Operations
// -------------------------------------------------------------
const timelineEvent = {
  async findMany(args: any = {}) {
    const sql = getSql();
    const conditions: string[] = [];
    const values: any[] = [];

    if (args.where?.category && args.where.category !== "all") {
      values.push(args.where.category);
      conditions.push(`category = $${values.length}`);
    }

    let query = `SELECT * FROM "TimelineEvent"`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY year DESC, "order" ASC`;

    return sql.query(query, values);
  },

  async create(args: { data: any }) {
    const sql = getSql();
    const d = args.data;
    const id = d.id || genId();
    const rows = await sql.query(
      `INSERT INTO "TimelineEvent" (
        id, year, period, category, title, organization, location, description, link, "order", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()
      ) RETURNING *`,
      [
        id,
        Number(d.year) || new Date().getFullYear(),
        d.period || null,
        d.category || "experience",
        d.title || "",
        d.organization || null,
        d.location || null,
        d.description || "",
        d.link || null,
        Number(d.order) || 0,
      ]
    );
    return rows[0];
  },

  async update(args: { where: { id: string }; data: any }) {
    const sql = getSql();
    const d = args.data;
    const updates: string[] = [];
    const values: any[] = [];

    const fieldMap: Record<string, string> = {
      year: "year",
      period: "period",
      category: "category",
      title: "title",
      organization: "organization",
      location: "location",
      description: "description",
      link: "link",
      order: '"order"',
    };

    for (const [k, col] of Object.entries(fieldMap)) {
      if (d[k] !== undefined) {
        values.push(k === "year" || k === "order" ? Number(d[k]) : d[k]);
        updates.push(`${col} = $${values.length}`);
      }
    }
    updates.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const rows = await sql.query(
      `UPDATE "TimelineEvent" SET ${updates.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const rows = await sql.query(`DELETE FROM "TimelineEvent" WHERE id = $1 RETURNING *`, [args.where.id]);
    return rows[0] || null;
  },

  async deleteMany() {
    const sql = getSql();
    return sql.query(`DELETE FROM "TimelineEvent"`);
  },
};

// -------------------------------------------------------------
// 5. WorkspaceItem Model Operations
// -------------------------------------------------------------
const workspaceItem = {
  async findMany(args: any = {}) {
    const sql = getSql();
    const conditions: string[] = [];
    const values: any[] = [];

    if (args.where?.category && args.where.category !== "all") {
      values.push(args.where.category);
      conditions.push(`category = $${values.length}`);
    }

    let query = `SELECT * FROM "WorkspaceItem"`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY category ASC, "order" ASC`;

    return sql.query(query, values);
  },

  async create(args: { data: any }) {
    const sql = getSql();
    const d = args.data;
    const id = d.id || genId();
    const rows = await sql.query(
      `INSERT INTO "WorkspaceItem" (
        id, category, name, description, url, icon, "order", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
      ) RETURNING *`,
      [
        id,
        d.category || "daily_tools",
        d.name || "",
        d.description || null,
        d.url || null,
        d.icon || null,
        Number(d.order) || 0,
      ]
    );
    return rows[0];
  },

  async update(args: { where: { id: string }; data: any }) {
    const sql = getSql();
    const d = args.data;
    const updates: string[] = [];
    const values: any[] = [];

    const fieldMap: Record<string, string> = {
      category: "category",
      name: "name",
      description: "description",
      url: "url",
      icon: "icon",
      order: '"order"',
    };

    for (const [k, col] of Object.entries(fieldMap)) {
      if (d[k] !== undefined) {
        values.push(k === "order" ? Number(d[k]) : d[k]);
        updates.push(`${col} = $${values.length}`);
      }
    }
    updates.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const rows = await sql.query(
      `UPDATE "WorkspaceItem" SET ${updates.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const rows = await sql.query(`DELETE FROM "WorkspaceItem" WHERE id = $1 RETURNING *`, [args.where.id]);
    return rows[0] || null;
  },

  async deleteMany() {
    const sql = getSql();
    return sql.query(`DELETE FROM "WorkspaceItem"`);
  },
};

// -------------------------------------------------------------
// 6. Competency Model Operations
// -------------------------------------------------------------
const competency = {
  async findMany(args: any = {}) {
    const sql = getSql();
    return sql.query(`SELECT * FROM "Competency" ORDER BY "order" ASC`);
  },

  async create(args: { data: any }) {
    const sql = getSql();
    const d = args.data;
    const id = d.id || genId();
    const rows = await sql.query(
      `INSERT INTO "Competency" (id, category, skills, "order", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, NOW(), NOW()) RETURNING *`,
      [id, d.category || "", Array.isArray(d.skills) ? d.skills : [], Number(d.order) || 0]
    );
    return rows[0];
  },

  async update(args: { where: { id: string }; data: any }) {
    const sql = getSql();
    const d = args.data;
    const updates: string[] = [];
    const values: any[] = [];

    if (d.category !== undefined) {
      values.push(d.category);
      updates.push(`category = $${values.length}`);
    }
    if (d.skills !== undefined) {
      values.push(Array.isArray(d.skills) ? d.skills : []);
      updates.push(`skills = $${values.length}`);
    }
    if (d.order !== undefined) {
      values.push(Number(d.order));
      updates.push(`"order" = $${values.length}`);
    }
    updates.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const rows = await sql.query(
      `UPDATE "Competency" SET ${updates.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const rows = await sql.query(`DELETE FROM "Competency" WHERE id = $1 RETURNING *`, [args.where.id]);
    return rows[0] || null;
  },

  async deleteMany() {
    const sql = getSql();
    return sql.query(`DELETE FROM "Competency"`);
  },
};

// -------------------------------------------------------------
// 7. SocialLink Model Operations
// -------------------------------------------------------------
const socialLink = {
  async findMany(args: any = {}) {
    const sql = getSql();
    const conditions: string[] = [];
    const values: any[] = [];

    if (args.where?.isEnabled !== undefined) {
      values.push(Boolean(args.where.isEnabled));
      conditions.push(`"isEnabled" = $${values.length}`);
    }

    let query = `SELECT * FROM "SocialLink"`;
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }
    query += ` ORDER BY "order" ASC`;

    return sql.query(query, values);
  },

  async create(args: { data: any }) {
    const sql = getSql();
    const d = args.data;
    const id = d.id || genId();
    const rows = await sql.query(
      `INSERT INTO "SocialLink" (
        id, platform, label, url, icon, "order", "isEnabled", "createdAt", "updatedAt"
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
      ) RETURNING *`,
      [
        id,
        d.platform || "github",
        d.label || "",
        d.url || "",
        d.icon || null,
        Number(d.order) || 0,
        d.isEnabled ?? true,
      ]
    );
    return rows[0];
  },

  async update(args: { where: { id: string }; data: any }) {
    const sql = getSql();
    const d = args.data;
    const updates: string[] = [];
    const values: any[] = [];

    const fieldMap: Record<string, string> = {
      platform: "platform",
      label: "label",
      url: "url",
      icon: "icon",
      order: '"order"',
      isEnabled: '"isEnabled"',
    };

    for (const [k, col] of Object.entries(fieldMap)) {
      if (d[k] !== undefined) {
        values.push(k === "order" ? Number(d[k]) : d[k]);
        updates.push(`${col} = $${values.length}`);
      }
    }
    updates.push(`"updatedAt" = NOW()`);
    values.push(args.where.id);
    const idIdx = values.length;

    const rows = await sql.query(
      `UPDATE "SocialLink" SET ${updates.join(", ")} WHERE id = $${idIdx} RETURNING *`,
      values
    );
    return rows[0] || null;
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const rows = await sql.query(`DELETE FROM "SocialLink" WHERE id = $1 RETURNING *`, [args.where.id]);
    return rows[0] || null;
  },

  async deleteMany() {
    const sql = getSql();
    return sql.query(`DELETE FROM "SocialLink"`);
  },
};

// -------------------------------------------------------------
// 8. NewsletterSubscriber Model Operations
// -------------------------------------------------------------
const newsletterSubscriber = {
  async findMany(args: any = {}) {
    const sql = getSql();
    return sql.query(`SELECT * FROM "NewsletterSubscriber" ORDER BY "createdAt" DESC`);
  },

  async findUnique(args: { where: { email?: string; id?: string } }) {
    const sql = getSql();
    if (args.where.email) {
      const rows = await sql.query(`SELECT * FROM "NewsletterSubscriber" WHERE email = $1 LIMIT 1`, [args.where.email]);
      return rows[0] || null;
    }
    if (args.where.id) {
      const rows = await sql.query(`SELECT * FROM "NewsletterSubscriber" WHERE id = $1 LIMIT 1`, [args.where.id]);
      return rows[0] || null;
    }
    return null;
  },

  async create(args: { data: { email: string } }) {
    const sql = getSql();
    const id = genId();
    const rows = await sql.query(
      `INSERT INTO "NewsletterSubscriber" (id, email, "createdAt")
       VALUES ($1, $2, NOW()) RETURNING *`,
      [id, args.data.email]
    );
    return rows[0];
  },

  async delete(args: { where: { id: string } }) {
    const sql = getSql();
    const rows = await sql.query(`DELETE FROM "NewsletterSubscriber" WHERE id = $1 RETURNING *`, [args.where.id]);
    return rows[0] || null;
  },
};

// -------------------------------------------------------------
// Root Prisma Client Proxy
// -------------------------------------------------------------
const clientProxy = {
  post,
  adminUser,
  siteSetting,
  timelineEvent,
  workspaceItem,
  competency,
  socialLink,
  newsletterSubscriber,

  async $queryRaw(query: any, ...values: any[]) {
    const sql = getSql();
    if (typeof query === "string") {
      return sql.query(query, values);
    }
    if (query?.strings) {
      return (sql as any)(query.strings, ...query.values);
    }
    return [];
  },

  async $queryRawUnsafe(query: string, ...values: any[]) {
    const sql = getSql();
    return sql.query(query, values);
  },

  async $executeRaw(query: any, ...values: any[]) {
    const sql = getSql();
    const rows = typeof query === "string" ? await sql.query(query, values) : await (sql as any)(query.strings, ...query.values);
    return Array.isArray(rows) ? rows.length : 1;
  },

  async $executeRawUnsafe(query: string, ...values: any[]) {
    const sql = getSql();
    const rows = await sql.query(query, values);
    return Array.isArray(rows) ? rows.length : 1;
  },

  async $disconnect() {
    return Promise.resolve();
  },

  async $connect() {
    return Promise.resolve();
  },
};

export const prisma = clientProxy as unknown as PrismaClient;
export default prisma;
