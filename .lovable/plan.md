

# Implementation Plan

## Overview
This plan covers 6 changes: removing "About" from navbar, making "AI Analysis" open the upload modal directly, implementing newsletter email subscription with database persistence, fixing footer links, adding more products and categories (including Gift Sets).

---

## 1. Remove "About" from Navbar, Make "AI Analysis" Open Modal Directly

**Navbar.tsx changes:**
- Remove the "About" nav link entry from `navLinks` array
- Change "AI Analysis" to trigger `SkinAnalysisModal` directly (open modal on click) instead of navigating to `/#ai-analysis`
- Import and add `SkinAnalysisModal` state + component in Navbar
- Both desktop and mobile nav will open the modal on click

---

## 2. Implement Newsletter Email Subscription (Database-Backed)

**Database migration:**
- Create a `newsletter_subscribers` table with columns: `id`, `email` (unique), `subscribed_at`, `is_active`
- Add RLS policy: allow anonymous inserts (public signup), restrict select/update/delete to admins

**Newsletter.tsx changes:**
- Replace the local-only state logic with an actual database insert to `newsletter_subscribers`
- Show success/error toasts
- Handle duplicate email gracefully

---

## 3. Fix Footer Links

**Footer.tsx changes:**
- Update "Shop" links to point to real routes: `/shop` for "All Products", and `/shop` for category-specific ones (since categories are dynamic)
- Update "Support" links: "Contact Us" and "FAQs" to `/support`, "Track Order" to `/orders`
- Remove non-functional links that don't have corresponding pages (e.g., "Our Story", "Ingredients", "Sustainability", "Careers") -- keep only links that map to real pages
- Simplify to relevant, working links: Shop (All Products, Gift Sets), Support (Contact Us, FAQs, Shipping & Returns), and keep social links

---

## 4. Add More Categories (Including Gift Sets)

**Database insert:**
- Add new categories: "Gift Sets", "Cleansers", "Suncare", "Masks & Treatments"

---

## 5. Add More Products with Descriptions and Images

**Database insert:**
- Add ~10 new products across the new and existing categories, including gift set products
- Use existing product images from `src/assets/products/` folder (there are many unused ones available)
- Each product will have: name, brand, price, description, detailed_description, image_url, category_id, rating, badge, slug, stock_quantity

---

## 6. Remove "About" Section Target from Footer

**Footer.tsx:**
- Remove `id="about"` from the footer element since the "About" nav link is being removed

---

## Technical Details

### Database Migration SQL (new table)
```sql
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  subscribed_at timestamptz NOT NULL DEFAULT now(),
  is_active boolean NOT NULL DEFAULT true
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can subscribe
CREATE POLICY "Anyone can subscribe"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can view subscribers
CREATE POLICY "Admins can view subscribers"
  ON public.newsletter_subscribers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));
```

### New Categories (via insert)
- Gift Sets, Cleansers, Suncare, Masks & Treatments

### New Products (~10 items)
Products spanning gift sets, cleansers, suncare, and masks categories with realistic skincare descriptions, prices in INR range, and mapped to existing product images.

### Files to Modify
1. `src/components/Navbar.tsx` -- remove About, make AI Analysis open modal
2. `src/components/Newsletter.tsx` -- database-backed subscription
3. `src/components/Footer.tsx` -- fix links, remove dead links and about id
4. Database -- new table + new categories + new products

