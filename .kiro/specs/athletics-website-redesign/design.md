# Design Document

## Overview

This design specifies a school athletics website built with SvelteKit frontend and Strapi CMS backend. The architecture emphasizes responsive image delivery, rich photo galleries, and maintainable content management while preserving existing archive content. The system leverages Strapi's built-in image optimization, authentication, and API generation to minimize custom backend code.

## Architecture

### System Components

```
┌─────────────────┐
│  SvelteKit      │
│  Frontend       │
│  (Public Site)  │
└────────┬────────┘
         │ HTTP/REST API
         │
┌────────▼────────┐
│  Strapi CMS     │
│  (Admin + API)  │
└────────┬────────┘
         │
┌────────▼────────┐
│  PostgreSQL     │
│  Database       │
└─────────────────┘
```

### Technology Stack

- **Frontend**: SvelteKit (SSR + Static Generation)
- **Backend**: Strapi v4 (Headless CMS)
- **Database**: PostgreSQL (via Drizzle ORM)
- **Image Processing**: Strapi Sharp plugin (built-in)
- **Hosting**: Vercel (frontend), Railway (Strapi + DB)
- **Media Storage**: S3-compatible storage (configured in Strapi)

### Data Flow

1. Admin creates/updates content in Strapi admin panel
2. Strapi processes images (generates variants) and stores in media library
3. Strapi exposes content via REST API
4. SvelteKit fetches data at build time (SSG) or request time (SSR)
5. Frontend renders responsive images using Strapi-provided URLs

## Components and Interfaces

### Strapi Content Types

#### Content Type: Record

**Purpose**: Store individual athletic records

**Fields**:

```typescript
{
  athleteName: string;          // Athlete's full name
  year: number;                 // Year achieved (e.g., 2024)
  performance: string;          // Performance value (e.g., "10.5s", "6'2\"")
  event: string;                // Event name (e.g., "100m Dash", "High Jump")
  category: enum;               // One of: Boys, Girls, Stadium, StateChamps, CIFChamps, TeamChamps, Alumni
  photos: media[];              // Multiple photos (Strapi media field)
  notes: text;                  // Optional additional information
  publishedAt: datetime;        // Publication timestamp
}
```

**Strapi Setup Instructions**:

1. Go to Content-Type Builder → Create new collection type → Name: "Record"
2. Add fields:
   - Text field: `athleteName` (Short text, required)
   - Number field: `year` (Integer, required)
   - Text field: `performance` (Short text, required)
   - Text field: `event` (Short text, required)
   - Enumeration field: `category` (Values: Boys, Girls, Stadium, StateChamps, CIFChamps, TeamChamps, Alumni)
   - Media field: `photos` (Multiple files, Images only)
   - Rich text field: `notes` (Optional)
3. Save and enable "Draft & Publish"

#### Content Type: MeetResult

**Purpose**: Store meet results with PDF documents

**Fields**:

```typescript
{
  meetName: enum;               // One of: RussellCup, CountyMeet, AllComers
  year: number;                 // Year of meet
  title: string;                // Display title (e.g., "2024 Russell Cup Results")
  description: text;            // Optional description
  resultsPDF: media;            // Single PDF file
  publishedAt: datetime;        // Publication timestamp
}
```

**Strapi Setup Instructions**:

1. Content-Type Builder → Create new collection type → Name: "MeetResult"
2. Add fields:
   - Enumeration field: `meetName` (Values: RussellCup, CountyMeet, AllComers)
   - Number field: `year` (Integer, required)
   - Text field: `title` (Short text, required)
   - Rich text field: `description` (Optional)
   - Media field: `resultsPDF` (Single file, Documents only)
3. Save and enable "Draft & Publish"

#### Content Type: NewsPost

**Purpose**: Store news articles and updates

**Fields**:

```typescript
{
  title: string; // Post title
  slug: string; // URL-friendly identifier
  excerpt: text; // Short summary for cards
  content: richtext; // Full post content
  featuredImage: media; // Single image
  publishedAt: datetime; // Publication timestamp
  author: string; // Optional author name
}
```

**Strapi Setup Instructions**:

1. Content-Type Builder → Create new collection type → Name: "NewsPost"
2. Add fields:
   - Text field: `title` (Short text, required)
   - UID field: `slug` (Attached to `title`, required)
   - Text field: `excerpt` (Long text, required)
   - Rich text field: `content` (Required)
   - Media field: `featuredImage` (Single file, Images only)
   - Text field: `author` (Short text, optional)
3. Save and enable "Draft & Publish"

#### Content Type: ArchiveLink

**Purpose**: Manage links to static archive pages

**Fields**:

```typescript
{
  title: string; // Link display text
  url: string; // Path to .htm file (e.g., "/archives/2010-season.htm")
  category: string; // Optional grouping
  year: number; // Optional year for sorting
  publishedAt: datetime; // Publication timestamp
}
```

**Strapi Setup Instructions**:

1. Content-Type Builder → Create new collection type → Name: "ArchiveLink"
2. Add fields:
   - Text field: `title` (Short text, required)
   - Text field: `url` (Short text, required)
   - Text field: `category` (Short text, optional)
   - Number field: `year` (Integer, optional)
3. Save and enable "Draft & Publish"

#### Single Type: HomepageSettings

**Purpose**: Configure homepage hero and featured content

**Fields**:

```typescript
{
  heroImage: media; // Hero section background
  logoImage: media; // Site logo
  heroTitle: string; // Hero heading
  heroSubtitle: text; // Hero subheading
  featuredNewsCount: number; // Number of news items to show (default: 5)
  // Note: Instagram integration handled externally via Behold widget (not in Strapi)
}
```

**Strapi Setup Instructions**:

1. Content-Type Builder → Create new single type → Name: "HomepageSettings"
2. Add fields:
   - Media field: `heroImage` (Single file, Images only)
   - Media field: `logoImage` (Single file, Images only)
   - Text field: `heroTitle` (Short text)
   - Text field: `heroSubtitle` (Long text)
   - Number field: `featuredNewsCount` (Integer, default: 5)
   - **Note**: Instagram integration is handled externally via Behold widget (not stored in Strapi)
3. Save (no Draft & Publish needed for single types)

### Strapi Image Configuration

**Configure Sharp Plugin** (in `config/plugins.ts`):

```typescript
export default {
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 300,
      },
      sizeOptimization: true,
      responsiveDimensions: true,
    },
  },
};
```

This configuration ensures Strapi automatically generates image variants at multiple sizes when images are uploaded.

### Frontend Components

#### Component: RecordsPage

**Purpose**: Display athletic records with photo gallery

**Props**:

```typescript
{
  category: RecordCategory;     // Which category to display
  records: Record[];            // Array of record entries
}
```

**Layout**:

```
┌─────────────────────────────────────┐
│  Category Title (e.g., "Boys")     │
├─────────────────────────────────────┤
│  Filters: [Event ▼] [Year ▼]      │
├─────────────────────────────────────┤
│  Records Table                      │
│  ┌──────┬────────┬──────┬────────┐ │
│  │ Name │ Event  │ Perf │ Year   │ │
│  ├──────┼────────┼──────┼────────┤ │
│  │ ...  │ ...    │ ...  │ ...    │ │
│  └──────┴────────┴──────┴────────┘ │
├─────────────────────────────────────┤
│  Photo Gallery                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐      │
│  │ 📷 │ │ 📷 │ │ 📷 │ │ 📷 │      │
│  └────┘ └────┘ └────┘ └────┘      │
│  [Caption overlays on hover]        │
└─────────────────────────────────────┘
```

**Responsive Image Implementation**:

```svelte
<img
  src={photo.formats.medium.url}
  srcset="
    {photo.formats.small.url} 500w,
    {photo.formats.medium.url} 750w,
    {photo.formats.large.url} 1000w
  "
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  alt={photo.caption}
  loading="lazy"
/>
```

#### Component: PhotoGallery

**Purpose**: Display responsive photo grid with lightbox

**Props**:

```typescript
{
  photos: StrapiImage[];        // Array of Strapi media objects
  columns: number;              // Grid columns (default: 4)
}
```

**Features**:

- CSS Grid layout with responsive columns
- Lazy loading for images below fold
- Click to open lightbox overlay
- Keyboard navigation (arrow keys, ESC)
- Caption overlay on hover
- Swipe gestures on mobile

**Implementation Notes**:

- Use `svelte-lightbox` or similar library
- Extract caption from photo metadata or related record
- Implement intersection observer for lazy loading

#### Component: MeetLanding

**Purpose**: Display meet results organized by year

**Props**:

```typescript
{
  meetName: string;             // "Russell Cup", "County Meet", etc.
  results: MeetResult[];        // Array of meet results
}
```

**Layout**:

```
┌─────────────────────────────────────┐
│  Meet Name & Description            │
├─────────────────────────────────────┤
│  Results by Year                    │
│  ┌─────────────────────────────┐   │
│  │ 2024 - Title                │   │
│  │ Description...              │   │
│  │ [Download PDF] 📄           │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 2023 - Title                │   │
│  │ [Download PDF] 📄           │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### Component: NewsCard

**Purpose**: Display news item preview

**Props**:

```typescript
{
  post: NewsPost; // News post data
  variant: "featured" | "list"; // Display style
}
```

**Layout (Featured)**:

```
┌─────────────────────────────┐
│  Featured Image (16:9)      │
├─────────────────────────────┤
│  Title                      │
│  Date                       │
│  Excerpt...                 │
│  [Read More →]              │
└─────────────────────────────┘
```

#### Component: Header

**Purpose**: Site navigation with dropdowns

**Features**:

- Responsive mobile menu (hamburger)
- Dropdown menus for Records and Meets
- Active page highlighting
- Sticky header on scroll

**Navigation Structure**:

```
Home | Records ▼ | Meets ▼ | Hall of Fame | Archives | Contact
       │            │
       ├─ Boys      ├─ Russell Cup
       ├─ Girls     ├─ County Meet
       ├─ Stadium   └─ All Comers
       ├─ State Champs
       ├─ CIF Champs
       ├─ Team Champs
       └─ Alumni
```

### API Endpoints

Strapi automatically generates these REST endpoints:

**Records**:

- `GET /api/records` - List all records (with filters)
- `GET /api/records/:id` - Get single record
- `GET /api/records?filters[category][$eq]=Boys` - Filter by category
- `GET /api/records?populate=photos` - Include photo data

**Meet Results**:

- `GET /api/meet-results` - List all meet results
- `GET /api/meet-results?filters[meetName][$eq]=RussellCup` - Filter by meet
- `GET /api/meet-results?populate=resultsPDF` - Include PDF data

**News Posts**:

- `GET /api/news-posts` - List all news posts
- `GET /api/news-posts/:id` - Get single post
- `GET /api/news-posts?sort=publishedAt:desc&pagination[limit]=5` - Recent posts
- `GET /api/news-posts?filters[slug][$eq]=championship-win` - Get by slug

**Homepage Settings**:

- `GET /api/homepage-setting?populate=*` - Get homepage configuration

**Archive Links**:

- `GET /api/archive-links` - List all archive links

## Data Models

### Record Entity

```typescript
interface Record {
  id: number;
  athleteName: string;
  year: number;
  performance: string;
  event: string;
  category: RecordCategory;
  photos: StrapiImage[];
  notes?: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type RecordCategory =
  | "Boys"
  | "Girls"
  | "Stadium"
  | "StateChamps"
  | "CIFChamps"
  | "TeamChamps"
  | "Alumni";
```

### StrapiImage Entity

```typescript
interface StrapiImage {
  id: number;
  name: string;
  alternativeText?: string;
  caption?: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
    small: ImageFormat;
    medium: ImageFormat;
    large: ImageFormat;
    xlarge?: ImageFormat;
  };
  url: string;
  mime: string;
  size: number;
}

interface ImageFormat {
  name: string;
  hash: string;
  ext: string;
  mime: string;
  width: number;
  height: number;
  size: number;
  url: string;
}
```

### MeetResult Entity

```typescript
interface MeetResult {
  id: number;
  meetName: MeetName;
  year: number;
  title: string;
  description?: string;
  resultsPDF: StrapiFile;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

type MeetName = "RussellCup" | "CountyMeet" | "AllComers";
```

### NewsPost Entity

```typescript
interface NewsPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: StrapiImage;
  author?: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Data Persistence Round Trip

_For any_ content entity (Record, MeetResult, or NewsPost), creating the entity with specific field values and then querying it should return those exact values unchanged.

**Validates: Requirements 1.1, 4.1, 5.1**

### Property 2: Image Format Generation

_For any_ uploaded image, the system should generate all required size variants (thumbnail, small, medium, large) with appropriate dimensions and provide URLs for each variant in API responses.

**Validates: Requirements 1.2, 2.1, 10.4**

### Property 3: Content Publication Visibility

_For any_ content entity, when it is published in Strapi, the API should immediately return it in appropriate queries without requiring cache clearing or delays.

**Validates: Requirements 1.3, 10.2**

### Property 4: Query Filtering and Sorting

_For any_ collection of entities and any valid filter/sort/pagination parameters, the API should return only entities matching the filter criteria, in the specified sort order, with correct pagination boundaries.

**Validates: Requirements 1.4, 10.5**

### Property 5: Responsive Image Selection

_For any_ image and any viewport width, the frontend should select the appropriate image format URL that best matches the viewport size without serving unnecessarily large files.

**Validates: Requirements 2.2**

### Property 6: Responsive Image Markup

_For any_ image rendered in the frontend, the HTML should include srcset and sizes attributes with all available format URLs and appropriate size breakpoints.

**Validates: Requirements 2.3**

### Property 7: Lazy Loading Implementation

_For any_ photo gallery with multiple images, images positioned below the initial viewport should have lazy loading enabled (loading="lazy" attribute or intersection observer).

**Validates: Requirements 2.5**

### Property 8: Lightbox Interaction

_For any_ photo in a gallery, clicking it should open a lightbox overlay displaying the full-size image with caption containing athlete name, year, and achievement.

**Validates: Requirements 3.2, 3.3**

### Property 9: Multiple Photos Support

_For any_ record entity, the system should support associating multiple photos and retrieving all associated photos when querying the record.

**Validates: Requirements 3.4**

### Property 10: Meet Results Organization

_For any_ collection of meet results for a specific meet, displaying them should show results sorted by year in descending order (most recent first).

**Validates: Requirements 4.3**

### Property 11: PDF Link Correctness

_For any_ meet result with an uploaded PDF, the rendered link should point to the correct PDF file URL that successfully downloads or opens the file.

**Validates: Requirements 4.4**

### Property 12: Meet Type Support

_For any_ of the three meet types (RussellCup, CountyMeet, AllComers), the system should accept, store, and retrieve meet results with that type correctly.

**Validates: Requirements 4.5**

### Property 13: Recent News Limiting

_For any_ collection of published news posts, the homepage should display only the N most recent posts (where N is configured in homepage settings), sorted by publication date descending.

**Validates: Requirements 5.2**

### Property 14: News Card Completeness

_For any_ news post rendered as a card, the rendered HTML should contain the featured image, title, excerpt, and publication date.

**Validates: Requirements 5.3**

### Property 15: News Slug Routing

_For any_ news post, the link to the full post should use the format `/news/{slug}` where slug matches the post's slug field.

**Validates: Requirements 5.4, 7.5**

### Property 16: News Pagination

_For any_ collection of published news posts exceeding the page size, the news archive page should implement pagination with correct page boundaries and navigation.

**Validates: Requirements 5.5**

### Property 17: Archive Content Integrity

_For any_ .htm archive file in the static directory, requesting its URL should return the original file content without modification.

**Validates: Requirements 6.1, 6.2**

### Property 18: Archive Links Completeness

_For any_ set of archive link entries in the database, the archives navigation page should display links to all entries.

**Validates: Requirements 6.3**

### Property 19: Archive URL Preservation

_For any_ archive file, its URL should maintain the original path structure without rewriting or modification.

**Validates: Requirements 6.5**

### Property 20: Authentication Requirement

_For any_ Strapi admin endpoint, unauthenticated requests should be rejected with appropriate HTTP status code and redirect to login.

**Validates: Requirements 9.1, 9.4**

### Property 21: Credential Verification

_For any_ login attempt, valid credentials should grant access while invalid credentials should be rejected with appropriate error message.

**Validates: Requirements 9.2**

### Property 22: Role-Based Authorization

_For any_ admin user with specific role permissions, they should be able to access permitted resources and be denied access to unpermitted resources.

**Validates: Requirements 9.3**

### Property 23: API Error Handling

_For any_ API error condition (network failure, 404, 500, etc.), the frontend should display user-friendly error messages rather than crashing or showing technical stack traces.

**Validates: Requirements 10.3**

## Error Handling

### Frontend Error Handling

**API Request Failures**:

- Network errors: Display "Unable to connect. Please check your internet connection."
- 404 errors: Display "Content not found" with link to homepage
- 500 errors: Display "Something went wrong. Please try again later."
- Timeout errors: Display "Request timed out. Please try again."

**Image Loading Failures**:

- Use placeholder image or gray box with icon
- Log error to console for debugging
- Don't break page layout

**Navigation Errors**:

- Invalid routes: Redirect to 404 page
- Missing slugs: Redirect to parent page (e.g., /news)

### Backend Error Handling

**Strapi Configuration**:

- Enable error logging to file and console
- Configure appropriate error responses in `config/middlewares.ts`
- Use Strapi's built-in error handling for validation errors

**File Upload Errors**:

- File too large: Return 413 with size limit message
- Invalid file type: Return 400 with allowed types message
- Storage failure: Return 500 with retry message

**Database Errors**:

- Connection failures: Log error, return 503
- Query errors: Log error, return 500
- Constraint violations: Return 400 with specific field error

## Testing Strategy

### Unit Testing

**Frontend Components** (Vitest + Testing Library):

- Test component rendering with mock data
- Test user interactions (clicks, hovers, form submissions)
- Test responsive behavior at different viewport sizes
- Test error states and loading states
- Test accessibility (ARIA labels, keyboard navigation)

**Example Unit Tests**:

- RecordsPage renders table with correct columns
- PhotoGallery opens lightbox on click
- NewsCard displays all required fields
- Header dropdown shows correct items on hover
- Error boundary catches and displays errors

**API Integration** (Vitest):

- Test API client functions with mocked fetch
- Test response parsing and error handling
- Test query parameter construction
- Test authentication token handling

### Property-Based Testing

**Testing Library**: Use `fast-check` for TypeScript/JavaScript property-based testing

**Test Configuration**:

- Minimum 100 iterations per property test
- Use appropriate generators for each data type
- Tag each test with feature name and property number

**Property Test Examples**:

```typescript
// Property 1: Data Persistence Round Trip
test("Feature: athletics-website-redesign, Property 1: Data persistence round trip", async () => {
  await fc.assert(
    fc.asyncProperty(recordGenerator(), async (record) => {
      const created = await createRecord(record);
      const retrieved = await getRecord(created.id);
      expect(retrieved).toEqual(created);
    }),
    { numRuns: 100 }
  );
});

// Property 6: Responsive Image Markup
test("Feature: athletics-website-redesign, Property 6: Responsive image markup", () => {
  fc.assert(
    fc.property(strapiImageGenerator(), (image) => {
      const html = renderImage(image);
      expect(html).toContain("srcset=");
      expect(html).toContain("sizes=");
      expect(html).toMatch(/\d+w/); // Contains width descriptors
    }),
    { numRuns: 100 }
  );
});
```

**Generators**:

- `recordGenerator()`: Generates random Record objects with valid fields
- `strapiImageGenerator()`: Generates mock Strapi image objects with formats
- `newsPostGenerator()`: Generates random NewsPost objects
- `viewportWidthGenerator()`: Generates random viewport widths (320-2560)

### Integration Testing

**End-to-End Tests** (Playwright):

- Test complete user flows (view records, read news, download PDFs)
- Test navigation between pages
- Test responsive behavior on mobile/tablet/desktop
- Test image loading and lazy loading
- Test lightbox functionality
- Test form submissions in Strapi admin

**API Integration Tests**:

- Test actual Strapi API endpoints (not mocked)
- Test authentication flows
- Test file uploads
- Test query filtering and pagination
- Test content publication workflow

### Manual Testing Checklist

**Strapi Admin**:

- [ ] Create record with photos
- [ ] Upload PDF for meet result
- [ ] Create news post with featured image
- [ ] Verify image variants generated
- [ ] Test role permissions
- [ ] Test draft/publish workflow

**Frontend**:

- [ ] Verify responsive images load correctly
- [ ] Test lightbox on mobile and desktop
- [ ] Verify lazy loading works
- [ ] Test navigation dropdowns
- [ ] Verify archive links work
- [ ] Test news pagination
- [ ] Verify Instagram embed displays

**Performance**:

- [ ] Lighthouse score > 90
- [ ] Images optimized (WebP format where supported)
- [ ] Lazy loading reduces initial page weight
- [ ] API responses cached appropriately

## Implementation Notes

### Strapi Setup Steps

1. **Install Strapi** (already done based on file structure)

2. **Configure Image Processing** in `config/plugins.ts`:

```typescript
export default {
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 300,
      },
      sizeOptimization: true,
      responsiveDimensions: true,
    },
  },
};
```

3. **Create Content Types** (follow instructions in Components section above)

4. **Configure Permissions**:

   - Settings → Users & Permissions → Roles → Public
   - Enable `find` and `findOne` for all content types
   - Enable `find` for media (upload)
   - Keep `create`, `update`, `delete` disabled for public

5. **Configure CORS** in `config/middlewares.ts`:

```typescript
export default [
  // ... other middlewares
  {
    name: "strapi::cors",
    config: {
      origin: ["http://localhost:5173", "https://your-frontend-domain.com"],
      credentials: true,
    },
  },
];
```

### SvelteKit Setup Steps

1. **Install Dependencies**:

```bash
npm install @sveltejs/adapter-vercel
npm install -D vitest @testing-library/svelte fast-check
```

2. **Configure API Client** (`src/lib/api/strapi.ts`):

```typescript
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || "http://localhost:1337";

export async function fetchAPI(path: string, params?: Record<string, any>) {
  const queryString = params
    ? "?" + new URLSearchParams(params).toString()
    : "";
  const response = await fetch(`${STRAPI_URL}/api${path}${queryString}`);

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  return response.json();
}
```

3. **Create Type Definitions** (`src/lib/types/strapi.ts`):

```typescript
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Add all entity interfaces from Data Models section
```

4. **Implement Responsive Image Component** (`src/lib/components/ResponsiveImage.svelte`):

```svelte
<script lang="ts">
  import type { StrapiImage } from '$lib/types/strapi';

  export let image: StrapiImage;
  export let alt: string = '';
  export let loading: 'lazy' | 'eager' = 'lazy';
</script>

<img
  src={image.formats.medium?.url || image.url}
  srcset="
    {image.formats.medium?.url} 750w,
    {image.formats.large?.url} 1000w
  "
  sizes="(max-width: 768px) 100vw, 1000px"
  {alt}
  {loading}
  width={image.width}
  height={image.height}
/>
```

**Note**: Strapi with S3 automatically generates Small, Medium, and Large image variants. We serve Medium (750px) for mobile/tablet and Large (1000px) for desktop. Small/thumbnail variants are not used for main content display.

### Static Archive Integration

1. **Copy Archive Files**:

   - Place all `.htm` files in `frontend/static/archives/`
   - Files will be served at `/archives/*.htm`

2. **Create Archive Links in Strapi**:

   - For each archive file, create an ArchiveLink entry
   - Set URL to `/archives/filename.htm`

3. **Build Archives Page** (`src/routes/archives/+page.svelte`):
   - Fetch archive links from Strapi
   - Group by category or year
   - Render as simple link list

### Deployment Considerations

**Frontend (Vercel)**:

- Set environment variable: `VITE_STRAPI_URL=https://your-strapi-domain.com`
- Configure build command: `npm run build`
- Set output directory: `.svelte-kit/vercel`

**Backend (Railway)**:

- Set environment variables from `.env.example`
- Configure database connection
- Set `NODE_ENV=production`
- Enable S3 storage for media files

**Database**:

- Use PostgreSQL (already configured with Drizzle)
- Regular backups recommended
- Consider read replicas for high traffic

## Future Enhancements

- **Search Functionality**: Add full-text search across records and news
- **Advanced Filtering**: Multi-select filters, date ranges
- **Social Sharing**: Add share buttons for news posts
- **Comments**: Enable comments on news posts
- **Email Notifications**: Notify subscribers of new records/news
- **Mobile App**: Consider React Native app using same Strapi backend
- **Analytics**: Add Google Analytics or similar tracking
- **SEO Optimization**: Add meta tags, structured data, sitemap
