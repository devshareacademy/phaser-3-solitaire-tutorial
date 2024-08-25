import { Card } from './card';
import { CARD_SUIT, CardValue } from './common';
import { shuffleArray } from './utils';

export class Deck {
  #cards: Card[];
  #drawPile: Card[];
  #discardPile: Card[];

  constructor() {
    this.#cards = [];
    this.#drawPile = [];
    this.#discardPile = [];
    this.#createDeck();
    this.reset();
  }

  get cards(): Card[] {
    return this.#cards;
  }

  get drawPile(): Card[] {
    return this.#drawPile;
  }

  get discardPile(): Card[] {
    return this.#discardPile;
  }

  public draw(): Card | undefined {
    return this.#drawPile.shift();
  }

  public shuffle(): void {
    shuffleArray(this.#drawPile);
  }

  public shuffleInDiscardPile(): void {
    this.#discardPile.forEach((card) => {
      card.flip();
      this.#drawPile.push(card);
    });
    this.#discardPile = [];
  }

  public reset(): void {
    this.#discardPile = [];
    this.#drawPile = [...this.#cards];
    this.shuffle();
  }

  #createDeck(): void {
    Object.values(CARD_SUIT).forEach((suit) => {
      for (let i = 1; i < 14; i += 1) {
        this.#cards.push(new Card(suit, i as CardValue));
      }
    });
  }
}
