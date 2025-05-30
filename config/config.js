require('dotenv').config();

exports.EnvSettings = {
  Port: process.env.Port,
};

exports.SUPA_BASE = {
  url: process.env.Supabase_url,
  apiKey: process.env.Supabase_api_key,
  secretKey: process.env.Supabase_secret_key,
};

exports.RAWG = {
  apiUrl: process.env.RAWG_api_url,
  apiKey: process.env.RAWG_api_key,
};

exports.CorsOptions = {
  origin: process.env.FrontEndUrl,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

exports.JWT = {
  SecretKey: process.env.JWT_Secret,
};

exports.PG = {
  host: process.env.Supabase_pg_host,
  port: process.env.Supabase_pg_port,
  database: process.env.Supabase_pg_database,
  user: process.env.Supabase_pg_user,
  password: process.env.Supabase_pg_password,
};
