import type { Film } from '../api/generated'

export const AGE_RATING_MAP: Record<Film['ageRating'], string> = {
  G: '0+',
  PG: '6+',
  PG13: '12+',
  R: '16+',
  NC17: '18+',
}
