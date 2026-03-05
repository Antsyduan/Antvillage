export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  status: string;
  is_system_admin?: boolean;
}

export interface HonoEnv {
  Bindings: {
    DB: D1Database;
    MASTER_KEY?: string;
    JWT_SECRET?: string;
    ENABLE_SKILL_INJECT?: string;
    SKILL_INJECT_SECRET?: string;
  };
  Variables: {
    user?: SessionUser;
    [key: string]: unknown;
  };
}
