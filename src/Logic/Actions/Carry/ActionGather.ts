import { drop } from "lodash";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Storage } from "Models/Structures/Storage";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionGather implements IAction
{
    unit: BaseCreep;
    target: Storage;
    containerTypes: StructureConstant[]

    takeBigFirst: boolean;

    constructor(unit: Unit, takeBigFirst: boolean, containerTypes: StructureConstant[])
    {
        this.unit = unit as BaseCreep;
        this.takeBigFirst = takeBigFirst;
        this.containerTypes = containerTypes;
    }




    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        var found;
        if (targetId != null)
        {
            found = Game.getObjectById(this.unit.targetId as Id<StructureContainer | StructureContainer | StructureLink | Tombstone | Resource | Ruin>);
        }
        if (found != null)
        {
            this.target = new Storage(found, RESOURCE_ENERGY)
            if (this.target.ammount > this.unit.AmmountCanCarry())
            {
                return; //Target is valid
            }
        }

        if (this.takeBigFirst)
        {
            found = Finder.GetBiggestFilledStorage(this.unit.creep.room, this.containerTypes, this.unit.AmmountCanCarry());
            if (found != null) this.target = new Storage(found, RESOURCE_ENERGY);

        }
        else
        {
            var structure = Finder.GetFilledStorage(this.unit.creep.pos, this.containerTypes, this.unit.AmmountCanCarry());
            var dropped = Finder.FindDropped(this.unit.creep.pos, this.unit.AmmountCanCarry());

            found = Utils.WhosClose(this.unit.creep.pos, structure, dropped) as StructureContainer | StructureContainer | StructureLink | Tombstone | Resource | Ruin;
            if(found!=null) this.target = new Storage(found, RESOURCE_ENERGY);

        }

        if (this.target != null)
        {

            this.unit.targetId = this.target.storage.id;
        }
    }

    RepeatAction(): boolean
    {
        var newStore = this.target.ammount - this.unit.creep.store.getFreeCapacity(RESOURCE_ENERGY);
        if (newStore < 0) return false;
        var newTarget = Finder.GetFilledStorage
            (
                this.unit.creep.pos,
                this.containerTypes,
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
                this.unit.MoveToTarget(this.target.storage);
                this.unit.creep.say(">⚡");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.creep.say("⚡");
                this.unit.memory.actions.worked = true;
                if (!this.RepeatAction()) return ActionResponseCode.Repeat;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Gather error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.target.Gather(this.unit);

        return this.WorkCodeProcessing(actionCode);
    }
}
