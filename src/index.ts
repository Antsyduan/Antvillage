/**
 * AntVillageMgr - Cloudflare Workers Entry
 * Hono App 作為 fetch handler
 */
import app from "./app";

export default {
  fetch: app.fetch,
};
