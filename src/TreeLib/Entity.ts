import {Timers} from "./Timers";
import {Logger} from "./Logger";
import {Quick} from "./Quick";

/**
 * Entities are great for when you need logic executed continuously in some service.
 * Loops in intervals of 0.01 , changeable with timerdelay on an entity level, at any time.
 * This should not be used for something like individual projectiles as it could overly expensive.
 * Instead, make a projectile handler class/service that extend this and then track/execute those projectiles there.
 */
export abstract class Entity {
    private static entities: Entity[] = [];
    private static entityLoop: Function;

    private _internalTimer: number = 0;
    protected _timerDelay: number = 0.01;

    public constructor() {
        if (Entity.entityLoop == null) {
            Entity.entityLoop = () => {
                Entity.entities.forEach((entity) => {

                    entity._internalTimer += 0.01;
                    if (entity._internalTimer >= entity._timerDelay) {
                        entity._internalTimer = 0;
                        xpcall(() => {
                            entity.step();
                        }, Logger.LogCritical);
                    }
                });
            };
            Timers.getInstance().addFastTimerCallback(Entity.entityLoop);
        }
        Quick.Push(Entity.entities, this);
    }

    abstract step(): void;

    public remove() {
        let index = Entity.entities.indexOf(this);
        if (index != -1) {
            Quick.Slice(Entity.entities, index);
        }
    }
}