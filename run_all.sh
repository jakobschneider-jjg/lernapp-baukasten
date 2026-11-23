#!/usr/bin/env bash
# Baut die Beispiel-App mit Testcode und führt alle Prüfungen aus.
set -e
cd "$(dirname "$0")"
python3 tools/build.py apps/beispiel-formen --code 0000 --out dist/test.html
python3 tests/test_lokal.py dist/test.html 0000
python3 tests/test_learningview.py dist/test.html
# Gebärdenvideo: Testbild-Video erzeugen (keine echten Videos im Repository)
mkdir -p dist/testvideos
ffmpeg -v error -y -f lavfi -i testsrc=size=1280x720:rate=30:duration=4 -c:v libx264 -pix_fmt yuv420p dist/testvideos/FRAGE_ECKEN.mp4
python3 tools/build.py apps/beispiel-formen --code 0000 --videos dist/testvideos --out dist/test_video.html
python3 tests/test_video.py dist/test_video.html 0000
echo "Alle Tests bestanden."
