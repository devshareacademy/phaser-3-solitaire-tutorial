import * as Phaser from 'phaser';
import { ASSET_KEYS, SCENE_KEYS } from './common';

// used for drawing out game objects for debugging our player input
const DEBUG = false;
// the scale factor that will be applied to our card image game objects
const SCALE = 1.5;
// the frame of the card spritesheet that represents the back of a card
const CARD_BACK_FRAME = 52;
// the x & y positions of were the foundation piles will be placed in our game area
const FOUNDATION_PILE_X_POSITIONS = [360, 425, 490, 555];
const FOUNDATION_PILE_Y_POSITION = 5;
// the x & y position of were the discard pile will be placed in our game area
const DISCARD_PILE_X_POSITION = 85;
const DISCARD_PILE_Y_POSITION = 5;
// the x & y position of were the draw pile will be placed in our game area
const DRAW_PILE_X_POSITION = 5;
const DRAW_PILE_Y_POSITION = 5;
// the x & y position of were the tableau pile will be placed in our game area
const TABLEAU_PILE_X_POSITION = 40;
const TABLEAU_PILE_Y_POSITION = 92;
// the starting frame of the card suit in the card spritesheet that represents the various cards
const SUIT_FRAMES = {
  HEART: 26,
  DIAMOND: 13,
  SPADE: 39,
  CLUB: 0,
};

export class GameScene extends Phaser.Scene {
  // keeps track of the card game objects in our draw pile (will have 3 game objects)
  #drawPileCards!: Phaser.GameObjects.Image[];
  // keeps track of the card game objects in our discard pile (will have 2 game objects)
  #discardPileCards!: Phaser.GameObjects.Image[];
  // keeps track of the card game objects in each of the foundation piles (4 game objects)
  #foundationPileCards!: Phaser.GameObjects.Image[];
  // keeps track of the card game object containers for each tableau pile (7 game objects)
  #tableauContainers!: Phaser.GameObjects.Container[];

  constructor() {
    super({ key: SCENE_KEYS.GAME });
  }

  public create(): void {
    // setup game objects based on solitaire game state
    this.#createDrawPile();
    this.#createDiscardPile();
    this.#createFoundationPiles();
    this.#createTableauPiles();
  }

  #createDrawPile(): void {
    // create outline for pile
    this.#drawCardLocationBox(DRAW_PILE_X_POSITION, DRAW_PILE_Y_POSITION);

    // create initial draw pile game object cards
    this.#drawPileCards = [];
    for (let i = 0; i < 3; i += 1) {
      this.#drawPileCards.push(this.#createCard(DRAW_PILE_X_POSITION + i * 5, DRAW_PILE_Y_POSITION));
    }
  }

  #createDiscardPile(): void {
    // create outline for pile
    this.#drawCardLocationBox(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION);

    // create initial discard pile game object cards, we will only need two game objects, which will represent the two most recently drawn cards
    // at the start of the game, these will not be visible until the player draws a new card
    this.#discardPileCards = [];
    const bottomCard = this.#createCard(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION).setVisible(false);
    const topCard = this.#createCard(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION).setVisible(false);
    this.#discardPileCards.push(bottomCard, topCard);
  }

  #createFoundationPiles(): void {
    this.#foundationPileCards = [];

    // create outline for each foundation pile
    FOUNDATION_PILE_X_POSITIONS.forEach((x) => {
      this.#drawCardLocationBox(x, FOUNDATION_PILE_Y_POSITION);
      // create phaser game object for each pile, these will not be visible at game start
      // but once we add the ace to the pile, we will make this card visible
      const card = this.#createCard(x, FOUNDATION_PILE_Y_POSITION).setVisible(false);
      this.#foundationPileCards.push(card);
    });
  }

  #createTableauPiles(): void {
    this.#tableauContainers = [];
    for (let i = 0; i < 7; i += 1) {
      const x = TABLEAU_PILE_X_POSITION + i * 85;
      const tableauContainer = this.add.container(x, TABLEAU_PILE_Y_POSITION, []);
      this.#tableauContainers.push(tableauContainer);
      for (let j = 0; j < i + 1; j += 1) {
        const cardGameObject = this.#createCard(0, j * 20);
        tableauContainer.add(cardGameObject);
      }
    }
  }

  #drawCardLocationBox(x: number, y: number): void {
    this.add.rectangle(x, y, 56, 78).setOrigin(0).setStrokeStyle(2, 0x000000, 0.5);
  }

  #createCard(x: number, y: number): Phaser.GameObjects.Image {
    return this.add.image(x, y, ASSET_KEYS.CARDS, CARD_BACK_FRAME).setOrigin(0).setScale(SCALE);
  }
}
