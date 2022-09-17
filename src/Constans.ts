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
              CreepTypes.UniversalCreep,
              CreepTypes.UniversalCreep,
          ];
    static creepRoleInfo: { [type: number]: CreepRoleInfo } =
        {
            0: new CreepRoleInfo(3, [MOVE, MOVE, WORK, CARRY, CARRY], CreepTypes.UniversalCreep), //300
            1: new CreepRoleInfo(2, [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY], CreepTypes.HeavyMiner) //700
        }

    static BodyPartsPrice: { [part: string]: number } =
        {
            "move":50,
            "work":100,
            "carry":50,
            "attack":80,
            "ranged_attack":150,
            "heal":250,
            "claim":600,
            "tough":10
        }

}



