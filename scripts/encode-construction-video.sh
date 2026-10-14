#!/usr/bin/env bash
# Encode real construction footage for the project-card hover film.
#
#   scripts/encode-construction-video.sh <source-video> <project-slug> [start] [duration]
#
# Writes public/construction/<slug>/reveal-1280.{webm,mp4} and reveal-720.mp4:
# muted, 16:10 center crop (same framing as the cards), 30 fps, fast-start MP4,
# small enough to stream on hover. Then add the slug to src/data/constructionMedia.js.
set -euo pipefail

src="${1:?source video}"
slug="${2:?project slug}"
start="${3:-0}"
dur="${4:-12}"
out="public/construction/$slug"
mkdir -p "$out"

crop="crop='min(iw,ih*16/10)':'min(ih,iw*10/16)',fps=30"
trim=(-ss "$start" -t "$dur")

ffmpeg -y "${trim[@]}" -i "$src" -an -vf "$crop,scale=1280:-2" \
  -c:v libvpx-vp9 -b:v 0 -crf 34 -row-mt 1 -deadline good "$out/reveal-1280.webm"

ffmpeg -y "${trim[@]}" -i "$src" -an -vf "$crop,scale=1280:-2" \
  -c:v libx264 -preset slow -crf 24 -pix_fmt yuv420p -movflags +faststart "$out/reveal-1280.mp4"

ffmpeg -y "${trim[@]}" -i "$src" -an -vf "$crop,scale=720:-2" \
  -c:v libx264 -preset slow -crf 26 -pix_fmt yuv420p -movflags +faststart "$out/reveal-720.mp4"

ls -lh "$out"
