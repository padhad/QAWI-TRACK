# QAWI TRACK

QAWI TRACK is a browser-based prototype for managing motorcycle repairs at Pahad Motorshop. The dashboard presents repair activity, customer and motorcycle information, repair tracking, inventory, billing, staff, and reporting sections.

## Run the system

This is a static front-end prototype. It does not need package installation, a build step, or a backend.

1. Open a terminal in the project folder.
2. Start a local web server:

   ```powershell
   py -m http.server 8000
   ```

   If `py` is unavailable, try `python -m http.server 8000`.
3. Open <http://localhost:8000> in a browser.
4. Stop the server with `Ctrl+C` in the terminal.

You can also open `index.html` directly, though using a local server is recommended.

## How to use

- **Dashboard:** View sample repair records, status counts, recent activity, and summary cards.
- **Navigation:** Use the sidebar to switch between Dashboard, Customers, Motorcycles, Repair Management, Repair Tracking, Inventory, Billing & Payments, Mechanics & Staff, Reports & Analytics, and System Settings.
- **Search:** Search the visible dashboard repairs by tracking ID, customer, or motorcycle. Press `Ctrl+K` (or `Cmd+K` on macOS) to focus the search field.
- **Register a repair:** Select **New Repair**, fill in the required customer, phone, motorcycle, and issue fields, then select **Create Repair**.
- **Customer portal:** Select the arrow button in the top bar, enter a tracking ID, and select **Track** to view the sample tracking display.
- **Mobile layout:** At smaller screen sizes, use the menu button to open the sidebar.

## Prototype limitations

The interface currently uses sample data. It has no database, user authentication, or server-side functionality. Creating a repair only displays a confirmation; it does not save a record. The non-dashboard navigation pages are placeholders, and the customer portal displays a static sample repair rather than looking up a real record. Data and actions do not persist after reloading the page.

## Project files

- `index.html` — page structure and sample content
- `styles.css` — layout, styling, and responsive behavior
- `app.js` — navigation, modal, search, tracking-display, and toast interactions
- `PROMPT.md` — reusable prompt for requesting future development

## Prompt for continuing development

See [`PROMPT.md`](PROMPT.md) for a reusable AI development prompt.
