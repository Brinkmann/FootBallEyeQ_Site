# Brand asset placement

To use your official branding on the site, upload your provided assets to the deployed site's `public/brand/user/` directory (preferred) or directly to `public/`. The homepage now checks for the following files (in order), so you can drop in the versions that best fit your palette:

- `brand/user/color_logo_transparent.svg` — preferred header wordmark on light backgrounds
- `brand/user/dark_logo_transparent.svg` — darker wordmark alternative
- `brand/user/white_logo_transparent.svg` — white wordmark for dark backgrounds
- `brand/user/color_logo_with_background.svg` — best suited for the small feature-card icon
- `color_logo_transparent.svg` — header wordmark fallback when placed directly in `/public`
- `dark_logo_transparent.svg` — darker wordmark fallback when placed directly in `/public`
- `white_logo_transparent.svg` — white wordmark fallback when placed directly in `/public`
- `color_logo_with_background.svg` — feature-card icon fallback when placed directly in `/public`
- `logo-wordmark.svg`/`.png` — fallback header wordmark name
- `mark.svg`/`.png` — fallback feature-card icon name

Once these files are in place, the homepage will automatically display them. Until then, the page will show a reminder to add the assets rather than substituting placeholder graphics.
