import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionStore implements IAction
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage;
    range:number;
    resource:ResourceConstant;

    constructor(unit: Unit,resource:ResourceConstant,range?:number)
    {
        this.unit = unit as BaseCreep;
        this.resource=resource;
        if(typeof range ==='undefined') range=999;
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.transfer(this.target, this.resource);

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getUsedCapacity(this.resource)==0) return ActionResponseCode.NextTask;
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
            if (this.target.store.getFreeCapacity(this.resource) >0)
            {
                return; //Target is valid
            }
        }

        this.target = Finder.GetContrainer(this.unit.creep.pos,this.range,this.resource);
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
                this.unit.creep.say(">🚚");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked=true;
                this.unit.creep.say("🚚");
                if (!this.RepeatAction()) return ActionResponseCode.NextTask;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. StoreExtension error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        var newStore = this.unit.creep.store.getUsedCapacity(this.resource)+this.target.store.getFreeCapacity(this.resource);
        if(newStore>this.target.store.getCapacity(this.resource)) return false;
        var newTarget = Finder.GetContrainer
            (
                this.unit.creep.pos,
                this.range,
                this.resource,
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
}
