<p align="center">
  <img src="./public/brand/starci-skills-wallpaper.png" alt="StarCi Skills wallpaper" width="100%" />
</p>

<h1 align="center">StarCi Skills</h1>

<p align="center">
  A read-only console for inspecting the machine-local state behind the StarCi trust tree.
</p>

StarCi Skills brings workspace routes, design registries, and active sessions into one clear view.
It helps maintainers verify what the machine currently knows without creating a second place that can
change that state.

> **It reads. It does not write.** Route changes, worktree installation, and hash approval remain owned
> by the corresponding skill and its approval boundary. When an action is needed, the console presents
> a command to copy instead of mutating the source itself.

## What you can inspect

| Area | What it answers |
| --- | --- |
| **Workspaces** | Does each role’s route still describe this machine? Are its checkout, branch, and recorded head valid? |
| **Registries** | Is each project registry locked, clean, and owned by the correct Source? Which hashes are queued, approved, or rejected? |
| **Sessions** | Which design surfaces are active? How many rounds have run, and which decisions still need owner input? |

A route can be structurally valid while pointing at a checkout that no longer exists. StarCi Skills
reports that route as **stale**, not absent, because parsing configuration and verifying the machine
are different checks with different fixes.

## Install the StarCi skills

StarCi keeps the complete trust tree in one place: `<Source>/.claude`. Skills, schemas, scripts,
compilers, gates, and their shared references are never copied into each target repository.

```bash
cd <Source>
git clone https://github.com/starci183/starci-skills.git .claude
```

The installed tree should start like this:

```text
<Source>/
  .claude/
    INDEX.md
    contexts/
    brainstorms/
    compilers/
    gates/
    scripts/
    skills/
```

Do not move individual skill folders into another directory. Several StarCi skills load shared modules
from this tree, so copying one folder creates a partial installation and a second version that can drift.

### Bootstrap Codex and Claude

Keep the root bootstrap files intentionally small. They route an agent into the tree; they do not
duplicate any rule from it.

Create both `AGENTS.md` and `CLAUDE.md` at the Source root with the same content:

```markdown
# StarCi agent bootstrap

Before planning, reading target source, or running a skill, read
[`<Source>/.claude/INDEX.md`](.claude/INDEX.md) completely and follow its load order.

This file is only a bootstrap. Do not copy context, brainstorm, compiler, gate or skill rules into it:
the entry routes, and a rule copied here becomes a second home that nobody remembers to update.
```

- **Codex** reads `AGENTS.md`, enters `.claude/INDEX.md`, and follows the capability route from there.
  StarCi deliberately keeps the shared implementation in `.claude` instead of maintaining another
  copy under `.agents`. If a skill is not shown in the picker, ask Codex to read its exact
  `.claude/skills/<skill>/SKILL.md` entry and run it.
- **Claude Code** reads `CLAUDE.md` and natively discovers project skills under `.claude/skills`.
  Invoke a StarCi skill directly with `/starci-init`, `/starci-stale-list`, and the other skill names.

This shared-tree convention is specific to StarCi. Codex's default local-skill discovery location is
`.agents/skills`, while Claude Code's is `.claude/skills`; the bootstrap is what lets StarCi keep one
authoritative tree without copying its instructions. See the official
[Codex skills documentation](https://developers.openai.com/codex/skills) and
[Claude Code skills documentation](https://code.claude.com/docs/en/slash-commands) for their native
discovery behavior.

## Initialize a Source

Run `starci-init` after cloning the trust tree. Name the Source, project, and roles explicitly; project
identity is never inferred from a folder name.

In Codex:

```text
Read .claude/skills/starci-init/SKILL.md and run it for this Source.
Project: example-app. Roles: fe and be.
Prepare the bootstrap, workspace routes, and worktree state.
```

In Claude Code:

```text
/starci-init setup this Source for project example-app with roles fe and be
```

The skill reviews three independent boundaries before writing:

1. `AGENTS.md` and `CLAUDE.md` — entry into the trust tree.
2. `.workspace/` — where each project role is read from on this machine.
3. `.worktrees/<project>/` — where reviewable and rebuildable run state may be written.

Review the displayed paths and reply `OK` to approve the shown defaults. A run may initialize all
three boundaries or only the boundary that needs repair.

## Configure multiple projects and roles

One Source can route to many projects, and one project can have many roles. Each `(project, role)` pair
has exactly one machine-local route:

```text
<Source>/
  .workspace/
    config.json
    academy/
      fe/config.json
      be/config.json
    payments/
      fe/config.json
      be/config.json
  .worktrees/
    academy/
      registries/
      sessions/
      cache/
    payments/
      registries/
      sessions/
      cache/
```

`.workspace/config.json` stores only Source-wide defaults:

```json
{
  "$schema": "../.claude/contexts/workspaces/config.schema.json",
  "version": 1,
  "defaultLang": "vi"
}
```

Each `.workspace/<project>/<role>/config.json` describes an existing checkout. It records:

- the declared project and role;
- the Source, trust-tree, skills, and workspace roots;
- the target checkout path, Git root, remote, branch, and observed head;
- required instruction files and manifests;

Routes describe checkouts; they never clone, mount, or copy them. Because they contain absolute paths
and machine-local Git state, `.workspace/` must remain ignored by the Source repository.

Add another project or role by running `starci-init` again with the new identity. Re-run it when a
checkout moves, a branch changes, or a recorded head becomes stale. Do not hand-copy the nearest role
and edit a few fields: every recorded path and Git claim must be verified against the current machine.

## Configure multiple Sources

Use a separate `.claude`, `.workspace`, and `.worktrees` root for each Source. This keeps routes and
decision history from unrelated environments from colliding:

```text
Sources/
  product-source/
    AGENTS.md
    CLAUDE.md
    .claude/
    .workspace/
    .worktrees/
  platform-source/
    AGENTS.md
    CLAUDE.md
    .claude/
    .workspace/
    .worktrees/
```

Each Source may point to any number of target repositories, including repositories outside its own
directory. Start Codex or Claude from the intended Source root so its bootstrap, routes, and local state
are unambiguous.

## Verify the setup

Ask either agent to run `starci-stale-list` before trusting a Source that has not been used recently:

```text
# Codex
Read .claude/skills/starci-stale-list/SKILL.md and list stale projects in this Source.

# Claude Code
/starci-stale-list
```

Use `starci-init` to repair a missing or stale route. Use `starci-diagnose` when a skill stops and it is
unclear whether the environment is incomplete or the skill itself is defective.

## Run locally

Requirements: a current Node.js release and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:8090](http://localhost:8090).

For a production check:

```bash
npm run build
npm run preview
```

## Data source

The console renders `public/state.json`. If a machine scan has not produced that file, it falls back
to `public/state.sample.json`. The header always identifies whether the displayed data is live or
sample data.

Generate a fresh snapshot from the Source repository that owns the trust tree:

```bash
node .claude/scripts/export-console-state.mjs --out <starci-skills-checkout>/public/state.json
```

`public/state.json` is intentionally ignored by Git. Absolute paths and local worktree state are true
for one machine only and must not become shared repository history.

## Project structure

```text
public/
  brand/                  StarCi Skills logo, favicon, and wallpaper
  state.sample.json       Safe fallback data
  state.json              Machine-local exported state (ignored)
src/
  components/             Reusable interface components
  panels/                 Workspace, registry, and session views
  App.tsx                 Console composition
```

## Stack

- Vite
- React 19
- TypeScript
- Tailwind CSS v4
- Local shadcn-style UI primitives

## Brand assets

The logo, favicon, and wallpaper live in [`public/brand`](./public/brand). Keep README and browser
references relative to those checked-in files so previews do not depend on generated or temporary
paths.
