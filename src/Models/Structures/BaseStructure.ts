import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";
import { Unit } from "Models/Unit";


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


    log(message: string)
    {
        console.log(this.structure.id + " (task:" + this.memory.taskNumber + ", target: " + this.memory.targetID + ")" + ":\n" + message);
    }


}
