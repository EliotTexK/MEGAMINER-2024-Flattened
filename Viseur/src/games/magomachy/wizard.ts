// @ts-nocheck

// This is a class to represent the Wizard object in the game.
// If you want to render it in the game do so here.
import { ease, Immutable } from "src/utils";
import { Viseur } from "src/viseur";
import { makeRenderable } from "src/viseur/game";
import { GameObject } from "./game-object";
import { MagomachyDelta, TileState, WizardState } from "./state-interfaces";
import { Point } from "pixi.js";

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

    // this is not clean code :(
    public extraSprites: PIXI.Sprite[];

    // a dict of dicts representing all wizard sprites. Outermost dict
    public wizSprites: {
        [type: string]: { [direction: string]: any };
    };

    public wizSpriteScale: {
        [type: string]: Point
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

        // PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

        // <<-- Creer-Merge: constructor -->>
        // You can initialize your new Wizard here.
        this.container.setParent(this.game.layers.wiz_a);

        this.type = state.specialty;
        this.typeSuffix = state.specialty.substring(0, 2);

        const hide = { visible: false };
        this.wizSprites = {
            aggressive: {
                norm:
                {
                    north: this.addSprite.wiz_ag_n(hide),
                    east: this.addSprite.wiz_ag_e(hide),
                    south: this.addSprite.wiz_ag_s(hide),
                    west: this.addSprite.wiz_ag_w(hide),
                },
                cast: {
                    north: this.addSprite.wiz_ag_cast_n(hide),
                    east: this.addSprite.wiz_ag_cast_e(hide),
                    south: this.addSprite.wiz_ag_cast_s(hide),
                    west: this.addSprite.wiz_ag_cast_w(hide),
                },
                tele: {
                    north: this.addSprite.wiz_ag_tele_n(hide),
                    east: this.addSprite.wiz_ag_tele_e(hide),
                    south: this.addSprite.wiz_ag_tele_s(hide),
                    west: this.addSprite.wiz_ag_tele_w(hide),
                },
                dash: {
                    north: this.addSprite.wiz_ag_dash_n(hide),
                    east: this.addSprite.wiz_ag_dash_e(hide),
                    south: this.addSprite.wiz_ag_dash_s(hide),
                    west: this.addSprite.wiz_ag_dash_w(hide),
                },
            },
            defensive: {
                norm:{
                    north: this.addSprite.wiz_de_n(hide),
                    east: this.addSprite.wiz_de_e(hide),
                    south: this.addSprite.wiz_de_s(hide),
                    west: this.addSprite.wiz_de_w(hide),
                },
                cast: {
                    north: this.addSprite.wiz_de_cast_n(hide),
                    east: this.addSprite.wiz_de_cast_e(hide),
                    south: this.addSprite.wiz_de_cast_s(hide),
                    west: this.addSprite.wiz_de_cast_w(hide),
                },
            },
            sustaining: {
                norm: 
                {
                    north: this.addSprite.wiz_su_n(hide),
                    east: this.addSprite.wiz_su_e(hide),
                    south: this.addSprite.wiz_su_s(hide),
                    west: this.addSprite.wiz_su_w(hide),
                },
                cast: {
                    north: this.addSprite.wiz_su_cast_n(hide),
                    east: this.addSprite.wiz_su_cast_e(hide),
                    south: this.addSprite.wiz_su_cast_s(hide),
                    west: this.addSprite.wiz_su_cast_w(hide),
                },
            },
            strategic: {
                norm: 
                {
                    north: this.addSprite.wiz_st_n(hide),
                    east: this.addSprite.wiz_st_e(hide),
                    south: this.addSprite.wiz_st_s(hide),
                    west: this.addSprite.wiz_st_w(hide),
                },
                cast: {
                    north: this.addSprite.wiz_st_cast_n(hide),
                    east: this.addSprite.wiz_st_cast_e(hide),
                    south: this.addSprite.wiz_st_cast_s(hide),
                    west: this.addSprite.wiz_st_cast_w(hide),
                },
            },
        };

        this.wizSpriteScale = {
            aggressive: {x: 1, y: 1.5},
            defensive: {x: 1, y: 1.125},
            sustaining: {x: 1, y: 1.5},
            strategic: {x: 1, y: 1.5},
        }

        this.spellSprites = {
            Punch: this.addSprite.spell_punch(hide),
            "Fire Slash": this.addSprite.spell_flame({
                visible: false,
                width: 3,
            }),
            "Rock Lob": this.addSprite.spell_rock(hide),
            "Calming Blast": this.addSprite.spell_water(hide),
        };

        this.extraSprites = []

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
        // z ordering
        if (this.game.next?.gameObjects[Number(this.id) - 1].tile.y > this.game.next?.gameObjects[Number(this.id)].tile.y) {
            this.container.setParent(this.game.layers.wiz_a);
        }
        else {
            this.container.setParent(this.game.layers.wiz_b);
        }

        // try to render spell
        for (const s in this.spellSprites) {
            this.spellSprites[s].visible = false;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const run = nextDelta.data?.run;
        let wizSpriteArg: string? = "norm";
        let spriteOffset = {x: (1 - this.wizSpriteScale[this.type].x), y: (1 - this.wizSpriteScale[this.type].y)};
        let easeArg: any = undefined;

        for (let exSprite in this.extraSprites) {
            this.extraSprites[exSprite].visible = false;
        }

        if (
            run !== undefined &&
            current.id === run.caller?.id &&
            (nextDelta.data.invalid === undefined || nextDelta.data.invalid === "")
        ) {
            const spellSprite = this.spellSprites[run.args.spellName];
            switch (run.functionName) {
                case "cast":
                    // eslint-disable-next-line no-case-declarations
                    wizSpriteArg = "cast"; // may be overwritten by other spells
                    const targX = Math.floor(
                        (run.args.tile?.id - 2) / this.game.current.mapWidth,
                    );
                    // eslint-disable-next-line no-case-declarations
                    const targY =
                        (run.args.tile?.id - 2) % this.game.current.mapWidth;
                    
                    const rotOffset = {x: (next.direction === 3 ||
                        next.direction === 0
                            ? 1
                            : 0), y: (next.direction === 3 ||
                                next.direction === 2
                                    ? 1
                                    : 0)};
                    switch (run.args.spellName) {
                        case undefined:
                            break;
                        case "Punch":
                            spellSprite.visible = true;
                            spellSprite.anchor.set(0.5);
                            spellSprite.angle = this.dirAsAngle(
                                next.direction,
                            );
                            spellSprite.anchor.set(0.0);
                            spellSprite.position.set(
                                ease(rotOffset.x - spriteOffset.x, targX - next.tile.x + rotOffset.x - spriteOffset.x, dt),
                                ease(rotOffset.y - spriteOffset.y, targY - next.tile.y + rotOffset.y - spriteOffset.y, dt),
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
                                this.dirAsPosDelta(next.direction).x + rotOffset.x - spriteOffset.x,
                                this.dirAsPosDelta(next.direction).y + rotOffset.y - spriteOffset.y,
                            );
                            break;
                        case "Furious Telekinesis":
                            wizSpriteArg = "tele";
                            break;
                        case "Thunderous Dash":
                            wizSpriteArg = "dash";
                            break;
                        case "Rock Lob":
                            const yOffset = 3 * (-((2 * dt - 1) ** 2) + 1)
                            spellSprite.visible = true;
                            spellSprite.position.set(
                                ease(0, targX - next.tile.x, dt, "linear"),
                                ease(0, targY - next.tile.y - yOffset, dt, "linear"),
                            );
                            break;
                        case "Calming Blast":
                            const theta = Math.atan2(targY - next.tile.y, targX - next.tile.x);
                            const dist = Math.ceil(1.25 * Math.sqrt(Math.pow((targY - next.tile.y), 2) + Math.pow((targX - next.tile.x), 2)));
                            for (let i = 0; i < dist; i++) {
                                this.extraSprites[i] = this.addSprite.spell_water({
                                    pivot: {x: 0.5, y: 0.5},
                                    position: 
                                    {
                                        x: (i / dist) * 0 + ((dist - i) / dist) * (targX - next.tile.x) + rotOffset.x * 0.85 - spriteOffset.x,
                                        y: (i / dist) * 0 + ((dist - i) / dist) * (targY - next.tile.y) + rotOffset.y * 0.85 - spriteOffset.y,
                                    },
                                    relativeScale: 0.75,
                                    rotation: theta,
                                })
                            }
                            break;
                        case "Teleport Rune":
                            easeArg = (t: number) => (t > 0.9 ? 1 : 0); 
                            break;
                        case "Teleport":
                            easeArg = (t: number) => (t > 0.9 ? 1 : 0);
                            break;
                        
                    }
            }
        }

        if (next.speed > 2) wizSpriteArg = "dash";

        // render position
        if (current === undefined) return;
        const dir = this.dirAsString(next.direction);


        for (const key1 in this.wizSprites) {
            for (const key2 in this.wizSprites[key1]) {
                for (let i = 0; i < 4; i++) {
                    this.wizSprites[key1][key2][this.dirAsString(i)].visible = false;
                }
            }
        }
        let sprite: PIXI.Sprite;
        if (wizSpriteArg === null) sprite = this.wizSprites[this.type][dir];
        else sprite = this.wizSprites[this.type][wizSpriteArg][dir];

        sprite.visible = true;
        this.container.position.set(
            ease(current.tile.x + spriteOffset.x, next.tile.x + spriteOffset.x, dt, easeArg),
            ease(current.tile.y + spriteOffset.y, next.tile.y + spriteOffset.y, dt, easeArg),
        );
        sprite.height = this.wizSpriteScale[this.type].y

        // render hurn anim
        if (
            delta.reversed?.gameObjects !== undefined &&
            delta.reversed?.gameObjects[current.id] !== undefined &&
            current.health <
                delta.reversed["gameObjects"][current.id]["health"]
        ) {
            sprite.tint = ease(0xff1010, 0xffffff, dt, "cubicInOut");
            if (current.health === 0)
            {
                sprite.width = ease(1, 0, dt, "linear");
                sprite.height = ease(1, 0, dt, "linear");
                this.container.position.set(
                    current.tile.x + spriteOffset.x + dt / 2,
                    current.tile.y + spriteOffset.y + dt / 2,
                );
            }
            else
            {
                sprite.anchor.set(0.5);
                sprite.angle = ease(
                    (Math.random() + 0.5) * 20 - 15,
                    0,
                    dt,
                    "cubicInOut",
                );
            }

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
