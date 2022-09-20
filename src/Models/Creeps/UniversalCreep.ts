import { Finder } from "Logic/Finder";
import { Constants } from "Constans";
import { WorkerCreep } from "./WorkerCreep";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { Utils } from "Logic/Utils";


export class UniversalCreep extends WorkerCreep
{

    //tasks = [this.ActGathering, this.ActMining, this.ActFillEmptyTower, this.ActStoreExtension, this.ActRepairing, this.ActFillTower, this.ActBuilding,this.ActUpgrading];


    private FillTower(searchMethod: (pos: RoomPosition, ignoreId?: Id<StructureTower>) => StructureTower): ActionResponseCode
    {
        if (this.creep.store.energy == 0) return ActionResponseCode.ResetThisTick;

        var tower: StructureTower = this.GetTarget(
            () => searchMethod.call(this, this.creep.pos),
            (target) => { return target.store.getFreeCapacity(RESOURCE_ENERGY) > 0 }
        );

        if (tower == null)
        {
            return ActionResponseCode.NextTask;
        }
        var actionCode = this.creep.transfer(tower, RESOURCE_ENERGY);

        switch (actionCode)
        {
            case ERR_NOT_IN_RANGE:
                {
                    this.MoveToTarget(tower);
                    this.creep.say(">🗼");
                    return ActionResponseCode.Repeat;
                }
            case ERR_NOT_ENOUGH_RESOURCES:
                {
                    return ActionResponseCode.Reset;
                }

            case OK:
                {
                    this.memory.actions.worked=true;
                    this.creep.say("🗼");
                    if(this.creep.store.energy == 0) return ActionResponseCode.Reset;
                    var nextTarget = searchMethod.call(this, this.creep.pos, this.memory.targetID as Id<StructureTower>);
                    if (nextTarget == null) return ActionResponseCode.NextTask;
                    this.memory.targetID = nextTarget.id;
                    this.memory.actionAttempts = 0;
                    this.MoveToTarget(nextTarget);
                    return ActionResponseCode.Repeat;
                }
            default:

                return ActionResponseCode.Repeat;
        }
    }

    private ActFillEmptyTower()
    {
        return this.FillTower(Finder.GetEmptyTower);
    }

    private ActFillTower()
    {
        return this.FillTower(Finder.GetNotFullTower);
    }

    private ActStoreExtension(): ActionResponseCode
    {
        if (this.creep.store.energy == 0) return ActionResponseCode.Reset;

        var storage: Structure = this.GetTarget(
            () => Finder.GetEmptyExtension(this.creep.pos),
            (target) => { return (target as StructureExtension | StructureSpawn).store.getFreeCapacity(RESOURCE_ENERGY) > 0 }
        );

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
            case OK:
                {
                    this.memory.actions.worked=true;
                    if(this.creep.store.energy == 0) return ActionResponseCode.Reset;
                    var nextTarget = Finder.GetEmptyExtension(this.creep.pos, this.memory.targetID as Id<Structure>);
                    if (nextTarget == null) return ActionResponseCode.NextTask;
                    this.memory.targetID = nextTarget.id;
                    this.memory.actionAttempts = 0;
                    this.MoveToTarget(nextTarget);
                    return ActionResponseCode.Repeat;
                }
            default:
                this.creep.say("📥");
                return ActionResponseCode.Repeat;
        }
    }

    private ActRepairing(): ActionResponseCode
    {
        this.creep.say("🔧");

        var target: OwnedStructure = this.GetTarget<OwnedStructure>(
            () => Finder.GetDamagedStructures(this.creep.pos),
            (target) => { return target.hits != target.hitsMax }
        );

        if (target == null)
        {
            return ActionResponseCode.NextTask;
        }

        if (Utils.CalculatePercentOfHP(target) > 99)
        {
            this.memory.targetID = null;
            return ActionResponseCode.Repeat;
        }

        var code: CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES = this.creep.repair(target);
        switch (code)
        {
            case (ERR_NOT_IN_RANGE):
                {
                    this.MoveToTarget(target);
                    this.memory.actionAttempts++;
                    if (this.memory.actionAttempts > Constants.moveAttmepts)
                    {
                        this.memory.targetID = null;
                        this.memory.actionAttempts = 0;
                    }
                    return ActionResponseCode.Repeat;
                }
            case (ERR_NOT_ENOUGH_RESOURCES):
                {
                    return ActionResponseCode.Reset;
                }
            case (ERR_INVALID_TARGET):
                {
                    this.memory.targetID = null;
                    this.memory.actionAttempts = 0;
                    return ActionResponseCode.Repeat;
                }
            case (OK):
                {
                    this.memory.actions.worked=true;
                    var nextTarget = Finder.GetDamagedStructures(this.creep.pos, this.memory.targetID as Id<Structure>);
                    if (nextTarget == null) return ActionResponseCode.NextTask;
                    this.memory.targetID = nextTarget.id;
                    this.memory.actionAttempts = 0;
                    return ActionResponseCode.RepeatThisTick;
                }
        }
        return ActionResponseCode.Repeat;
    }

    private ActBuilding(): ActionResponseCode
    {


        var target: ConstructionSite = this.GetTarget<ConstructionSite>(() => Finder.GetConstructionSites(this.creep.pos));

        if (target == null)
        {
            return ActionResponseCode.NextTask;
        }

        var code: CreepActionReturnCode | ERR_NOT_ENOUGH_RESOURCES | ERR_RCL_NOT_ENOUGH = this.creep.build(target);
        switch (code)
        {
            case (ERR_NOT_IN_RANGE):
                {
                    this.creep.say(">🏗️");
                    this.MoveToTarget(target);
                    this.memory.actionAttempts++;
                    if (this.memory.actionAttempts > Constants.moveAttmepts)
                    {
                        this.memory.targetID = null;
                        this.memory.actionAttempts = 0;
                    }
                    return ActionResponseCode.Repeat;
                }
            case (ERR_NOT_ENOUGH_RESOURCES):
                {
                    return ActionResponseCode.Reset;
                }
            case (ERR_INVALID_TARGET):
                {
                    this.memory.targetID = null;
                    this.memory.actionAttempts = 0;
                    return ActionResponseCode.Repeat;
                }
            case (OK):
                {
                    this.creep.say("🏗️");
                    this.memory.actions.worked=true;
                    return ActionResponseCode.Repeat;
                }
        }
        return ActionResponseCode.Repeat;
    }
}

