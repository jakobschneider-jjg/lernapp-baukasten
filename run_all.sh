#!/usr/bin/env bash
# Baut die Beispiel-App mit Testcode und führt alle Prüfungen aus.
set -e
cd "$(dirname "$0")"
python3 tools/build.py apps/beispiel-formen --code 0000 --out dist/test.html
python3 tests/test_lokal.py dist/test.html 0000
python3 tests/test_learningview.py dist/test.html
echo "Alle Tests bestanden."
