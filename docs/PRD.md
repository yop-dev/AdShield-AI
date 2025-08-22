# AdShield AI — Product Requirements Document (PRD)

Version: 0.2 (Demo-first MVP)
Status: Draft for review
Owners: Product, Engineering, ML, Design
Last updated: 2025-08-22

1. Summary
AdShield AI (demo-first MVP) is an interactive web app that helps users detect scams across three modalities: text/emails, documents/images, and audio. Users upload or paste content and receive per-modality fraud risk scores, visual highlights, and simple explanations (“why flagged?”). A scoring dashboard summarizes results/history and includes an educational hub so users learn to spot scams.

2. Goals & Success Metrics
- UX goals
  - Text analysis results in ≤1.5s p95
  - Document image (≤1MB) results in ≤3.0s p95
  - Audio clip (≤10s) results in ≤5.0s p95
  - >70% of test users rate explanations as helpful (survey)
- Model goals (offline eval)
  - Phishing text: ≥95% accuracy on curated eval set
  - Document authenticity (Donut + rules): ≥85% precision on forged templates
  - Deepfake audio: ≥90% accuracy on short-clip benchmark
- Reliability
  - API error rate <1% daily; graceful partial results on timeouts
- Adoption
  - ≥60% of demo users complete one analysis; ≥30% view at least one educational tip

3. Scope (MVP)
In-scope
- Web app (React + Tailwind) pages:
  - Landing/Home
  - Dashboard (Main Hub)
  - Text Analysis page
  - Document Analysis page
  - Audio Analysis page
  - Scan Results (drill-down)
  - Learn/Education hub
  - Settings/Profile (optional local-only)
- Backend (FastAPI) endpoints:
  - POST /api/v1/text/analyze
  - POST /api/v1/doc/analyze
  - POST /api/v1/audio/analyze
  - POST /api/v1/history, GET /api/v1/history (optional storage)
  - POST /api/v1/analyze (optional aggregator)
- ML inference via Hugging Face Inference API
  - Text: DistilBERT/BERT phishing/fraud detector
  - Doc: Donut (DocVQA) extraction + rules for inconsistencies
  - Audio: wav2vec anti-deepfake classifier
- Data: local storage by default; optional Postgres for saved history (no raw content by default)

Out-of-scope
- Browser extension and real-time blocking
- Mobile apps
- Accounts/sync (unless trivial local profile)
- Heavy image forensics beyond Donut+rules

4. User Experience — Flow & Pages
4.1 Landing / Home
- Tagline: “Upload text, audio, or documents to detect scams & fraud.”
- CTAs: Start Scanning (→ Dashboard), Learn About Scams (→ Learn), How it Works

4.2 Dashboard (Main Hub)
- Tiles or tabs for: Text, Documents, Audio
- Recent scans list with fraud probability per modality
- Quick chart (pie/bar) of recent scam types
- Click into a scan to view detailed results

4.3 Text Analysis Page (📝)
- Input: paste text or upload .txt/.eml (size-limited)
- Output:
  - Fraud probability score (e.g., 0–100%)
  - Highlights for suspicious phrases ("urgent action", "verify account", etc.)
  - Reasons list (“Why flagged?”)
- Actions: Save to history (optional), View Results

4.4 Document Analysis Page (📄)
- Input: upload .png/.jpg (≤1MB), optional .pdf (if feasible)
- Output:
  - Fraud score
  - Overlays: bounding boxes for inconsistencies (logo mismatch, formatting anomalies)
  - Extracted fields (issuer, date, amounts) with validation notes
- Actions: Save to history (optional), View Results

4.5 Audio Analysis Page (🎙️)
- Input: upload .wav/.mp3 (≤10s recommended)
- Output:
  - Deepfake/Scam likelihood score
  - Transcript snippet (if ASR is available) with highlighted suspicious sections (future optional)
  - Reasons (artifacts, voice-print inconsistency — model-dependent)
- Actions: Save to history (optional), View Results

4.6 Scan Results Page (📂 Drill-down)
- Summary cards: per-modality scores (Text/Doc/Audio)
- Highlights section: inline spans (text), overlays (doc), notes (audio)
- Educational note blocks: "This pattern is common in phishing emails"
- History timeline (if enabled)

4.7 Learn / Education Page (🧑‍🏫)
- Mini tutorials: Fake vs Real examples (side-by-side)
- Quick tips: "Banks never ask for your PIN via email"
- Mini quizzes: “Which is the scam?” with immediate feedback

4.8 Settings / Profile (⚙️ Optional MVP)
- Local-only preferences: dark mode, save-history toggle
- Data controls: clear history
- Backend URL (dev only)

Additional suggested pages (optional)
- Help/Support & Privacy Policy
- System Status (admin-only: model versions, latency)

5. Functional Requirements
5.1 Frontend (React + Tailwind)
- Routes: / (home), /dashboard, /analyze/text, /analyze/doc, /analyze/audio, /results/:id, /learn, /settings
- File input validation: types & size limits; accessible error states
- Highlights rendering:
  - Text: token-level spans with tooltip reasons
  - Doc: canvas/SVG overlay boxes with callouts
  - Audio: label + (optional) transcript segments
- Accessibility: WCAG AA; keyboard navigable; dark mode
- Privacy: default local mode; no persistence without opt-in

5.2 Backend (FastAPI)
- Endpoints
  - POST /api/v1/text/analyze
    - Input: { text: string } or multipart text file
    - Output: { label: phishing|legit, score: 0..1, highlights: [{start,end,reason}], reasons: [], model_version }
  - POST /api/v1/doc/analyze
    - Input: multipart file (png/jpg, ≤1MB), optional { question?: string }
    - Output: { label: suspicious|legit, score, findings: [{bbox,reason}], extractedFields: {}, model_version }
  - POST /api/v1/audio/analyze
    - Input: multipart file (wav/mp3, ≤10s)
    - Output: { label: deepfake|real, score, reasons: [], model_version }
  - POST /api/v1/history (optional)
    - Input: { summary }
    - Output: { id }
  - GET /api/v1/history?limit&offset (optional)
- Policies
  - Timeouts: text 700ms, doc 2.5s, audio 4s; return partials on timeout
  - CORS: allow web app origin(s)
  - File safety: magic/MIME checks, size limits, discard raw content unless user opts in

5.3 Data Model (optional Postgres)
- analyses: id (uuid), created_at, text_score, doc_score, audio_score, findings_json, meta_json
- When privacy-only local mode: store in browser local storage; server stores only anonymized counters (opt-in)

6. Technical Design
- Frontend: React + Tailwind + Vite; modular pages/components; client for API
- Backend: FastAPI + httpx; structured logging; rate limiting; request IDs
- ML inference (Hugging Face Inference API)
  - Text: DistilBERT phishing detector (primary), BERT alternative
  - Doc: Donut DocVQA → normalize to findings/extractedFields
  - Audio: wav2vec anti-deepfake → classify REAL/FAKE with score
- Caching: hash inputs (text SHA-256; file SHA-256) → short TTL cache of outputs
- Observability: record model_id, latency_ms, timeout flag, normalized scores (no raw content)
- Security: validate inputs; limit sizes; no secrets in client; HF token only on server env

7. Performance Budgets
- Client→Server p95 (cold): text ≤1.5s; doc ≤3.0s; audio ≤5.0s
- Server timeouts: text 0.7s; doc 2.5s; audio 4.0s (plus network headroom)

8. Evaluation & QA
- Eval sets per modality; track accuracy/precision/recall and calibration
- Unit tests: validation, normalization, highlight shaping
- Integration: multipart uploads; timeouts; partial responses
- UX: highlight correctness; accessibility checks
- Perf: warm vs cold inference; cache efficacy

9. Telemetry & Analytics (opt-in)
- Metrics: request counts per modality, p50/95 latency, timeout rates, error rates
- UX metrics: analysis completion, tips viewed, quiz participation
- No raw content in logs/metrics; only anonymized IDs/scores

10. Risks & Mitigations
- Latency spikes → timebox, cache, partial UI
- False positives → clear reasons, learn center for calibration
- File security → MIME sniffing, size caps, future antivirus hook
- Cost control → cache common inputs; consider self-hosting high-traffic models

11. Milestones
- W1: Wireframes, API contracts, text analyzer + highlights
- W2: Document analyzer + overlays
- W3: Audio analyzer; results dashboard; optional history
- W4: Learn hub; polish; a11y; perf tuning; demo release

12. Acceptance Criteria
- Users can analyze at least one item in each modality and receive a score + highlights
- p95 latency within budgets; partial results on timeout
- Explanations rendered for flagged results
- Learn hub contains ≥5 tips and ≥1 quiz example

