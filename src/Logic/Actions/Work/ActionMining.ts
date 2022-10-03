import { Constants } from "Constans";
import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
@profile
export class ActionMining implements IAction
{
    unit: BaseCreep;
    target: Source;

    findRandomSource: boolean;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();

        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;
        var actionCode = this.unit.creep.harvest(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if ((this.unit.creep.getActiveBodyparts(WORK) * 2) > this.unit.AmmountCanCarry()) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
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

        if (!this.findRandomSource)
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

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_OWNER:
                this.unit.memory.haltUntil = Game.time + this.unit.creep.room.controller.reservation.ticksToEnd;
                return ActionResponseCode.Repeat;
            case ERR_NOT_IN_RANGE:
                this.unit.memory.actionAttempts++;
                if (this.unit.memory.actionAttempts > Constants.moveAttmepts)
                {
                    var found = Finder.GetRandomSource(this.unit.creep.room, this.target.id);
                    if (found != null)
                    {
                        this.unit.memory.targetID = found.id;
                        this.unit.memory.actionAttempts = 0;
                        return ActionResponseCode.Repeat;
                    }
                    return ActionResponseCode.Reset;
                }
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say("⛏️");
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES:
                this.unit.creep.say("!⛏️");
                this.unit.memory.haltUntil = Game.time + this.target.ticksToRegeneration;
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                this.unit.memory.actionAttempts = 0;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Mining error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    //#region
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.findRandomSource = false;
    }

    FindRandomSource(): ActionMining
    {
        this.findRandomSource = true;
        return this;
    }
    //#endregion

}
