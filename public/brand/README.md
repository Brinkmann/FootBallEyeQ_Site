# Football EyeQ Brand Assets

Brand identity files for Football EyeQ.

---

## Logo Files

### Primary Logos

Located in `/public/brand/`:

| File | Usage | Dimensions |
|------|-------|------------|
| `logo-full.png` | **Primary logo** - Full wordmark with icon | Use for headers, signup pages |
| `logo-icon.png` | **Icon only** - Football icon without text | Use for navbar, footer, small spaces |
| `ball-icon-red.png` | Red football icon | Alternative icon variant |

### Usage in Code

```tsx
// Full logo (signup, about page, club signup)
<img src="/brand/logo-full.png" alt="Football EyeQ" />

// Icon logo (navbar, footer, page headers)
<img src="/brand/logo-icon.png" alt="Football EyeQ" />
```

**Current usage:**
- `logo-icon.png` - Used **11 times** in app (Navbar, Footer, multiple pages)
- `logo-full.png` - Used **3 times** in app (Signup, Club signup, About page)

---

## Alternative Brand Assets

Located in `/public/brand/user/`:

This directory contains additional brand variants for external use (social media, WordPress, marketing):

### Logo Variants

- `Logo Transparent.png` / `Logo Transparent 2.png` - Transparent backgrounds
- `3-line Ball black on white background.png` - Black variant
- `3-line Ball red on white background.png` - Red variant (primary brand color)

### SVG Formats

- `color_logo_transparent.svg` - Color logo (SVG)
- `color_logo_with_background.svg` - Color logo with background (SVG)
- `dark_logo_transparent.svg` - Dark theme logo (SVG)
- `white_logo_transparent.svg` - White logo for dark backgrounds (SVG)

### Social Media Assets

- `cover_photo retina.png` - Cover photo for social profiles
- `header_photo.png` - Header image
- `WordPress Login Logo.png` - WordPress admin login logo

### App Icons

- `icon_symbol 57px 57px.png` - Small app icon (57×57)
- `icon_symbol 72px 72px.png` - Medium app icon (72×72)
- `icon_symbol 114px 114px.png` - Large app icon (114×114)

### Profile Pictures

- `profile_picture_symbol red ball white background.png` - Profile pic variant 1
- `profile_picture_symbol red ball white background trans.png` - Profile pic with transparency
- `profile_picture_symbol white on red.png` - Inverted profile pic

---

## Brand Guidelines

**Official Branding Guideline:** See `docs/branding/Football_EyeQ_Branding_Guideline.pdf`

### Primary Colors

**Red (Primary):**
- Used in logo, primary actions, brand elements
- Represents energy, passion, football

**Black:**
- Used for text, high-contrast elements
- Professional, clean

**White:**
- Used for backgrounds, light themes
- Clean, modern

### Typography

The app uses system fonts via Tailwind CSS:
- **Headlines:** Font-bold, larger sizes
- **Body:** Font-normal, readable sizes
- **Monospace:** Font-mono (for code, session codes)

---

## File Organization

```
public/brand/
├── logo-full.png           ✅ Used in app
├── logo-icon.png           ✅ Used in app
├── ball-icon-red.png       ❌ Not currently used in app
├── user/                   ❌ Not used in app (external assets)
│   ├── 3-line Ball black on white background.png
│   ├── 3-line Ball red on white background.png
│   ├── Logo Transparent.png
│   ├── Logo Transparent 2.png
│   ├── WordPress Login Logo.png
│   ├── color_logo_transparent.svg
│   ├── color_logo_with_background.svg
│   ├── dark_logo_transparent.svg
│   ├── white_logo_transparent.svg
│   ├── cover_photo retina.png
│   ├── header_photo.png
│   ├── icon_symbol 57px 57px.png
│   ├── icon_symbol 72px 72px.png
│   ├── icon_symbol 114px 114px.png
│   ├── profile_picture_symbol red ball white background.png
│   ├── profile_picture_symbol red ball white background trans.png
│   └── profile_picture_symbol white on red.png
└── README.md               ← You are here
```

---

## Adding New Logos

If you need to add or update logo files:

1. **Add file to appropriate directory:**
   - App logos → `/public/brand/`
   - External/marketing → `/public/brand/user/`

2. **Use descriptive names:**
   - `logo-{variant}.{ext}` for logos
   - `icon-{size}.{ext}` for icons

3. **Update this README** with usage info

4. **Test in app** if used in code

---

## Design Resources

**Branding Guideline PDF:**
- Location: `docs/branding/Football_EyeQ_Branding_Guideline.pdf`
- Contains: Logo usage rules, color palettes, typography, spacing

**Figma / Design Files:**
- (Add links to design files if available)

---

## Questions?

**Need a specific logo variant?**
- Check `/public/brand/user/` first
- Refer to branding guideline PDF
- Contact design team

**Adding logos to the app?**
- Use `logo-full.png` or `logo-icon.png` (already optimized)
- Reference with `/brand/logo-*.png` path
- Add alt text: `alt="Football EyeQ"`

---

*Last updated: 2026-01-14*
