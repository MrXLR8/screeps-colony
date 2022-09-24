import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";


export class Constants
{
    static damagePercentToRepair: number = 80;
    static moveAttmepts = 40;
    static towerEnergyReserve = 20;

    static weakController: number = 3;

    static userName: string;
    static ScenarioProduce: CreepTypes[] =
        [
            CreepTypes.UniversalCreep,
            CreepTypes.HeavyMiner,
            CreepTypes.UniversalCreep,
            CreepTypes.HeavyMiner,
            CreepTypes.UniversalCreep,
            CreepTypes.UniversalCreep,
            CreepTypes.UniversalCreep,
            CreepTypes.UniversalCreep,
            CreepTypes.UniversalCreep,
            CreepTypes.Courier,
            CreepTypes.ExpeditorCreep,
            CreepTypes.ExpeditorCreep,
            CreepTypes.ExpeditorCreep,
        ];
}



