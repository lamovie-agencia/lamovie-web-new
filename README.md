<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/b3fd082e-441f-45d5-bc81-8e4294eac181

## Run Locally

**Prerequisites:** Node.js and PostgreSQL.

1. Install dependencies:
   `npm install`
2. Create a local `.env` file from the example:
   `copy .env.example .env`
3. Edit `.env` and set these required values:
   `DATABASE_URL`, `JWT_SECRET`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD`
4. Run the app:
   `npm run dev`

`DATABASE_URL` must be a real PostgreSQL connection string, for example:

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/la_movie
```

Hosted providers such as Neon, Supabase, Render, or Railway also work. If your provider requires SSL, use the connection string they provide.

## Paquetes y páginas públicas

Cada paquete de precios puede indicar en qué página se renderiza con el campo `page`. Esto permite documentar y controlar visualmente dónde se muestra el paquete:

- `pricing`: se muestra en la sección principal de precios.
- `home`: se muestra en la home como CTA destacada.
- `services`: se muestra junto a servicios y oferta destacada.
- `contact`: se muestra en el flujo de contacto antes de WhatsApp.

En el dashboard, el formulario de paquetes incluye este campo para mantener la visibilidad del paquete alineada con la página deseada.
