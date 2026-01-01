---
version: 1.0.0
description: This rule is missing a name field
author: Example Team
---

# Invalid Rule Example - Missing Name

This file has a `version` field but is intentionally missing a `name` field in the frontmatter.

If you try to add this with `/claude-context-updater:ctx-rule add`, it should fail with:
"Source file frontmatter must include a 'name' field"
