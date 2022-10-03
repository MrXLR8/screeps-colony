import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
@profile
export class ActionDismantleEnemy implements IAction
{
    unit: BaseCreep;
    private target: Structure;
    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.dismantle(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Structure>);
        }
        if (this.target != null)
            return; //Target is valid

        this.target = this.unit.creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES,
            {
                filter: (structure) =>
                {
                    if(structure.structureType==STRUCTURE_RAMPART) return false;
                    var storeStructure = structure as any;
                    if (typeof storeStructure.store !== 'undefined')
                    {
                        if (storeStructure.store.getUsedCapacity() > 0) return false;
                    }
                    return true;
                }
            });

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
                this.unit.creep.say("💣");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Dismantle error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }
    //#region  factory

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }
    //#endregion

}
