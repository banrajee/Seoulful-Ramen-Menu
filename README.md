# Seoulful Ramen Live QR Menu

A simple live digital menu for one QR code. Customers scan the public page and see the latest menu. The owner signs in at `/owner` to update stock, prices, descriptions, images, and item order.

This project intentionally does not include carts, ordering, payments, receipts, POS, Loyverse, customer login, or table numbers.

## Important Files

- `src/app/page.tsx` loads the public QR menu page.
- `src/components/live-menu.tsx` renders the customer-facing mobile menu and listens for Supabase realtime changes.
- `src/app/owner/page.tsx` loads the owner dashboard route at `/owner`.
- `src/components/owner-dashboard.tsx` handles owner login, add/edit/delete, status changes, item order, and the out-of-stock visibility toggle.
- `src/lib/menu-service.ts` contains all Supabase reads/writes used by both screens.
- `src/lib/sample-data.ts` gives the app sample items before Supabase is connected.
- `src/lib/supabase.ts` creates the browser Supabase client from environment variables.
- `src/app/globals.css` contains the poster-style menu design based on the supplied reference.
- `supabase/schema.sql` creates the database tables, policies, sample categories/items, and realtime publication setup.
- `.env.example` shows the required environment variables.
- `public/ramen-hero.png` is the illustrated menu artwork used on the public menu.

## Run Locally

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000` for the public menu and `http://localhost:3000/owner` for the owner dashboard.

If `.env.local` is not configured yet, the app uses sample menu data. Editing is enabled after Supabase is connected.

## Create the Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Open `SQL Editor`.
3. Paste everything from `supabase/schema.sql`.
4. Run the SQL.
5. Go to `Project Settings` > `API`.
6. Copy the `Project URL`.
7. Copy the public `anon` key.

The SQL creates:

- `categories`
- `menu_items`
- `shop_settings`

`shop_settings` is a tiny supporting table for the owner setting that decides whether out-of-stock items appear with a label or are hidden completely.

## Create the Owner Login

1. In Supabase, open `Authentication` > `Users`.
2. Click `Add user`.
3. Enter the shop owner's email and password.
4. Confirm the user if Supabase asks.
5. Use that email and password at `/owner`.

For a single-owner shop, the included RLS policies allow any authenticated user to manage the menu. Only create the owner account you want to have access.

## Add Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

Restart the dev server after adding or changing environment variables.

## Deploy to Vercel

1. Push the project to GitHub.
2. In [Vercel](https://vercel.com), click `Add New` > `Project`.
3. Import the repository.
4. Add the same environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy.

After deployment:

- Public customer menu: `https://your-site.vercel.app`
- Owner dashboard: `https://your-site.vercel.app/owner`

## Create One QR Code

1. Copy the public menu URL, for example `https://your-site.vercel.app`.
2. Use any QR code generator.
3. Paste the URL.
4. Download the QR code.
5. Print it for the shop counter, tables, posters, or takeaway packaging.

Because the QR code points to the website URL, the QR code does not need to change when the owner updates stock or prices.

## How the Owner Updates Stock and Prices Later

1. Visit `/owner`.
2. Sign in with the owner email and password.
3. To change stock, use the status dropdown:
   - `Available` shows the item normally.
   - `Out of Stock` shows an out-of-stock label, unless the global setting hides out-of-stock items.
   - `Hidden` removes the item from the public menu.
4. To change a ramen price or description, click `Edit`, update `Packet Only Price`, `Self-Cook Bowl Price`, veg/non-veg, or other fields, and click `Save Item`.
5. Drinks, add-ons, and snacks use one normal price field.
6. To add a new item, fill the form and click `Save Item`.
7. To change order, use the up/down buttons or edit the `Order` number.
8. To decide whether out-of-stock items show or disappear, use the `Show OOS` / `Hide OOS` button in the dashboard.

Customers see changes on the public menu immediately through Supabase realtime updates.
