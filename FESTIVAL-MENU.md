# Festival menu

Apply supabase/add-festival-menu.sql once in the existing Supabase project's SQL editor, then deploy this checkout with its existing Supabase environment variables. Do not rerun schema.sql: that older script includes unrelated shop data changes.

The migration only creates festival_items and festival_combos, policies, and hidden draft references to matching existing products. It does not duplicate product names, descriptions, images, dietary data, or spice levels. Draft prices copy existing bowl/product prices once and must be confirmed for prepared festival service. Missing candidate names are simply skipped. No combos are preselected.

In /owner, sign in as usual and expand Festival Menu management. Select a draft or add an existing product, choose a section, enter Festival Price, set Available/Sold Out/Hidden, set numeric display order, then save. Hidden excludes an item. Shop status and global stock visibility do not control festival visibility. Combos have their own name, description, image, price, status, and order. All fields are saved separately from the shop.

/festival is view-only, independent of /scan and its session timer. It refreshes on focus and every minute while visible. Loading failures show an unavailable message instead of sample prices. Empty sections show Selection coming soon. Existing image paths and image fallbacks are reused; no new dependencies or image copies.

Security follows the existing schema: anonymous visitors can read visible festival records; authenticated owner accounts can manage them. As with the shop, Supabase public sign-up should be disabled so authenticated accounts are owner-controlled.

Deployment status: migration and production deployment must be completed separately. No live database changes are performed by building this code.
