import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionMining implements IAction
{
    unit: BaseCreep;
    target: Source;

    lookForClosest: boolean;

    constructor(unit: Unit, lookForClosest?: boolean)
    {
        if (typeof lookForClosest !== 'undefined')
        {
            this.lookForClosest = lookForClosest;
        }
        else
        {
            this.lookForClosest = false;
        }
        this.unit = unit as BaseCreep;
    }



    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Source>);
        }
        if (this.target != null)
        {
            if (this.target.energy != 0)
            {
                return; //Target is valid
            }
        }

        if (this.lookForClosest)
        {
            this.target = Finder.GetClosestSource(this.unit.creep.pos);
        }
        else
        {
            this.target = Finder.GetRandomSource(this.unit.creep.room);
        }

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.memory.actionAttempts++;
                if (this.unit.memory.actionAttempts > Constants.moveAttmepts)
                {
                    this.unit.log("move attempts");
                    return ActionResponseCode.Reset;
                }
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⛏️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                this.unit.memory.actionAttempts = 0;
                this.unit.creep.say("⛏️");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Mining error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        throw ("Not implemented");
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();

        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;
        var actionCode = this.unit.creep.harvest(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

}
