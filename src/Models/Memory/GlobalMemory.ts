import { BaseStructureMemory } from "./BaseStructureMemory";


export class GlobalMemory implements Memory
{
    creeps: { [name: string]: CreepMemory };
    powerCreeps: { [name: string]: PowerCreepMemory };
    flags: { [name: string]: FlagMemory };
    rooms: { [name: string]: RoomMemory };
    spawns: { [name: string]: SpawnMemory };
    structures: { [structureID: string]: BaseStructureMemory };
    targets: { [name: string]: string[] }; //what reserved by who
}
