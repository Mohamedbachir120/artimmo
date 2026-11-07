// Landing pages for "promotion immobilière <commune>" searches. The text lives
// in localPages.json. Each page has its own text: near-identical pages would be
// treated as doorway pages by search engines. city: null lists every residence.
import localPages from './localPages.json'

export { localPages }
export const getLocalPage = (slug) => localPages.find((p) => p.slug === slug)
