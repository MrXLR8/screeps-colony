import { BaseCreep, CreepTypes } from "Models/Creeps/BaseCreep";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { UniversalCreep } from "Models/Creeps/UniversalCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";

export class CreepFactory
{
  static CreateCreep(creep: Creep): BaseCreep
  {
    if (creep.id == null || creep.id == undefined) return null;
    var creepWrapper: BaseCreep;
    var typeOfCreep: CreepTypes = BaseCreep.GetCreepType(creep);

    switch (typeOfCreep)
    {
      case CreepTypes.UniversalCreep:
        creepWrapper = new UniversalCreep(creep);
        break;
      case CreepTypes.HeavyMiner:
        creepWrapper = new HeavyMinerCreep(creep);
        break;
      default:
        console.log(creep.name + " has uknown role of: " + typeOfCreep + "\n" + JSON.stringify(creep.memory as BaseCreepMemory));
    }
    return creepWrapper;
  }

  static DisposeCreep(mem: CreepMemory)
  {
    var typeOfCreep: CreepTypes = BaseCreep.GetCreepTypeFromMemory(mem);

    switch (typeOfCreep)
    {
      case CreepTypes.HeavyMiner:
        HeavyMinerCreep.Dispose(mem);
        break;
      default:
        return;
    }
  }
}
