import { Constants } from "Constans";
import { filter } from "lodash";
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

    private allowEmptyStart: boolean;

    private priorityStructure: StructureConstant;
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
        if (this.unit.creep.store.energy == 0 && !this.allowEmptyStart) return ActionResponseCode.NextTask;
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

        if (this.priorityStructure != null)
            this.target = this.unit.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES, { filter: (site) => { return site.structureType == this.priorityStructure } });

        if (this.target == null)
        {
            if (this.globalSearch)
            {
                if (this.unit.creep.room.name != this.unit.memory.originRoom)
                    this.target = this.unit.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                else
                {
                    for (var siteName in Game.constructionSites)
                    {
                        var site = Game.constructionSites[siteName];
                        if (typeof site.room.controller !== 'undefined')
                        {
                            if (site.room.controller.level > Constants.ExpiditorMaxHelpLevel) continue;
                            if (site.room.name == this.unit.memory.originRoom) continue;
                        }
                        if (site.pos.findPathTo(this.unit.creep).length > this.unit.creep.ticksToLive * 2) continue;
                        this.target = site;
                    }
                }
            }
            else
            {
                this.target = this.unit.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
            }
        }
        if (this.target == null && !this.globalSearch)
            this.target = this.unit.creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);



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
                this.unit.log("Problem occured. Build error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }
    //#region  factory

    constructor(unit: Unit)
    {
        this.unit = unit as BaseCreep;
        this.globalSearch = false;
        this.allowEmptyStart = false;
        this.priorityStructure = null;
    }
    GlobalSearch(): ActionBuild
    {
        this.globalSearch = true;
        return this;
    }
    AllowEmptyTry(): ActionBuild
    {
        this.allowEmptyStart = true;
        return this;
    }

    PriorityStructure(structure: StructureConstant): ActionBuild
    {
        this.priorityStructure = structure;
        return this;
    }
    //#endregion

}
