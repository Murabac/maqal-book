# Mobile Design Prompt for Maqal Book Audiobook App

## Project Overview
Design a mobile-optimized version of **Maqal Book**, a modern audiobook web application built with Next.js 14, React, TypeScript, and Tailwind CSS. The app supports multiple languages (English, Arabic, Somali) and focuses on providing an excellent listening experience.

## Design System

### Color Palette
- **Primary Gradient**: Purple (#9333EA) → Blue (#2563EB) → Teal (#14B8A6)
- **Background**: Light gradient from purple-50 via blue-50 to teal-50
- **Text**: Gray-900 for primary text, Gray-600 for secondary
- **Accents**: Purple-600, Blue-600, Teal-500
- **White**: Pure white (#FFFFFF) with 80% opacity for overlays

### Typography
- **Primary Font**: Inter (Latin scripts)
- **Arabic Font**: Cairo (for Arabic content)
- **Font Sizes**: Responsive scaling from mobile to tablet
- **RTL Support**: Full right-to-left support for Arabic content

### Visual Style
- **Modern & Clean**: Minimalist design with gradient accents
- **Glassmorphism**: Backdrop blur effects (bg-white/80 backdrop-blur-lg)
- **Rounded Corners**: Rounded-xl (12px) for cards, rounded-full for buttons
- **Shadows**: Subtle shadows for depth (shadow-md, shadow-lg, shadow-xl)
- **Icons**: Lucide React icons with consistent sizing

## Key Screens & Components to Design for Mobile

### 1. Home/Discovery Screen
**Layout Requirements:**
- Sticky header with logo, search, and navigation menu
- Hero section with gradient background and CTA buttons
- Category grid (2 columns on mobile, responsive)
- Featured audiobooks grid (2 columns on mobile, 3 on tablet)
- Popular this week section
- Bottom audio player bar (when book is playing)

**Key Elements:**
- Responsive search bar (collapsed on mobile, full width on tablet+)
- Category cards with gradient backgrounds and icons
- Book cards with cover image, title, author, duration, language badge
- Play/favorite buttons on book cards

### 2. Library/Browse Screen
**Layout Requirements:**
- Full-width search bar at top
- Filter chips (category, language, duration)
- Book grid layout (2 columns mobile, 3 tablet, 4+ desktop)
- Infinite scroll or pagination
- Loading states and empty states

**Key Elements:**
- Search input with icon
- Filter buttons with active states
- Book grid with consistent card sizes
- Quick play and favorite actions

### 3. Audio Player (Bottom Bar & Full Screen)
**Bottom Bar (Fixed):**
- Compact player bar at bottom
- Book cover thumbnail (small circle/square)
- Book title and author (truncated)
- Play/pause button
- Skip forward/back buttons
- Progress indicator (minimal)

**Full Screen Player:**
- Large book cover image (centered)
- Book title and author (full)
- Progress slider with time indicators
- Playback controls (play, pause, skip forward/back)
- Speed control
- Volume control
- Chapter list (if applicable)
- Background blur with gradient overlay

### 4. User Profile Screen
**Layout Requirements:**
- Profile header with avatar, name, level badge, streak indicator
- XP progress bar
- Currently reading card (prominent, gradient background)
- Stats grid (2x2 on mobile)
- Weekly activity chart
- Achievements/badges grid
- Recent listening history list

**Key Elements:**
- Circular avatar with gradient border
- Progress rings for reading stats
- Weekly activity bar chart
- Badge cards with unlock status
- Stat cards with icons and gradients

### 5. Favorites Screen
**Layout Requirements:**
- Empty state when no favorites
- Book grid (2 columns mobile)
- Remove from favorites action
- Quick play button

### 6. Authentication Screens
**Login & Signup:**
- Centered form layout
- Gradient background or card-based design
- Email and password inputs
- Social login options (if applicable)
- Link to switch between login/signup
- Error message display
- Loading states during submission

### 7. Book Detail/Chapter Screen
**Layout Requirements:**
- Hero section with large book cover
- Book metadata (title, author, duration, category, language)
- Description/About section
- Chapter list (if applicable)
- Play button (prominent)
- Add to favorites button
- Related books section

## Mobile-Specific Design Requirements

### Navigation
- **Bottom Navigation Bar** (recommended for mobile):
  - Home icon
  - Library icon
  - Search icon
  - Favorites icon
  - Profile icon
  - Active state indicators

- **Alternative: Hamburger Menu**
  - Slide-out drawer from left
  - Full navigation menu
  - User profile section at top
  - Settings and logout at bottom

### Touch Interactions
- **Minimum touch target**: 44x44px (iOS) / 48x48px (Android)
- **Button sizes**: Comfortable for thumb navigation
- **Swipe gestures**: 
  - Swipe down to refresh on lists
  - Swipe left/right on book cards for quick actions
  - Swipe up on audio player bar to expand to full screen

### Responsive Breakpoints
- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md)
- **Desktop**: > 1024px (lg)

### Performance Considerations
- Optimize images for mobile (Next.js Image component)
- Lazy loading for book grids
- Skeleton loaders instead of blank states
- Smooth animations (60fps)

### Accessibility
- Proper contrast ratios (WCAG AA minimum)
- Screen reader support
- Keyboard navigation
- Focus states for interactive elements
- Alt text for images

## Component Specifications

### Book Card (Mobile)
- **Size**: Approximately 150px width (2 columns)
- **Image**: 150x225px aspect ratio (book cover)
- **Content**: Title (2 lines max), author, duration badge
- **Actions**: Play button overlay, favorite heart icon
- **States**: Default, hover, loading, error

### Audio Player Bar (Mobile)
- **Height**: ~80px fixed at bottom
- **Content**: Small cover (40x40px), title/author (truncated), play button
- **Expand**: Tap to open full-screen player
- **Background**: Gradient with blur effect

### Category Card (Mobile)
- **Size**: Approximately 150px width
- **Design**: Gradient background with icon and count
- **Touch**: Entire card is clickable

## Technical Context
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS with custom utilities
- **Components**: React functional components with hooks
- **State Management**: React useState/useEffect, Context API for audio player
- **Icons**: Lucide React
- **Images**: Next.js Image optimization
- **Authentication**: Supabase Auth

## Design Deliverables Requested
1. **Mobile UI Mockups** for all key screens (iPhone and Android variants)
2. **Component Library** showing mobile-optimized versions of all components
3. **Interaction Flows** for key user journeys (discover → play, profile → settings)
4. **Responsive Design Specs** for tablet sizes (640px - 1024px)
5. **Animation Specifications** for transitions and micro-interactions
6. **Design Tokens** (spacing, typography scale, color variants)
7. **Mobile Navigation Patterns** recommendation (bottom nav vs hamburger menu)

## Special Considerations
- **Multi-language Support**: Ensure RTL layouts for Arabic content work seamlessly
- **Audio-First Experience**: Player should be easily accessible and never intrusive
- **Offline Considerations**: Design for potential offline mode (save for later, download indicators)
- **Dark Mode**: Consider dark mode variant (optional but recommended)
- **Thumb-Friendly**: Primary actions should be within thumb reach zone
- **Loading States**: Design skeleton screens for better perceived performance

## Reference Inspiration
- Spotify (music streaming UX patterns)
- Audible (audiobook-specific features)
- Apple Books (clean, minimalist design)
- Google Play Books (material design principles)

---

**Target Devices**: iPhone (12 Pro Max, SE), Android (Pixel 5, Samsung Galaxy S21)
**Primary Orientation**: Portrait (with landscape support for audio player)
**Target Users**: Audiobook enthusiasts, multi-language content consumers


