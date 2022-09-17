import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";
import { Unit } from "Models/Unit";


export enum StructureTypes
{
    Spawner,
    Tower
}

export abstract class BaseStructure extends Unit
{
//todo dispose memory
    public structure: Structure;

    constructor(_structure: Structure)
    {
        super();
        this.structure = _structure;
    }
    get memory():  BaseStructureMemory
    {
        return (Memory as GlobalMemory).structures[this.structure.id];
    }
    set memory(memory:BaseStructureMemory)
    {
        (Memory as GlobalMemory).structures[this.structure.id]=memory;
    }
    static GetStructureType(structure: Structure): StructureTypes
    {
        var mem: BaseStructureMemory = (Memory as GlobalMemory).structures[structure.id] as BaseStructureMemory;
        return mem.Type;
    }

    log(message: string)
    {
        console.log(this.structure.id + " (task:" + this.memory.taskNumber + ", target: " + this.memory.targetID + ")" + ":\n" + message);
    }


}
