import { Constants } from "Constans";
import { UnitFactory } from "Logic/UnitFactory";
import { Utils } from "Logic/Utils";
import { BaseCreep } from "Models/Creeps/BaseCreep";
import { Spawner } from "Models/Structures/Spawner";
import { Tower } from "Models/Structures/Tower";
import { PopulatioInfo, Population } from "Population";
//npm run push-main

export function loop()
{

  Population.count = {};
  Utils.MemoryCleanUp();

  Constants.userName = "XLR8";

  if (Game.cpu.bucket == 10000)
  {
    console.log("CREATED PIXEL");
    Game.cpu.generatePixel();
  }

  for (var roomName in Game.rooms)
  {
    Population.count[roomName] = new PopulatioInfo();

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



