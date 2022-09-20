import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionGather implements IAction
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage;

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }




    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureContainer | StructureStorage>);
        }
        if (this.target != null)
        {
            if (this.target.store.getUsedCapacity(RESOURCE_ENERGY) > this.unit.AmmountCanCarry())
            {
                return; //Target is valid
            }
        }

        this.target = Finder.GetFilledStorage(this.unit.creep.pos, this.unit.AmmountCanCarry());
        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    RepeatAction(): boolean
    {
        var newTarget = Finder.GetFilledStorage
            (
                this.unit.creep.pos,
                this.unit.AmmountCanCarry(),
                this.unit.targetId as Id<StructureContainer | StructureStorage>
            );
        if (newTarget != null)
        {
            this.unit.targetId = newTarget.id;
            this.unit.MoveToTarget(newTarget);
            return true;
        }
        return false;
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">⚡");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.creep.say("⚡");
                this.unit.memory.actions.worked = true;
                if (!this.RepeatAction()) return ActionResponseCode.NextTask;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Gather error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
       if (entryCode!=null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.withdraw(this.target, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }
}
