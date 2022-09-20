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


export class CourierCreep extends BaseCreep
{

    tasks: IAction[] =
    [
        new ActionGather(this,[STRUCTURE_CONTAINER]),
        new ActionStore(this,[STRUCTURE_STORAGE],RESOURCE_ENERGY)
    ];
}

