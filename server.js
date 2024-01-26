const express = require('express');
const app = express();
const port = process.env.PORT || 3500;

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/blog', (req, res) => {
    res.render('blog');
});

app.get('/elements', (req, res) => {
    res.render('elements');
});

app.get('/job_details', (req, res) => {
    res.render('job_details');
});

app.get('/job_listing', (req, res) => {
    res.render('job_listing');
});

app.get('/single-blog', (req, res) => {
    res.render('single-blog');
});

// Handle 404 error - Page not found
app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
