import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Finder } from "Logic/Finder";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { ActionMoveFlag } from "Logic/Actions/Basic/ActionMoveFlag";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { AssignableFlagMemory } from "Models/Memory/AssignableFlagMemory";
import { AssignableFlag } from "Models/AssignableFlag";
import { IAction } from "Logic/Actions/IAction";


export class HeavyMinerCreep extends BaseCreep
{

    //tasks = [this.ActHeavyMining, this.ActOneRangeStorage, this.ActDrop];

    tasks: IAction[] =
        [
            new ActionMoveFlag(this, COLOR_YELLOW, COLOR_YELLOW, 1, false),
            new ActionMining(this, true),
            new ActionStore(this, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_LINK], RESOURCE_ENERGY, 2)
        ];


    static SpawnCondition(): boolean
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if (!assFalg.CompareColors(COLOR_YELLOW, COLOR_YELLOW)) continue;
            if (assFalg.assignedAmmount < 1) return true;
        }
        return false;
    }
    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as BaseCreepMemory;
        var flag = Game.flags[mem.assignedTo];

        if (!flag) return;

        console.log("Disposing heavy miner. " + flag.name);

        var flagObj = new AssignableFlag(flag);
        flagObj.ReleaseDead();
    }
}

