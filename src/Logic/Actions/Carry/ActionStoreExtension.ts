import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionStoreExtension implements IAction
{
    unit: BaseCreep;
    target: StructureExtension | StructureSpawn;

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.transfer(this.target, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.energy == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureExtension>);
        }
        if (this.target != null)
        {
            if (this.target.store.getFreeCapacity(RESOURCE_ENERGY) >0)
            {
                return; //Target is valid
            }
        }

        this.target = Finder.GetEmptyExtension(this.unit.creep.pos);
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
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say(">📥");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked=true;
                this.unit.creep.say("📥");
                if (!this.RepeatAction()) return ActionResponseCode.NextTask;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. StoreExtension error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        var newTarget = Finder.GetEmptyExtension
            (
                this.unit.creep.pos,
                this.unit.targetId as Id<StructureExtension | StructureSpawn>
            );
        if (newTarget != null)
        {
            this.unit.targetId = newTarget.id;
            this.unit.MoveToTarget(newTarget);
            return true;
        }
        return false;
    }
}
