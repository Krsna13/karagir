# Contributing to Karagir

## Adding New Materials or Master Items

To add new master furniture items or materials to the database:
1. We previously used loose root-level Python scripts (`update_items.py`, etc.) to rewrite static TypeScript files. 
2. Now, all materials and catalog items reside in the Supabase PostgreSQL database. 
3. To add new materials, you must write a new SQL migration in `supabase/migrations/` and run `npx supabase db push`.
4. Avoid running loose python scripts to inject TS code directly.

## Legacy Scripts
The following root scripts have been preserved for historical reference but are **deprecated** and should not be used in the new Supabase architecture:
- `fix_imports.cjs`
- `fix_missing_vars.cjs`
- `refactor_ui.cjs`
- `refactor_ui.py`
- `update_items.py`

If any UI refactoring is required, it should be done manually in the `src/` directory.

## Testing
Run unit tests with Vitest:
```bash
npm run test
```
*(Ensure to add `"test": "vitest run"` to your `package.json` scripts)*
