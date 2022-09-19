import { AssignableFlagMemory } from "./Memory/AssignableFlagMemory";

export class AssignableFlag
{
    flag: Flag;

    constructor(flag: Flag)
    {
        this.flag = flag;
        if (typeof this.memory.assignedCreeps === 'undefined') this.memory.assignedCreeps = [];
    }

    get memory(): AssignableFlagMemory
    {
        return this.flag.memory as AssignableFlagMemory;
    }

    set memory(memory: AssignableFlagMemory)
    {
        this.flag.memory = memory;
    }

  public  isAssigned(creepId: string): boolean
    {
        return creepId in this.memory.assignedCreeps
    }

    public  Assign(creepId: string)
    {
        this.memory.assignedCreeps.push(creepId);
    }

    public  Release(creepId: string)
    {
        this.memory.assignedCreeps = this.memory.assignedCreeps.filter(data => data != creepId);
    }

    public CompareColors(primaryColor:ColorConstant,secondaryColor:ColorConstant)
    {
        return this.flag.color==primaryColor&&this.flag.secondaryColor==secondaryColor;
    }

}
