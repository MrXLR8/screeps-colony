import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { IAction } from "./BaseAction";

export class ActionGather implements IAction<StructureContainer | StructureStorage>
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage;
    SearchMethod: () => StructureContainer | StructureStorage;
    ValidationMethod: (target: StructureContainer | StructureStorage) => boolean;

    constructor(creep: BaseCreep)
    {
        this.unit = creep as BaseCreep;

        this.SearchMethod = () =>
        {
            return Finder.GetFilledStorage(this.unit.creep.pos, this.unit.AmmountCanCarry())
        };

        this.ValidationMethod = (target: StructureContainer | StructureStorage) =>
        {
            return target.store.getUsedCapacity(RESOURCE_ENERGY) > this.unit.AmmountCanCarry()
        };
    }


    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.target = this.unit.GetTarget<StructureContainer | StructureStorage>(this.SearchMethod, this.ValidationMethod);

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.withdraw(this.target, RESOURCE_ENERGY);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    RepeatEligable(): boolean
    {
        var newTarget = Finder.GetFilledStorage
            (
                this.unit.creep.pos,
                this.unit.AmmountCanCarry(),
                this.unit.memory.targetID as Id<StructureContainer | StructureStorage>
            );
        if (newTarget != null)
        {
            this.unit.memory.targetID = newTarget.id;
            this.unit.memory.actionAttempts = 0;
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
                if(!this.RepeatEligable()) return ActionResponseCode.NextTask;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Gather error code: "+code);
                return ActionResponseCode.NextTask;
            }
    }
}
