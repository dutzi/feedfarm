import { TFunction } from 'i18next';

export default function getEmojiMartI18n(t: TFunction) {
  return {
    search: t('emojiMart.', 'Search'),
    clear: t('emojiMart.', 'Clear'),
    notfound: t('emojiMart.', 'No Emoji Found'),
    skintext: t('emojiMart.', 'Choose your default skin tone'),
    categories: {
      search: t('emojiMart.search', 'Search Results'),
      recent: t('emojiMart.recent', 'Frequently Used'),
      people: t('emojiMart.people', 'Smileys & People'),
      nature: t('emojiMart.nature', 'Animals & Nature'),
      foods: t('emojiMart.foods', 'Food & Drink'),
      activity: t('emojiMart.activity', 'Activity'),
      places: t('emojiMart.places', 'Travel & Places'),
      objects: t('emojiMart.objects', 'Objects'),
      symbols: t('emojiMart.symbols', 'Symbols'),
      flags: t('emojiMart.flags', 'Flags'),
      custom: t('emojiMart.custom', 'Custom'),
    },
    categorieslabel: t('emojiMart.categorieslabel', 'Emoji categories'), // Accessible title for the list of categories
    skintones: {
      1: t('emojiMart.skinTone[1]', 'Default Skin Tone'),
      2: t('emojiMart.skinTone[2]', 'Light Skin Tone'),
      3: t('emojiMart.skinTone[3]', 'Medium-Light Skin Tone'),
      4: t('emojiMart.skinTone[4]', 'Medium Skin Tone'),
      5: t('emojiMart.skinTone[5]', 'Medium-Dark Skin Tone'),
      6: t('emojiMart.skinTone[6]', 'Dark Skin Tone'),
    },
  };
}
