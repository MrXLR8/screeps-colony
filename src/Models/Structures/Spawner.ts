import { BaseStructure } from "./BaseStructure";
import { ActionSpawn } from "Logic/Actions/Strcuture/ActionSpawn";
import { IAction } from "Logic/Actions/IAction";

export class Spawner extends BaseStructure
{
    //  tasks = [this.ActSpawn];
    tasks: IAction[] =
        [
            new ActionSpawn(this)
        ];
}


