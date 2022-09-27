import { Constants } from "Constans";
import { random } from "lodash";
import { Finder } from "Logic/Finder";
import { UnitFactory } from "Logic/UnitFactory";
import { Utils } from "Logic/Utils";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { UniversalCreep } from "Models/Creeps/Universal";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { Tower } from "Models/Structures/Tower";
import { Unit } from "Models/Unit";
import { IAction } from "../IAction";

export class ActionRepair implements IAction
{
    unit: BaseCreep | Tower;
    target: Structure;

    room: Room;

    roomMinumumEnergy: number;
    energyStored: number;
    energyPercent: number;
    towerReserves: number;
    byRandom: boolean;

    keepTask: boolean;
    whatToRepair: StructureConstant[];

    Act(): ActionResponseCode
    {
        var test = this.unit as BaseStructure;
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;
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

    private EntryValidation(): ActionResponseCode
    {
        if (typeof this.room.storage !== 'undefined')
        {
            if (this.room.storage.store[RESOURCE_ENERGY] < this.roomMinumumEnergy) return ActionResponseCode.NextTask;
        }
        else
        {
            return ActionResponseCode.NextTask;
        }
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

    private GetSavedTarget(): void
    {

        var targetId = this.unit.targetId;
        if (targetId != null)
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

    private WorkCodeProcessing(code: ScreepsReturnCode | CreepActionReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case ERR_NOT_IN_RANGE:
                if (this.unit instanceof BaseCreep)
                {
                    this.unit.MoveToTarget(this.target);
                    this.unit.creep.say("🔧");
                }

                return ActionResponseCode.Repeat;
            case OK:
                this.unit.memory.actions.worked = true;
                if (!this.keepTask) return ActionResponseCode.Reset;
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Repair error code: " + code);
                return ActionResponseCode.NextTask;
        }
    }

    //#region factory
    constructor(unit: Unit)
    {

        this.byRandom = false;
        this.keepTask = false;
        this.towerReserves = 0;
        this.roomMinumumEnergy = 0;
        if (unit instanceof BaseCreep)
        {
            this.unit = unit as BaseCreep;
            this.room = this.unit.creep.room;
            this.energyStored = this.unit.creep.store[RESOURCE_ENERGY];
        }
        else if (unit instanceof BaseStructure)
        {
            this.unit = unit as Tower;
            this.room = this.unit.structure.room;
            this.energyStored = this.unit.structure.store[RESOURCE_ENERGY];
            this.energyPercent = Utils.Percent(this.energyStored, this.unit.structure.store.getCapacity(RESOURCE_ENERGY));
        }
        else { console.log("UNKNOWN INSTANCE"); }
    }

    Structures(whatToRepair: StructureConstant[]): ActionRepair
    {
        this.whatToRepair = whatToRepair;
        return this;
    }

    ChooseRandomly(): ActionRepair
    {
        this.byRandom = true;
        return this;
    }

    RepeatToEnd(): ActionRepair
    {
        this.keepTask = true;
        return this;
    }

    EnergyReserves(towerReserves: number): ActionRepair
    {
        this.towerReserves = towerReserves;
        return this;
    }

    RoomMinumumEnergy(min: number): ActionRepair
    {
        this.roomMinumumEnergy = min;
        return this;
    }

    //#endregion
}
