# starci-skills-fe

A read-only console over the machine-local state the StarCi trust tree routes through: workspace
routes, design registries and sessions.

**It reads. It does not write.** Every action it could offer — repointing a route, installing a
worktree, approving a hash — is owned by a skill with its own approval boundary. A button here would
make a second author for the same root, and two authors for one root is the drift the tree exists to
prevent. So actions are rendered as commands to copy.

## Running it

```bash
npm install
npm run dev          # http://localhost:8090
```

The console renders `public/state.json`, and falls back to `public/state.sample.json` when no scan
exists. **Which one is showing is stated in the header**, because a sample presented as live data is the
worst thing a read-only console can do.

To scan this machine, from the Source repository that holds the trust tree:

```bash
node .claude/scripts/export-console-state.mjs --out <this-checkout>/public/state.json
```

`state.json` is git-ignored. A disk path is true on exactly one machine, which is the same rule the
trust tree holds itself to.

## What it shows

| Panel | Answers |
|---|---|
| Workspaces | does each role's route still describe this machine — checkout present, contract present, recorded head level with the checkout |
| Registries | is each project's registry a locked, clean worktree owned by this Source's git, and how many hashes sit queued, approved or rejected |
| Sessions | which surfaces have an open session, how many rounds, which hashes are accepted and which are waiting for the owner |

A route whose fields are all well formed and whose paths no longer resolve is reported **stale**, not
absent: parsing a route is not verifying it, and the two have different fixes.

## Stack

Vite, React 19, TypeScript, Tailwind v4. The UI primitives in `src/components/ui/primitives.tsx` are
hand-written in the shadcn shape — small, local, no component registry to sync.
