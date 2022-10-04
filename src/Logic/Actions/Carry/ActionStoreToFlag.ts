import { forEach } from "lodash";
import { Finder } from "Logic/Finder";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { profile } from "../../../../screeps-typescript-profiler/Profiler";
import { IAction } from "../IAction";
@profile
export class ActionStoreToFlag implements IAction
{
    unit: BaseCreep;
    target: StructureContainer | StructureStorage | StructureLink | StructureTerminal | StructureLab;

    primaryColor: ColorConstant;

    secondaryColor: ColorConstant;

    flagResource: ResourceConstant;

    limit: Number;
    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

     //   this.unit.log("storing to" +this.target.structureType+ ". "+this.flagResource+"\ncreep store:"+JSON.stringify(this.unit.creep.store));
        var actionCode = this.unit.creep.transfer(this.target, this.flagResource);

        return this.WorkCodeProcessing(actionCode);
    }



    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.getUsedCapacity() == 0) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
    {

        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<StructureContainer | StructureStorage | StructureLink | StructureTerminal | StructureLab>);
        }
        if (this.target != null)
        {
            var flag = this.target.pos.lookFor<"flag">("flag")[0] as Flag;
            if (flag != null)
            {

                this.flagResource = Utils.GetFlagResourceConstant(flag.name);
                if (this.flagResource == null) this.flagResource = Utils.GetResourceInStore(this.unit.creep.store);
                if (this.target.store.getFreeCapacity(this.flagResource) > 0 && this.target.store.getUsedCapacity(this.flagResource) < this.limit)
                {

                    return; //Target is valid
                }
            }

        }

        this.target = this.FlagSearch();

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }


    private FlagSearch(): StructureContainer | StructureStorage | StructureLink | StructureTerminal | StructureLab
    {

        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            if (typeof flag.room === 'undefined') continue;
            if (!Utils.BelongsToThisRoom(flagName, this.unit.memory.originRoom)) continue;
            if (flag.color == this.primaryColor && flag.secondaryColor == this.secondaryColor)
            {
                var found = flag.pos.lookFor<"structure">("structure")[0] as StructureContainer | StructureStorage | StructureLink | StructureTerminal | StructureLab;
                if (found != null)
                {

                    this.flagResource = Utils.GetFlagResourceConstant(flagName);
                    if (this.flagResource == null) this.flagResource = Utils.GetResourceInStore(this.unit.creep.store);
                    if ((found.store.getFreeCapacity(this.flagResource) > 0) && found.store.getUsedCapacity(this.flagResource) < this.limit)
                    {
                        return found;
                    }
                }
            }
        }
        return null;
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say("📥");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.StopCreepAct;
            default:
                this.unit.log("Problem occured. StoreToFlag error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }


    //#region  factory
    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
    }

    WithColors(primaryColor: ColorConstant, secondaryColor: ColorConstant): ActionStoreToFlag
    {
        this.primaryColor = primaryColor;
        this.secondaryColor = secondaryColor;
        this.limit = Number.MAX_SAFE_INTEGER;
        return this;
    }

    Limit(ammount: number): ActionStoreToFlag
    {
        this.limit = ammount;
        return this;
    }


    //#endregion
}
