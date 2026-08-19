# Job Finder Portal (EJS)

An Express + EJS job listings site.

## Getting started

```
npm install
npm start        # production
npm run dev       # auto-restart on change (nodemon)
```

The server listens on `PORT` (default `3500`).

## Stack

- Express + EJS views (`views/`)
- Single bundled CSS file (`public/assets/css/bundle.min.css`) — Bootstrap 4,
  Font Awesome, Themify icons, and the site's own styles concatenated in
  load order, plus a small custom block for the mobile nav / price slider /
  testimonial carousel added below.
- Single vanilla JS file (`public/assets/js/site.js`) — no jQuery, no
  plugin dependencies. Handles the mobile nav, sticky header, back-to-top
  button, testimonial carousel, and price range filter.
- `helmet` for security headers, `compression` for gzip.

## Known gap

The contact form (`views/contact.ejs`) posts to `contact_process.php`,
which has no backend handler — there's no route for it in `server.js`.
Wire up a real submit handler (e.g. an email-sending route) before relying
on that form in production.
