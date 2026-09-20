# DEPLOYMENT GUIDE: Itemized — Your Life, In Receipts
**Challenge**: WebRush — "Your Life, In Receipts"  
**Architecture**: 100% Frontend Single-Page Application (SPA)  
**Status**: Ready for Production Deployment  

---

## 1. Architecture Overview
Itemized is built as a pure client-side single page application using React 19, TypeScript, Vite, Tailwind CSS v4, and Motion.
- **Zero Backend**: All data (55 receipts, 29 confirmed connections, 9 monthly chapters) is parsed and computed in-browser from bundled CSV files.
- **Zero API Keys**: No external APIs, databases, or cloud services are required.
- **Static Assets**: Compiles down to standard HTML, CSS, JavaScript, and font assets in `dist/`.

---

## 2. Build Instructions

### Prerequisites
- Node.js version 20.x or higher
- npm 10.x or higher

### Build Steps
```bash
# Navigate to Frontend directory
cd Frontend

# Install production and dev dependencies
npm install

# Run strict verification (TypeScript typecheck + Vitest suite + Vite production build)
npm run verify

# Output files will be generated in Frontend/dist/
```

---

## 3. Platform Configurations

### Vercel Deployment
The repository includes `vercel.json` in `Frontend/vercel.json`:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
- **Framework Preset**: Vite
- **Root Directory**: `Frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Netlify Deployment
For Netlify, ensure standard SPA redirection is enabled via `public/_redirects`:
```text
/*    /index.html   200
```
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### Static Server / Docker / Nginx
For Nginx or static file servers:
```nginx
server {
    listen 80;
    server_name itemized.example.com;
    root /var/www/itemized/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache immutable static assets
    location ~* \.(?:css|js|woff2?|svg|png)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 4. Post-Deployment Verification Checklist
1. **Direct Route Access**: Navigating directly to `/story`, `/threads`, `/map`, `/patterns`, `/archive`, or `/method` loads the page without 404 errors (SPA rewrite test).
2. **Deep Linking**: Accessing `/?r=R018` opens the Home page with the Receipt Drawer for R018 automatically open.
3. **Keyboard Navigation**: Pressing `?` opens the Keyboard Shortcuts cheat sheet; sequential keys (`g` then `h/s/t/m/p/a/x`) switch views.
4. **Performance**: Initial load displays under 1.5 seconds on fast 4G networks; animations run smoothly at 60fps.
5. **Accessibility**: Screen readers announce route changes via polite live regions; focus moves to page `<h1>`.
