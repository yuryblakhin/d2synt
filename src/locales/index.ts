import { ru } from './ru';
import { en } from './en';

export const messages = {
    ru,
    en,
};

export type LocaleType = keyof typeof messages;
