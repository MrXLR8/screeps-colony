import { Constants } from "Constans";
import { CreepRoleInfo } from "Models/CreepRoleInfo";
import { CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { Utils } from "Logic/Utils";
import { PartsPicker } from "Logic/PartsPicker";
import { HeavyMinerMemory } from "Models/Creeps/HeavyMiner";

export class Spawner
{
    structure: StructureSpawn;

    constructor(_structure: StructureSpawn)
    {
        this.structure = _structure;
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

    Spawn(_type: CreepTypes): void
    {
        var mem: BaseCreepMemory;
        var settings: SpawnSettings;
        var creepName: string;
        settings = new SpawnSettings(mem);
        switch (_type)
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
        var code: ScreepsReturnCode = this.structure.spawnCreep(PartsPicker.GetAviableParts(_type, this.structure.room.energyAvailable), creepName, settings);
        switch (code)
        {
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Unabled to spawn, low resources. Tried to spawn - " + creepName);
                break;
            case OK:
                console.log('Spawning new ' + creepName);
                break;
        }
        //todo error code processing
    }

    Act()
    {
        if (this.structure.spawning) return;
        var create: CreepTypes = this.ScenarioProduce();
        if (create != null)
        {
            Utils.MemoryCleanUp();
            this.Spawn(create);
        }
    }

    ScenarioProduce(): CreepTypes
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

class SpawnSettings implements SpawnOptions
{
    memory?: CreepMemory | undefined;

    constructor(_memory: CreepMemory)
    {
        this.memory = _memory;
    }
}
