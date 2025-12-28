# Implementation Plan: Athletics Website Redesign

## Overview

This implementation plan breaks down the athletics website redesign into discrete coding tasks. The approach prioritizes getting the news system, meet results, and archives working first, then adds navigation and layout, and finally implements the school records system (which needs more design discussion). Each task builds on previous work to ensure continuous integration.

## Tasks

- [x] 1. Set up Strapi base configuration and initial content types

  - Configure image processing breakpoints in `config/plugins.ts`
  - Configure CORS in `config/middlewares.ts` to allow frontend origin
  - Create MeetResult, NewsPost, ArchiveLink collection types via Strapi GUI (follow design.md instructions)
  - Create HomepageSettings single type via Strapi GUI
  - Set public permissions for find/findOne on these content types
  - _Requirements: 2.1, 4.1, 5.1, 9.1_
  - **Note**: Records content type will be created later (Task 13) after other features are working

- [x] 2. Create TypeScript type definitions and API client

  - [x] 2.1 Create Strapi type definitions in `frontend/src/lib/types/strapi.ts`

    - Define StrapiImage, ImageFormat interfaces
    - Define MeetResult, NewsPost, ArchiveLink, HomepageSettings interfaces
    - Define StrapiResponse wrapper type
    - _Requirements: 2.1, 4.1, 5.1_
    - **Note**: Record interface will be added in Task 13

  - [x] 2.2 Implement API client in `frontend/src/lib/api/strapi.ts`

    - Create fetchAPI function with error handling
    - Implement getMeetResults, getMeetResultsByName functions
    - Implement getNewsPosts, getNewsPostBySlug functions
    - Implement getHomepageSettings, getArchiveLinks functions
    - _Requirements: 10.1, 10.2, 10.3_
    - **Note**: Records API functions will be added in Task 13

  - [ ]\* 2.3 Write property test for API client
    - **Property 1: Data Persistence Round Trip**
    - **Property 4: Query Filtering and Sorting**
    - **Validates: Requirements 1.1, 1.4, 10.5**

- [x] 3. Implement meet results pages

  - [x] 3.1 Create MeetLanding component in `frontend/src/lib/components/MeetLanding.svelte`

    - Accept meetName prop
    - Fetch meet results for specific meet using API client
    - Sort results by year descending
    - Render cards for each year with title, description, PDF download link
    - _Requirements: 4.1, 4.3, 4.4_

  - [x] 3.2 Create route pages for each meet

    - Create `frontend/src/routes/meets/russell-cup/+page.svelte`
    - Create `frontend/src/routes/meets/county-meet/+page.svelte`
    - Create `frontend/src/routes/meets/all-comers/+page.svelte`
    - Each page uses MeetLanding component with appropriate meet name
    - _Requirements: 4.5, 7.1, 7.3_

  - [x] 3.3 Write property tests for meet results

    - **Property 10: Meet Results Organization**
    - **Property 11: PDF Link Correctness**
    - **Property 12: Meet Type Support**
    - **Validates: Requirements 4.3, 4.4, 4.5**

- [x] 4. Implement news system

  - [x] 4.1 Create NewsCard component in `frontend/src/lib/components/NewsCard.svelte`

    - Accept post and variant props
    - Render featured image using responsive image techniques (srcset, sizes)
    - Display title, date, excerpt
    - Add "Read More" link to `/news/{slug}`
    - Support 'featured' and 'list' variants
    - _Requirements: 5.3, 5.4_

  - [x] 4.2 Create homepage with news feed in `frontend/src/routes/+page.svelte`

    - Fetch homepage settings
    - Fetch N most recent news posts (from settings)
    - Render hero section with logo and hero image
    - Display news cards in grid
    - Add "View All News" button linking to `/news`
    - Add Behold Instagram widget using PUBLIC_BEHOLD_FEED_ID from env
    - _Requirements: 5.2, 8.1, 8.2, 8.3, 8.4_

  - [x] 4.3 Create news archive page in `frontend/src/routes/news/+page.svelte`

    - Fetch all published news posts
    - Implement pagination (10 posts per page)
    - Render NewsCard components in list variant
    - Add pagination controls
    - _Requirements: 5.5_

  - [x] 4.4 Create individual news post page in `frontend/src/routes/news/[slug]/+page.svelte`

    - Fetch news post by slug from URL parameter
    - Render featured image, title, date, author
    - Render full content
    - Handle 404 if slug not found
    - _Requirements: 5.1, 5.4_

  - [ ]\* 4.5 Write property tests for news system

    - **Property 13: Recent News Limiting**
    - **Property 14: News Card Completeness**
    - **Property 15: News Slug Routing**
    - **Property 16: News Pagination**
    - **Validates: Requirements 5.2, 5.3, 5.4, 5.5**

- [ ] 5. Checkpoint - Verify news system works

  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement navigation and layout

  - [ ] 6.1 Create Header component in `frontend/src/lib/components/Header/Header.svelte`

    - Create navigation links: Home, Meets, Hall of Fame, Archives, Contact
    - Implement dropdown for Meets with all meet links
    - Add hover interactions for dropdowns
    - Implement responsive mobile menu (hamburger)
    - Add active page highlighting
    - Make header sticky on scroll
    - _Requirements: 7.1, 7.3, 7.5_
    - **Note**: Records dropdown will be added in Task 13

  - [ ] 6.2 Create Footer component in `frontend/src/lib/components/Footer.svelte`

    - Add social media links (Facebook, Instagram)
    - Add quick links section
    - _Requirements: 7.4_

  - [ ] 6.3 Create layout in `frontend/src/routes/+layout.svelte`

    - Include Header component
    - Include Footer component
    - Add main content slot
    - _Requirements: 7.1, 7.4_

- [ ] 7. Implement archives integration

  - [ ] 7.1 Copy existing .htm archive files to `frontend/static/archives/`

    - Preserve original file structure and names
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ] 7.2 Create archives navigation page in `frontend/src/routes/archives/+page.svelte`

    - Fetch archive links from Strapi
    - Group by category or year
    - Render as link list
    - Each link points to static .htm file
    - _Requirements: 6.3, 6.5_

  - [ ]\* 7.3 Write property tests for archives

    - **Property 17: Archive Content Integrity**
    - **Property 18: Archive Links Completeness**
    - **Property 19: Archive URL Preservation**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.5**

- [ ] 8. Implement error handling and loading states

  - [ ] 8.1 Create error boundary component in `frontend/src/lib/components/ErrorBoundary.svelte`

    - Catch and display user-friendly error messages
    - Handle different error types (network, 404, 500)
    - _Requirements: 10.3_

  - [ ] 8.2 Add loading states to all data-fetching pages

    - Show skeleton loaders or spinners while fetching
    - Handle empty states (no records, no news, etc.)
    - _Requirements: 10.3_

  - [ ] 8.3 Add image loading error handling

    - Use placeholder for failed image loads
    - Log errors to console
    - Don't break layout
    - _Requirements: 2.1, 10.3_

  - [ ]\* 8.4 Write property test for error handling

    - **Property 23: API Error Handling**
    - **Validates: Requirements 10.3**

  - [ ]\* 8.5 Write unit tests for API error handling
    - Test API client handles network errors
    - Test API client handles 404/500 errors
    - Test error messages are user-friendly
    - _Requirements: 10.3_

- [ ] 9. Add Hall of Fame and Contact pages

  - [ ] 9.1 Create Hall of Fame page in `frontend/src/routes/hall-of-fame/+page.svelte`

    - Create simple content type in Strapi for Hall of Fame entries
    - Fetch and display Hall of Fame members
    - _Requirements: 7.1_

  - [ ] 9.2 Create Contact page in `frontend/src/routes/contact/+page.svelte`
    - Display contact information (email, phone, address)
    - Add coaching staff information
    - Optionally add contact form
    - _Requirements: 7.1_

- [ ] 10. SEO and performance optimization

  - [ ] 10.1 Add SEO meta tags to all pages

    - Add title, description, og:image tags
    - Use news post featured images for social sharing
    - _Requirements: 5.1, 8.1_

  - [ ] 10.2 Optimize performance

    - Verify lazy loading works on images
    - Check Lighthouse scores
    - Optimize bundle size
    - _Requirements: 2.5_

  - [ ] 10.3 Test responsive behavior
    - Test all pages on mobile, tablet, desktop
    - Verify images load appropriate sizes
    - Test navigation on mobile
    - _Requirements: 2.2, 2.3, 7.1_

- [ ] 11. Checkpoint - Verify core site is functional

  - Ensure all tests pass, ask the user if questions arise.
  - News, meets, archives, and navigation should all be working

- [ ] 12. FINAL: Implement school records system

  - [ ] 12.1 Design and create Record content type in Strapi

    - Discuss and finalize record structure with user
    - Create Record collection type via Strapi GUI
    - Define fields: athleteName, year, performance, event, category, photos, notes
    - Set up enumeration for categories (Boys, Girls, Stadium, StateChamps, CIFChamps, TeamChamps, Alumni)
    - Configure permissions
    - _Requirements: 1.1_
    - **Note**: This is where we'll review the DB structure before implementing

  - [ ] 12.2 Add Record types and API functions

    - Add Record interface to `frontend/src/lib/types/strapi.ts`
    - Add getRecords, getRecordsByCategory to API client
    - _Requirements: 1.1_

  - [ ] 12.3 Implement responsive image component

    - Create ResponsiveImage component in `frontend/src/lib/components/ResponsiveImage.svelte`
    - Accept StrapiImage prop and alt text
    - Generate srcset with medium (750w) and large (1000w) variants
    - Use sizes attribute: "(max-width: 768px) 100vw, 1000px"
    - Add lazy loading support
    - _Requirements: 2.2, 2.3, 2.5_

  - [ ]\* 12.4 Write property tests for responsive images

    - **Property 5: Responsive Image Selection**
    - **Property 6: Responsive Image Markup**
    - **Property 7: Lazy Loading Implementation**
    - **Validates: Requirements 2.2, 2.3, 2.5**

  - [ ] 12.5 Build photo gallery with lightbox

    - Create PhotoGallery component in `frontend/src/lib/components/PhotoGallery.svelte`
    - Accept photos array and columns prop
    - Implement CSS Grid layout with responsive columns
    - Add hover caption overlays
    - Integrate lightbox library (svelte-lightbox or similar)
    - Implement keyboard navigation (arrows, ESC)
    - Use ResponsiveImage component for each photo
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]\* 12.6 Write property tests for photo gallery

    - **Property 8: Lightbox Interaction**
    - **Property 9: Multiple Photos Support**
    - **Validates: Requirements 3.2, 3.3, 3.4**

  - [ ] 12.7 Create RecordsPage component

    - Create RecordsPage component in `frontend/src/lib/components/RecordsPage.svelte`
    - Accept category prop
    - Fetch records for category using API client
    - Render records table with columns: Name, Event, Performance, Year
    - Add filter dropdowns for Event and Year
    - Display PhotoGallery component below table with category photos
    - _Requirements: 1.1, 1.4, 1.5, 3.1_

  - [ ] 12.8 Create route pages for each record category

    - Create `frontend/src/routes/records/boys/+page.svelte`
    - Create `frontend/src/routes/records/girls/+page.svelte`
    - Create `frontend/src/routes/records/stadium/+page.svelte`
    - Create `frontend/src/routes/records/state-champs/+page.svelte`
    - Create `frontend/src/routes/records/cif-champs/+page.svelte`
    - Create `frontend/src/routes/records/team-champs/+page.svelte`
    - Create `frontend/src/routes/records/alumni/+page.svelte`
    - Each page uses RecordsPage component with appropriate category
    - _Requirements: 1.1, 7.1, 7.2_

  - [ ] 12.9 Add Records dropdown to Header

    - Update Header component to include Records dropdown
    - Add all category links (Boys, Girls, Stadium, State Champs, CIF Champs, Team Champs, Alumni)
    - _Requirements: 7.2_

  - [ ]\* 12.10 Write property tests for records system
    - **Property 4: Query Filtering and Sorting**
    - **Validates: Requirements 1.4, 10.5**

- [ ] 13. Final checkpoint - Complete system verification
  - Ensure all tests pass, ask the user if questions arise.
  - Full site including records should be functional

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Task 1 (Strapi setup) is manual GUI configuration - follow design.md instructions
- **Task 12 (Records system) is saved for last** - this allows you to get news, meets, archives, and navigation working first, then review the records DB structure before implementing
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties using fast-check library
- Unit tests focus on API integration and error handling (no component/UI tests)
- The implementation follows this order: news → meets → archives → navigation → records
- Install testing dependencies: `npm install -D vitest fast-check` in frontend directory
