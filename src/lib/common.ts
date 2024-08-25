export type CardSuit = keyof typeof CARD_SUIT;

export const CARD_SUIT = {
  HEART: 'HEART',
  DIAMOND: 'DIAMOND',
  SPADE: 'SPADE',
  CLUB: 'CLUB',
} as const;

export type CardValue = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export type CardSuitColor = keyof typeof CARD_SUIT_COLOR;

export const CARD_SUIT_COLOR = {
  RED: 'RED',
  BLACK: 'BLACK',
} as const;

export const CARD_SUIT_TO_COLOR = {
  [CARD_SUIT.CLUB]: CARD_SUIT_COLOR.BLACK,
  [CARD_SUIT.SPADE]: CARD_SUIT_COLOR.BLACK,
  [CARD_SUIT.DIAMOND]: CARD_SUIT_COLOR.RED,
  [CARD_SUIT.HEART]: CARD_SUIT_COLOR.RED,
} as const;
