import { UnitFactory } from "Logic/UnitFactory";
import { Utils } from "Logic/Utils";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Spawner } from "Models/Structures/Spawner";
import { Tower } from "Models/Structures/Tower";
//npm run push-main

export function loop()
{
  Utils.MemoryCleanUp();

  for (var roomName in Game.rooms)
  {
    var room = Game.rooms[roomName];

    var creepList = room.find(FIND_MY_CREEPS);
    for (var gameCreep of creepList)
    {
      var creepWrapper: BaseCreep = UnitFactory.CreateCreep(gameCreep);
      if (!creepWrapper) continue;
      creepWrapper.Act();
    }

    var structureList: Structure[] = room.find(FIND_MY_STRUCTURES);

    for (var gameStructure of structureList)
    {
      var structure = UnitFactory.CreateStructure(gameStructure);
      if (!structure) continue;
      structure.Act();
    }
  }

}



