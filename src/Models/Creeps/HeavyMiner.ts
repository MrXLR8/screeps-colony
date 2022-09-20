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

export class HeavyMinerMemory extends BaseCreepMemory
{
    minerStatus: number = 0;
    flagName: string;
    flagX: number = null;
    flagY: number = null;

}

export class HeavyMinerCreep extends BaseCreep
{

    //tasks = [this.ActHeavyMining, this.ActOneRangeStorage, this.ActDrop];

    tasks: IAction[] =
        [
            new ActionMoveFlag(this, COLOR_YELLOW, COLOR_YELLOW, 1),
            new ActionMining(this, true),
            new ActionStore(this,[STRUCTURE_CONTAINER,STRUCTURE_STORAGE,STRUCTURE_LINK],RESOURCE_ENERGY, 2)
        ];
    static Dispose(_mem: CreepMemory)
    {
        var mem = _mem as HeavyMinerMemory;
        var flag = Game.flags[mem.flagName];

        if (!flag) return;

        console.log("Disposing heavy miner. " + flag.name);

        var flagObj = new AssignableFlag(flag);
        flagObj.ReleaseDead();
    }
}

