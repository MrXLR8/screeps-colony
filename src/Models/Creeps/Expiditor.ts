import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { IAction } from "Logic/Actions/IAction";

export class ExpiditorCreep extends BaseCreep
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]//1800
        ];

    tasks: IAction[] =
        [
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE]),
            new ActionMining(this),
            new ActionBuild(this).PriorityStructure(STRUCTURE_SPAWN).GlobalSearch(),

        ];

    static SpawnCondition(room: Room): boolean
    {
        //return false;
        return ExpiditorCreep.LookForRoomWithConstructionSites() != null;
    }



    static LookForRoomWithConstructionSites(): Room
    {
        for (var roomName in Game.rooms)
        {
            var room = Game.rooms[roomName];

            if (room == null) continue;
            if (room.find(FIND_MY_CONSTRUCTION_SITES)[0] != null)
            {
                return room;
            }

        }
        return null;
    }


}

