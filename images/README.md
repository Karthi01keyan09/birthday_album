# 📸 Images Folder

Place your photos here. The album supports the following structure:

## Button Images (required for styled buttons)
| Filename   | Description           |
|------------|-----------------------|
| `next.png` | "NEXT" button image   |
| `prev.png` | "PREV" button image   |

## Photo Pages (optional)
Add images named `img1.jpg`, `img2.jpg` ... up to `img20.jpg` (or use `.png`, `.webp`).
Once you have photos, replace the placeholder `<div class="photo-placeholder">` in `index.html`
with `<img src="images/yourphoto.jpg" alt="Memory">` inside the relevant page.

## Quick Replace Guide
In `index.html`, for each photo page, change:
```html
<div class="photo-placeholder pp1">
  <span class="ph-icon">📷</span>
  <p class="ph-label">Your Photo Here</p>
</div>
```
to:
```html
<div class="photo-placeholder pp1">
  <img src="images/img1.jpg" alt="Photo 1">
</div>
```
