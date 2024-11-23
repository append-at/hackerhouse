Hackerhouse
==========

This is a project for Supabase x YC AI Hackathon 2024.

## Getting Started

### Install dependencies

```bash
corepack enable
pnpm i
```

### Run the development server

```bash
pnpm dev
```

You can now access the app at http://localhost:3000.

## Development

### Supabase

Hackerhouse uses Supabase with Row Level Security (RLS), enabling access control without the need for backend API server.

#### Create a new migration

```bash
pnpm migration:new <migration-name>
```

#### Run migrations

```bash
pnpm migration:apply
```

#### Create a new SQL function

1. First, create a new file in `supabase/sql-functions/`
2. Go to Supabase Studio, navigate to SQL Editor, and run `CREATE OR REPLACE FUNCTION ...` with the content of the new file. **This has to be done manually.**

