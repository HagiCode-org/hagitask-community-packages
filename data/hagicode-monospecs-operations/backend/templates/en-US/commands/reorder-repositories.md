## Command: reorder-repositories

Reorder the repositories by recent activity and collapse long-inactive ones, but only after explicit confirmation.

1. Read the complete `repositories` array and assess recent commits, branch synchronization, uncommitted changes, and recent-use records.
2. Put frequently or recently active repositories first with `ui.collapseToMore: false`, and long-inactive repositories later with `ui.collapseToMore: true`.
3. Keep the total number of non-collapsed repositories preferably below 10; when there are more, keep only the most active repositories non-collapsed and place the rest in More.
4. When activity is unknown, preserve relative order and existing values.
5. Produce a preview with evidence, proposed positions, and collapse values, then wait for explicit confirmation.
6. After confirmation, change only repository order and `ui.collapseToMore`, and validate the complete document.
7. Never write without confirmation or after validation failure.
