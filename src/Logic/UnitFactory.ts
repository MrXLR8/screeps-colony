import { BaseCreep, CreepTypes } from "Models/Creeps/BaseCreep";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { UniversalCreep } from "Models/Creeps/UniversalCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { Spawner } from "Models/Structures/Spawner";
import { Tower } from "Models/Structures/Tower";

export class UnitFactory
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

  static CreateStructure(structure: Structure): BaseStructure
  {
    var structureWrapper: BaseStructure;

    switch (structure.structureType)
    {
      case STRUCTURE_SPAWN:
        structureWrapper = new Spawner(structure as StructureSpawn);
        break;
      case STRUCTURE_TOWER:
        structureWrapper = new Tower(structure as StructureTower);
        break;
      default:
        return null;
    }

    UnitFactory.StructureMemoryExistsCheck(structure.id);

    return structureWrapper;
  }

  static StructureMemoryExistsCheck(id: Id<Structure>)
  {
    var request = (Memory as GlobalMemory).structures[id];
    if (request == null)
    {
      var mem = new BaseStructureMemory();
      (Memory as GlobalMemory).structures[id] = mem;
    }
  }
}
