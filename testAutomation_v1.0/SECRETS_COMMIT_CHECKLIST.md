# Secrets Hardening — Jab ye commit/PR merge ho, tab ye steps

## 1. Aapko (commit karne se pehle)
- [ ] `git diff` review karo (28 files — `env.conf.js`, `runContext.js`, `env.json`, 21 testcaseData files, `.gitignore`, `decisions.md`)
- [ ] `node tooling/secretScan.js` chalao — confirm exit code 0 (koi plaintext secret nahi bacha)
- [ ] `.env` file **commit MAT karo** (already `.gitignore` mein hai, par ek baar `git status` se confirm kar lo)

## 2. Team members (jab wo `main` se latest pull karenge)
- [ ] `.env.example` ko `.env` mein copy karo (`cp .env.example .env`)
- [ ] Real values daalo — jisse bhi (team lead / password manager / Slack) values milengi
- [ ] Local test chalega normally — koi aur setup nahi chahiye

## 3. CI (GitHub Actions + Semaphore) mein add karna
- [ ] `.env.example` mein jitne naye vars hain (129 naye is commit se), un sabko CI secrets mein add karo:
  - **GitHub Actions** → repo Settings → Secrets and variables → Actions
  - **Semaphore** → project ke secrets config mein
- [ ] Jab tak CI secrets add nahi honge, CI runs fail honge (clear error: "environment variable X is not set") — ye intentional hai, silent fail nahi

## 4. Baad mein (is commit ke saath ya alag se)
- [ ] 3 CF-Access secrets rotate karo (qa/rel C1, qa Builder) — ye chat transcript mein expose ho gaye the
- [ ] AGENTS.md / skill mein rule add karo: "naya test data `{{env.*}}` use kare, plaintext nahi"
- [ ] `qa` environment wapas aane par ek live qa test chala ke confirm kar lena (is session mein qa down tha)
