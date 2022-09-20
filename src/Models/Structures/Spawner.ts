import { Constants } from "Constans";
import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Utils } from "Logic/Utils";
import { PartsPicker } from "Logic/PartsPicker";
import { HeavyMinerMemory } from "Models/Creeps/HeavyMiner";
import { BaseStructure } from "./BaseStructure";
import { ActionResponseCode } from "Models/ActionResponseCode";

export class Spawner extends BaseStructure
{
    tasks = [this.ActSpawn];
    structure: StructureSpawn;

    constructor(_structure: StructureSpawn)
    {
        super(_structure);
    }

    ActSpawn(): ActionResponseCode
    {
        var mem: BaseCreepMemory;
        var settings: SpawnSettings;
        var creepName: string;
        settings = new SpawnSettings(mem);

        if (this.structure.spawning) return ActionResponseCode.Done;
        var type: CreepTypes = this.ScenarioProduce();
        if (type == null) return ActionResponseCode.NextTask;

        switch (type)
        {
            case CreepTypes.UniversalCreep:
                mem = new BaseCreepMemory();
                mem.taskNumber = 0;
                mem.actionAttempts = 0;
                mem.Role = CreepTypes.UniversalCreep;
                creepName = this.GetAviableCreepName("Universal");
                settings = new SpawnSettings(mem);
                break;
            case CreepTypes.HeavyMiner:
                var _mem = new HeavyMinerMemory();
                _mem.taskNumber = 0;
                _mem.actionAttempts = 0;
                _mem.flagX = null;
                _mem.flagY = null;
                _mem.Role = CreepTypes.HeavyMiner;
                creepName = this.GetAviableCreepName("Miner");
                settings = new SpawnSettings(_mem);
                break;
            default:
                console.log("Uknown creep type to spawn");
        }
        var code: ScreepsReturnCode = this.structure.spawnCreep(PartsPicker.GetAviableParts(type, this.structure.room.energyAvailable), creepName, settings);
        switch (code)
        {
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Unabled to spawn, low resources. Tried to spawn - " + creepName);
                return ActionResponseCode.Repeat;
            case OK:
                console.log('Spawning new ' + creepName);
                return ActionResponseCode.Done;
        }
        return ActionResponseCode.Repeat;


        //todo error code processing
    }

    private GetAviableCreepName(prefix: string): string
    {
        var i = 1;
        var combo = prefix + "#" + i;
        while (Game.creeps[combo])
        {
            i++;
            combo = prefix + "#" + i;
        }
        return combo;
    }
    private ScenarioProduce(): CreepTypes
    {

        var creepExist: { [type: number]: number } = Utils.GetCreepPopulation(this.structure.room);
        var creepRequiredMoment: { [type: number]: number } = { 0: 0, 1: 0, 2: 0 };

        for (var order of Constants.ScenarioProduce)
        {
            creepRequiredMoment[order]++;
            if (creepRequiredMoment[order] > creepExist[order])
            {
                return order;
            }
        }
        return null;
    }
}


