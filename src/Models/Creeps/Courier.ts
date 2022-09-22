import { ActionGather } from "Logic/Actions/Carry/ActionGather";
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


export class CourierCreep extends BaseCreep
{

    tasks: IAction[] =
    [
        new ActionSalvage(this,200),
        new ActionGatherFromFlag(this,COLOR_YELLOW,COLOR_WHITE),
        new ActionGather(this,true,[STRUCTURE_CONTAINER]),
        new ActionSalvage(this,0),
        new ActionStore(this,[STRUCTURE_STORAGE],RESOURCE_ENERGY),
        new ActionGather(this,true,[STRUCTURE_STORAGE]),
        new ActionFillTower(this,99)

    ];
}

