# Recommended Hugging Face Models and Integration Plan — AdShield AI

Version: 1.0
Date: 2025-08-22
Scope: Models we plan to adopt, with links, integration notes, and example requests

Purpose
This document specifies the pretrained models from huggingface.co we intend to integrate into AdShield AI and outlines how to call them safely via the Hugging Face Inference API (or self-host later). Metrics listed below are as reported by model authors; validate on our internal evaluation sets before production use.

Usage mode
- MVP: Use Hugging Face Inference API for speed-to-market.
- Later: Consider self-hosting critical models for cost/latency control (TorchServe/ONNX).
- Secrets: Store the HF API token in an environment variable (HF_API_TOKEN). Never log or print it.
- Timeouts: Apply per-request timeouts to keep p95 latency within budget (see PRD: URL ≤300ms, News ≤500ms).

Environment variable
- HF_API_TOKEN must be available in the backend process environment. Do not inline secrets in code.

1) Phishing & Scam Text Detection
Primary model
- ID: cybersectony/phishing-email-detection-distilbert_v2.4.1
- Link: https://huggingface.co/cybersectony/phishing-email-detection-distilbert_v2.4.1
- Type: DistilBERT sequence classification (phishing vs legitimate)
- Reported metrics: ~99.6% accuracy, precision, and recall (per model card/author claims)
- Input: Text (email body, SMS, URL context). For URLs, include minimal context (anchor text, URL string) to improve signal.
- Output: Label (e.g., PHISHING / LEGIT) with score

Alternative
- ID: ealvaradob/bert-finetuned-phishing
- Link: https://huggingface.co/ealvaradob/bert-finetuned-phishing
- Type: BERT Large fine-tuned on emails/SMS/URLs/websites
- Reported metrics: ~97% accuracy

Integration mapping
- Backend route(s):
  - POST /api/v1/text/analyze
- Latency budget: target ≤300ms for model call (timeout at 350–400ms and degrade gracefully)
- Privacy: strip PII, avoid sending entire emails; summarize to key phrases and URL string where possible

Example request (Hugging Face Inference API)
```python path=null start=null
import os, requests

API_URL = "https://api-inference.huggingface.co/models/cybersectony/phishing-email-detection-distilbert_v2.4.1"
headers = {"Authorization": f"Bearer {os.environ['HF_API_TOKEN']}"}

def classify_phishing(text: str, timeout_s: float = 0.35):
    resp = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=timeout_s)
    resp.raise_for_status()
    # Expected format: [{"label": "PHISHING", "score": 0.98}, ...]
    data = resp.json()
    pred = max(data, key=lambda x: x.get("score", 0)) if isinstance(data, list) else data
    return pred.get("label"), float(pred.get("score", 0.0))
```

Example (self-host, optional later)
```python path=null start=null
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

model_id = "cybersectony/phishing-email-detection-distilbert_v2.4.1"
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForSequenceClassification.from_pretrained(model_id)
clf = pipeline("text-classification", model=model, tokenizer=tokenizer)

label_score = clf("Verify your account at http://login.verify-acc0unt.support")[0]
```

2) Fake News / Misinformation Detection
Primary model
- ID: iTzMiNOS/mobilebert-uncased-fake-news-detector
- Link: https://huggingface.co/iTzMiNOS/mobilebert-uncased-fake-news-detector
- Type: MobileBERT binary classifier (fake vs real)
- Notes: Lightweight (~25M params). Good for low latency.

Alternative
- ID: Pulk17/Fake-News-Detection
- Link: https://huggingface.co/Pulk17/Fake-News-Detection
- Type: BERT-base fine-tuned; reported high accuracy (~99.6% across metrics)

Bonus (localized)
- ID: iceman2434/xlm-roberta-base-fake-news-detection-tl
- Link: https://huggingface.co/iceman2434/xlm-roberta-base-fake-news-detection-tl
- Language: Tagalog/Filipino; reported accuracy ~95.5%

Integration mapping
- Backend route(s): POST /api/v1/text/analyze
- Input: Title (optional) + body text (preferred). Consider sending a short excerpt (e.g., first 512–1,024 characters) to conserve latency.
- Output: {label: FAKE|REAL (or similar), score}
- Latency budget: ≤500ms (timeout 400–500ms)
- Privacy: Do not send entire articles by default; summarize or chunk. Respect telemetry opt-in.

Example request (Inference API)
```python path=null start=null
import os, requests

API_URL = "https://api-inference.huggingface.co/models/iTzMiNOS/mobilebert-uncased-fake-news-detector"
headers = {"Authorization": f"Bearer {os.environ['HF_API_TOKEN']}"}

def classify_news(text: str, timeout_s: float = 0.5):
    resp = requests.post(API_URL, headers=headers, json={"inputs": text}, timeout=timeout_s)
    resp.raise_for_status()
    data = resp.json()
    pred = max(data, key=lambda x: x.get("score", 0)) if isinstance(data, list) else data
    return pred.get("label"), float(pred.get("score", 0.0))
```

3) Document QA / Fake Document Detection
Primary model
- ID: naver-clova-ix/donut-base-finetuned-docvqa
- Link: https://huggingface.co/naver-clova-ix/donut-base-finetuned-docvqa
- Type: Donut (Document Understanding Transformer) for DocVQA; image-to-text Q&A without external OCR
- Use case: Extract/verify fields in suspicious document images (receipts, invoices, screenshots). Useful for scammy document verification.

Integration mapping
- Backend route(s): POST /api/v1/doc/analyze
- Input: Image bytes (PNG/JPEG); optionally include a question prompt for targeted extraction
- Output: Extracted text/answers; we convert to label/score for “authenticity” if we build a rule/model on top
- Latency: Heavier than text; consider async job or higher timeout; not in MVP latency budget

Example request (Inference API; send binary)
```python path=null start=null
import os, requests

API_URL = "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-finetuned-docvqa"
headers = {"Authorization": f"Bearer {os.environ['HF_API_TOKEN']}"}

def docvqa_infer(image_path: str, timeout_s: float = 10.0):
    with open(image_path, "rb") as f:
        resp = requests.post(API_URL, headers=headers, data=f.read(), timeout=timeout_s)
    resp.raise_for_status()
    return resp.json()
```

4) Deepfake Voice Detection (Optional Module)
Primary model
- ID: nii-yamagishilab/wav2vec-small-anti-deepfake
- Link: https://huggingface.co/nii-yamagishilab/wav2vec-small-anti-deepfake
- Type: Wav2Vec2-based classifier detecting spoofed/AI-generated speech
- Use case: If we inspect audio ads or voice clips linked from pages; this is beyond MVP but listed for Phase 2+ exploration

Integration mapping
- Backend route(s): POST /api/v1/audio/analyze
- Input: Short WAV/FLAC/MP3 clip; we may downsample/normalize
- Output: {label: REAL|FAKE (or similar), score}
- Latency: Depends on clip duration; consider async processing if >1s

Example request (Inference API; send binary)
```python path=null start=null
import os, requests

API_URL = "https://api-inference.huggingface.co/models/nii-yamagishilab/wav2vec-small-anti-deepfake"
headers = {"Authorization": f"Bearer {os.environ['HF_API_TOKEN']}"}

def deepfake_audio_infer(audio_path: str, timeout_s: float = 5.0):
    with open(audio_path, "rb") as f:
        resp = requests.post(API_URL, headers=headers, data=f.read(), timeout=timeout_s)
    resp.raise_for_status()
    return resp.json()
```

Operational guidance
- Timeouts & fallbacks: If a model call times out, return partial decision and do not block browsing (see PRD aggregation rules). Log timeouts for tuning.
- Caching: Cache deterministic results for identical inputs (hash text/images) for a short TTL to reduce costs.
- Rate limits & retries: Respect HF API rate limits; use limited retries with jitter for transient 5xx.
- Security: Validate/sanitize inputs; never forward secrets or raw PII. Use allowlisted outbound hosts.
- Observability: Log model_id, latency_ms, timeout, and normalized outputs (label, score). Do not log raw content.

Mapping to AdShield API (from PRD)
- /api/v1/text/analyze → phishing/fraud text detection (DistilBERT/BERT), ≤300–350ms timeout
- /api/v1/doc/analyze → document authenticity via Donut DocVQA + rules
- /api/v1/audio/analyze → deepfake/voice risk via wav2vec anti-deepfake
- /api/v1/analyze → optional aggregator; degrade gracefully on timeouts

Evaluation plan
- Build small, labeled eval sets for each task (phishing URLs/text, news titles/bodies, doc images) to verify external metrics.
- Track accuracy/precision/recall, AUC, and calibration (ECE). Use threshold tuning to meet PRD false-positive constraints.

Licensing & compliance
- Check each model’s license on its Hugging Face page before deployment.
- If license restricts commercial use, obtain permission or switch to an alternative.

Future work
- Consider quantized or distilled variants for lower latency.
- Explore multilingual misinformation models for broader coverage.
- Add a local embedding-based detector for URLs as a fallback when offline.

