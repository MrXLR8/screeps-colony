import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionStore implements IAction
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage | StructureLink;
    range: number;
    dropOnFull: boolean;
    containerTypes: StructureConstant[];
    stored_resources:ResourceConstant;

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;


        this.GetSavedTarget();

        if (this.target == null)
        {
            this.unit.creep.drop(this.stored_resources);
            return ActionResponseCode.NextTask;
        }

        var actionCode = this.unit.creep.transfer(this.target,this.stored_resources);
        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getUsedCapacity() == 0) return ActionResponseCode.NextTask;
        this.stored_resources = _.filter(Object.keys(this.unit.creep.store), resource => this.unit.creep.store[resource as ResourceConstant] > 0)[0] as ResourceConstant;

        return null;

    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureContainer | StructureStorage | StructureLink>);
        }
        if (this.target != null)
        {
            if (this.target.store.getFreeCapacity() > 0)
            {
                return; //Target is valid
            }
        }



        this.target = Finder.GetContrainer(this.unit.creep.pos, this.range ,this.containerTypes);

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
                this.unit.creep.say(">🚚");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                if (!this.RepeatAction()) return ActionResponseCode.Reset;
                this.unit.creep.say("🚚");
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Store error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    private RepeatAction(): boolean
    {
        var newStore = this.unit.creep.store.getUsedCapacity() - this.target.store.getFreeCapacity();


        if (newStore < 0) return false;
        var newTarget = Finder.GetContrainer
            (
                this.unit.creep.pos,
                this.range,
                this.containerTypes,
                this.unit.targetId as Id<StructureContainer | StructureStorage | StructureLink>
            );
        if (newTarget != null)
        {
            this.unit.targetId = newTarget.id;
            this.unit.MoveToTarget(newTarget);
            return true;
        }
        return false;
    }

    //#region factory
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.dropOnFull = false;
        this.range = 999;

    }

    ContainerTypes(containerTypes: StructureConstant[]): ActionStore
    {
        this.containerTypes = containerTypes;
        return this;
    }
    AllowDrop(): ActionStore
    {
        this.dropOnFull = true;
        return this;
    }

    InRange(range: number): ActionStore
    {
        this.range = range
        return this;
    }

    //#endregion
}
