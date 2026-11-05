# Francis Maria Libermann School Website

Official website for **Francis Maria Libermann School (Zanzibar)**.

This repository is configured as a **100% Static Website** designed for **free hosting on Render** (via Render's free Static Site service).

---

## Free Hosting on Render (Static Site)

You can host this website on Render completely free with custom domains and SSL:

1. **Push your code to GitHub / GitLab**.
2. **Go to Render Dashboard**: [dashboard.render.com](https://dashboard.render.com/)
3. Click **New +** -> **Static Site**.
4. Connect this repository.
5. Settings:
   - **Name**: `francis-maria-libermann-school`
   - **Branch**: `main`
   - **Build Command**: *(leave empty)*
   - **Publish Directory**: `.`
6. Click **Create Static Site**.

Render will deploy the site on its global CDN within seconds at zero cost.

> [!TIP]
> The repository includes a `render.yaml` blueprint, allowing automated 1-click static site configuration.

---

## Local Preview

To test or preview the static website locally on your computer:

```bash
# Using Python's built-in HTTP server:
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

---

## Preserved Dynamic Backend Service ("Behind the Scenes")

All dynamic web service features (Flask models, routes, SQLite database, admin portal, online admissions forms with file uploads, automated PDF generation, and visit scheduling) have been **preserved** in the `backend_service/` directory and were **not deleted**.

If you wish to run the full dynamic web service locally or deploy it to a server in the future:
- See [`BACKEND_SERVICE_README.md`](BACKEND_SERVICE_README.md) for full instructions on running the Flask web service and accessing the admin dashboard.
