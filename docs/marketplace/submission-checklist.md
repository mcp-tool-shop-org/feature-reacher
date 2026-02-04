# Feature-Reacher Marketplace Submission Checklist

**Last updated:** February 2026
**Target:** Microsoft AppSource / Azure Marketplace (SaaS offer)

---

## Pre-Submission Requirements

### 1. Partner Center Account

- [ ] Microsoft Partner Network (MPN) ID registered
- [ ] Partner Center account verified
- [ ] Commercial marketplace program enrolled
- [ ] Bank/tax information on file

### 2. Offer Configuration

- [ ] Offer type: SaaS
- [ ] Offer alias: `feature-reacher`
- [ ] Primary category: Productivity > Content & Files
- [ ] Secondary category: IT & Management > Analytics

---

## Listing Content

### Required Images

| Asset | Dimensions | File | Status |
|-------|------------|------|--------|
| Logo (216×216) | 216×216 px PNG | `logo-216.png` | [ ] Created |
| Logo (48×48) | 48×48 px PNG | `logo-48.png` | [ ] Created |
| Hero image | 1280×720 px PNG | `hero-1280x720.png` | [ ] Created |
| Screenshot 1 | 1280×720 px | `screenshot-01-landing.png` | [ ] Created |
| Screenshot 2 | 1280×720 px | `screenshot-02-audit.png` | [ ] Created |
| Screenshot 3 | 1280×720 px | `screenshot-03-detail.png` | [ ] Created |
| Screenshot 4 | 1280×720 px | `screenshot-04-compare.png` | [ ] Created |
| Screenshot 5 | 1280×720 px | `screenshot-05-trends.png` | [ ] Created |

### Listing Copy

| Field | Character Limit | File Reference | Status |
|-------|-----------------|----------------|--------|
| Short description | 100 chars | `listing-copy.md` | [x] Written |
| Long description | 3000 chars | `listing-copy.md` | [x] Written |
| Keywords | 3 minimum | `listing-copy.md` | [x] Listed |

### Supporting Documents (PDF)

| Document | Purpose | File | Status |
|----------|---------|------|--------|
| Product overview | 1-page summary | `01-overview.md` → PDF | [x] Written |
| Sample audit | Example output | `02-sample-audit.md` → PDF | [x] Written |
| Security brief | Privacy/security | `03-security-privacy.md` → PDF | [x] Written |

---

## Legal & Support

### Required Pages

| Page | URL | Purpose | Status |
|------|-----|---------|--------|
| Privacy Policy | `/privacy` | Data handling disclosure | [x] Live |
| Terms of Service | `/terms` | Usage terms | [x] Live |
| Support | `/support` | Contact info, FAQ | [x] Live |

### Support Configuration

- [ ] Support email: `support@feature-reacher.example`
- [ ] Support URL: `https://feature-reacher.example/support`
- [ ] Response time SLA documented (2-3 business days)

---

## Technical Validation

### Application URLs

| URL | Purpose | Status |
|-----|---------|--------|
| `/landing` | Public landing page | [x] Live |
| `/demo` | Demo with auto-loaded data | [x] Live |
| `/methodology` | Scoring explanation | [x] Live |
| `/settings` | Data handling controls | [x] Live |

### Functionality Checklist

- [x] Demo loads without authentication
- [x] Audit completes successfully
- [x] Export functions work
- [x] History/compare/trends functional
- [x] Error boundaries catch failures
- [x] Onboarding tour shows on first visit

### Performance

- [ ] Lighthouse score > 90 (Performance)
- [ ] Lighthouse score > 90 (Accessibility)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

---

## Test Account / Demo Instructions

**For certification reviewers:**

```
1. Navigate to https://feature-reacher.example/demo
2. Demo data loads automatically
3. Audit runs within 2 seconds
4. Review results:
   - Expand HIGH risk feature to see evidence
   - Click "Export" → "Executive Summary"
5. Navigate to /history to see saved audits
6. Navigate to /compare to see audit diff
7. Navigate to /methodology to understand scoring
8. Navigate to /settings to see data controls
```

**No account required. No authentication flow.**

---

## Certification Policies

### Microsoft Requirements (SaaS offers)

| Requirement | How We Meet It | Status |
|-------------|----------------|--------|
| Accurate listing | Copy reviewed for accuracy | [x] |
| Supportable offer | Support page + email | [x] |
| Functional app | Demo works without auth | [x] |
| Privacy policy | /privacy page | [x] |
| Terms of service | /terms page | [x] |
| Supporting docs | 3 PDF documents | [x] |

### Data Handling Disclosures

- [x] Data stored locally (IndexedDB)
- [x] No external transmission
- [x] User can delete data
- [x] No account/authentication required
- [x] Export is user-initiated

---

## Post-Submission

### After Certification

- [ ] Monitor for certification feedback
- [ ] Respond to any reviewer questions within 48 hours
- [ ] Update screenshots if UI changes
- [ ] Publish when approved

### Ongoing Maintenance

- [ ] Review listing copy quarterly
- [ ] Update supporting PDFs with major releases
- [ ] Monitor support email for issues
- [ ] Track listing analytics in Partner Center

---

## Quick Reference

### Partner Center Links

- Offer overview: Partner Center > Commercial Marketplace > Overview
- Offer setup: Partner Center > Commercial Marketplace > Offer setup
- Offer listing: Partner Center > Commercial Marketplace > Offer listing

### Asset Locations

```
/docs/marketplace/
├── 01-overview.md          # One-pager
├── 02-sample-audit.md      # Sample report
├── 03-security-privacy.md  # Security brief
├── listing-copy.md         # Listing text
└── submission-checklist.md # This file
```

### Key Contacts

- Technical: [GitHub Issues](https://github.com/mcp-tool-shop-org/feature-reacher/issues)
- Support: support@feature-reacher.example
- Listing: [Partner Center](https://partner.microsoft.com/)

---

*Feature-Reacher — Ready for Marketplace*
