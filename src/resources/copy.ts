/** Reader-facing console vocabulary. Keeping copy here prevents panels from becoming translation owners. */
export const copy = {
    app: {
        title: "StarCi Skills",
        subtitle: "Read-only · all writes go through a skill",
        sample: "Sample data",
        scanned: "Scanned",
        source: "Source",
        warnings: "Warnings",
        loading: "Reading state…",
        failedTitle: "Unable to read state",
        failedHint: "Run the state export skill to create a local snapshot.",
    },
    tabs: {workspaces: "Workspaces", registries: "Registries", sessions: "Sessions"},
    empty: {workspaces: "No workspace routes found.", registries: "No registry projects found.", sessions: "No sessions found."},
    labels: {route: "route", staleRoutes: "routes needing attention", registryProjects: "projects with registries", queuedHashes: "hashes awaiting approval"},
} as const
