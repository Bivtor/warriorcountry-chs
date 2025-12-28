# Strapi Content Types Setup Guide

This guide provides step-by-step instructions for creating the required content types in Strapi via the admin GUI.

## Prerequisites

1. Start the Strapi server: `cd strapi && npm run develop`
2. Access the Strapi admin panel at `http://localhost:1337/admin`
3. Log in with your admin credentials

## Content Types to Create

### 1. MeetResult (Collection Type)

**Purpose**: Store meet results with PDF documents

**Steps**:

1. Go to **Content-Type Builder** in the left sidebar
2. Click **"Create new collection type"**
3. Enter Display name: `MeetResult`
4. Click **Continue**

**Add the following fields**:

#### Field 1: meetName (Enumeration)

- Click **"Add another field"**
- Select **Enumeration**
- Name: `meetName`
- Values (add these three):
  - `RussellCup`
  - `CountyMeet`
  - `AllComers`
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 2: year (Number)

- Click **"Add another field"**
- Select **Number**
- Name: `year`
- Number format: **integer**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 3: title (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `title`
- Type: **Short text**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 4: description (Rich text)

- Click **"Add another field"**
- Select **Rich text**
- Name: `description`
- Click **Finish** (optional field)

#### Field 5: resultsPDF (Media)

- Click **"Add another field"**
- Select **Media**
- Name: `resultsPDF`
- Type: **Single media**
- Allowed types: Check **Document** only
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

5. Click **Save** in the top right
6. Wait for Strapi to restart

---

### 2. NewsPost (Collection Type)

**Purpose**: Store news articles and updates

**Steps**:

1. Go to **Content-Type Builder**
2. Click **"Create new collection type"**
3. Enter Display name: `NewsPost`
4. Click **Continue**

**Add the following fields**:

#### Field 1: title (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `title`
- Type: **Short text**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 2: slug (UID)

- Click **"Add another field"**
- Select **UID**
- Name: `slug`
- Attached field: Select **title**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 3: excerpt (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `excerpt`
- Type: **Long text**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 4: content (Rich text)

- Click **"Add another field"**
- Select **Rich text**
- Name: `content`
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 5: featuredImage (Media)

- Click **"Add another field"**
- Select **Media**
- Name: `featuredImage`
- Type: **Single media**
- Allowed types: Check **Image** only
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 6: author (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `author`
- Type: **Short text**
- Click **Finish** (optional field)

5. Click **Save** in the top right
6. Wait for Strapi to restart

---

### 3. ArchiveLink (Collection Type)

**Purpose**: Manage links to static archive pages

**Steps**:

1. Go to **Content-Type Builder**
2. Click **"Create new collection type"**
3. Enter Display name: `ArchiveLink`
4. Click **Continue**

**Add the following fields**:

#### Field 1: title (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `title`
- Type: **Short text**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 2: url (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `url`
- Type: **Short text**
- Click **Advanced Settings** tab
- Check **Required field**
- Click **Finish**

#### Field 3: category (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `category`
- Type: **Short text**
- Click **Finish** (optional field)

#### Field 4: year (Number)

- Click **"Add another field"**
- Select **Number**
- Name: `year`
- Number format: **integer**
- Click **Finish** (optional field)

5. Click **Save** in the top right
6. Wait for Strapi to restart

---

### 4. HomepageSettings (Single Type)

**Purpose**: Configure homepage hero and featured content

**Steps**:

1. Go to **Content-Type Builder**
2. Click **"Create new single type"**
3. Enter Display name: `HomepageSettings`
4. Click **Continue**

**Add the following fields**:

#### Field 1: heroImage (Media)

- Click **"Add another field"**
- Select **Media**
- Name: `heroImage`
- Type: **Single media**
- Allowed types: Check **Image** only
- Click **Finish**

#### Field 2: logoImage (Media)

- Click **"Add another field"**
- Select **Media**
- Name: `logoImage`
- Type: **Single media**
- Allowed types: Check **Image** only
- Click **Finish**

#### Field 3: heroTitle (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `heroTitle`
- Type: **Short text**
- Click **Finish**

#### Field 4: heroSubtitle (Text)

- Click **"Add another field"**
- Select **Text**
- Name: `heroSubtitle`
- Type: **Long text**
- Click **Finish**

#### Field 5: instagramEmbedCode (Text) - NOT USED

- **Note**: Instagram integration is handled externally via Behold widget
- This field is not needed and can be skipped
- The frontend will use a Behold embed code from environment variables instead

#### Field 6: featuredNewsCount (Number)

- Click **"Add another field"**
- Select **Number**
- Name: `featuredNewsCount`
- Number format: **integer**
- Default value: `5`
- Click **Finish**

5. Click **Save** in the top right
6. Wait for Strapi to restart

---

## Setting Public Permissions

After creating all content types, you need to configure permissions so the frontend can access the data:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**
2. Click on **Public** role
3. Scroll down to **Permissions** section

### For each content type, enable these permissions:

#### MeetResult

- ✅ `find` (allows fetching all meet results)
- ✅ `findOne` (allows fetching a single meet result)

#### NewsPost

- ✅ `find` (allows fetching all news posts)
- ✅ `findOne` (allows fetching a single news post)

#### ArchiveLink

- ✅ `find` (allows fetching all archive links)
- ✅ `findOne` (allows fetching a single archive link)

#### HomepageSettings

- ✅ `find` (allows fetching homepage settings)

#### Upload (for media files)

- ✅ `find` (allows fetching media files)

4. Click **Save** in the top right

---

## Verification

After completing all steps:

1. Go to **Content Manager** in the left sidebar
2. You should see:

   - Collection Types: MeetResult, NewsPost, ArchiveLink
   - Single Types: HomepageSettings

3. Test the API endpoints (replace `localhost:1337` with your Strapi URL):
   - `GET http://localhost:1337/api/meet-results`
   - `GET http://localhost:1337/api/news-posts`
   - `GET http://localhost:1337/api/archive-links`
   - `GET http://localhost:1337/api/homepage-settings`

All endpoints should return `200 OK` with empty data arrays (or null for single type).

---

## Notes

- **Records content type** will be created later in Task 13 after other features are working
- Make sure to enable **Draft & Publish** for collection types (enabled by default)
- Single types don't have Draft & Publish system
- You can add sample content through the Content Manager to test the setup
