import { Card } from './card';
import { CARD_SUIT } from './common';
import { Deck } from './deck';
import { FoundationPile } from './foundation-pile';
import { exhaustiveGuard } from './utils';

export class Solitaire {
  #deck: Deck;
  #foundationPileSpade: FoundationPile;
  #foundationPileClub: FoundationPile;
  #foundationPileHeart: FoundationPile;
  #foundationPileDiamond: FoundationPile;
  #tableauPiles: Card[][];

  constructor() {
    this.#deck = new Deck();
    this.#foundationPileClub = new FoundationPile(CARD_SUIT.CLUB);
    this.#foundationPileSpade = new FoundationPile(CARD_SUIT.SPADE);
    this.#foundationPileHeart = new FoundationPile(CARD_SUIT.HEART);
    this.#foundationPileDiamond = new FoundationPile(CARD_SUIT.DIAMOND);
    this.#tableauPiles = [[], [], [], [], [], [], []];
  }

  get drawPile(): Card[] {
    return this.#deck.drawPile;
  }

  get discardPile(): Card[] {
    return this.#deck.discardPile;
  }

  get tableauPiles(): Card[][] {
    return this.#tableauPiles;
  }

  get foundationPiles(): FoundationPile[] {
    return [
      this.#foundationPileSpade,
      this.#foundationPileClub,
      this.#foundationPileHeart,
      this.#foundationPileDiamond,
    ];
  }

  get wonGame(): boolean {
    return (
      this.#foundationPileClub.value === 13 &&
      this.#foundationPileDiamond.value === 13 &&
      this.#foundationPileHeart.value === 13 &&
      this.#foundationPileSpade.value === 13
    );
  }

  /**
   * Resets the solitaire game state and setups up the game state for a new game by building the tableau piles that are needed.
   */
  public newGame(): void {
    /**
     * Rules for game setup:
     *
     * To form the tableau, seven piles need to be created. Starting from left to right, place the first card face up to make the first pile,
     * deal one card face down for the next six piles. Starting again from left to right, place one card face up on the second pile and deal
     * one card face down on piles three through seven. Starting again from left to right, place one card face up on the third pile and deal
     * one card face down on piles four through seven. Continue this pattern until pile seven has one card facing up on top of a pile of six
     * cards facing down.
     *
     * The remaining cards form the stock (or “hand”) pile and are placed above the tableau.
     *
     * When starting out, the foundations and waste pile do not have any cards.
     */
    this.#deck.reset();
    this.#tableauPiles = [[], [], [], [], [], [], []];
    this.#foundationPileClub.reset();
    this.#foundationPileDiamond.reset();
    this.#foundationPileHeart.reset();
    this.#foundationPileSpade.reset();

    for (let i = 0; i < 7; i += 1) {
      for (let j = i; j < 7; j += 1) {
        const card = this.#deck.draw() as Card;
        if (j === i) {
          card.flip();
        }
        this.#tableauPiles[j].push(card);
      }
    }
  }

  public drawCard(): boolean {
    const card = this.#deck.draw();
    if (card === undefined) {
      return false;
    }
    card.flip();
    this.#deck.discardPile.push(card);
    return true;
  }

  public shuffleDiscardPile(): boolean {
    if (this.#deck.drawPile.length !== 0) {
      return false;
    }

    this.#deck.shuffleInDiscardPile();
    return true;
  }

  public playDiscardPileCardToFoundation(): boolean {
    // get the top card of the discard pile (last element in array)
    const card = this.#deck.discardPile[this.#deck.discardPile.length - 1];
    if (card === undefined) {
      return false;
    }

    // based on the suit, check the correct foundation pile for the current value to make sure this is the next card
    if (!this.#isValidMoveToAddCardToFoundation(card)) {
      return false;
    }

    // play card to the foundation pile and remove from the discard pile
    this.#addCardToFoundation(card);
    this.#deck.discardPile.pop();

    return true;
  }

  public playDiscardPileCardToTableau(targetTableauIndex: number): boolean {
    // get the top card of the discard pile (last element in array)
    const card = this.#deck.discardPile[this.#deck.discardPile.length - 1];
    if (card === undefined) {
      return false;
    }

    const targetTableauPile = this.#tableauPiles[targetTableauIndex];
    if (targetTableauPile === undefined) {
      return false;
    }

    // based on the card suit color and card number, check that this card is allowed as the next card in the target tableau
    if (!this.#isValidMoveToAddCardToTableau(card, targetTableauPile)) {
      return false;
    }

    // play card to the tableau pile and remove from the discard pile
    this.#tableauPiles[targetTableauIndex].push(card);
    this.#deck.discardPile.pop();

    return true;
  }

  public flipTopTableauCard(tableauIndex: number): boolean {
    // get the last card in the tableau pile that was provided (last element in the pile array)
    const tableauPile = this.#tableauPiles[tableauIndex];
    if (tableauPile === undefined) {
      return false;
    }
    const card = tableauPile[tableauPile.length - 1];
    if (card === undefined) {
      return false;
    }

    if (card.isFaceUp) {
      return false;
    }

    card.flip();
    return true;
  }

  public moveTableauCardsToAnotherTableau(
    initialTableauIndex: number,
    cardIndex: number,
    targetTableauIndex: number,
  ): boolean {
    const initialTableauPile = this.#tableauPiles[initialTableauIndex];
    const targetTableauPile = this.#tableauPiles[targetTableauIndex];
    if (initialTableauPile === undefined || targetTableauPile === undefined) {
      return false;
    }

    // get the starting card from the first tableau pile
    const card = initialTableauPile[cardIndex];
    if (card === undefined) {
      return false;
    }

    // validate that the card is visible to the player
    if (!card.isFaceUp) {
      return false;
    }

    // based on the suit color and card number, check that this card is allowed as the next card in the target tableau
    if (!this.#isValidMoveToAddCardToTableau(card, targetTableauPile)) {
      return false;
    }

    // move the cards to the target tableau pile and remove from the initial tableau pile
    const cardsToMove = initialTableauPile.splice(cardIndex);
    cardsToMove.forEach((card) => targetTableauPile.push(card));

    return true;
  }

  public moveTableauCardToFoundation(tableauIndex: number): boolean {
    // get the last card in the tableau pile that was provided (last element in the pile array)
    const tableauPile = this.#tableauPiles[tableauIndex];
    if (tableauPile === undefined) {
      return false;
    }
    const card = tableauPile[tableauPile.length - 1];
    if (card === undefined) {
      return false;
    }

    // based on the card suit, check the correct foundation pile for the current value to make sure this is the next card
    if (!this.#isValidMoveToAddCardToFoundation(card)) {
      return false;
    }

    // play card to the foundation pile and remove from the tableau pile
    this.#addCardToFoundation(card);
    tableauPile.pop();

    return true;
  }

  #addCardToFoundation(card: Card): void {
    let foundationPile: FoundationPile;
    switch (card.suit) {
      case CARD_SUIT.CLUB:
        foundationPile = this.#foundationPileClub;
        break;
      case CARD_SUIT.SPADE:
        foundationPile = this.#foundationPileSpade;
        break;
      case CARD_SUIT.HEART:
        foundationPile = this.#foundationPileHeart;
        break;
      case CARD_SUIT.DIAMOND:
        foundationPile = this.#foundationPileDiamond;
        break;
      default:
        exhaustiveGuard(card.suit);
    }
    foundationPile.addCard();
  }

  #isValidMoveToAddCardToFoundation(card: Card): boolean {
    let foundationPile: FoundationPile;
    switch (card.suit) {
      case CARD_SUIT.CLUB:
        foundationPile = this.#foundationPileClub;
        break;
      case CARD_SUIT.SPADE:
        foundationPile = this.#foundationPileSpade;
        break;
      case CARD_SUIT.HEART:
        foundationPile = this.#foundationPileHeart;
        break;
      case CARD_SUIT.DIAMOND:
        foundationPile = this.#foundationPileDiamond;
        break;
      default:
        exhaustiveGuard(card.suit);
    }
    return card.value === foundationPile.value + 1;
  }

  #isValidMoveToAddCardToTableau(card: Card, tableauPile: Card[]): boolean {
    // if tableau is empty, only allow king (13) to be placed
    if (tableauPile.length === 0) {
      return card.value === 13;
    }

    // get reference to the last card in the tableau pile
    const lastTableauCard = tableauPile[tableauPile.length - 1];

    // if last card in tableau is an ace (1), no cards can be added
    if (lastTableauCard.value === 1) {
      return false;
    }

    // validate next card in a tableau is the opposite color and next card in sequence, example red 8 -> black 7
    if (lastTableauCard.color === card.color) {
      return false;
    }
    if (lastTableauCard.value !== card.value + 1) {
      return false;
    }

    return true;
  }
}
