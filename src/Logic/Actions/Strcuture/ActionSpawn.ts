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
import { PartsPicker } from "Logic/PartsPicker";
import { Unit } from "Models/Unit";
import { ClaimerCreep } from "Models/Creeps/Claimer";
import { HeavyMinerCreep } from "Models/Creeps/HeavyMiner";
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



    EntryValidation(): ActionResponseCode
    {
        if ((this.unit.structure as StructureSpawn).spawning) return ActionResponseCode.NextTask;
        return null;
    }

    GetSavedTarget(): void
    {
        var creepExist: { [type: number]: number } = Utils.GetCreepPopulation(this.unit.structure.room);
        var creepRequiredMoment: { [type: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0 };

        for (var order of Constants.ScenarioProduce)
        {
            creepRequiredMoment[order]++;
            if (creepRequiredMoment[order] > creepExist[order])
            {
                if(!this.CheckSpawnCondition(order)) continue;
                this.target = order;
                return;
            }
        }
    }


    CheckSpawnCondition(type: CreepTypes): boolean
    {
        switch (this.target)
        {
            case CreepTypes.HeavyMiner:
                return HeavyMinerCreep.SpawnCondition();
            case CreepTypes.Claimer:
                return ClaimerCreep.SpawnCondition();
            default:
                return true;
        }
    }

    WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case OK:
                console.log("Spawning creep: "+this.creepName);
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Unabled to spawn, low resources. Tried to spawn - " + this.creepName);
                return ActionResponseCode.Repeat;
            case ERR_INVALID_ARGS:
                console.log("invalid args for spawned: " + this.creepName + ". " + JSON.stringify(this.spawnsettings));
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

    private PrepareCreepToSpawn(): boolean
    {

        var mem: BaseCreepMemory = new BaseCreepMemory();
        mem.taskNumber = 0;
        mem.assignedTo = null;
        mem.actionAttempts = 0;

        switch (this.target)
        {
            case CreepTypes.UniversalCreep:
                mem.Role = CreepTypes.UniversalCreep;
                this.creepName = this.GetAviableCreepName("Universal");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.HeavyMiner:
                mem.Role = CreepTypes.HeavyMiner;
                this.creepName = this.GetAviableCreepName("Miner");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.Courier:
                mem.Role = CreepTypes.Courier;
                this.creepName = this.GetAviableCreepName("Courier");
                this.spawnsettings = new SpawnSettings(mem);
            case CreepTypes.Claimer:
                mem.Role = CreepTypes.Claimer;
                this.creepName = this.GetAviableCreepName("Claimer");
                this.spawnsettings = new SpawnSettings(mem);

                break;
            default:
                console.log("Uknown creep type to spawn");
                return false;
        }

        return true;
    }

    RepeatAction(): boolean
    {
        throw ("Not Implemented");
    }

    Act(): ActionResponseCode
    {
        var entryCode = this.EntryValidation();
        if (entryCode != null) return entryCode;

        this.GetSavedTarget();

        if (this.target == null) return ActionResponseCode.NextTask;

        this.PrepareCreepToSpawn()

        if (this.creepName == null || this.spawnsettings == null) return ActionResponseCode.NextTask;
        var actionCode = (this.unit.structure as StructureSpawn).spawnCreep(
            PartsPicker.GetAviableParts(this.target, this.unit.structure.room.energyAvailable),
            this.creepName,
            this.spawnsettings
        );

        return this.WorkCodeProcessing(actionCode);
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
