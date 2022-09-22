import { ActionGather } from "Logic/Actions/Carry/ActionGather";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { Constants } from "Constans";
import { ActionMoveToRoom } from "Logic/Actions/Basic/ActionMoveToRoom";

export class ExpiditorCreep extends BaseCreep
{


    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], //700
            [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY], //500
            [MOVE, MOVE, WORK, WORK, CARRY, CARRY], //400
            [MOVE, MOVE, WORK, CARRY, CARRY] //300
        ];

    tasks: IAction[] =
        [
            new ActionMoveToRoom(this),
            new ActionGather(this, false, [STRUCTURE_CONTAINER, STRUCTURE_STORAGE]),
            new ActionMining(this, false),
            new ActionFillTower(this, 20),
            new ActionStoreExtension(this),
            new ActionFillTower(this, 80),
            new ActionBuild(this),
            new ActionRepair(this, [STRUCTURE_CONTAINER, STRUCTURE_ROAD], false, true),
            new ActionUpgrade(this)
        ];

    static SpawnCondition(): boolean
    {
        return this.GetMyNoSpawnRoom() != null;
    }

    static GetMyNoSpawnRoom(): Room
    {
        var room: Room;
        var secondTarget: Room=null;
        for (var roomName in Game.rooms)
        {
            room = Game.rooms[roomName];
            if (room.controller == null || room.controller == undefined) continue;
            if (room.controller.owner.username != Constants.userName) continue;
            if (room.controller.level < Constants.weakController) secondTarget = room;
            if (room.find(FIND_MY_SPAWNS)[0] == null) return room;
        }
        if(room!=null) return room;
        return secondTarget;
    }


}

