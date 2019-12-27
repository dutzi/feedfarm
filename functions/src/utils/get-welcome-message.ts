import { TSupportedLanguages } from '../feedfarm-shared/types';

export default function getWelcomeMessage(lanugage: TSupportedLanguages) {
  if (lanugage === 'he') {
    return (
      'ברוכים הבאים לפיד-פארם! לקח לנו לא מעט זמן לבנות את האתר ואנחנו סופּר שמחים שהוא סוף סוף באוויר :) ' +
      'אנחנו מקווים שתהנו להשתמש בו באותה מידה בה אנחנו נהנים לפתח אותו. ' +
      "אם אתם נתקלים באיזושהי בעיה או אם יש לכם הצעה לשיפור, אנא צרו עמנו קשר כאן בצ'אט או בלחיצה על כפתור 'צרו עמנו קשר' בתחתית העמוד 💘"
    );
  } else {
    return (
      "Welcome to Feed Farm! It took a while to build and we are really excited it's finally out :) " +
      'We hope you enjoy using it as much as we enjoy building it. If you encounter any issue ' +
      'or have a suggestion please feel free to contact us here, or using the Contact Us button below 💘'
    );
  }
}
