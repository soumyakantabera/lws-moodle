## Learn With Smile Moodle Prototype (No Backend)

This repository contains a hardcoded, frontend-only Moodle-style prototype for **Learn With Smile**.

### Features
- Admin login (hardcoded)
- Student login by batch code (hardcoded)
- Admin: manage students (add/edit/delete)
- Admin: create/modify/delete learning content
- Student dashboard with:
  - Embedded video
  - Embedded audio
  - Embedded PDF
  - Embedded document/text resource
  - Markdown content rendering
  - Text content with browser Text-to-Speech
  - Task submission UI
  - Quiz
  - Flashcards
  - Matching activity

### Test Credentials
> ⚠️ Demo only: these hardcoded credentials/codes are for prototype testing and must be replaced with secure backend authentication before production use.

- **Admin login**
  - Username: `admin`
  - Password: `LWS@123`

- **Student batch code login**
  - `LWS-PLAN-A` (Spoken English / Career Accelerator)
  - `LWS-PLAN-B` (IELTS Prep / Business English B2-C1)

### Run
Open `index.html` in a browser.

### Deployment (GitHub Pages)
This repository now includes a GitHub Actions workflow at `.github/workflows/deploy.yml` to deploy the static site to GitHub Pages.

#### One-time setup
1. Open repository **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.

#### Deploy trigger
- Automatic deploy on every push to `main`.
- Manual deploy via **Actions → Deploy static site to GitHub Pages → Run workflow**.
