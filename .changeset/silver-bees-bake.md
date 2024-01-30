---
"@commonalityco/data-project": patch
"@commonalityco/utils-core": patch
"commonality": patch
---

Adds a `workspaces` property to the project configuration file. This will allow you to override your package manager's workspaces. This will also allow integrated monorepos to filter packages without adding a workspaces property to their package manager.
