# Lumière Beauty: A Modern E-Commerce Platform for Skincare Products with AI-Powered Skin Analysis

**International Journal for Innovative Engineering and Management Research**  
*PEER REVIEWED OPEN ACCESS INTERNATIONAL JOURNAL*

---

## Authors

**Development Team**  
Lumière Beauty Project, 2026

---

## ABSTRACT

Lumière Beauty is a comprehensive e-commerce platform designed for premium skincare products, featuring an innovative AI-powered skin analysis system. The platform combines modern web technologies including React, TypeScript, and Supabase to deliver a seamless shopping experience. This paper presents the architecture, methodology, and implementation details of the Lumière Beauty platform, focusing on its key features: dynamic product catalog management, AI-driven personalized recommendations, user authentication, and a robust admin dashboard for inventory management. The system demonstrates how machine learning can be integrated into e-commerce to enhance customer experience and drive personalized product recommendations.

**Keywords:** E-Commerce, Skincare, AI Skin Analysis, React, TypeScript, Supabase, Machine Learning, Product Recommendations, User Authentication, Admin Dashboard

---

## I. INTRODUCTION

The skincare industry has experienced significant growth in recent years, with consumers increasingly seeking personalized product recommendations based on their individual skin characteristics. Traditional e-commerce platforms often provide generic shopping experiences that fail to address the unique needs of each customer. This gap presents an opportunity for innovative solutions that leverage artificial intelligence to deliver personalized experiences.

Lumière Beauty addresses this challenge by implementing an AI-powered skin analysis feature that evaluates user-uploaded images to determine skin type, identify concerns, and recommend appropriate products. The platform combines this intelligent recommendation system with a fully-featured e-commerce infrastructure, including product browsing, cart management, wishlist functionality, and secure checkout processes.

The structure of this document is as follows: Section II reviews the technology stack and related work. Section III explains the methodology and architecture. Section IV presents the system features and implementation details. Section V provides a conclusion based on our findings.

---

## II. TECHNOLOGY STACK

### Frontend Technologies

The Lumière Beauty platform is built using modern frontend technologies that ensure performance, maintainability, and developer productivity:

1. **React 18.3**: A JavaScript library for building user interfaces with component-based architecture
2. **TypeScript**: Provides static typing for enhanced code quality and developer experience
3. **Vite**: A fast build tool that enables rapid development with hot module replacement
4. **Tailwind CSS**: A utility-first CSS framework for responsive and customizable styling
5. **shadcn/ui**: A collection of accessible, customizable UI components built on Radix primitives

### Backend Technologies

The backend infrastructure leverages Supabase, an open-source Firebase alternative:

1. **Supabase Database**: PostgreSQL database with Row-Level Security (RLS) for data protection
2. **Supabase Auth**: Built-in authentication with email/password and social login support
3. **Supabase Storage**: File storage for product images, banners, and user uploads
4. **Supabase Edge Functions**: Serverless functions for AI analysis and custom business logic

### AI Integration

The platform integrates with advanced AI models for skin analysis:

1. **Google Gemini**: Vision-language model for analyzing skin images
2. **Custom Analysis Pipeline**: Evaluates hydration, elasticity, radiance, and overall skin health
3. **Personalized Recommendations**: Matches skin concerns with appropriate product categories

---

## III. PROPOSED METHODOLOGY

### System Architecture

The Lumière Beauty platform follows a modern three-tier architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Layer                        │
│  React + TypeScript + Tailwind CSS + shadcn/ui          │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                    API Layer                             │
│  Supabase Client + Edge Functions                       │
└─────────────────────┬───────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────┐
│                   Data Layer                             │
│  PostgreSQL + Storage Buckets + Auth                    │
└─────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Authentication**: Users register/login through Supabase Auth
2. **Product Browsing**: Products fetched from PostgreSQL with real-time updates
3. **Cart Management**: Cart items stored in database with user association
4. **AI Analysis**: Images uploaded to storage, processed by Edge Functions
5. **Order Processing**: Orders created with full transaction history

### Database Schema

The platform utilizes the following primary tables:

| Table | Purpose |
|-------|---------|
| products | Product catalog with pricing, images, and inventory |
| categories | Product categorization |
| profiles | User profile information |
| cart_items | Shopping cart items per user |
| orders | Order records with shipping/billing |
| order_items | Individual items within orders |
| reviews | Product reviews and ratings |
| wishlists | User wishlists |
| skin_analyses | AI analysis results and recommendations |
| promotional_banners | Dynamic homepage promotions |
| user_roles | Role-based access control (admin, moderator, user) |

### Security Implementation

Row-Level Security (RLS) policies ensure data protection:

- Users can only access their own cart, orders, and wishlist items
- Products and categories are publicly viewable
- Admin operations require verified admin role
- Storage buckets have role-based upload/download policies

---

## IV. SYSTEM FEATURES

### A. Product Catalog Management

The product catalog features a dynamic, database-driven architecture:

- **Multi-brand Support**: Diverse skincare brands including Lumière Luxe, Éclat Paris, AquaVeil
- **Category Organization**: Products organized by skincare type (serums, moisturizers, etc.)
- **Rich Product Details**: Descriptions, ingredients, usage instructions, and multiple images
- **Stock Management**: Real-time inventory tracking with stock quantity alerts

### B. AI Skin Analysis

The AI-powered skin analysis provides personalized insights:

1. **Image Upload**: Users upload facial photos securely
2. **AI Processing**: Edge Function processes image with Google Gemini vision model
3. **Analysis Results**:
   - Skin type classification (oily, dry, combination, normal, sensitive)
   - Hydration level (0-100 scale)
   - Elasticity level (0-100 scale)
   - Radiance level (0-100 scale)
   - Overall skin health score
4. **Personalized Recommendations**: Products matched to identified concerns
5. **Routine Generation**: Morning and evening skincare routines

### C. User Account System

Comprehensive user account features:

- Email/password authentication with verification
- Profile management
- Order history tracking
- Skin analysis history with progress tracking
- Wishlist management
- Review submission

### D. Shopping Experience

Full e-commerce functionality:

- **Product Discovery**: Search, filter by category, sort by price/rating
- **Product Details**: High-quality images, reviews, related products
- **Cart Management**: Add/remove items, quantity adjustment
- **Wishlist**: Save products for later
- **Checkout**: Shipping address, payment method selection
- **Order Confirmation**: Email confirmation with order details

### E. Admin Dashboard

Role-based admin panel for store management:

- **Product Management**: CRUD operations for products with image upload
- **Banner Management**: Promotional banners with images and scheduling
- **Settings**: Store configuration and payment gateway setup

### F. Promotional Banners

Dynamic promotional system:

- Image-enabled banners for hero sections
- Text-only banners for announcements
- Scheduling with start/end dates
- Active/inactive status control
- Custom background colors and CTAs

---

## V. CONCLUSION

The Lumière Beauty platform demonstrates a successful integration of modern web technologies with AI-powered personalization in the e-commerce domain. Key achievements include:

1. **Scalable Architecture**: React + Supabase provides a solid foundation for growth
2. **AI Integration**: Successful implementation of vision-based skin analysis
3. **Secure Design**: Row-Level Security ensures data protection at the database level
4. **Admin Capabilities**: Comprehensive dashboard for store management
5. **User Experience**: Responsive design with intuitive navigation

The platform serves as a model for how AI can enhance traditional e-commerce by providing personalized experiences that address individual customer needs. Future enhancements may include:

- Integration with payment gateways (Stripe)
- Advanced analytics and reporting
- Social sharing features
- Loyalty program implementation
- Mobile application development

---

## VI. REFERENCES

1. React Documentation, "React - A JavaScript library for building user interfaces," 2024. Available: https://react.dev/

2. Supabase Documentation, "Supabase - The Open Source Firebase Alternative," 2024. Available: https://supabase.com/docs

3. Tailwind CSS Documentation, "A utility-first CSS framework," 2024. Available: https://tailwindcss.com/

4. shadcn/ui Documentation, "Beautifully designed components," 2024. Available: https://ui.shadcn.com/

5. Google Gemini API Documentation, "Multimodal AI capabilities," 2024. Available: https://ai.google.dev/

6. TypeScript Documentation, "JavaScript with syntax for types," 2024. Available: https://www.typescriptlang.org/

7. Vite Documentation, "Next Generation Frontend Tooling," 2024. Available: https://vitejs.dev/

8. PostgreSQL Documentation, "The World's Most Advanced Open Source Relational Database," 2024. Available: https://www.postgresql.org/docs/

9. TanStack Query Documentation, "Powerful asynchronous state management," 2024. Available: https://tanstack.com/query/

10. Radix UI Documentation, "Unstyled, accessible components," 2024. Available: https://www.radix-ui.com/

---

**Volume 14 Issue 04 April 2026** | **ISSN 2456 - 5083** | **Page 599-603**

---

*© 2026 Lumière Beauty. All rights reserved.*
