import { Constants } from "Constans";
import { random } from "lodash";
import path from "path";
import { Utils } from "./Utils";

export class Finder
{
    constructor() { }

    static GetSource(_pos: RoomPosition): Source
    {
        return _pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        //todo distance sort, energy check
    }

    static GetRandomSource(_room: Room): Source
    {
        var sourceArray = _room.find(FIND_SOURCES_ACTIVE);
        return sourceArray[random(0, sourceArray.length - 1)];
        //todo distance sort, energy check
    }

    static GetEmptyExtension(_pos: RoomPosition): Structure
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        });
        return target as Structure;
    }

    static GetEmptyTower(_pos: RoomPosition): StructureTower
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER)
                    &&
                    structure.store.getCapacity(RESOURCE_ENERGY) == 0
            }
        });
        return target as StructureTower;
    }

    static GetNotFullTower(_pos: RoomPosition): StructureTower
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            }
        });
        return target as StructureTower;
    }

    static GetFilledStorage(_pos: RoomPosition, minAmmount?: number): Structure
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) //|| structure.structureType == STRUCTURE_SPAWN
                    &&
                    structure.store.getUsedCapacity() > minAmmount
            }
        });
        return target as Structure;
    }

    static FindDropped(_pos:RoomPosition, minAmmount?: number) :Resource
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        return _pos.findClosestByRange(FIND_DROPPED_RESOURCES, {filter: (dropped) => {return dropped.amount>minAmmount}});
    }

    static GetOneRangeContrainer(_pos: RoomPosition): StructureContainer
    {
        var target = _pos.findInRange<StructureContainer>(FIND_STRUCTURES, 2,
            {
                filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && structure.store.getFreeCapacity() != 0 }
            });
        return target[0];
    }

    static GetClosestDamagedStructures(_pos: RoomPosition): Structure
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) //todo all buildings?
                    &&
                    Utils.CalculatePercentOfHP(structure) < Constants.damagePercentToRepair
            }
        });
        return target as Structure;
    }

    static GetRandomDamagedStructuresNoPercent(_room: Room): Structure
    {
        var target = _room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return ((structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER)&& structure.hits<structure.hitsMax)//todo all buildings?
            }
        });
        return target[random(0, target.length - 1)] as Structure;
    }

    static GetDamagedWalls(_pos: Room): Structure
    {
        var targets = _pos.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_WALL||structure.structureType == STRUCTURE_RAMPART) //sort by damages
            }
        }).sort((a, b) => { return a.hits - b.hits });

        return targets[0] as Structure;

    }

    static GetConstructionSites(_pos: RoomPosition): ConstructionSite
    {
        return _pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    }
}
