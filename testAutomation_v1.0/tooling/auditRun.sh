#!/usr/bin/env bash
# auditRun — run the side-effect-free Admin suites back to back and KEEP each report.
#
# The runner always writes to the same output/reports/TestReports/mochawesome/report.json,
# so every suite overwrites the previous one's results. This archives each run under
# output/reports/auditRuns/<suite>__<pass>.json so the whole audit can be assembled from
# real recorded results instead of from memory of what scrolled past.
#
# Usage:  bash tooling/auditRun.sh <passLabel> [npmScript ...]
# Suites are run SEQUENTIALLY on purpose - they share thor logins and schools.

set -u
cd "$(dirname "$0")/.."

PASS="${1:-run1}"
shift || true

if [ "$#" -gt 0 ]; then
  SUITES=("$@")
else
  # Read-only Admin suites only. Deliberately EXCLUDED because they create or delete real
  # data on shared schools: schoolAdminAddClass, adminClassGradeSettings (throwaway class),
  # adminGradingCategories / adminGradingScales (create categories/scales on the shared
  # FCN-CHZ-PDA), adminSchoolReportsCreate, schoolAdminAddClassBulkCreateCSV.
  SUITES=(
    P1AdminClassesTab_Thor
    P1AdminclassBulk_Thor
    P1AdminclassValidation_Thor
    adminStudentsTabTest_thor
    adminStudentProfileTest_thor
    adminBulkStudentsTest_thor
    adminStaffTabTest_thor
    adminStaffProfileTest_thor
    adminSchoolLibraryTest_thor
    adminGenericTest_thor
    adminSchoolReportsTest_thor
  )
fi

OUT="output/reports/auditRuns"
SRC="output/reports/TestReports/mochawesome/report.json"
mkdir -p "$OUT"

for s in "${SUITES[@]}"; do
  echo "########## $s  (pass=$PASS) ##########"
  rm -f "$SRC"
  npm run --silent "$s" 2>&1 | tail -25
  if [ -f "$SRC" ]; then
    cp "$SRC" "$OUT/${s}__${PASS}.json"
    echo "[audit] archived -> $OUT/${s}__${PASS}.json"
  else
    echo "[audit] NO REPORT produced for $s - suite did not reach the reporter"
  fi
done

echo "########## audit pass '$PASS' complete ##########"
ls -1 "$OUT"
