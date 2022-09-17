import { Finder } from "Logic/Finder";
import { Constants } from "Constans";
import { WorkerCreep } from "./WorkerCreep";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { Utils } from "Logic/Utils";


export class UniversalCreep extends WorkerCreep
{

    tasks =  [this.ActGathering,this.ActMining,this.ActStoreExtensionTower,this.ActRepairing,this.ActBuilding,this.ActUpgrading];

    private ActStoreExtensionTower():ActionResponseCode
    {

        if(this.creep.store.energy==0) return ActionResponseCode.Reset;
        var storage: Structure = Finder.GetEmptyTower(this.creep.pos);
        if (storage == null)
        {
            storage = Finder.GetEmptyExtension(this.creep.pos);
        }
        if (storage == null)
        {
            storage = Finder.GetNotFullTower(this.creep.pos);
        }
        if (storage == null)
        {

            return ActionResponseCode.NextTask;
        }
        var actionCode = this.creep.transfer(storage, RESOURCE_ENERGY);

        switch (actionCode)
        {
            case ERR_NOT_IN_RANGE:
            {
                this.MoveToTarget(storage);
                this.creep.say(">📥");
                return ActionResponseCode.Repeat;
            }
            case ERR_NOT_ENOUGH_RESOURCES:
                {
                    return ActionResponseCode.Reset;
                }
            default:
                this.creep.say("📥");
                return ActionResponseCode.Repeat;
        }

    }

    private ActRepairing(): ActionResponseCode
    {

        this.creep.say("🔧");

        var target: Structure=this.GetTarget() as Structure;

        if (target == null)
        {
            target = Finder.GetClosestDamagedStructures(this.creep.pos);
            if (target == null)
            {
                return ActionResponseCode.NextTask;
            }
           this.memory.targetID=target.id;
        }

        if (Utils.CalculatePercentOfHP(target) > 99)
        {
            this.memory.targetID=null;
            return ActionResponseCode.Repeat;
        }

        var code: CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES = this.creep.repair(target);
        switch (code)
        {
            case (ERR_NOT_IN_RANGE):
                {
                    this.MoveToTarget(target);
                    this.memory.actionAttempts++;
                    if(this.memory.actionAttempts>Constants.moveAttmepts)
                    {
                        this.memory.targetID=null;
                        this.memory.actionAttempts=0;
                    }
                    return ActionResponseCode.Repeat;
                }
            case (ERR_NOT_ENOUGH_RESOURCES):
                {
                    return ActionResponseCode.Reset;
                }
                case (ERR_INVALID_TARGET):
                    {
                        this.memory.targetID=null;
                        this.memory.actionAttempts=0;
                        return ActionResponseCode.Repeat;
                    }
        }
        return ActionResponseCode.Repeat;
    }

    private ActBuilding(): ActionResponseCode
    {
        this.creep.say("🏗️");

       var target:ConstructionSite =this.GetTarget() as ConstructionSite;

        if (target == null)
        {
            var target: ConstructionSite = Finder.GetConstructionSites(this.creep.pos);
            if (target == null)
            {
                return ActionResponseCode.NextTask;
            }
            this.memory.targetID = target.id;
        }

        var code: CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH = this.creep.build(target);
        switch (code)
        {
            case (ERR_NOT_IN_RANGE):
                {
                    this.MoveToTarget(target);
                    this.memory.actionAttempts++;
                    if(this.memory.actionAttempts>Constants.moveAttmepts)
                    {
                        this.memory.targetID=null;
                        this.memory.actionAttempts=0;
                    }
                    return ActionResponseCode.Repeat;
                }
            case (ERR_NOT_ENOUGH_RESOURCES):
                {
                    return ActionResponseCode.Reset;
                }
            case(ERR_INVALID_TARGET):
            {
                this.memory.targetID=null;
                this.memory.actionAttempts=0;
                return ActionResponseCode.Repeat;
            }
        }
        return ActionResponseCode.Repeat;
    }

}

