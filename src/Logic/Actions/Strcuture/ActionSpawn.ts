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
import { ExpiditorCreep } from "Models/Creeps/Expiditor";
import { CourierCreep } from "Models/Creeps/Courier";
import { Console } from "console";
import { ExternalHeavyMiner } from "Models/Creeps/ExternalHeavyMiner";
import { ExternalHaulerCreep } from "Models/Creeps/ExternalHauler";
import { ScoutCreep } from "Models/Creeps/Scout";
import { PopulatioInfo, Population } from "Population";
import { ExternalRepairer } from "Models/Creeps/ExternalRepairer";
export class ActionSpawn implements IAction
{
    unit: Spawner;
    target: CreepTypes;

    creepName: string = null;
    pickedParts: BodyPartConstant[];
    spawnsettings: SpawnSettings = null;

    Act(): ActionResponseCode
    {


        var entryCode = this.EntryValidation();

        if (entryCode != null) return entryCode;


        this.GetCreepTypeToSpawn();

        if (this.target == null)
        {
            if (this.IsThereAllFullContainers())
            {
                this.target = CreepTypes.UniversalCreep;
                console.log(this.unit.structure.room.name + " is full. spawning extra creep");
            }
            else
                return ActionResponseCode.Repeat;
        }

        this.pickedParts = PartsPicker.GetAviableMaxParts(this.target, this.unit.structure.room.energyAvailable, this.unit.structure.room.energyCapacityAvailable);


        if (this.pickedParts == null)
        {
            if (Population.count[this.unit.structure.room.name].pressence[CreepTypes.UniversalCreep] == 0)
            {
                this.SpawnEmergencyCreep();
            }
            else if (this.IsThereAllFullContainers())
            {
                this.target = CreepTypes.UniversalCreep;
                this.pickedParts = PartsPicker.GetAviableParts(this.target, this.unit.structure.room.energyAvailable);
                if (this.pickedParts == null) return ActionResponseCode.Repeat;
                console.log(this.unit.structure.room.name + " is full. spawning extra creep");
            }

            else { return ActionResponseCode.Repeat; }

        }

        this.PrepareCreepToSpawn();



        if (this.creepName == null || this.spawnsettings == null) return ActionResponseCode.Repeat;
        var actionCode = (this.unit.structure as StructureSpawn).spawnCreep(this.pickedParts, this.creepName, this.spawnsettings);

        return this.WorkCodeProcessing(actionCode);
    }

    private EntryValidation(): ActionResponseCode
    {
        if ((this.unit.structure as StructureSpawn).spawning) return ActionResponseCode.Repeat;
        if (this.unit.structure.room.energyAvailable < 200) return ActionResponseCode.Repeat;
        return null;
    }

    private SpawnEmergencyCreep()
    {
        this.target = CreepTypes.UniversalCreep;
        this.pickedParts = PartsPicker.GetAviableParts(this.target, this.unit.structure.room.energyAvailable);
        if (this.unit.structure.room.controller.level != 1)
            console.log((this.unit.structure.room.name + "| SPAWNING EMERGENCY CREEP"));

    }

    private GetCreepTypeToSpawn(): void
    {

        var creepRequiredMoment: { [type: number]: number } = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };

        for (var creepType of Constants.LocalCreepsRequired)
        {
            creepRequiredMoment[creepType]++;
            if (creepRequiredMoment[creepType] > Population.count[this.unit.structure.room.name].pressence[creepType])
            {
                if (!this.CheckSpawnCondition(creepType)) continue;
                this.target = creepType;
                return;
            }
        }

        creepRequiredMoment = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0 };

        for (var creepType of Constants.ExternalCreepRequired)
        {

            creepRequiredMoment[creepType]++;
            if (creepRequiredMoment[creepType] > Population.count[this.unit.structure.room.name].bound[creepType])
            {

                if (!this.CheckSpawnCondition(creepType)) continue;
                this.target = creepType;
                return;
            }
        }
    }


    IsThereAllFullContainers(): boolean
    {
        var room = this.unit.structure.room;
        var foundLeftSpace = room.find(FIND_STRUCTURES, {
            filter: (strcucture) =>
            {
                if (strcucture instanceof StructureContainer)
                {
                    return strcucture.store.getFreeCapacity(RESOURCE_ENERGY) != 0;
                }
                return false;
            }
        });

        return foundLeftSpace[0] == null;;

    }

    private CheckSpawnCondition(type: CreepTypes): boolean
    {
        switch (type)
        {
            case CreepTypes.HeavyMiner:
                return HeavyMinerCreep.SpawnCondition(this.unit.structure.room);
            case CreepTypes.Courier:
                return CourierCreep.SpawnCondition(this.unit.structure.room);
            case CreepTypes.Claimer:
                return ClaimerCreep.SpawnCondition(this.unit.structure.room.name);
            case CreepTypes.ExpeditorCreep:
                return ExpiditorCreep.SpawnCondition(this.unit.structure.room);
            case CreepTypes.ExternalHeavyMiner:
                return ExternalHeavyMiner.SpawnCondition(this.unit.structure.room.name);
            case CreepTypes.ExternalHauler:
                return ExternalHaulerCreep.SpawnCondition(this.unit.structure.room.name);
            case CreepTypes.Scout:
                return ScoutCreep.SpawnCondition(this.unit.structure.room.name);
            case CreepTypes.ExternalRepairer:
                return ExternalRepairer.SpawnCondition();
            default:
                return true;
        }
    }

    private WorkCodeProcessing(code: ScreepsReturnCode): ActionResponseCode
    {
        switch (code)
        {
            case OK:
                console.log("Spawning creep: " + this.creepName);
                this.unit.memory.actions.worked = true;
                return ActionResponseCode.Repeat;
            case ERR_NOT_ENOUGH_RESOURCES:
                console.log("Unabled to spawn, low resources. Tried to spawn - " + this.creepName);
                return ActionResponseCode.Repeat;
            case ERR_INVALID_ARGS:
                return ActionResponseCode.Repeat;
            //console.log("invalid args for spawned: " + this.creepName + ". " + JSON.stringify(this.spawnsettings));
            default:
                this.unit.log("Problem occured. Spawner error code: " + code);
                return ActionResponseCode.Repeat;
        }
    }

    private GetAviableCreepName(prefix: string): string
    {
        var date = new Date();
        return prefix + "|" + this.unit.structure.room.name + "|" + (date.getHours() + 3) + ":" + date.getMinutes() + ":" + date.getSeconds();

    }

    private PrepareCreepToSpawn(): boolean
    {

        var mem: BaseCreepMemory = new BaseCreepMemory();
        mem.taskNumber = 0;
        mem.assignedTo = null;
        mem.actionAttempts = 0;
        mem.originRoom = this.unit.structure.room.name;
        mem.Role = this.target;

        switch (this.target)
        {
            case CreepTypes.UniversalCreep:
                this.creepName = this.GetAviableCreepName("Universal");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.HeavyMiner:
                this.creepName = this.GetAviableCreepName("Miner");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.Courier:
                this.creepName =  this.GetAviableCreepName("Courier");
                 this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.Claimer:
                this.creepName =  this.GetAviableCreepName("Claimer");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.ExpeditorCreep:
                this.creepName =  this.GetAviableCreepName("Expiditor");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.Upgrader:
                this.creepName =  this.GetAviableCreepName("Upgrader");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.ExternalHeavyMiner:
                this.creepName =  this.GetAviableCreepName("ExternalMiner");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.ExternalHauler:
                this.creepName =  this.GetAviableCreepName("ExternalHauler");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.Scout:
                this.creepName =  this.GetAviableCreepName("Scout");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            case CreepTypes.ExternalRepairer:
                this.creepName =  this.GetAviableCreepName("ExternalRepairer");
                this.spawnsettings = new SpawnSettings(mem);
                break;
            default:
                console.log("Uknown creep type to spawn");
                return false;
        }

        return true;
    }

    constructor(unit: Unit)
    {
        this.unit = unit as Spawner;
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
