import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionSalvage implements IAction
{
    unit: BaseCreep;
    target: Tombstone | Resource | Ruin;
    minAmmount: number;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;
        var actionCode;
        if (this.target instanceof Resource) actionCode = this.unit.creep.pickup(this.target);
        else
        {
            actionCode = this.unit.creep.withdraw(this.target, RESOURCE_ENERGY);
        }

        return this.WorkCodeProcessing(actionCode);
    }

   private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Tombstone | Resource | Ruin>);
        }
        if (this.target != null)
        {
            if (this.target instanceof Resource)
            {
                if (this.target.amount > this.minAmmount) return;
            }
            else
                if (this.target.store.getUsedCapacity(RESOURCE_ENERGY) > this.minAmmount)
                {
                    return; //Target is valid
                }
        }

        this.target = this.unit.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (res) => { return res.amount > this.minAmmount } });

        if (this.target == null) this.target = this.unit.creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tomb) => { return tomb.store.energy > this.minAmmount } });

        if (this.target == null) this.target = this.unit.creep.pos.findClosestByPath(FIND_RUINS, { filter: (ruin) => { return ruin.store.energy > this.minAmmount } });

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">♻️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.creep.say("♻️");
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.NextTask;
            default:
                this.unit.log("Problem occured. Salvage error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    //#region  factory
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.minAmmount = 0;
    }

    MinAmmount(minAmmount: number):ActionSalvage
    {
        this.minAmmount = minAmmount;
        return this;
    }
    //#endregion
}
