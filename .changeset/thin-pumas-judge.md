---
"@commonalityco/data-packages": patch
"@commonalityco/data-project": patch
"commonality": patch
"@commonalityco/studio": patch
---

Fixes an issue where package.json files with missing "name" properties would cause any command to throw an error. We now ignore these invalid packages and continue with the command while displaying an error.
