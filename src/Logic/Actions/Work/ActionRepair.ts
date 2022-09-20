import { Constants } from "Constans";
import { random } from "lodash";
import { Finder } from "Logic/Finder";
import { UnitFactory } from "Logic/UnitFactory";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Tower } from "Models/Structures/Tower";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionRepair implements IAction
{
    unit: BaseCreep | Tower;
    target: Structure;

    room: Room;
    energyStored: number;
    energyPercent: number;
    towerReserves: number;
    byRandom: boolean;
    whatToRepair: StructureConstant[];
    constructor(unit: Unit, whatToRepair: StructureConstant[], byRandom: boolean, towerReserves?: number)
    {
        this.whatToRepair = whatToRepair;
        this.byRandom = byRandom;
        if (this.unit instanceof BaseCreep)
        {
            this.unit = unit as BaseCreep;
            this.room = this.unit.creep.room;
            this.energyStored = this.unit.creep.store[RESOURCE_ENERGY];
        }
        else
        {
            this.unit = unit as Tower;
            this.room = this.unit.structure.room;
            this.towerReserves = towerReserves;
            this.energyStored = this.unit.structure.store[RESOURCE_ENERGY];
            this.energyPercent = Utils.Percent(this.energyStored, this.unit.structure.store.getCapacity(RESOURCE_ENERGY));
        }
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        var actionCode;

        if (this.unit instanceof BaseCreep)
        {
            actionCode = this.unit.creep.repair(this.target);
        }
        else
        {
            actionCode = this.unit.structure.repair(this.target);
        }
        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (!(this.unit instanceof BaseCreep))
        {
            if (this.energyPercent < this.towerReserves)
            {
                return ActionResponseCode.NextTask
            }
        }
        if (this.energyStored == 0) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var targetId = this.unit.targetId;
        if (targetId == null)
        {
            this.target = Game.getObjectById(this.unit.targetId as Id<Structure>);
        }
        if (this.target != null)
        {
            if (this.target.hits != this.target.hitsMax)
            {
                return; //Target is valid
            }
        }

        var arrayOfTargets = Finder.GetDamagedStructures(this.room, this.whatToRepair);

        if (this.byRandom)
        {
            this.target = arrayOfTargets[random(0, arrayOfTargets.length - 1)];
        }
        else
        {
            this.target = arrayOfTargets.sort((a, b) => { return a.hits - b.hits })[0];
        }

        if (this.target != null)
        {
            this.unit.targetId = this.target.id;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode | CreepActionReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                if (this.unit instanceof BaseCreep)
                {
                    this.unit.MoveToTarget(this.target);
                    this.unit.creep.say(">🔧");
                }
                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                if (this.unit instanceof BaseCreep)
                {
                    this.unit.creep.say("🔧");
                }
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Repair error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    RepeatAction(): boolean
    {
        throw ("Not implemented");
    }
}
