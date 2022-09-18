import { ActionResponseCode } from "Models/ActionResponseCode";
import { Unit } from "Models/Unit";
import { BaseCreepMemory } from "../Memory/BaseCreepMemory";

export enum CreepTypes
{
    UniversalCreep,
    HeavyMiner
}

export abstract class BaseCreep extends Unit
{
    public creep: Creep;

    protected tasks: (() => ActionResponseCode)[];

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

    MoveToTarget(targetObj: RoomObject): boolean
    {
        return this.MoveToPos(targetObj.pos)
    }

    MoveToPos(targetPos: RoomPosition): boolean
    {
        if(this.memory.actions.moved) return false;
        if (this.creep.moveTo(targetPos, { visualizePathStyle: { stroke: '#ffffff' } }) == ERR_NO_PATH)
        {
            return false;
        }
        this.memory.actions.moved=true;
        return true;
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
        console.log(this.creep.name + " (task:" + this.memory.taskNumber + ", target: " + this.memory.targetID + ")" + ":\n" + message);
    }
}

