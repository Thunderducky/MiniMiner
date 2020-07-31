import { Brand, Flavor } from './flavoring-and-branding';

// Measurements
export type UnitAmount = Flavor<number, 'UnitAmount'>;
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

// Let's build some other types out of the units

// Let's build some helper units to help with acceleration and force


// Rotation
export type Radians = Flavor<number, 'Radians'>;
export type Degrees = Flavor<number, 'Degrees'>;
/**
 * Positive is counter-clockwise, negative is clockwise
 */
export type Rotation = Radians | Degrees;

// Secondary Measurements
export type Vector2d<T extends number> = {x: T, y: T};
export type Position2d = Flavor<Vector2d<Distance>, 'Position2d'>
export type Velocity2d = Flavor<{
    deltaPosition: Vector2d<Distance>,
    time: Time}, 'Velocity2d'>
export type Acceleration2d = Flavor<{
    deltaVelocity: Velocity2d,
    time: Time}, 'Acceleration2d'>;
export type Force2D = Flavor<{
    acceleration: Acceleration2d,
    mass: Mass}, 'Force2d'>;


export type RotationalVelocity2D = Flavor<{deltaRotation: Rotation, time: Time}, 'Rotational Velocity'>;

// Not super pleased with this name, but it works
export type MovementState = {
    position: Position2d,
    velocity: Velocity2d,
    rotation: Rotation,
    rotationalVelocity: RotationalVelocity2D
}

// Currency
export type SpaceBucks = Flavor<number, 'SpaceBucks'>;
export type Currency = SpaceBucks; // awaiting more unions

// MaterialType
// We will probably switch over the MaterialTypeId to an enum eventually
export type MaterialTypeId = Brand<number, 'MaterialTypeId'>;
export type MaterialUnitVolume = Flavor<Volume, 'MaterialUnitVolume'>;
export type MaterialUnitMass = Flavor<Volume, 'MaterialUnitMass'>;
export type MaterialType = Flavor<{
    typeId: MaterialTypeId,
    unitVolume: MaterialUnitVolume,
    unitMass: MaterialUnitMass,
}, 'MaterialType'>
export type MaterialAmount = Flavor<UnitAmount, 'MaterialAmount'>;

export type MaterialResource = Flavor<{
    type: MaterialTypeId,
    amount: MaterialAmount
}, 'MaterialResource'>;

// We'll develop a Unit version of this later in order to help with calculations, but this isn't a bad way to specify it and make it exact

// Different ID Types
// We might use Flavors for IDs... I don't know
export type EntityId = Brand<number, 'EntityId'>;
export type Designation<T> = Flavor<string, T>; 
// Agents are agents in the world, who can make decisions
export type AgentId = Brand<number, 'AgentId'>;
export type AgentDesignation = Designation<'AgentDesignation'>;
export type Agent = Flavor<{
    entityId: EntityId,
    agentId: AgentId,
    designation: AgentDesignation
}, 'Agent'>;
// Let's Create Markets
// For now there is no pro-rating
// Markets are systems of Asks and Bids, and Agents can fulfill it
export type Bid = Flavor<{
    buyingAgentId: AgentId,
    resource: MaterialResource;
    offerPrice: Currency;
}, 'Bid'>;
export type Ask = Flavor<{
    sellingAgentId: AgentId,
    resource: MaterialResource;
    sellingPrice: Currency;
}, 'Ask'>;
export type Market = Flavor<{
    bids: Bid[],
    asks: Ask[]
}, 'Market'>;

// More specific objects
export type AsteroidDesignation = Designation<'AsteroidDesignation'>;
export type Asteroid = Flavor<MovementState & {
    entityId: EntityId,
    designation: AsteroidDesignation,
    resources: MaterialResource[]
}, 'Asteroid'>;


export type ShipDesignation = Designation<'ShipDesignation'>;
export type Ship = Flavor<MovementState & {
    entityId: EntityId,
    designation: ShipDesignation,
    ownerId: AgentId,
    // Todo, model cargo and max capabilities
    // Eventually we'll componetize ship parts
}, 'Ship'>;

export type StationDesignation = Designation<'StationDesignation'>;
export type Station = Flavor<{
    entityId: EntityId,
    designation: StationDesignation,
    ownerId: AgentId,
    market?:Market // Markets aren't mandatory
    // Eventually we'll componetize ship parts
} & MovementState, 'Station'>;


// We'll also build some conversion types where necessary

// We need to represent: Ships, Stations, Markets
// We might need to add in readonly and immutable pieces later
// These types might be overspecified but it's a learning process!

// Other ideas to keep track of
// CostOfMaterial
// Version 1 the stations will generate deals semi randomly
// Asteroids will be generated randomly
// Fuel is considered infinite?