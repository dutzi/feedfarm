export default function getProfilePhoto(photos: string[]) {
  return photos.filter(photo => !!photo)[0];
}
