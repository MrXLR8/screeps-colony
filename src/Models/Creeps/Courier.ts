import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { ActionStore } from "Logic/Actions/Carry/ActionStore";
import { ActionGatherFromFlag } from "Logic/Actions/Carry/ActionGatherFromFlag";
import { ActionSalvage } from "Logic/Actions/Carry/ActionSalvage";
import { ActionStoreToFlag } from "Logic/Actions/Carry/ActionStoreToFlag";


export class CourierCreep extends BaseCreep
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1000
            [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //750
            [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //600
            [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //450
            [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY] //300
        ];

    tasks: IAction[] =
        [
            new ActionGatherFromFlag(this).WithColors(COLOR_YELLOW, COLOR_RED).LeaveAmmount(5000),
            new ActionStoreToFlag(this).WithColors(COLOR_YELLOW, COLOR_BLUE),
            new ActionSalvage(this).MinAmmount(this.AmmountCanCarry()),
            new ActionGatherFromFlag(this).WithColors(COLOR_YELLOW, COLOR_WHITE),
            new ActionGatherEnergy(this,).ContainerTypes([STRUCTURE_CONTAINER]).PriorityBigFirst(),
            new ActionSalvage(this).MinAmmount(0),
            new ActionGatherEnergy(this,).ContainerTypes([STRUCTURE_STORAGE]),
            new ActionFillTower(this),
            new ActionGatherFromFlag(this).WithColors(COLOR_YELLOW, COLOR_GREY),
            new ActionStore(this).ContainerTypes([STRUCTURE_STORAGE])

        ];

    static SpawnCondition(room: Room): boolean
    {
        var found = room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_STORAGE } });
        return found[0] != null;
    }
}

