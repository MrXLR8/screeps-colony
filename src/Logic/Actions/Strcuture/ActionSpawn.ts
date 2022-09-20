import { Finder } from "Logic/Finder";
import { ActionResponseCode } from "Models/ActionResponseCode";
import { BaseCreep, CreepTypes } from "Models/Creeps/BaseCreep";
import { BaseStructure } from "Models/Structures/BaseStructure";
import { IAction } from "../IAction";
import { Tower } from "Models/Structures/Tower";
import { Spawner } from "Models/Structures/Spawner";
import { Utils } from "Logic/Utils";
import { Constants } from "Constans";
import { BaseCreepMemory } from "Models/Memory/BaseCreepMemory";
import { HeavyMinerMemory } from "Models/Creeps/HeavyMiner";
import { PartsPicker } from "Logic/PartsPicker";
import { Unit } from "Models/Unit";
export class ActionSpawn implements IAction
{
    unit: Spawner;
    target: CreepTypes;

    creepName: string = null;
    spawnsettings: SpawnSettings = null;

    constructor(unit: Unit)
    {
        this.unit = unit as Spawner;
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (!entryCode) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        this.PrepareCreepToSpawn()

        if (this.creepName == null || this.spawnsettings == null) return ActionResponseCode.NextTask;
        var actionCode = this.unit.structure.spawnCreep(
            PartsPicker.GetAviableParts(this.target, this.unit.structure.room.energyAvailable),
            this.creepName,
            this.spawnsettings
        );

        return this.WorkCodeProcessing(actionCode);
    }

    EntryValidation(): ActionResponseCode
    {
        if (this.unit.structure.spawning) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var creepExist: { [type: number]: number } = Utils.GetCreepPopulation(this.unit.structure.room);
        var creepRequiredMoment: { [type: number]: number } = { 0: 0, 1: 0, 2: 0 };

        for (var order of Constants.ScenarioProduce)
        {
            creepRequiredMoment[order]++;
            if (creepRequiredMoment[order] > creepExist[order])
            {
                this.target = order;
            }
        }
        return null;
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case OK:
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES :
                console.log("Unabled to spawn, low resources. Tried to spawn - " + this.creepName);
                return ActionResponseCode.Repeat;
            default:
                this.unit.log("Problem occured. Spawner error code: " + code);
                return ActionResponseCode.NextTask;
        }
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

    private PrepareCreepToSpawn()
    {

        var mem: BaseCreepMemory;

        switch (this.target)
        {
            case CreepTypes.UniversalCreep:
                mem = new BaseCreepMemory();
                mem.taskNumber = 0;
                mem.actionAttempts = 0;
                mem.Role = CreepTypes.UniversalCreep;
                this.creepName = this.GetAviableCreepName("Universal");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.HeavyMiner:
                var _mem = new HeavyMinerMemory();
                _mem.taskNumber = 0;
                _mem.actionAttempts = 0;
                _mem.flagX = null;
                _mem.flagY = null;
                _mem.Role = CreepTypes.HeavyMiner;
                this.creepName = this.GetAviableCreepName("Miner");
                this.spawnsettings = new SpawnSettings(_mem);
                break;
            default:
                console.log("Uknown creep type to spawn");
        }
    }

    RepeatAction(): boolean
    {
        throw ("Not Implemented");
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
