# Brand asset placement

To use your official branding on the site, upload your provided assets to the deployed site's `public/brand/user/` directory. The homepage now checks for the following files (in order), so you can drop in the versions that best fit your palette:

- `color_logo_transparent.svg` — preferred header wordmark on light backgrounds
- `dark_logo_transparent.svg` — darker wordmark alternative
- `white_logo_transparent.svg` — white wordmark for dark backgrounds
- `color_logo_with_background.svg` — best suited for the small feature-card icon
- `logo-wordmark.svg`/`.png` — fallback header wordmark name
- `mark.svg`/`.png` — fallback feature-card icon name

Once these files are in place, the homepage will automatically display them. Until then, the page will show a reminder to add the assets rather than substituting placeholder graphics.
