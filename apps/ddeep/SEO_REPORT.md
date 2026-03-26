# Comprehensive SEO Report for React Router Project

## Project Overview
- **Path**: `/home/kali5/new_folder/my-monorepo/apps/ddeep`
- **Framework**: React Router v7 with Vite
- **SSR Configuration**: `ssr: false` in `react-router.config.ts`
- **Prerendering**: Enabled for 12 static routes
- **Dev Server**: Running on port 5175 (pid 1190295)

## Current SEO Implementation Analysis

### 1. Build-Time Configuration (`react-router.config.ts`)
typescript
// Current configuration
ssr: false,
prerender: [
  "/", // Homepage
  "/services/regular-cleaning",
  "/services/deep-cleaning",
  "/services/end-of-tenancy-cleaning",
  "/services/appliances-cleaning",
  "/services/carpet-cleaning",
  "/services/office-cleaning",
  "/services/bars-restaurants",
  "/services/post-construction",
  "/services/healthcare-cleaning",
  "/services/student-accommodation",
  "/tc", // Terms & Conditions
],


**Impact**: With `ssr: false`, pages are prerendered at build time as static HTML. Client-side JavaScript hydrates the page after load.

### 2. SEO Hook Implementation (`app/hooks/usePageSEO.ts`)
typescript
export function usePageSEO({ title, description, keywords, schema }: SEOProps) {
  useEffect(() => {
    document.title = title;
    // ... creates/updates meta tags via DOM manipulation
  }, [title, description, keywords, schema]);
}


**Critical Issue**: This hook runs in `useEffect`, which executes **after** component mount. For prerendered pages:
1. Build generates static HTML without meta tags (React hasn't run)
2. Client loads HTML, React hydrates, `useEffect` runs
3. Search engines see empty `<head>` during initial crawl

### 3. Current Route SEO Status
| Route File | SEO Implementation | Status |
|------------|-------------------|--------|
| `_index.tsx` | `export function meta()` | ✅ Correct |
| `tc.tsx` | `export const meta = () => [...]` | ✅ Correct |
| `services.deep-clean.tsx` | `usePageSEO()` hook | ❌ Will fail for prerendering |
| `services.regular.tsx` | No SEO implementation | ❌ Missing |
| `services.$service.tsx` | Unknown (not inspected) | ⚠️ Needs verification |
| `services._index.tsx` | Unknown (not inspected) | ⚠️ Needs verification |

### 4. Semantic HTML & Accessibility Audit

**Findings from component inspection**:
1. **Good**: `HomeIntro.tsx` line 68: `<img alt="Cleaner in bright room" />`
2. **Good**: `HomeIntro2.tsx` line 137: `<img alt="Immaculate living room after cleaning" />`
3. **Issue**: `HomeHero.tsx` line 43: `<div role="img" />` - Should use `<img>` with proper `alt` or CSS background
4. **Missing**: Some decorative images may lack `aria-hidden="true"`
5. **Missing**: Semantic heading hierarchy review needed

## Migration to Native `export const meta` API

### Why Migrate?
React Router's `meta` export:
1. Runs at build time for prerendered routes
2. Injects tags directly into static HTML
3. Works with client-side navigation
4. No hydration mismatch

### Migration Code Examples

**Example 1: Fix `services.deep-clean.tsx` (replace `usePageSEO`)**
typescript
// REMOVE: import { usePageSEO } from "../hooks/usePageSEO";
// REMOVE: usePageSEO({ ... });

// ADD:
export function meta() {
  return [
    { title: "Deep Cleaning Services in Manchester | D Deep Cleaning Services" },
    {
      name: "description",
      content: "Professional deep cleaning services across Manchester and Liverpool. We tackle built-up grime, sanitise high-touch areas, and restore your property to a like-new condition."
    },
    {
      name: "keywords",
      content: "deep cleaning manchester, deep clean liverpool, end of tenancy cleaning, after builders cleaning, professional cleaners north west"
    },
    { property: "og:title", content: "Deep Cleaning Services | D Deep Cleaning" },
    {
      property: "og:description",
      content: "Transform your space with our thorough deep cleaning service. Ideal for move-in/move-out, post-renovation, or seasonal refresh."
    },
    { name: "robots", content: "index, follow" },
  ];
}


**Example 2: Add to `services.regular.tsx` (missing SEO)**
typescript
// Add at top of file, after imports:
export function meta() {
  return [
    { title: "Regular Cleaning Services | D Deep Cleaning" },
    {
      name: "description",
      content: "Weekly or fortnightly regular cleaning services for homes and offices across Manchester and Liverpool. Consistent, reliable cleaning on your schedule."
    },
    {
      name: "keywords",
      content: "regular cleaning, weekly cleaners, fortnightly cleaning, domestic cleaners, office cleaning schedule, trusted cleaners manchester"
    },
    { name: "robots", content: "index, follow" },
  ];
}


### Schema.org JSON-LD Integration
typescript
// Add to meta function if needed:
const schema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "D Deep Cleaning Services",
  "description": "Professional cleaning services in Manchester and Liverpool",
  // ... additional properties
};

// In meta() return array:
{ "script:ld+json": schema }


## Semantic HTML Improvements

### 1. Fix `HomeHero.tsx` Background Image
**Current**:
tsx
<div 
  role="img"
  style={{ y: backgroundY, backgroundImage: `url(${HeroImage})` }}
/>


**Recommended**:
tsx
// Option A: Use CSS background with aria-hidden
<div 
  className="hero-background"
  style={{ backgroundImage: `url(${HeroImage})` }}
  aria-hidden="true"
/>

// Option B: Use proper img with alt
export const HeroBackground = () => (
  <img 
    src={HeroImage}
    alt="Professional cleaner at work in a modern kitchen"
    className="hero-background"
    style={{ y: backgroundY }}
  />
);


### 2. Add Missing Alt Text
Check all `<img>` tags in:
- `HomeIntro.tsx` ✓ (has alt)
- `HomeIntro2.tsx` ✓ (has alt)
- `HomeAreas.tsx` (no images found)
- `HomeReviews.tsx` (no images found)
- Other components need verification

### 3. Heading Hierarchy
Ensure proper `<h1>` to `<h6>` structure:
- Each page should have one `<h1>`
- Follow logical nesting
- Use semantic sections (`<section>`, `<article>`, `<header>`, `<footer>`)

## Implementation Priority

### High Priority (Prerendered Routes)
1. `app/routes/services.deep-clean.tsx` - Migrate from `usePageSEO` to `export function meta`
2. `app/routes/services.regular.tsx` - Add `export function meta`
3. `app/routes/services.$service.tsx` - Verify and add if missing
4. `app/routes/services._index.tsx` - Verify and add if missing

### Medium Priority (Semantic HTML)
1. `app/components/home/HomeHero.tsx` - Fix background image semantics
2. Review all components for missing `alt` attributes
3. Verify heading hierarchy

### Low Priority
1. `app/hooks/usePageSEO.ts` - Mark as deprecated or delete after migration
2. Consider adding Open Graph image tags
3. Add JSON-LD structured data for LocalBusiness

## Verification Steps

1. **Build Test**: `npm run build` (or equivalent) should succeed
2. **Type Check**: `tsc --noEmit` should show no errors
3. **HTML Inspection**: Check prerendered HTML in `build/client/` for meta tags
4. **Lighthouse Audit**: Run Chrome Lighthouse for SEO score

## Conclusion
The current `usePageSEO` hook cannot inject meta tags into prerendered HTML. Migration to React Router's native `export const meta` API is required for all prerendered routes. Semantic HTML improvements will enhance accessibility and SEO ranking.

**Next Actions**:
1. Implement migration for high-priority routes
2. Fix semantic HTML issues in components
3. Run verification tests
4. Deploy updated build