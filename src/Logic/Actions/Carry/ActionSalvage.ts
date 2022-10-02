import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Storage } from "Models/Structures/Storage";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionSalvage implements IAction
{
    unit: BaseCreep;
    target: Storage;
    minAmmount: number;

    resource: ResourceConstant;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;
        var actionCode = this.target.Gather(this.unit);



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
        var foundGameObj;
        if (targetId != null)
        {
            foundGameObj = Game.getObjectById(this.unit.targetId as Id<Tombstone | Resource | Ruin>);
            if (foundGameObj != null) this.target = new Storage(foundGameObj, this.resource);
        }
        if (this.target != null)
        {
            if (this.target.ammount > this.minAmmount)
            {
                return; //Target is valid
            }

        }

        foundGameObj = this.unit.creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (res) => { return new Storage(res, this.resource).ammount > this.minAmmount } });

        if (foundGameObj == null) foundGameObj = this.unit.creep.pos.findClosestByPath(FIND_TOMBSTONES, { filter: (tomb) => { return new Storage(tomb, this.resource).ammount > this.minAmmount } });

        if (foundGameObj == null) foundGameObj = this.unit.creep.pos.findClosestByPath(FIND_RUINS, { filter: (ruin) => { return new Storage(ruin, this.resource).ammount > this.minAmmount } });

        if (foundGameObj != null)
        {
            this.target = new Storage(foundGameObj);
            this.unit.targetId = this.target.id;
        }
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToPos(this.target.pos);
                this.unit.creep.say("♻️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
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

    MinAmmount(minAmmount: number): ActionSalvage
    {
        this.minAmmount = minAmmount;
        return this;
    }

    WithResource(resource: ResourceConstant): ActionSalvage
    {
        this.resource = resource;
        return this;
    }
    //#endregion
}
