import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";


export class Constants
{
    static damagePercentToRepair: number = 80;
    static moveAttmepts = 40;
    static towerEnergyReserve = 20;

    static ScenarioProduce: CreepTypes[] =
        [
              CreepTypes.UniversalCreep,
              CreepTypes.HeavyMiner,
              CreepTypes.UniversalCreep,
              CreepTypes.UniversalCreep,
              CreepTypes.HeavyMiner,
              CreepTypes.Courier,
              CreepTypes.Claimer
        ];
}



