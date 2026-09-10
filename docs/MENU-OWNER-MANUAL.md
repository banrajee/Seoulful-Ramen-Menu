# Seoulful Ramen Menu — Owner's Manual

This manual explains how to maintain the menu without editing application code. It is written for the live site at [seoulful-ramen-menu.vercel.app](https://seoulful-ramen-menu.vercel.app/) and the GitHub repository [banrajee/Seoulful-Ramen-Menu](https://github.com/banrajee/Seoulful-Ramen-Menu).

## 1. Understand the three parts

The menu uses three services. Each one has a different job.

| Service | What it stores | What you change there |
| --- | --- | --- |
| **GitHub** | Website code and actual product image files | Add or replace images in `public/menu-products/` |
| **Supabase** | Menu item names, descriptions, prices, image paths, stock, spice level, food type, and order | Change these through the owner dashboard; use SQL only for a database upgrade |
| **Vercel** | The published website built from GitHub | Check whether the latest GitHub commit deployed successfully |

The most important rule is:

> An image path in the dashboard does not upload an image. The actual image file must first exist in GitHub under `public/menu-products/`.

For example:

- Actual GitHub file: `public/menu-products/nongshim-shin-ramyun.png`
- Image URL saved on the menu item: `/menu-products/nongshim-shin-ramyun.png`
- Public image address: `https://seoulful-ramen-menu.vercel.app/menu-products/nongshim-shin-ramyun.png`

These names must match exactly, including spelling, hyphens, capital letters, and `.png`.

## 2. Your normal workflow

Use this order whenever you add a new product:

1. Prepare the image.
2. Give it a safe filename.
3. Upload it to GitHub in `public/menu-products/`.
4. Wait for the GitHub deployment in Vercel to show **Ready**.
5. Open the image's public address to confirm it works.
6. Open `/owner`, add or edit the menu item, and enter its image path.
7. Check the customer menu on a phone.

When replacing an existing picture with a better one, keep the same filename. Upload the replacement to the same GitHub folder and let Vercel deploy it. You do not need to change the dashboard path.

## 3. Prepare a product image

### Recommended image standard

Use these settings so products look consistent:

- File type: **PNG**
- Canvas: **900 × 900 pixels**
- Background: **transparent**
- Product: centered, straight, and fully visible
- Product size: usually about 80–88% of the canvas at its widest or tallest point
- Empty space: leave a small, even margin around the package
- Colour: keep the original packaging colour and contrast
- File size: preferably below 2 MB and always below GitHub's 25 MiB browser-upload limit

Do not erase white parts of a white package. A background-removal tool may mistake the package for the background and make it faded or transparent.

### A simple editing process

You can use Photopea, Canva, GIMP, Photoshop, or another editor that supports transparent PNG files.

1. Open the clearest source image you have.
2. Remove only the area behind the product.
3. Inspect the edges at high zoom. Undo any removal that damages letters, package corners, food, or white areas of the packet.
4. Create a square 900 × 900 transparent canvas.
5. Place the product in the centre.
6. Resize it until it is visually similar to the other products in the same section.
7. Export as PNG with transparency.
8. Open the exported PNG once before uploading it. Check that it is sharp, centred, and has no solid white rectangle or fake checkerboard background.

If the source image already has a clean white background and removing it damages the packet, keep the product intact. A carefully cleaned source is better than a faded package.

### Safe filenames

Use lowercase English letters, numbers, and hyphens. Avoid spaces, brackets, apostrophes, `&`, and extra words such as `final` or `new`.

Good examples:

```text
nongshim-shin-kimchi.png
samyang-buldak-quattro-cheese-halal.png
noriko-braised-tofu-stick-snack.png
```

Poor examples:

```text
New Image (2).PNG
Shin Kimchi final final.png
ramen&drink photo.png
```

Windows often hides file extensions. Make sure the file is really `product-name.png`, not `product-name.png.webp` or `product-name.png.png`.

## 4. Upload an image through the GitHub website

1. Open [the GitHub repository](https://github.com/banrajee/Seoulful-Ramen-Menu).
2. Confirm the branch selector near the top says **main**.
3. Open **public**.
4. Open **menu-products**.
5. Click **Add file**, then **Upload files**.
6. Drag the finished PNG into the upload area, or click **choose your files**.
7. Check the destination shown on the page. It must end with:

   ```text
   /public/menu-products/
   ```

8. Enter a clear commit message, such as `Add Shin Kimchi product image` or `Replace faded Kokomen image`.
9. Commit the change to **main**.
10. Wait for Vercel to deploy the commit.

GitHub's browser accepts up to 100 files at once, but each file must be 25 MiB or smaller. Upload the extracted image files, not a ZIP. GitHub does not turn a ZIP into public website images. See [GitHub's file upload guide](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository).

### Where images must not go

Do not put new menu images in any of these locations:

```text
/menu-products/
/public/ramen-products/
/public/snack-products/
repository root
```

The one permanent location is:

```text
/public/menu-products/
```

The build script can recover some older files from legacy folders, but that is an emergency safeguard, not the normal workflow.

## 5. Wait for and check the deployment

The Vercel project should remain connected to this GitHub repository, with **main** as its Production Branch. Vercel creates a production deployment whenever a new commit reaches that branch. This is the standard Git workflow described in [Vercel's Git deployment documentation](https://vercel.com/docs/git).

1. Open Vercel and select the **Seoulful Ramen Menu** project.
2. Open **Deployments**.
3. Find the deployment with the commit message you just entered in GitHub.
4. Wait until its status is **Ready**.
5. If it says **Error**, open it and read the build log. The menu-image check normally states the missing or invalid filename clearly.
6. Do not redeploy an older deployment. Fix the GitHub files and make a new commit instead.

Do not return to dragging a folder directly into Vercel for routine updates. A direct Vercel upload and a later GitHub deployment can contain different file collections. The next deployment then appears to “remove” images because it faithfully publishes whichever collection it received. GitHub `main` must be the single complete source.

### Confirm the image before editing the item

Open this address, replacing the filename:

```text
https://seoulful-ramen-menu.vercel.app/menu-products/your-filename.png
```

If the image opens by itself, the file is deployed correctly. If you see a 404 page, do not save that path on a menu item yet. Recheck the folder, filename, extension, case, and Vercel deployment.

## 6. Sign in to the owner dashboard

1. Open [seoulful-ramen-menu.vercel.app/owner](https://seoulful-ramen-menu.vercel.app/owner).
2. Sign in with the owner email and password created in Supabase Authentication.
3. Use the dashboard search box to find an item by its name, description, category, or flavour.

The public menu updates immediately after most dashboard changes because the menu listens to Supabase in real time. An image-file change still needs a Vercel deployment because the file lives in GitHub.

## 7. Edit an existing item

1. Search for the item in the dashboard.
2. Click **Edit** on the correct item.
3. Review every field before saving:

   - **Item name:** the customer-facing product name.
   - **Short description:** one short, verified explanation.
   - **Packet Only Price / Self-Cook Bowl Price:** shown for ramen in the dashboard.
   - **Price:** used for add-ons, drinks, and K-Snacks.
   - **Order:** a smaller number places a non-ramen item earlier within its category. Ramen are ordered automatically by bowl price and then by name.
   - **Veg / Non-Veg:** available for ramen and K-Snacks.
   - **Category:** shown where the section has category choices, including drink groups.
   - **Image URL:** normally `/menu-products/filename.png`.
   - **Spice level:** a number from 0 to 5 for ramen and K-Snacks.
   - **Status:** Available, Out of Stock, or Hidden.

4. Click **Save Item**.
5. Search for it on the customer page and check the result.

### Status meanings

| Status | Customer result |
| --- | --- |
| **Available** | Item appears normally |
| **Out of Stock** | Item is labelled out of stock, unless the global setting hides all out-of-stock items |
| **Hidden** | Item does not appear to customers |

The **Hide OOS / Show OOS** button controls whether all out-of-stock items remain visible. It does not change their individual statuses.

## 8. Add a brand-new item

### First add its image

Prepare, upload, deploy, and directly test the image as described above.

### Then add the menu record

1. Sign in at `/owner`.
2. Click the correct button: **Add Ramen**, **Add Add-Ons**, **Add Drinks**, or **Add K-Snacks & Sides**.
3. Enter the exact product name.
4. Enter a researched short description, or leave it empty until verified.
5. Enter the price or ramen prices.
6. Choose the category when the form offers one.
7. Enter the image path, for example:

   ```text
   /menu-products/paldo-kokomen.png
   ```

8. Set food type and spice level where applicable.
9. Choose **Available**, **Out of Stock**, or **Hidden**. Use Hidden if you want to finish checking the item before customers see it.
10. Enter its order number when the field is shown. Ramen do not need one because their order is automatic.
11. Click **Save Item**.
12. If it needs flavours or variants, edit the newly saved main item and add them under **Flavours / Variants**.
13. Check the public menu on both desktop and mobile.

If the dashboard reports that the name already exists, search for the existing item. Edit or unhide that record instead of creating a duplicate.

## 9. Add drink flavours or other variants

Use a variant when several flavours belong under one main product card.

1. Save the main item first.
2. Edit that main item.
3. In **Flavours / Variants**, enter:

   - **Flavour name**
   - **Variant description**, only if that flavour needs verified information different from the main description
   - **Price**
   - **Order**
   - **Status**
   - **Variant image URL**, if the flavour needs its own image

4. Click **Add Variant** or **Save Variant**.

Keep shared information in the main item's description. For example, “Sweet Korean grape drink with pulp” can be a grape variant description if only the grape flavour contains pulp.

If variants fail to load or save, the database may be missing the variant table or description column. Follow the migration section before trying again.

## 10. Write accurate descriptions

Do not create a description just because it sounds suitable. Check the exact product and flavour.

Use sources in this order:

1. Text on the physical package.
2. Official brand or manufacturer product page.
3. Official distributor or supplier page.
4. A trusted retailer listing that clearly matches the same product, size, and flavour.
5. Manual confirmation by the shop owner.

Keep a note outside the website with the product name, source link or package photo, date checked, and final description. This makes later corrections much easier.

Good description style:

```text
Spicy Korean noodle soup.
Creamy spicy carbonara-style ramen.
Sweet Korean grape drink with pulp.
Crispy roasted seaweed snack.
```

Avoid claims such as “best-selling,” “healthy,” “authentic,” “traditional,” or “premium” unless the exact claim is verified. If you cannot verify a useful description, leave the field empty. The customer menu does not leave blank space for an empty description.

## 11. Run a Supabase migration safely

A migration changes the database structure. You do not run one for normal price, stock, image, or description edits.

For an older database, this project provides:

- `supabase/add-item-variants.sql` — creates the variants table and its access rules.
- `supabase/add-menu-descriptions.sql` — adds the main and variant description fields without replacing existing text.

Run a migration only when the related feature is missing or the app reports that the column or table does not exist.

1. Open [Supabase](https://supabase.com/dashboard) and choose the project used by this website.
2. Open **SQL Editor**.
3. Click **New query**.
4. In GitHub, open the required `.sql` file inside the repository's `supabase` folder.
5. Click **Raw**, then copy the complete SQL file.
6. Paste it into the Supabase SQL Editor.
7. Read the first comment lines to confirm it is the intended migration.
8. Click **Run**. Supabase also supports Ctrl+Enter, as shown in its [SQL Editor instructions](https://supabase.com/docs/guides/database/functions#quick-demo).
9. Wait for a successful result.
10. Refresh `/owner` and test the feature.

Run each migration as one complete file. Do not paste ordinary instructions, Markdown, a filename, or only part of the SQL into the editor. Do not rerun `schema.sql` on the live shop merely to change one item; it contains setup and seed operations intended for creating or upgrading the whole project.

## 12. Make a new image part of the build safety check

The project runs `scripts/prepare-menu-assets.mjs` before every production build. It checks all filenames listed in `scripts/required-menu-assets.json`. If a required file is missing or is not a real PNG/SVG, the deployment stops instead of publishing a menu with broken images.

For a new permanent bundled image:

1. Upload the PNG to `public/menu-products/`.
2. Open `scripts/required-menu-assets.json` on GitHub.
3. Click the pencil icon to edit it.
4. Add the new filename in alphabetical order, inside quotation marks.
5. Keep a comma after every entry except the final entry.
6. Use **Preview** or review the file carefully. It must remain a JSON list shaped like this:

   ```json
   [
     "first-image.png",
     "second-image.png",
     "your-new-image.png"
   ]
   ```

7. Commit the manifest edit to `main`.
8. Confirm the Vercel deployment is Ready.

This step is strongly recommended because it prevents a future incomplete upload from silently removing the image. The validator accepts PNG and SVG entries; use PNG for product photographs.

## 13. Check every change

After a dashboard edit:

1. Open the relevant public page.
2. Search for the item by name.
3. Check its name, description, price, status, food icon, spice level, and image.

After an image or website deployment, check all three pages:

- [Ramen and add-ons](https://seoulful-ramen-menu.vercel.app/)
- [Drinks](https://seoulful-ramen-menu.vercel.app/drinks)
- [K-Snacks & Sides](https://seoulful-ramen-menu.vercel.app/k-snacks)

Then check on a phone:

1. Refresh the page.
2. Search for the changed item.
3. Zoom in once and confirm the product image grows with the menu.
4. Check that long names remain readable and prices stay aligned.
5. Check the image against neighbouring products for visual size.

If you still see the old version, use Ctrl+F5 on Windows, try a private/incognito window, or clear the browser cache for the site. A normal refresh may reuse an old image with the same filename.

## 14. Troubleshooting guide

### The image is broken or shows a missing-image symbol

Open its direct public image address.

- **404:** The file is missing, in the wrong folder, or the name/case/extension does not match the dashboard path.
- **Image opens correctly:** Recheck the menu item's Image URL and refresh the menu.
- **Vercel deployment failed:** Open the deployment log and correct the filename named by the asset validator.

For add-ons, upload the file to `public/menu-products/`, wait for deployment, then enter `/menu-products/your-filename.png` in that add-on's **Image URL** field. Uploading the picture alone does not create an add-on item; use **Add Add-Ons** if the named item does not already exist.

Current examples:

```text
Sausage Corn Dog: /menu-products/addon-sausage-corn-dog.png
Chicken Dumplings: /menu-products/addon-chicken-dumplings.png
```

### Images disappear after a deployment

Check that the deployment came from `banrajee/Seoulful-Ramen-Menu`, branch `main`, and contains the expected GitHub commit. Confirm every image exists under `public/menu-products/` in GitHub. Stop using a second local folder or direct Vercel upload as a different source.

### The image is faded, cut out, or partly transparent

Return to the best original source. Redo the background removal more carefully, preserve the package itself, export a true transparent PNG, and replace the existing filename.

### The image has a white rectangle

The white area is inside the image. Remove the background in an image editor and export with transparency. Changing CSS or the dashboard path cannot remove pixels baked into the file.

### The product looks too small or too large

Open the 900 × 900 source. Resize the product layer, not the canvas. Compare it with two neighbouring products in the same menu section, then replace the file using the same filename.

### GitHub says the file is too large

Do not upload a ZIP of the image folder. Resize the single product image to 900 × 900 and export an optimized PNG. GitHub browser uploads have a 25 MiB limit per file.

### Vercel is Ready but the site is old

Confirm the deployment shows the newest GitHub commit and is a **Production** deployment from `main`. Check Vercel **Settings → Git** if the wrong repository or branch is connected. Try a hard refresh only after confirming the correct commit.

### A menu item is missing but its image exists

Search for it in `/owner`, which includes hidden and out-of-stock items. Check its Status and Category. The image file and the database item are separate; either one can exist without the other.

### A description or variant cannot be saved

Read the dashboard error. If it mentions a missing column, run `supabase/add-menu-descriptions.sql`. If it mentions `item_variants`, run `supabase/add-item-variants.sql` first, followed by the descriptions migration.

### A newly added item appears in the wrong place

Edit its Category and Order. Items with lower Order numbers appear earlier. Use the dashboard's up/down buttons for small adjustments.

## 15. Safe habits and recovery

- Make one small, clearly named GitHub commit for each group of related changes.
- Keep the original product photos in a separate backup folder on your PC.
- Never upload `.env.local`, passwords, Supabase secret/service-role keys, or Vercel tokens to GitHub.
- Use the public Supabase anon key only where the project setup specifically expects it.
- Before making many database edits, export or record the current values in Supabase.
- Prefer **Hidden** while preparing a new item. Change it to **Available** after checking it.
- Use **Delete** only when the record should be removed permanently. Hidden is easier to reverse.
- If a GitHub change causes a problem, open the earlier commit and revert the faulty commit, or restore the earlier file and make a new commit.
- If a deployment fails, the existing live deployment normally remains available. Correct the source in GitHub and deploy a new commit.

## 16. Optional: use GitHub Desktop on this PC

GitHub Desktop is safer for regular batches because you can see every changed file before pushing.

1. Install and sign in to GitHub Desktop.
2. Choose **File → Clone repository**.
3. Select `banrajee/Seoulful-Ramen-Menu`.
4. Choose one permanent local folder.
5. Before every editing session, click **Fetch origin**, then **Pull origin** if offered.
6. Copy finished images into that clone's `public/menu-products/` folder.
7. In GitHub Desktop, inspect the changed-files list. Make sure it contains only the intended files.
8. Enter a clear summary and click **Commit to main**.
9. Click **Push origin**.
10. Check the resulting Vercel deployment.

Do not create a second hand-assembled copy of the project on a new PC. Clone the GitHub repository so the complete current file set comes with it.

## 17. One-page quick checklist

### Replace an existing image

- [ ] Start from the clearest original.
- [ ] Make a 900 × 900 transparent PNG.
- [ ] Preserve white package areas and clean edges.
- [ ] Use the exact existing filename.
- [ ] Upload to GitHub `public/menu-products/` on `main`.
- [ ] Wait for the matching Vercel deployment to show Ready.
- [ ] Open the direct public image URL.
- [ ] Check the item on its menu page and on a phone.

### Add a new item with an image

- [ ] Research the exact product and short description.
- [ ] Prepare and name the image.
- [ ] Upload it to GitHub `public/menu-products/`.
- [ ] Add its filename to `scripts/required-menu-assets.json`.
- [ ] Wait for Vercel and test the direct image URL.
- [ ] Open `/owner` and choose the correct Add button.
- [ ] Enter the path `/menu-products/filename.png`.
- [ ] Complete price, category, status, spice, food type, and order.
- [ ] Save and test desktop search, mobile view, and zoom.

### Change only menu information

- [ ] Open `/owner` and search for the item.
- [ ] Click Edit.
- [ ] Change only verified values.
- [ ] Save Item.
- [ ] Check the public page.
- [ ] No GitHub upload or Vercel redeployment is needed for an ordinary Supabase data edit.

## 18. Keep these four addresses

- Public menu: `https://seoulful-ramen-menu.vercel.app/`
- Owner dashboard: `https://seoulful-ramen-menu.vercel.app/owner`
- GitHub repository: `https://github.com/banrajee/Seoulful-Ramen-Menu`
- Correct image folder: `public/menu-products/`

If you remember only one sequence, remember this:

> **Prepare image → GitHub folder → Vercel Ready → test image URL → dashboard path → check phone.**
