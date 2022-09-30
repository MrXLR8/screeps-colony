import { Constants } from "Constans";
import { drop, filter, forEach, random } from "lodash";
import { AssignableFlag } from "Models/AssignableFlag";
import path from "path";
import { Utils } from "./Utils";

export class Finder
{
    constructor() { }

    static GetClosestSource(_pos: RoomPosition): Source
    {
        return _pos.findClosestByRange(FIND_SOURCES);
        //todo distance sort, energy check
    }

    static GetRandomSource(_room: Room, ignoreId?: Id<Source>): Source
    {
        var sourceArray = _room.find(FIND_SOURCES_ACTIVE, { filter: (source) => source.id != ignoreId });
        return sourceArray[random(0, sourceArray.length - 1)];
    }

    static GetEmptyExtension(_pos: RoomPosition, ignoreId?: Id<Structure>): StructureExtension | StructureSpawn
    {
        var target = _pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN)
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    &&
                    structure.id != ignoreId
            }
        });
        return target as StructureExtension | StructureSpawn;
    }

    static GetFlagByColors(primaryColor: ColorConstant, secondaryColor: ColorConstant, maxAssigned: number, assignable: string, room?: Room): AssignableFlag
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];
            if (typeof room !== 'undefined') if (flag.room != room) continue;
            if (flag.color == primaryColor && flag.secondaryColor == secondaryColor)
            {
                var obj = new AssignableFlag(flag);
                if (obj.isAssigned(assignable)) return obj;
                if (obj.assignedAmmount < maxAssigned) return obj;
            }
        }
        return null;
    }


    static FindWhereIAmAssigned(creepID: string): AssignableFlag
    {
        for (var flagName in Game.flags)
        {
            var flag = Game.flags[flagName];

            var obj = new AssignableFlag(flag);
            if (obj.isAssigned(creepID)) return obj;
        }

        return null;
    }

    static GetNotFilledTower(_pos: RoomPosition, filledLess: number, ignoreId?: Id<Structure>): StructureTower
    {
        var target = _pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_TOWER)
                    &&
                    Utils.GetUsedStoragePercent(structure.store, RESOURCE_ENERGY) <= filledLess
                    &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    &&
                    structure.id != ignoreId
            }
        });
        return target as StructureTower;
    }


    static GetFilledStorage(_pos: RoomPosition, resource: ResourceConstant, structureTypes: StructureConstant[], minAmmount?: number, ignoreId?: Id<Structure>): StructureContainer | StructureStorage | StructureLink
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        var target = _pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return structureTypes.includes(structure.structureType) //|| structure.structureType == STRUCTURE_SPAWN
                    &&
                    (structure as any).store.getUsedCapacity(resource) > minAmmount
                    &&
                    structure.id != ignoreId
            }
        });
        return target as StructureContainer | StructureStorage | StructureLink;
    }

    static GetBiggestFilledStorage(room: Room, resource: ResourceConstant, structureTypes: StructureConstant[], minAmmount?: number, ignoreId?: Id<Structure>): StructureContainer | StructureStorage | StructureLink
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        var target = room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return structureTypes.includes(structure.structureType) //|| structure.structureType == STRUCTURE_SPAWN
                    &&
                    (structure as any).store.getUsedCapacity(resource) > minAmmount
                    &&
                    structure.id != ignoreId
            }
        }).sort((a, b) => { return (b as any).store.getUsedCapacity() - (a as any).store.getUsedCapacity() });
        return target[0] as StructureContainer | StructureStorage | StructureLink;
    }

    static FindDropped(_pos: RoomPosition, resourceType: ResourceConstant, minAmmount?: number, ignoreId?: Id<Resource>): Resource
    {
        if (minAmmount == null || minAmmount == undefined) { minAmmount = 0 };
        return _pos.findClosestByPath(FIND_DROPPED_RESOURCES, { filter: (dropped) => { return dropped.resourceType == resourceType && dropped.amount > minAmmount && dropped.id != ignoreId } });
    }

    static GetContrainer(_pos: RoomPosition, range: number, structureTypes: StructureConstant[],resource:ResourceConstant, ignoreId?: Id<StructureContainer | StructureStorage | StructureLink>): StructureContainer | StructureStorage | StructureLink
    {
        var target = _pos.findInRange<StructureContainer | StructureStorage | StructureLink>(FIND_STRUCTURES, range,
            {
                filter: (structureRaw) =>
                {
                    var structure = structureRaw as StructureContainer | StructureStorage | StructureLink;
                    return structureTypes.includes(structure.structureType)
                        &&
                        structure.store.getFreeCapacity(resource) > 0
                        &&
                        structure.id != ignoreId
                }
            }).sort((a, b) => { return a.pos.getRangeTo(b) });
        return target[0];
    }

    static GetDamagedStructures(room: Room, types: StructureConstant[], ignoreId?: Id<Structure>): Structure[]
    {
        var target = room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return types.includes(structure.structureType)
                    &&
                    (structure.hits + 800 < structure.hitsMax)
                    &&
                    structure.id != ignoreId;
            }
        });
        return target as Structure[];
    }

    static GetRandomDamagedStructuresNoPercent(_room: Room, ignoreId?: Id<Structure>): Structure
    {
        var target = _room.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return ((structure.structureType == STRUCTURE_ROAD || structure.structureType == STRUCTURE_CONTAINER)
                    && (structure.hits < structure.hitsMax)
                    &&
                    structure.id != ignoreId

                )//todo all buildings?
            }
        });
        return target[random(0, target.length - 1)] as Structure;
    }

    static GetDamagedWalls(_pos: Room, ignoreId?: Id<Structure>): Structure
    {
        var targets = _pos.find(FIND_STRUCTURES, {
            filter: (structure) =>
            {
                return (structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART)
                    &&
                    structure.id != ignoreId
            }
        }).sort((a, b) => { return a.hits - b.hits });

        return targets[0] as Structure;

    }

}
