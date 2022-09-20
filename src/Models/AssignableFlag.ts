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

    get assignedAmmount() :number
    {
        return this.memory.assignedCreeps.length;
    }

  public  isAssigned(creepId: string): boolean
    {
        return this.memory.assignedCreeps.includes(creepId)
    }

    public  Assign(creepId: string)
    {
        this.memory.assignedCreeps.push(creepId);
    }

    public  Release(creepId: string)
    {
        this.memory.assignedCreeps = this.memory.assignedCreeps.filter(data => data != creepId);
    }

    public ReleaseDead()
    {
        for(var creepId in this.memory.assignedCreeps)
        {
            var found = Game.getObjectById<Id<Creep>>(creepId as Id<Creep>);
            if(found==null) this.Release(creepId);
        }
    }


    public CompareColors(primaryColor:ColorConstant,secondaryColor:ColorConstant)
    {
        return this.flag.color==primaryColor&&this.flag.secondaryColor==secondaryColor;
    }

}
