import { AssignableFlagMemory } from "./Memory/AssignableFlagMemory";

export class AssignableFlag
{
    flag: Flag;


    static FindFlag(primaryColor: ColorConstant, secondaryColor: ColorConstant, maxAssigned: number): AssignableFlag
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if (!assFalg.CompareColors(primaryColor, secondaryColor)) continue;

            if (assFalg.assignedAmmount < maxAssigned)
                return assFalg;

        }
        return null;
    }


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

    get assignedAmmount(): number
    {
        return this.memory.assignedCreeps.length;
    }

    public isAssigned(creepId: string): boolean
    {
        return this.memory.assignedCreeps.includes(creepId)
    }

    public Assign(creepId: string)
    {

        console.log("assigning to the flag " + this.flag.name + " next creep: " + creepId + " count: " + this.memory.assignedCreeps.length);
        this.memory.assignedCreeps.push(creepId);
    }

    public TryToAssign(creepId: string, maxAmmount: number): boolean
    {
        if (this.isAssigned(creepId)) return true;
        if (this.assignedAmmount >= maxAmmount) return false;
        return true;
    }

    public Release(creepId: string)
    {
        this.memory.assignedCreeps = this.memory.assignedCreeps.filter(data => data != creepId);
    }

    public ReleaseDead()
    {
        for (var creepId of this.memory.assignedCreeps)
        {
            var found = Game.getObjectById<Id<Creep>>(creepId as Id<Creep>);
            if (found == null) this.Release(creepId);
        }
    }


    public CompareColors(primaryColor: ColorConstant, secondaryColor: ColorConstant)
    {
        return this.flag.color == primaryColor && this.flag.secondaryColor == secondaryColor;
    }

}
