import { IUser } from './types';

export function isLegitUsername(usernmae: string) {
  const legalChars = usernmae.match(/[A-Z,a-z,0-9,_]/g);
  return (
    legalChars &&
    legalChars.length === usernmae.length &&
    !usernmae.match(/admin/i)
  );
}

export function isPremium(user: IUser) {
  return false;
  // if (!user.premiumEndDate) {
  //   return false;
  // }

  // const premiumEndDate: any = user.premiumEndDate;
  // let seconds;

  // if (premiumEndDate.seconds) {
  //   seconds = premiumEndDate.seconds;
  // } else {
  //   seconds = premiumEndDate._seconds;
  // }

  // return seconds * 1000 >= new Date().getTime();
}

export function parseTags(tags: string) {
  return tags
    .split(' ')
    .map(tag => tag.trim())
    .filter(tag => tag)
    .map(tag => (tag.indexOf('#') === 0 ? tag.substr(1) : tag));
}

export function canonizeFeedName(name: string) {
  return name
    .trim()
    .split(' ')
    .filter(word => word)
    .join(' ')
    .replace(/ /g, '-')
    .replace(/\./g, '')
    .toLowerCase();
}

export const avatarColors = [
  'carrot',
  'pink',
  'purple',
  'indigo',
  'aqua',
  'turquoise',
  'green',
  'lime',
  'yellow',
  'apricot',
  'orange',
  'cherry', // todo change to tiger
  'brown',
  'gray',
  'pigeon',
];

export const avatarEmojis = [
  'grapes',
  'melon',
  'watermelon',
  'tangerine',
  'lemon',
  'banana',
  'pineapple',
  'apple',
  'green_apple',
  'pear',
  'peach',
  'cherries',
  'strawberry',
  'kiwifruit',
  'tomato',
  'coconut',
  'avocado',
  'eggplant',
  'potato',
  'carrot',
  'corn',
  'hot_pepper',
  'cucumber',
  'broccoli',
  'mushroom',
  'peanuts',
  'chestnut',
  'bread',
  'croissant',
  'baguette_bread',
  'pretzel',
  'pancakes',
  'cheese_wedge',
  'meat_on_bone',
  'poultry_leg',
  'cut_of_meat',
  'bacon',
  'hamburger',
  'fries',
  'pizza',
  'hotdog',
  'sandwich',
  'taco',
  'burrito',
  'egg',
  'fried_egg',
  'stew',
  'bowl_with_spoon',
  'green_salad',
  'popcorn',
  'canned_food',
  'bento',
  'rice_cracker',
  'rice_ball',
  'rice',
  'curry',
  'ramen',
  'spaghetti',
  'sweet_potato',
  'oden',
  'sushi',
  'fried_shrimp',
  'fish_cake',
  'dango',
  'dumpling',
  'fortune_cookie',
  'takeout_box',
  'icecream',
  'shaved_ice',
  'ice_cream',
  'doughnut',
  'cookie',
  'birthday',
  'cake',
  'pie',
  'chocolate_bar',
  'candy',
  'lollipop',
  'custard',
  'honey_pot',
  'baby_bottle',
  'glass_of_milk',
  'coffee',
  'tea',
  'sake',
  'champagne',
  'wine_glass',
  'cocktail',
  'tropical_drink',
  'beer',
  'beers',
  'clinking_glasses',
  'tumbler_glass',
  'cup_with_straw',
  'chopsticks',
  'spoon',
  'hocho',
  'amphora',
  'jack_o_lantern',
  'christmas_tree',
  'fireworks',
  'sparkler',
  'sparkles',
  'balloon',
  'tada',
  'confetti_ball',
  'tanabata_tree',
  'bamboo',
  'dolls',
  'flags',
  'wind_chime',
  'rice_scene',
  'ribbon',
  'gift',
  'reminder_ribbon',
  'admission_tickets',
  'ticket',
  'medal',
  'trophy',
  'sports_medal',
  'soccer',
  'baseball',
  'basketball',
  'volleyball',
  'football',
  'rugby_football',
  'tennis',
  '8ball',
  'bowling',
  'boxing_glove',
  'goal_net',
  'dart',
  'golf',
  'ice_skate',
  'ski',
  'sled',
  'curling_stone',
  'video_game',
  'joystick',
  'game_die',
  'spades',
  'hearts',
  'diamonds',
  'clubs',
  'black_joker',
  'mahjong',
];

export function generateUserPhoto() {
  let photo;

  do {
    const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
    const emoji = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];

    photo = `!${color}-${emoji}`;
  } while (photo.length > 20);

  return photo;
}

export const SYSTEM_ADMIN_UID = 'peNEXtLHb0VkYNWe1lGkwQ1Jo0C3';
