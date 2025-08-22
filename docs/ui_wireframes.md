# UI Wireframes & Component Specifications — AdShield AI

Version: 1.0
Date: 2025-08-22
Purpose: Visual structure and component breakdown for each page in the demo-first web app

## Design System Overview

### Color Palette
- Primary: Blue (#3B82F6) - CTAs, active states
- Success: Green (#10B981) - safe/legit results
- Warning: Amber (#F59E0B) - suspicious/medium risk
- Danger: Red (#EF4444) - high risk/phishing/deepfake
- Neutral: Zinc shades - text, borders, backgrounds

### Typography
- Headings: Inter or system-ui, font-weight 600-700
- Body: Inter or system-ui, font-weight 400
- Monospace: 'Fira Code' or monospace for technical details

### Component Library
- Base: Tailwind CSS utility classes
- Components: Custom React components with consistent patterns
- Icons: Heroicons or Lucide React

## Page Wireframes

### 1. Landing / Home Page

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] AdShield AI                              [Learn] [About] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│         🛡️ Protect yourself from scams in seconds              │
│                                                                 │
│     Upload text, audio, or documents to detect fraud           │
│                                                                 │
│        [Start Scanning →]  [How it Works]  [See Demo]          │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  ✓ Text Analysis    ✓ Document Verify    ✓ Audio Deepfake     │
│     Phishing           Bank statements      Voice cloning      │
│     detection          authenticity         detection          │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<Header />` - Logo, nav links
- `<Hero />` - Tagline, description, CTAs
- `<FeatureCards />` - 3 modality cards with icons

### 2. Dashboard (Main Hub)

```
┌────────────────────────────────────────────────────────────────┐
│ [Logo] Dashboard                    [History] [Learn] [Settings]│
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Choose Analysis Type:                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │   📝     │  │   📄     │  │   🎙️     │                    │
│  │  Text    │  │ Document │  │  Audio   │                    │
│  │ Analysis │  │ Analysis │  │ Analysis │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  Recent Scans                                  Quick Stats     │
│  ┌─────────────────────────────────────┐     ┌──────────────┐ │
│  │ Time     Type    Risk    Action     │     │ Pie Chart    │ │
│  │ 10:42am  Text    85%     View →     │     │ Text: 45%    │ │
│  │ 10:38am  Doc     12%     View →     │     │ Doc:  30%    │ │
│  │ 10:31am  Audio   92%     View →     │     │ Audio: 25%   │ │
│  └─────────────────────────────────────┘     └──────────────┘ │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<DashboardNav />` - Secondary navigation
- `<ModalityCards />` - 3 clickable cards routing to analysis pages
- `<RecentScansTable />` - Sortable table with risk badges
- `<StatsChart />` - Pie/bar chart visualization

### 3. Text Analysis Page

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Text Analysis                                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Paste text or upload file:                                    │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │  [Paste your text here...]                               │  │
│  │                                                           │  │
│  │                                                           │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Or: [📎 Upload .txt/.eml file]                                │
│                                                                 │
│  [Analyze Text →]                                              │
│                                                                 │
│  ─────────────────── Results (after analysis) ─────────────    │
│                                                                 │
│  Risk Score: [████████░░] 85% - High Risk 🔴                  │
│                                                                 │
│  Highlighted Issues:                                           │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Your text with [suspicious phrases] and [risky URLs]    │  │
│  │ highlighted in different colors based on severity        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Top Reasons:                                                  │
│  • Multiple urgency cues detected                              │
│  • Suspicious domain in URL                                    │
│  • Grammar inconsistencies typical of phishing                 │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<TextInput />` - Textarea with char counter
- `<FileUpload />` - Drag & drop zone
- `<RiskMeter />` - Visual score indicator
- `<HighlightedText />` - Text with colored spans and tooltips
- `<ReasonsList />` - Bullet list of findings

### 4. Document Analysis Page

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Document Analysis                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Upload document image:                                        │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │         📄 Drag & drop your document here                │  │
│  │              or click to browse                           │  │
│  │                                                           │  │
│  │         Supports: PNG, JPG (max 1MB)                     │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Analyze Document →]                                          │
│                                                                 │
│  ─────────────────── Results (after analysis) ─────────────    │
│                                                                 │
│  Risk Score: [█████████░] 95% - Likely Forged 🔴              │
│                                                                 │
│  Document Preview with Findings:                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  [Document image with red boxes overlaid on suspicious   │  │
│  │   areas like mismatched logos, inconsistent fonts]       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Extracted Information:                                        │
│  • Issuer: "Bank of Example" (92% confidence)                 │
│  • Account: ****1234 (88% confidence)                         │
│                                                                 │
│  Issues Found:                                                 │
│  • Logo mismatch detected                                      │
│  • Font inconsistency in header                                │
│  • Metadata suggests tampering                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<ImageUpload />` - Dropzone with preview
- `<DocumentViewer />` - Canvas with bounding box overlays
- `<ExtractedFields />` - Key-value list with confidence scores
- `<FindingsList />` - Issues with severity badges

### 5. Audio Analysis Page

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Audio Analysis                                        │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Upload audio file:                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │         🎙️ Drag & drop audio file here                   │  │
│  │              or click to browse                           │  │
│  │                                                           │  │
│  │         Supports: WAV, MP3 (max 10 seconds)              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Analyze Audio →]                                             │
│                                                                 │
│  ─────────────────── Results (after analysis) ─────────────    │
│                                                                 │
│  Risk Score: [███████░░░] 78% - Likely Deepfake 🟡            │
│                                                                 │
│  Audio Waveform:                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  ∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿∿    │  │
│  │  [Waveform visualization with suspicious sections marked] │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Analysis:                                                     │
│  • Synthetic speech artifacts detected                         │
│  • Unnatural prosody patterns                                  │
│  • Voice print inconsistencies                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<AudioUpload />` - Dropzone with duration validation
- `<WaveformVisualizer />` - Audio waveform display
- `<AudioPlayer />` - Play/pause controls
- `<DeepfakeIndicators />` - Technical details list

### 6. Scan Results Page (Detailed View)

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Scan Results                           [Save] [Share] │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Analysis Summary - December 22, 2025 10:42 AM                 │
│                                                                 │
│  Overall Risk: HIGH                                            │
│                                                                 │
│  ┌─────────────┬─────────────┬─────────────┐                 │
│  │    Text     │   Document  │    Audio    │                 │
│  │     85%     │     N/A     │     N/A     │                 │
│  │   🔴 High   │      -      │      -      │                 │
│  └─────────────┴─────────────┴─────────────┘                 │
│                                                                 │
│  Detailed Findings:                                            │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ • Urgency language: "Act now" detected at position 45    │  │
│  │ • Suspicious URL: login-verify.suspicious.com            │  │
│  │ • Grammar errors typical of phishing attempts            │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  📚 Educational Note:                                          │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ This pattern is common in phishing emails. Legitimate    │  │
│  │ organizations rarely create urgency or threaten account  │  │
│  │ closure. Always verify sender addresses carefully.       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Learn More About Phishing →]                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<ResultsHeader />` - Timestamp, actions
- `<ModalityScores />` - 3-card grid with scores
- `<DetailedFindings />` - Expandable finding cards
- `<EducationalCard />` - Tips related to findings
- `<LearnMoreCTA />` - Link to education page

### 7. Learn / Education Page

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Learn About Scams                                     │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📚 Scam Detection Guide                                       │
│                                                                 │
│  Quick Lessons:                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Phishing Emails     Document Fraud     Voice Deepfakes   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  Interactive Examples:                                         │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │        Real Bank Email    vs    Phishing Attempt         │  │
│  │  ┌──────────────────┐         ┌──────────────────┐      │  │
│  │  │ [Legitimate email]│         │ [Phishing email] │      │  │
│  │  │  with green       │         │  with red        │      │  │
│  │  │  checkmarks       │         │  warning signs   │      │  │
│  │  └──────────────────┘         └──────────────────┘      │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Quick Tips:                                                   │
│  • Banks never ask for passwords via email                    │
│  • Check sender addresses carefully                           │
│  • Hover over links before clicking                           │
│  • Grammar errors are red flags                               │
│                                                                 │
│  Test Your Knowledge:                                          │
│  [Take Quiz →]                                                 │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<LessonTabs />` - Topic navigation
- `<ComparisonView />` - Side-by-side examples
- `<TipsList />` - Actionable advice cards
- `<QuizWidget />` - Interactive knowledge test

### 8. Settings Page (Optional)

```
┌────────────────────────────────────────────────────────────────┐
│ [← Back] Settings                                              │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Preferences                                                   │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Theme:           [●] Light  [○] Dark  [○] System         │  │
│  │ Save History:    [✓] Enable local history                │  │
│  │ Notifications:   [✓] Show analysis complete alerts       │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Privacy                                                       │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Data Storage:    [○] Local only  [●] Allow cloud backup  │  │
│  │ Analytics:       [○] Opt-in to help improve              │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Data Management                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ [Clear History]  [Export Data]  [Delete Account]         │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Save Changes]                                                │
└────────────────────────────────────────────────────────────────┘
```

**Components:**
- `<PreferenceToggles />` - Switch components
- `<PrivacySettings />` - Radio groups
- `<DataActions />` - Destructive action buttons with confirmations

## Component Hierarchy

```
App
├── Layout
│   ├── Header
│   └── Footer
├── Pages
│   ├── HomePage
│   │   ├── Hero
│   │   └── FeatureCards
│   ├── Dashboard
│   │   ├── ModalityCards
│   │   ├── RecentScansTable
│   │   └── StatsChart
│   ├── TextAnalysisPage
│   │   ├── TextInput
│   │   ├── FileUpload
│   │   ├── RiskMeter
│   │   └── HighlightedText
│   ├── DocumentAnalysisPage
│   │   ├── ImageUpload
│   │   ├── DocumentViewer
│   │   └── FindingsList
│   ├── AudioAnalysisPage
│   │   ├── AudioUpload
│   │   ├── WaveformVisualizer
│   │   └── DeepfakeIndicators
│   ├── ResultsPage
│   │   ├── ModalityScores
│   │   ├── DetailedFindings
│   │   └── EducationalCard
│   ├── LearnPage
│   │   ├── LessonTabs
│   │   ├── ComparisonView
│   │   └── QuizWidget
│   └── SettingsPage
│       ├── PreferenceToggles
│       └── PrivacySettings
└── SharedComponents
    ├── Button
    ├── Card
    ├── Badge
    ├── Progress
    ├── Alert
    └── Modal
```

## Responsive Breakpoints

- Mobile: < 640px - Stack all elements vertically
- Tablet: 640px - 1024px - 2-column layouts
- Desktop: > 1024px - Full layouts as shown

## Accessibility Requirements

- All interactive elements keyboard accessible
- ARIA labels for icons and complex components
- Color contrast ratio ≥4.5:1 for normal text
- Focus indicators visible
- Screen reader announcements for dynamic content
- Loading states announced
- Error states clearly communicated

## Animation & Transitions

- Page transitions: 200ms ease-in-out
- Hover states: 150ms ease
- Loading spinners for async operations
- Skeleton screens while data loads
- Progress bars for file uploads
- Smooth scroll for in-page navigation

## Next Steps

1. Create React component stubs matching this hierarchy
2. Set up routing with React Router
3. Implement MSW for mock API responses
4. Add Tailwind configuration for design system
5. Build reusable components first (Button, Card, Badge)
6. Implement page layouts with mock data
7. Add real API integration once backend is ready
