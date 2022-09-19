import { Constants } from "Constans";
import { filter, random } from "lodash";
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
        var sourceArray = _room.find(FIND_SOURCES_ACTIVE, { filter: (source) => source.energy != 0 });
        return sourceArray[random(0, sourceArray.length - 1)];
    }

    static GetEmptyExtension(_pos: RoomPosition,ignoreId?:Id<Structure>): StructureExtension|StructureSpawn
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    &&
                    structure.id!=ignoreId
            }
        });
        return target as StructureExtension|StructureSpawn;
    }

    static GetNotFilledTower(_pos: RoomPosition,filledMoreThen:number,ignoreId?:Id<Structure>): StructureTower
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER)
                    &&
                    structure.store.getCapacity(RESOURCE_ENERGY) > filledMoreThen
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    &&
                    structure.id!=ignoreId
            }
        });
        return target as StructureTower;
    }


    static GetFilledStorage(_pos: RoomPosition, minAmmount?: number,ignoreId?:Id<Structure>): StructureContainer|StructureStorage
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) //|| structure.structureType == STRUCTURE_SPAWN
                    &&
                    structure.store.getUsedCapacity() > minAmmount
                    &&
                    structure.id!=ignoreId
            }
        });
        return target as StructureContainer|StructureStorage;
    }

    static FindDropped(_pos: RoomPosition, minAmmount?: number,ignoreId?:Id<Resource>): Resource
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        return _pos.findClosestByRange(FIND_DROPPED_RESOURCES, { filter: (dropped) => { return dropped.amount > minAmmount && dropped.id!=ignoreId } });
    }

    static GetContrainer(_pos: RoomPosition,range:number,resource:ResourceConstant,ignoreId?:Id<StructureContainer|StructureStorage>): StructureContainer|StructureStorage
    {
        var target = _pos.findInRange<StructureContainer|StructureStorage>(FIND_STRUCTURES, range,
            {
                filter: (structure) =>
                {
                    return (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE)
                     &&
                     structure.store.getFreeCapacity(resource) != 0
                     &&
                     structure.id!=ignoreId
                     }
            });
        return target[0];
    }

    static GetClosestDamagedStructures(_pos: RoomPosition,ignoreId?:Id<Structure>): Structure
    {
        var target = _pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER) //todo all buildings?
                    &&
                    (Utils.CalculatePercentOfHP(structure) < Constants.damagePercentToRepair)
                    &&
                    structure.id!=ignoreId;
            }
        });
        return target as Structure;
    }

    static GetRandomDamagedStructuresNoPercent(_room: Room,ignoreId?:Id<Structure>): Structure
    {
        var target = _room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return ((structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER)
                 && (structure.hits < structure.hitsMax)
                 &&
                 structure.id!=ignoreId

                 )//todo all buildings?
            }
        });
        return target[random(0, target.length - 1)] as Structure;
    }

    static GetDamagedWalls(_pos: Room,ignoreId?:Id<Structure>): Structure
    {
        var targets = _pos.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                &&
                structure.id!=ignoreId
            }
        }).sort((a, b) => { return a.hits - b.hits });

        return targets[0] as Structure;

    }

    static GetConstructionSites(_pos: RoomPosition,ignoreId?:Id<ConstructionSite>): ConstructionSite
    {
        return _pos.findClosestByRange(FIND_CONSTRUCTION_SITES,{filter:(structure)=>{return structure.id!=ignoreId}});
    }
}
