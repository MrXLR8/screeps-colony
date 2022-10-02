import { ActionGatherEnergy } from "Logic/Actions/Carry/ActionGatherEnergy";
import { BaseCreep } from "./BaseCreep";
import { ActionMining } from "Logic/Actions/Work/ActionMining";
import { ActionFillTower } from "Logic/Actions/Carry/ActionFillTower";
import { ActionStoreExtension } from "Logic/Actions/Carry/ActionStoreExtension";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { ActionBuild } from "Logic/Actions/Work/ActionBuild";
import { ActionUpgrade } from "Logic/Actions/Work/ActionUpgrade";
import { IAction } from "Logic/Actions/IAction";
import { ActionSalvage } from "Logic/Actions/Carry/ActionSalvage";


export class UniversalCreep extends BaseCreep
{

    static parts: BodyPartConstant[][] =
        [
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1300
            [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], //700
            [MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY], //550
            [MOVE, MOVE, WORK, WORK, CARRY, CARRY], //400
            [MOVE, MOVE, WORK, CARRY, CARRY] //300
        ];

    tasks: IAction[] =
        [
            new ActionSalvage(this).MinAmmount(this.AmmountCanCarry()).WithResource(RESOURCE_ENERGY),
            new ActionGatherEnergy(this).ContainerTypes([STRUCTURE_CONTAINER, STRUCTURE_STORAGE,STRUCTURE_LINK]),
            new ActionMining(this).FindRandomSource(),
            new ActionFillTower(this).FillUntil(20),
            new ActionStoreExtension(this),
            new ActionFillTower(this).FillUntil(80),
            new ActionBuild(this),
            new ActionRepair(this,).Structures([STRUCTURE_CONTAINER, STRUCTURE_ROAD]).RepeatToEnd(),
            new ActionUpgrade(this)
        ];
}

