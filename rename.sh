#!/bin/bash
# Renommage SEO des images ARTIMMO — à exécuter depuis src/assets/3D
# Usage : cd src/assets/3D && bash rename-seo-images.sh

set -e

rename_if_exists() {
  local old="$1"
  local new="$2"
  if [ -f "$old" ]; then
    mv -v "$old" "$new"
  else
    echo "⚠️  Introuvable, ignoré : $old"
  fi
}

# OXYGÈNE
rename_if_exists "Oxygen (1).webp" "residence-oxygene-appartement-haut-standing-ouled-fayet-alger.webp"

# SOLARIUM
rename_if_exists "SOLARIUM 1.webp"    "residences-solarium-cheraga-tours-residentielles-exception-alger.webp"
rename_if_exists "SOLARIUM 2.webp"    "residences-solarium-appartements-lumineux-cheraga-alger.webp"
rename_if_exists "SOLARIUM 2(1).webp" "residences-solarium-investissement-immobilier-cheraga-alger.webp"
rename_if_exists "Solarium3.webp"     "residences-solarium-tours-residentielles-premium-cheraga-alger.webp"

# ATMOSPHÈRE
rename_if_exists "ATMOSPHERE.webp" "residence-atmosphere-immobilier-haut-standing-draria-alger.webp"

# SPLENDIA / VERDONIA — même fichier placeholder utilisé pour les deux à l'origine.
# On le renomme pour VERDONIA (le projet en cours) et on en fait une copie pour SPLENDIA
# en attendant le vrai visuel.
rename_if_exists "Rendu 3D extérieurs ARTIMMO.webp" "residence-verdonia-cheraga-en-cours-alger.webp"
if [ -f "residence-verdonia-cheraga-en-cours-alger.webp" ]; then
  cp -v "residence-verdonia-cheraga-en-cours-alger.webp" "residence-splendia-appartement-haut-standing-cheraga-alger.webp"
  echo "⚠️  SPLENDIA utilise une copie du placeholder VERDONIA — à remplacer par le vrai visuel dès que possible."
fi

echo "✅ Renommage terminé."