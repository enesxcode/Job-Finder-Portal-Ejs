const path = require('path');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');

const app = express();
const port = process.env.PORT || 3500;
const isProd = process.env.NODE_ENV === 'production';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Trust the platform's reverse proxy (Render, Heroku, etc.) so req.ip / https
// detection works correctly.
app.set('trust proxy', 1);

// Security headers. CSP is relaxed for inline styles/scripts and the map
// embed used by this template rather than left off entirely.
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
                fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
                imgSrc: ["'self'", 'data:'],
                frameSrc: ["'self'", 'https://maps.google.com'],
            },
        },
    })
);

// Gzip/Brotli-eligible compression for all responses.
app.use(compression());

// Static assets: long-lived cache since filenames don't change between
// deploys in this template. Bump maxAge or add cache-busting filenames if
// assets start changing more frequently.
app.use(
    express.static(path.join(__dirname, 'public'), {
        maxAge: isProd ? '30d' : 0,
        etag: true,
    })
);

// Route table: page name -> EJS view. Keeps the growing list of static
// pages in one place instead of a repeated app.get block per page.
const pages = {
    '/': 'index',
    '/about': 'about',
    '/contact': 'contact',
    '/blog': 'blog',
    '/elements': 'elements',
    '/job_details': 'job_details',
    '/job_listing': 'job_listing',
    '/single-blog': 'single-blog',
};

for (const [route, view] of Object.entries(pages)) {
    app.get(route, (req, res) => res.render(view));
}

// 404
app.use((req, res) => {
    res.status(404).send('Page not found');
});

// Centralized error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong');
});

const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

module.exports = app;
