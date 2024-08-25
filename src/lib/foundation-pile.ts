import { CardSuit, CardValue } from './common';

export class FoundationPile {
  #suit: CardSuit;
  #currentValue: CardValue | 0;

  constructor(suit: CardSuit) {
    this.#suit = suit;
    this.#currentValue = 0;
  }

  get suit(): CardSuit {
    return this.#suit;
  }

  get value(): CardValue | 0 {
    return this.#currentValue;
  }

  public addCard(): void {
    if (this.#currentValue === 13) {
      return;
    }

    this.#currentValue += 1;
  }

  public reset(): void {
    this.#currentValue = 0;
  }
}
