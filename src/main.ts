import { CreepFactory } from "Logic/CreepFactory";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Spawner } from "Models/Structures/Spawner";
import { Tower } from "Models/Structures/Tower";
//npm run push-main

export function loop()
{
  for (var roomName in Game.rooms)
  {
    var room: Room = Game.rooms[roomName];

    var towers: StructureTower[] = room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_TOWER } });
    for (var tower of towers)
    {
      new Tower(tower).Act();
    }
  }

  for (var spawnerName in Game.spawns)
  {
    var SpawnerStructure: Spawner = new Spawner(Game.spawns[spawnerName]);

    SpawnerStructure.Act();
  }

  for (var creepName in Game.creeps)
  {
    var creepWrapper: BaseCreep=CreepFactory.CreateCreep(Game.creeps[creepName]);
    if(!creepWrapper) continue;
    creepWrapper.Act();
  }
}

