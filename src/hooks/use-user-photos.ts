import { padArray } from '../utils';

export default function useUserPhotos(
  photos: string[] | null | undefined,
): [string[], number] {
  if (photos) {
    return [padArray(photos, 5, ''), photos.filter(photo => !!photo).length];
  } else {
    return [[], 0];
  }
}
