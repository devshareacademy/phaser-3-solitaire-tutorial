import * as Phaser from 'phaser';
import { ASSET_KEYS, CARD_HEIGHT, CARD_WIDTH, SCENE_KEYS } from './common';

// used for drawing out game objects for debugging our player input
const DEBUG = true;
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

    // setup drop zones for interactions and events for drag
    this.#createDragEvents();
  }

  #createDrawPile(): void {
    // create outline for pile
    this.#drawCardLocationBox(DRAW_PILE_X_POSITION, DRAW_PILE_Y_POSITION);

    // create initial draw pile game object cards
    this.#drawPileCards = [];
    for (let i = 0; i < 3; i += 1) {
      this.#drawPileCards.push(this.#createCard(DRAW_PILE_X_POSITION + i * 5, DRAW_PILE_Y_POSITION, false));
    }

    // create zone to listen for click events, which triggers the drawing card logic
    const drawZone = this.add
      .zone(0, 0, CARD_WIDTH * SCALE + 20, CARD_HEIGHT * SCALE + 12)
      .setOrigin(0)
      .setInteractive();
    drawZone.on(Phaser.Input.Events.POINTER_DOWN, () => {
      // update the bottom card in the discard pile to reflect the top card
      this.#discardPileCards[0].setFrame(this.#discardPileCards[1].frame).setVisible(this.#discardPileCards[1].visible);
      // update the top card in the discard pile to reflect card we drew
      this.#discardPileCards[1].setFrame(CARD_BACK_FRAME).setVisible(true);
    });
    if (DEBUG) {
      this.add.rectangle(drawZone.x, drawZone.y, drawZone.width, drawZone.height, 0xff0000, 0.5).setOrigin(0);
    }
  }

  #createDiscardPile(): void {
    // create outline for pile
    this.#drawCardLocationBox(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION);

    // create initial discard pile game object cards, we will only need two game objects, which will represent the two most recently drawn cards
    // at the start of the game, these will not be visible until the player draws a new card
    this.#discardPileCards = [];
    const bottomCard = this.#createCard(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION, true).setVisible(false);
    const topCard = this.#createCard(DISCARD_PILE_X_POSITION, DISCARD_PILE_Y_POSITION, true).setVisible(false);
    this.#discardPileCards.push(bottomCard, topCard);
  }

  #createFoundationPiles(): void {
    this.#foundationPileCards = [];

    // create outline for each foundation pile
    FOUNDATION_PILE_X_POSITIONS.forEach((x) => {
      this.#drawCardLocationBox(x, FOUNDATION_PILE_Y_POSITION);
      // create phaser game object for each pile, these will not be visible at game start
      // but once we add the ace to the pile, we will make this card visible
      const card = this.#createCard(x, FOUNDATION_PILE_Y_POSITION, false).setVisible(false);
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
        const cardGameObject = this.#createCard(0, j * 20, true, j, i);
        tableauContainer.add(cardGameObject);
      }
    }
  }

  #drawCardLocationBox(x: number, y: number): void {
    this.add.rectangle(x, y, 56, 78).setOrigin(0).setStrokeStyle(2, 0x000000, 0.5);
  }

  #createCard(
    x: number,
    y: number,
    draggable: boolean,
    cardIndex?: number,
    pileIndex?: number,
  ): Phaser.GameObjects.Image {
    return this.add
      .image(x, y, ASSET_KEYS.CARDS, CARD_BACK_FRAME)
      .setOrigin(0)
      .setScale(SCALE)
      .setInteractive({ draggable: draggable })
      .setData({
        x,
        y,
        cardIndex,
        pileIndex,
      });
  }

  #createDragEvents(): void {
    this.#createDragStartEventListener();
    this.#createOnDragEventListener();
    this.#createDragEndEventListener();
  }

  #createDragStartEventListener(): void {
    // listen for the drag start event on a game object, this will be used to store the original position of the game
    // object, that way we can put the object back in the original position if an invalid move is made
    this.input.on(
      Phaser.Input.Events.DRAG_START,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        // store objects position
        gameObject.setData({ x: gameObject.x, y: gameObject.y });
        // update depth on container or image game object, so when we drag the card it is visible above all other game objects
        const tableauPileIndex = gameObject.getData('pileIndex') as number | undefined;
        if (tableauPileIndex !== undefined) {
          this.#tableauContainers[tableauPileIndex].setDepth(2);
        } else {
          gameObject.setDepth(2);
        }
        // update card objects alpha so we know which card is actively being dragged
        gameObject.setAlpha(0.8);
      },
    );
  }

  #createOnDragEventListener(): void {
    // listen for the drag event on a game object, this will be used to move game objects along the mouse path
    // as we click and drag an object in our scene
    this.input.on(
      Phaser.Input.Events.DRAG,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image, dragX: number, dragY: number) => {
        gameObject.setPosition(dragX, dragY);
        gameObject.setDepth(0);

        // if card is part of the tableau, we need to move all cards that are stacked on top of this card
        const tableauPileIndex = gameObject.getData('pileIndex') as number | undefined;
        const cardIndex = gameObject.getData('cardIndex') as number;
        if (tableauPileIndex !== undefined) {
          const numberOfCardsToMove = this.#getNumberOfCardsToMoveAsPartOfStack(tableauPileIndex, cardIndex);
          for (let i = 1; i <= numberOfCardsToMove; i += 1) {
            this.#tableauContainers[tableauPileIndex]
              .getAt<Phaser.GameObjects.Image>(cardIndex + i)
              .setPosition(dragX, dragY + 20 * i);
          }
        }
      },
    );
  }

  #createDragEndEventListener(): void {
    // listen for the drag end event on a game object, this will be used to check were the game object was placed
    // in our scene, and depending on were the object was placed we will check if that is a valid move in our game
    // otherwise, we will reset the objects position back to were the object was originally located at
    this.input.on(
      Phaser.Input.Events.DRAG_END,
      (pointer: Phaser.Input.Pointer, gameObject: Phaser.GameObjects.Image) => {
        // TODO: reset the depth on the container or image game object
        const tableauPileIndex = gameObject.getData('pileIndex') as number | undefined;
        if (tableauPileIndex !== undefined) {
          this.#tableauContainers[tableauPileIndex].setDepth(0);
        } else {
          gameObject.setDepth(0);
        }

        // TODO: check if game object overlaps with foundation
        // TODO: check if game object overlaps with tableau
        // TODO: check if game object overlaps with with multiple tableau piles and determine were to place game object
        // TODO: if game object was not destroyed, still active, we need to update that game objects data to match were the card was placed

        gameObject.setPosition(gameObject.getData('x') as number, gameObject.getData('y') as number);
        // reset card game objects alpha since we are done moving the object
        gameObject.setAlpha(1);

        // if card is part of the tableau, we need to move all cards that are stacked on top of this card back to the original location as well
        const cardIndex = gameObject.getData('cardIndex') as number;
        if (tableauPileIndex !== undefined) {
          const numberOfCardsToMove = this.#getNumberOfCardsToMoveAsPartOfStack(tableauPileIndex, cardIndex);
          for (let i = 1; i <= numberOfCardsToMove; i += 1) {
            const cardToMove = this.#tableauContainers[tableauPileIndex].getAt<Phaser.GameObjects.Image>(cardIndex + i);
            cardToMove.setPosition(cardToMove.getData('x') as number, cardToMove.getData('y') as number);
          }
        }
      },
    );
  }

  /**
   * Determines the number of cards that should also be moved with the current card game object that is being
   * dragged. Example, in a pile I have the cards 5 -> 4 -> 3, and I want to move the whole stack, when I drag the 5
   * card, cards 4 and 3 should also move. If I drag the 4 card, we should not move card 5, but card 3 should be
   * moved with card 4.
   */
  #getNumberOfCardsToMoveAsPartOfStack(tableauPileIndex: number, cardIndex: number): number {
    if (tableauPileIndex !== undefined) {
      const lastCardIndex = this.#tableauContainers[tableauPileIndex].length - 1;
      if (lastCardIndex === cardIndex) {
        return 0;
      }

      return lastCardIndex - cardIndex;
    }
    return 0;
  }
}
