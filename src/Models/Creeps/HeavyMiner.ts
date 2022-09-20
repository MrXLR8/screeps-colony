import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Finder } from "Logic/Finder";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { HeavyMinerFlagMemory } from "Models/Memory/HeavyMinerFlagMemory";
import { ActionResponseCode } from "Models/ActionResponseCode";

export class HeavyMinerMemory extends BaseCreepMemory
{
    minerStatus: number = 0;
    flagName: string;
    flagX: number = null;
    flagY: number = null;

}

export class HeavyMinerCreep extends BaseCreep
{

    tasks = [this.ActHeavyMining, this.ActOneRangeStorage, this.ActDrop];

    static Dispose(_mem: CreepMemory)
    {

        var mem = _mem as HeavyMinerMemory;
        var flag = Game.flags[mem.flagName];

        if (!flag) return;

        console.log("Disposing heavy miner. " + flag.name);

        var flagMem = flag.memory as HeavyMinerFlagMemory;
        flagMem.assignedHvyMinerId = null;
        flag.memory = flagMem;
    }

    private FlagAssign(): Source
    {
        var creepMem: HeavyMinerMemory = this.creep.memory as HeavyMinerMemory;

        if (creepMem.flagX != null && creepMem.flagY != null)
        {
            return Game.getObjectById(creepMem.targetID as Id<Source>);
        }
        for (const flagName in Game.flags) //filter this room
        {
            var flag = Game.flags[flagName];
            if (flag.room != this.creep.room || !flagName.startsWith("HeavySpot")) continue;

            var flagMem = flag.memory as HeavyMinerFlagMemory;

            if (flagMem.assignedHvyMinerId == null || flagMem.assignedHvyMinerId == undefined)
            {
                flagMem = new HeavyMinerFlagMemory();
                flagMem.assignedHvyMinerId = this.creep.id.toString();
                flag.memory = flagMem;
                creepMem.flagX = flag.pos.x;
                creepMem.flagY = flag.pos.y;
                creepMem.flagName = flag.name;
                var target = Finder.GetClosestSource(new RoomPosition(flag.pos.x, flag.pos.y, this.creep.room.name));
                creepMem.targetID = target.id;
                return target;
            }
        }

        console.log("No free flag found!");
        return null;
    }

    static FlagClean(currentRoom: Room)
    {
        var rightFlags = _.filter(Game.flags, function (o) { return o.room == currentRoom && o.name.startsWith("HeavySpot"); })
        for (const name in rightFlags)
        {
            var flag = Game.flags[name];
            var mem = flag.memory as HeavyMinerFlagMemory;
            var id = mem.assignedHvyMinerId;
            if (id != null)
            {
                var foundCreep = Game.getObjectById<Creep>(id as Id<Creep>);
                if (foundCreep == null)
                {
                    mem.assignedHvyMinerId = null;
                    flag.memory = mem;
                }
            }
        }
    }


    private ActHeavyMining(): ActionResponseCode
    {
        if (this.creep.store.getFreeCapacity() == 0) return ActionResponseCode.NextTaskPreserveTarget;
        var target: Source = this.GetTarget<Source>(this.FlagAssign);

        if(target==null)
        {
            this.creep.say("!🚩");
            return ActionResponseCode.Repeat;
        }

        var mem: HeavyMinerMemory = this.creep.memory as HeavyMinerMemory;
        var flagPos: RoomPosition;
        flagPos = new RoomPosition(mem.flagX, mem.flagY, this.creep.room.name);

        if (!this.creep.pos.isEqualTo(flagPos.x, flagPos.y))
        {
            this.MoveToPos(flagPos);
            this.creep.say(">⛏️");
        }
        else
        {
            this.creep.harvest(target);
            this.creep.say("⛏️");
        }
        return ActionResponseCode.Repeat;
    }

    private ActOneRangeStorage(): ActionResponseCode
    {
        var container = Finder.GetOneRangeContrainer(this.creep.pos);
        if (container == null)
        {
            return ActionResponseCode.NextTaskPreserveTarget;
        }
        if (this.creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
        {
            this.MoveToTarget(container);
            this.creep.say(">📥");
            return ActionResponseCode.Repeat;
        }
        this.creep.say("📥");
        return ActionResponseCode.ResetPreserveTarget;
    }

    private ActDrop(): ActionResponseCode
    {
        this.creep.say("⤵️");
        this.creep.drop(RESOURCE_ENERGY);
        return ActionResponseCode.ResetPreserveTarget;
    }
}

