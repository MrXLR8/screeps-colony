import { IAction } from "Logic/Actions/IAction";
import { ActionLinkSend } from "Logic/Actions/Strcuture/ActionLinkSend";
import { ActionTowerAttack } from "Logic/Actions/Strcuture/ActionTowerAttack";
import { ActionRepair } from "Logic/Actions/Work/ActionRepair";
import { Utils } from "Logic/Utils";
import { BaseStructure } from "./BaseStructure";

export class Link extends BaseStructure
{
    //tasks = [this.ActAttack, this.ActRepair,this.ActRepairWalls];

    tasks: IAction[] =
        [
            new ActionLinkSend(this)
        ];

    structure: StructureLink;

    public GetUsedStoragePercent(resource: ResourceConstant): number
    {
        return Utils.Percent(this.structure.store.getUsedCapacity(resource), this.structure.store.getCapacity(resource));
    }

}
