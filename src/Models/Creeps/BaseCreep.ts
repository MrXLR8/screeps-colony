import { IAction } from "Logic/Actions/IAction";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { Unit } from "Models/Unit";
import { BaseCreepMemory } from "../Memory/BaseCreepMemory";
import { Traveler } from "../../../Traveler/Traveler";
export enum CreepTypes
{
    UniversalCreep,
    HeavyMiner,
    Courier,
    Claimer,
    ExpeditorCreep,
    Upgrader,
    ExternalHeavyMiner,
    ExternalHauler,
    Scout,
    ExternalRepairer,
    ExternalAttacker
}

export abstract class BaseCreep extends Unit
{

    public creep: Creep;

    protected tasks: IAction[];

    constructor(_creep: Creep)
    {
        super();
        this.creep = _creep;
    }

    get memory(): BaseCreepMemory
    {
        return this.creep.memory as BaseCreepMemory;
    }

    set memory(memory: BaseCreepMemory)
    {
        this.creep.memory = memory;
    }

    MoveToTarget(targetObj: RoomObject,ops?: TravelToOptions): number
    {
        return this.MoveToPos(targetObj.pos,ops)
    }

    MoveToPos(targetPos: RoomPosition,ops?: TravelToOptions): number
    {
        if (this.memory.actions.moved) return ERR_TIRED;
        this.memory.actions.moved = true;
        return Traveler.travelTo(this.creep,targetPos, ops);
    }

    AmmountCanCarry(): number
    {
        return (this.creep.getActiveBodyparts(CARRY) * 50) - this.creep.store.getUsedCapacity();
    }


    static GetCreepType(creep: Creep): CreepTypes
    {
        var mem: BaseCreepMemory = creep.memory as BaseCreepMemory;
        return mem.Role;
    }

    static GetCreepTypeFromMemory(memory: CreepMemory): CreepTypes
    {
        var mem: BaseCreepMemory = memory as BaseCreepMemory;
        return mem.Role;
    }

    log(message: string)
    {
        console.log(this.creep.name + " (task:" + this.memory.taskNumber + ", target: " + this.memory.targetID + ", room: "+this.creep.room.name+")" + ":\n" + message);
    }
}

