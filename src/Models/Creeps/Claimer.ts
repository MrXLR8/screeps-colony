import { ActionClaim } from "Logic/Actions/Basic/ActionClaim";
import { ActionMoveFlag } from "Logic/Actions/Basic/ActionMoveFlag";
import { IAction } from "Logic/Actions/IAction";
import { Finder } from "Logic/Finder";
import { AssignableFlag } from "Models/AssignableFlag";
import { AssignableFlagMemory } from "Models/Memory/AssignableFlagMemory";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseCreep } from "./BaseCreep";

export class ClaimerCreep extends BaseCreep
{

    tasks: IAction[] =
        [
            new ActionMoveFlag(this, COLOR_RED, COLOR_WHITE, 1, false),
            new ActionClaim(this)
        ];


    static SpawnCondition(): boolean
    {
        console.log("spawn condition");
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            var assFalg = new AssignableFlag(flag);
            if (!assFalg.CompareColors(COLOR_RED, COLOR_WHITE)) continue;
            if (assFalg.assignedAmmount < 1) return true;
        }
        console.log("spawn condition is false");
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
