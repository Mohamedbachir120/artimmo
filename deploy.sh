#!/usr/bin/env bash
# Build the site and upload docs/ to cPanel over FTP.
# Usage: ./deploy.sh   (reads FTP details from .env, which git ignores; see .env.example)
set -euo pipefail
cd "$(dirname "$0")"

if [[ ! -f .env ]]; then
  echo "Missing .env: copy .env.example to .env and fill it in." >&2
  exit 1
fi
set -a; . ./.env; set +a
: "${FTP_SERVER:?FTP_SERVER missing in .env}"
: "${FTP_USERNAME:?FTP_USERNAME missing in .env}"
: "${FTP_PASSWORD:?FTP_PASSWORD missing in .env}"
FTP_DIR="${FTP_DIR:-}"

# FTPS by default; set FTP_PROTOCOL=ftp in .env if the server has no TLS.
tls=(--ssl-reqd)
[[ "${FTP_PROTOCOL:-ftps}" == "ftp" ]] && tls=()

npm run build

cd docs
count=0
while IFS= read -r -d '' f; do
  path="${f#./}"
  echo "Uploading $path"
  curl -sS ${tls[@]+"${tls[@]}"} --ftp-create-dirs \
    --user "$FTP_USERNAME:$FTP_PASSWORD" \
    -T "$f" "ftp://$FTP_SERVER/$FTP_DIR${path// /%20}"
  count=$((count + 1))
done < <(find . -type f -print0)

echo "Done: $count files uploaded to $FTP_SERVER"
