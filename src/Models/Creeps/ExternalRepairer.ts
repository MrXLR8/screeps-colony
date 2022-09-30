import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { Finder } from "Logic/Finder";


export class ExternalRepairer extends BaseCreep
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, WORK, WORK, CARRY, CARRY] //400
        ];

    static repairTargets = [STRUCTURE_CONTAINER, STRUCTURE_ROAD];
    tasks: IAction[] =
        [
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]),
            new ActionMining(this).FindRandomSource(),
            new ActionRepair(this).Structures(ExternalRepairer.repairTargets).GlobalSearch().RepeatToEnd()
        ];



    static LookForRoomWithDamages(): Room
    {

        for (var roomName in Game.rooms)
        {
            var room = Game.rooms[roomName];

            if (room == null) continue;
            if (Finder.GetDamagedStructures(room, ExternalRepairer.repairTargets)[0] != null)
            {
                return room;
            }

        }
        return null;
    }


    static SpawnCondition(): boolean
    {
        return this.LookForRoomWithDamages() != null;
    }
}

