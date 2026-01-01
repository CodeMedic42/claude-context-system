---
name: invalid-no-version
description: This rule is missing a version field
author: Example Team
---

# Invalid Rule Example - Missing Version

This file has a `name` field but is intentionally missing a `version` field in the frontmatter.

If you try to add this with `/claude-context-updater:ctx-rule add`, it should fail with:
"Source file frontmatter must include a 'version' field"
