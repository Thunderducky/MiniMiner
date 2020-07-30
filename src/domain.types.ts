import { Brand, Flavor } from './flavoring-and-branding';

// Measurements
// Time
export type Seconds = Flavor<number, 'Seconds'>;
export type Milliseconds = Flavor<number, 'Milliseconds'>;
export type Time = Seconds | Milliseconds;

// Volume
export type CubicMeters = Flavor<number, 'CubicMeters'>;
export type Volume = CubicMeters; // awaiting more unions
// Mass
export type Kilograms = Flavor<number, 'Kilograms'>;
export type Mass = Kilograms; // awaiting more unions

// Distance
export type Meters = Flavor<number, 'Meters'>;
export type Kilometers = Flavor<number, 'Kilometers'>;
export type Distance = Meters | Kilometers;

// Rotation
export type Radians = Flavor<number, 'Radians'>;
export type Degrees = Flavor<number, 'Degrees'>;
/**
 * Positive is counter-clockwise, negative is clockwise
 */
export type Rotation = Radians | Degrees;

export type Vector2d<T extends number> = {x: T, y: T};
export type Position2d = Flavor<Vector2d<Distance>, "Position2d">
export type Velocity2d = Flavor<{
    delta: Vector2d<Distance>,
    time: Time}, "Velocity2d">

export type RotationalVelocity2D = Flavor<Rotation & Time, "Rotational Velocity">;

// Not super pleased with this name, but it works
export type MovementState = Position2d & Velocity2d & Rotation & RotationalVelocity2D 

// Currency
export type SpaceBucks = Flavor<number, 'SpaceBucks'>;
export type Currency = SpaceBucks; // awaiting more unions

// MaterialType
// We will probably switch over the MaterialTypeId to an enum eventually
export type MaterialTypeId = Brand<number, 'MaterialTypeId'>;
export type MaterialUnitVolume = Flavor<Volume, "MaterialUnitVolume">;
export type MaterialUnitMass = Flavor<Volume, "MaterialUnitMass">;
export type MaterialType = Flavor<{
    typeId: MaterialTypeId,
    unitVolume: MaterialUnitVolume,
    unitMass: MaterialUnitMass,
}, "MaterialType">
export type MaterialAmount = Flavor<number, "MaterialAmount">;

// TODO: See if We want to work with some kind of validated type like VerifiedMaterialAmount
export type MaterialResource = Flavor<{
    type: MaterialTypeId,
    amount: MaterialAmount
}, "MaterialResource">;

// We'll develop a Unit version of this later in order to help with calculations, but this isn't a bad way to specify it and make it exact

// Different ID Types
// We might use Flavors for IDs... I don't know
export type EntityId = Brand<number, 'EntityId'>;

// Agents are agents in the world, who can make decisions
export type AgentId = Brand<number, 'AgentId'>;
export type AgentDesignation = Flavor<string, "AgentDesignation">;
export type Agent = Flavor<{
    entityId: EntityId,
    agentId: AgentId,
    designation: AgentDesignation
}, 'Agent'>;

