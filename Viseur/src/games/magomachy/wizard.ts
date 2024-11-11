// This is a class to represent the Wizard object in the game.
// If you want to render it in the game do so here.
import { ease, Immutable, PixiSpriteOptions } from "src/utils";
import { Viseur } from "src/viseur";
import { makeRenderable } from "src/viseur/game";
import { GameObject } from "./game-object";
import { MagomachyDelta, TileState, WizardState } from "./state-interfaces";
import { linear } from "eases";

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
export class Wizard extends makeRenderable(GameObject, SHOULD_RENDER) {
    // <<-- Creer-Merge: static-functions -->>
    // you can add static functions here
    // <<-- /Creer-Merge: static-functions -->>

    /** The current state of the Wizard (dt = 0). */
    public current: WizardState | undefined;

    /** The next state of the Wizard (dt = 1). */
    public next: WizardState | undefined;

    // <<-- Creer-Merge: variables -->>
    // You can add additional member variables here

    // wizard's specialty
    public type: string;

    // shorted version of wizard's specialty
    public typeSuffix: string;

    // a dict of dicts representing all wizard sprites. Outermost dict
    public wizSprites: {
        [type: string]: { [direction: string]: PIXI.Sprite };
    };

    public spellSprites: {
        [spell: string]: PIXI.Sprite;
    };
    // <<-- /Creer-Merge: variables -->>

    /**
     * Constructor for the Wizard with basic logic
     * as provided by the Creer code generator.
     * This is a good place to initialize sprites and constants.
     *
     * @param state - The initial state of this Wizard.
     * @param viseur - The Viseur instance that controls everything and
     * contains the game.
     */
    constructor(state: WizardState, viseur: Viseur) {
        super(state, viseur);

        // <<-- Creer-Merge: constructor -->>
        // You can initialize your new Wizard here.
        this.container.setParent(this.game.layers.game);

        this.type = state.specialty;
        this.typeSuffix = state.specialty.substring(0, 2);

        const hide = { visible: false };
        this.wizSprites = {
            aggressive: {
                north: this.addSprite.wiz_ag_n(hide),
                east: this.addSprite.wiz_ag_e(hide),
                south: this.addSprite.wiz_ag_s(hide),
                west: this.addSprite.wiz_ag_w(hide),
            },
            defensive: {
                north: this.addSprite.wiz_de_n(hide),
                east: this.addSprite.wiz_de_e(hide),
                south: this.addSprite.wiz_de_s(hide),
                west: this.addSprite.wiz_de_w(hide),
            },
            sustaining: {
                north: this.addSprite.wiz_su_n(hide),
                east: this.addSprite.wiz_su_e(hide),
                south: this.addSprite.wiz_su_s(hide),
                west: this.addSprite.wiz_su_w(hide),
            },
            strategic: {
                north: this.addSprite.wiz_st_n(hide),
                east: this.addSprite.wiz_st_e(hide),
                south: this.addSprite.wiz_st_s(hide),
                west: this.addSprite.wiz_st_w(hide),
            },
        };

        this.spellSprites = {
            Punch: this.addSprite.spell_punch(hide),
            "Fire Slash": this.addSprite.spell_flame({
                visible: false,
                width: 3,
            }),
            "Rock Lob": this.addSprite.wall2(hide),
        };

        // <<-- /Creer-Merge: constructor -->>
    }

    /**
     * Called approx 60 times a second to update and render Wizard
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
        current: Immutable<WizardState>,
        next: Immutable<WizardState>,
        delta: Immutable<MagomachyDelta>,
        nextDelta: Immutable<MagomachyDelta>,
    ): void {
        super.render(dt, current, next, delta, nextDelta);

        // <<-- Creer-Merge: render -->>
        // render where the Wizard is
        // render position
        if (current === undefined) return;
        const dir = this.dirAsString(next.direction);

        for (let i = 0; i < 4; i++) {
            this.wizSprites[this.type][this.dirAsString(i)].visible = false;
        }
        const sprite = this.wizSprites[this.type][dir];
        sprite.visible = true;
        this.container.position.set(
            ease(current.tile.x, next.tile.x, dt),
            ease(current.tile.y, next.tile.y, dt),
        );

        // try to render spell
        for (const s in this.spellSprites) {
            this.spellSprites[s].visible = false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const run = delta.data?.run;

        if (
            run !== undefined &&
            current.id === run.caller?.id &&
            (delta.data.invalid === undefined || delta.data.invalid === "")
        ) {
            const spellSprite = this.spellSprites[run.args.spellName];
            switch (run.functionName) {
                case "cast":
                    // eslint-disable-next-line no-case-declarations
                    const targX = Math.floor(
                        (run.args.tile?.id - 2) / this.game.current.mapWidth,
                    );
                    // eslint-disable-next-line no-case-declarations
                    const targY =
                        (run.args.tile?.id - 2) % this.game.current.mapWidth;
                    switch (run.args.spellName) {
                        case undefined:
                            break;
                        case "Punch":
                            spellSprite.visible = true;
                            spellSprite.position.set(
                                ease(0, targX - next.tile.x, dt),
                                ease(0, targY - next.tile.y, dt),
                            );
                            break;
                        case "Fire Slash":
                            spellSprite.visible = true;
                            spellSprite.anchor.set(0.5);
                            spellSprite.angle = this.dirAsAngle(
                                next.direction,
                            );
                            spellSprite.anchor.set(0.0);
                            spellSprite.position.set(
                                this.dirAsPosDelta(next.direction).x +
                                    (next.direction === 3 ||
                                    next.direction === 0
                                        ? 1
                                        : 0),
                                this.dirAsPosDelta(next.direction).y +
                                    (next.direction === 3 ||
                                    next.direction === 2
                                        ? 1
                                        : 0),
                            );
                            break;
                        case "Rock Lob":
                            spellSprite.visible = true;
                            spellSprite.position.set(
                                ease(0, targX - next.tile.x, dt, linear),
                                ease(
                                    0,
                                    targY - next.tile.y,
                                    dt,
                                    (t) => 2 * (-((2 * t - 1) ** 2) + 1),
                                ),
                            );
                    }
            }
        }

        // render hurn anim
        if (
            delta.reversed?.gameObjects !== undefined &&
            delta.reversed?.gameObjects[current.id] !== undefined &&
            current.health <
                delta.reversed["gameObjects"][current.id]["health"]
        ) {
            sprite.anchor.set(0.5);
            sprite.tint = ease(0xff1010, 0xffffff, dt, "cubicInOut");
            sprite.angle = ease(
                (Math.random() + 0.5) * 20 - 15,
                0,
                dt,
                "cubicInOut",
            );
        }

        sprite.anchor.set(0.0);

        // <<-- /Creer-Merge: render -->>
    }

    /**
     * Invoked after a player changes their color,
     * so we have a chance to recolor this Wizard's sprites.
     */
    public recolor(): void {
        super.recolor();

        // <<-- Creer-Merge: recolor -->>
        // replace with code to recolor sprites based on player color
        // <<-- /Creer-Merge: recolor -->>
    }

    /**
     * Invoked when this Wizard instance should not be rendered,
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
        current: Immutable<WizardState>,
        next: Immutable<WizardState>,
        delta: Immutable<MagomachyDelta>,
        nextDelta: Immutable<MagomachyDelta>,
    ): void {
        super.stateUpdated(current, next, delta, nextDelta);

        // <<-- Creer-Merge: state-updated -->>
        // update the Wizard based off its states
        // <<-- /Creer-Merge: state-updated -->>
    }

    // <<-- Creer-Merge: public-functions -->>
    // You can add additional public functions here
    dirAsString(direction: number): string {
        return ["south", "east", "north", "west"][direction];
    }

    dirAsPosDelta(direction: number): { x: number; y: number } {
        return [
            { x: 0, y: 1 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: -1, y: 0 },
        ][direction];
    }

    // assuming default sprite faces right
    dirAsAngle(direction: number): number {
        return [90, 0, 270, 180][direction];
    }
    // <<-- /Creer-Merge: public-functions -->>

    // <Joueur functions> --- functions invoked for human playable client
    // NOTE: These functions are only used 99% of the time if the game
    // supports human playable clients (like Chess).
    // If it does not, feel free to ignore these Joueur functions.

    /**
     * Casts a spell on a Tile in range.
     *
     * @param spellName - The name of the spell to cast.
     * @param tile - The Tile to aim the spell toward.
     * @param callback - The callback that eventually returns the return value
     * from the server. - The returned value is True if successfully cast, false
     * otherwise.
     */
    public cast(
        spellName: string,
        tile: TileState,
        callback: (returned: boolean) => void,
    ): void {
        this.runOnServer("cast", { spellName, tile }, callback);
    }

    /**
     * Moves this Wizard from its current Tile to another empty Tile.
     *
     * @param tile - The Tile this Wizard should move to.
     * @param callback - The callback that eventually returns the return value
     * from the server. - The returned value is True if it moved, false
     * otherwise.
     */
    public move(tile: TileState, callback: (returned: boolean) => void): void {
        this.runOnServer("move", { tile }, callback);
    }

    // </Joueur functions>

    // <<-- Creer-Merge: protected-private-functions -->>
    // You can add additional protected/private functions here
    // <<-- /Creer-Merge: protected-private-functions -->>
}
