import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionBuild implements IAction
{
    unit: BaseCreep;
    private target: ConstructionSite;

    private globalSearch: boolean;


    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode = this.unit.creep.build(this.target);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if (this.unit.creep.store.energy == 0) return ActionResponseCode.NextTask;
        return null;
    }

    private GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId != null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<ConstructionSite>);
        }
        if (this.target != null)
            return; //Target is valid

        this.target = this.unit.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);

        if ((this.target == null) && this.globalSearch)
        {
            for (var siteName in Game.constructionSites)
            {
                var site = Game.constructionSites[siteName];
                if (site.pos.findPathTo(this.unit.creep).length > this.unit.creep.ticksToLive * 2) continue;
                this.target=site;
            }
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
            case ERR_NOT_IN_RANGE:
                this.unit.MoveToTarget(this.target);
                this.unit.creep.say("🏗️");
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Repair error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }
    //#region  factory

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.globalSearch = false;
    }
    GlobalSearch():ActionBuild
    {
        this.globalSearch = true;
        return this;
    }
    //#endregion

}
