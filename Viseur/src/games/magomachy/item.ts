// This is a class to represent the Item object in the game.
// If you want to render it in the game do so here.
import { ease, Immutable } from "src/utils";
import { Viseur } from "src/viseur";
import { makeRenderable } from "src/viseur/game";
import { GameObject } from "./game-object";
import { ItemState, MagomachyDelta } from "./state-interfaces";

// <<-- Creer-Merge: imports -->>
// any additional imports you want can be added here safely between Creer runs
// <<-- /Creer-Merge: imports -->>

// <<-- Creer-Merge: should-render -->>
// Set this variable to `true`, if this class should render.
const SHOULD_RENDER = true;
// <<-- /Creer-Merge: should-render -->>

/**
 * An object in the game. The most basic class that all game classes should inherit from automatically.
 */
export class Item extends makeRenderable(GameObject, SHOULD_RENDER) {
    // <<-- Creer-Merge: static-functions -->>
    // you can add static functions here
    // <<-- /Creer-Merge: static-functions -->>

    /** The current state of the Item (dt = 0). */
    public current: ItemState | undefined;

    /** The next state of the Item (dt = 1). */
    public next: ItemState | undefined;

    // <<-- Creer-Merge: variables -->>
    // You can add additional member variables here

    public sprite: PIXI.Sprite | undefined;
    public particleSprite: PIXI.Sprite | null;
    // <<-- /Creer-Merge: variables -->>

    /**
     * Constructor for the Item with basic logic
     * as provided by the Creer code generator.
     * This is a good place to initialize sprites and constants.
     *
     * @param state - The initial state of this Item.
     * @param viseur - The Viseur instance that controls everything and
     * contains the game.
     */
    constructor(state: ItemState, viseur: Viseur) {
        super(state, viseur);

        // <<-- Creer-Merge: constructor -->>
        this.container.position.set(state.tile.x, state.tile.y);


        this.particleSprite = null;
        // You can initialize your new Item here.
        const hide = { visible: false };
        this.container.setParent(this.game.layers.items);
        switch (state.form) {
            case "health flask":
                this.sprite = this.addSprite.item_health();
                break;
            case "aether flask":
                this.sprite = this.addSprite.item_aether();
                break;
            case "explosion rune":
                this.sprite = this.addSprite.rune_explode();
                this.particleSprite = this.addSprite.particle_explode(hide);
                break;
            case "heal rune":
                this.sprite = this.addSprite.rune_health();
                this.particleSprite = this.addSprite.particle_health(hide);
                break;
            case "teleport rune":
                this.sprite = this.addSprite.rune_tele();
                this.particleSprite = this.addSprite.particle_tele(hide);
                break;
            case "charge rune":
                this.sprite = this.addSprite.rune_charge();
                this.particleSprite = this.addSprite.particle_charge(hide);
                break;
            case "stone":
                this.sprite = this.addSprite.statue();
                break;
        }
        // <<-- /Creer-Merge: constructor -->>
    }

    /**
     * Called approx 60 times a second to update and render Item
     * instances.
     * Leave empty if it is not being rendered.
     *
     * @param dt - A floating point number [0, 1) which represents how far into
     * the next turn that current turn we are rendering is at.
     * @param current - The current (most) game state, will be this.next if
     * this.current is undefined.
     * @param next - The next (most) game state, will be this.current if
     * this.next is undefined.
     * @param delta - The current (most) delta, which explains what happened.
     * @param nextDelta - The the next (most) delta, which explains what
     * happend.
     */
    public render(
        dt: number,
        current: Immutable<ItemState>,
        next: Immutable<ItemState>,
        delta: Immutable<MagomachyDelta>,
        nextDelta: Immutable<MagomachyDelta>,
    ): void {
        super.render(dt, current, next, delta, nextDelta);

        // <<-- Creer-Merge: render -->>
        // render where the Item is
        this.container.position.set(
            ease(current.tile.x, next.tile.x, dt, "quadOut"),
            ease(current.tile.y, next.tile.y, dt, "quadOut"),
        );

        if (current.tile.object !== null && next.tile.object === null)
        {
            if (this.particleSprite !== null) {
                this.container.setParent(this.game.layers.item_used);
                this.particleSprite.visible = true;
            }
        }
        this.container.visible = (current.tile.object !== null);

        // <<-- /Creer-Merge: render -->>
    }

    /**
     * Invoked after a player changes their color,
     * so we have a chance to recolor this Item's sprites.
     */
    public recolor(): void {
        super.recolor();

        // <<-- Creer-Merge: recolor -->>
        // replace with code to recolor sprites based on player color
        // <<-- /Creer-Merge: recolor -->>
    }

    /**
     * Invoked when this Item instance should not be rendered,
     * such as going back in time before it existed.
     *
     * By default the super hides container.
     * If this sub class adds extra PIXI objects outside this.container, you
     * should hide those too in here.
     */
    public hideRender(): void {
        super.hideRender();

        // <<-- Creer-Merge: hide-render -->>
        // hide anything outside of `this.container`.
        // <<-- /Creer-Merge: hide-render -->>
    }

    /**
     * Invoked when the state updates.
     *
     * @param current - The current (most) game state, will be this.next if
     * this.current is undefined.
     * @param next - The next (most) game state, will be this.current if
     * this.next is undefined.
     * @param delta - The current (most) delta, which explains what happened.
     * @param nextDelta - The the next (most) delta, which explains what
     * happend.
     */
    public stateUpdated(
        current: Immutable<ItemState>,
        next: Immutable<ItemState>,
        delta: Immutable<MagomachyDelta>,
        nextDelta: Immutable<MagomachyDelta>,
    ): void {
        super.stateUpdated(current, next, delta, nextDelta);

        // <<-- Creer-Merge: state-updated -->>
        // update the Item based off its states
        // <<-- /Creer-Merge: state-updated -->>
    }

    // <<-- Creer-Merge: public-functions -->>
    // You can add additional public functions here
    // <<-- /Creer-Merge: public-functions -->>

    // <<-- Creer-Merge: protected-private-functions -->>
    // You can add additional protected/private functions here
    // <<-- /Creer-Merge: protected-private-functions -->>
}
