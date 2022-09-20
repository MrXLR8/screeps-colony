import { IAction } from "Logic/Actions/IAction";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { Unit } from "Models/Unit";
import { BaseCreepMemory } from "../Memory/BaseCreepMemory";

export enum CreepTypes
{
    UniversalCreep,
    HeavyMiner,
    Courier
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

    MoveToTarget(targetObj: RoomObject):  CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
    {
        return this.MoveToPos(targetObj.pos)
    }

    MoveToPos(targetPos: RoomPosition): CreepMoveReturnCode | ERR_NO_PATH | ERR_INVALID_TARGET | ERR_NOT_FOUND
    {
        if(this.memory.actions.moved) return ERR_TIRED;
        this.memory.actions.moved=true;
        return this.creep.moveTo(targetPos, { visualizePathStyle: { stroke: '#ffffff' } });
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

