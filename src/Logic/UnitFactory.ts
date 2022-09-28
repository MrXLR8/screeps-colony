import { BaseCreep, CreepTypes } from "Models/Creeps/BaseCreep";
import { ClaimerCreep } from "Models/Creeps/Claimer";
import { CourierCreep } from "Models/Creeps/Courier";
import { ExpiditorCreep } from "Models/Creeps/Expiditor";
import { ExternalHaulerCreep } from "Models/Creeps/ExternalHauler";
import { ExternalHeavyMiner } from "Models/Creeps/ExternalHeavyMiner";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
import { UniversalCreep } from "Models/Creeps/Universal";
import { UpgraderCreep } from "Models/Creeps/Updgrader";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { BaseStructureMemory } from "Models/Memory/BaseStructureMemory";
import { GlobalMemory } from "Models/Memory/GlobalMemory";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { Link } from "Models/Structures/Link";
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
      case CreepTypes.Courier:
        creepWrapper = new CourierCreep(creep);
        break;
      case CreepTypes.Claimer:
        creepWrapper = new ClaimerCreep(creep);
        break;
      case CreepTypes.ExpeditorCreep:
        creepWrapper = new ExpiditorCreep(creep);
        break;
      case CreepTypes.Upgrader:
        creepWrapper = new UpgraderCreep(creep);
        break;
      case CreepTypes.ExternalHeavyMiner:
        creepWrapper = new ExternalHeavyMiner(creep);
        break;
      case CreepTypes.ExternalHauler:
        creepWrapper = new ExternalHaulerCreep(creep);
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
      case CreepTypes.ExternalHeavyMiner:
        ExternalHeavyMiner.Dispose(mem);
        break;
      case CreepTypes.ExternalHauler:
        ExternalHaulerCreep.Dispose(mem);
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
      case STRUCTURE_LINK:
        structureWrapper = new Link(structure as StructureLink);
        break;
      default:
        return null;
    }

    UnitFactory.StructureMemoryExistsCheck(structure.id);

    return structureWrapper;
  }

  static StructureMemoryExistsCheck(id: Id<any>)
  {
    var mem = (Memory as GlobalMemory);

    if (mem.structures == undefined)
    {
      mem.structures = {};
    }
    var request = mem.structures[id];

    if (typeof request === 'undefined')
    {
      console.log(id + " creating memory");
      var mem2 = new BaseStructureMemory();
      mem.structures[id.toString()] = mem2;
    }
  }
}

