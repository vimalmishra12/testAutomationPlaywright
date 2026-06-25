# Blackboard Integration — TODO

## Pending

- [ ] **TST_BBIP2_TC_2 (Ebook)** — Add meaningful assertions after launch  
  Currently only confirms page loaded (`waitForDocumentLoad`). Inspect Ebook component page via MCP to find stable selectors, then add specific checks (e.g. page element unique to Ebook viewer).

- [ ] **TST_BBIP2_TC_3 (RB-3)** — Add meaningful assertions after launch  
  Same as Ebook — currently only confirms page loaded. Inspect RB-3 component page via MCP to find stable selectors.

## Done

- [x] **TST_BBIP1_TC_1** — LTI teacher dashboard loads after clicking LTI tool
- [x] **TST_BBIP2_TC_1 (PE)** — Launch PE component; assert back button, TOC, TOC heading, activity iframe (4 assertions)
- [x] **TST_BBIP2_TC_2 (Ebook)** — Launch Ebook component; confirm page loaded, return to dashboard
- [x] **TST_BBIP2_TC_3 (RB-3)** — Launch RB-3 component; confirm page loaded, return to dashboard
