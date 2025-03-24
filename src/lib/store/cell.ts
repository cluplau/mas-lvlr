export type Color =
	| 'blue'
	| 'red'
	| 'cyan'
	| 'purple'
	| 'green'
	| 'orange'
	| 'pink'
	| 'grey'
	| 'lightblue'
	| 'brown';

export enum CellVariant {
	Wall = 'wall',
	Free = 'free',
	AgentGoal = 'agent-goal',
	BoxGoal = 'box-goal',
	Empty = 'empty'
}

export enum EntityVariant {
	Agent = 'agent',
	Box = 'box'
}

export interface EntityAgent {
	type: EntityVariant.Agent;
	color: Color;
	id: string;
}

export interface EntityBox {
	type: EntityVariant.Box;
	color: Color;
	id: string;
}

export interface CellWall {
	id: string;
	type: CellVariant.Wall;
}

export interface CellFree {
	id: string;
	type: CellVariant.Free;
	entity?: EntityAgent | EntityBox;
}

export interface CellAgentGoal {
	id: string;
	type: CellVariant.AgentGoal;
	goalFor: string;
	entity?: EntityAgent | EntityBox;
}

export interface CellBoxGoal {
	id: string;
	type: CellVariant.BoxGoal;
	goalFor: string;
	entity?: EntityAgent | EntityBox;
}

export interface CellEmpty {
	id: string;
	type: CellVariant.Empty;
}

export type Cell = CellWall | CellFree | CellAgentGoal | CellBoxGoal | CellEmpty;

// --- Utility Functions ---

export function isWallCell(cell: Cell): cell is CellWall {
	return cell.type === CellVariant.Wall;
}

export function isFreeCell(cell: Cell): cell is CellFree {
	return cell.type === CellVariant.Free;
}

export function isAgentGoalCell(cell: Cell): cell is CellAgentGoal {
	return cell.type === CellVariant.AgentGoal;
}

export function isBoxGoalCell(cell: Cell): cell is CellBoxGoal {
	return cell.type === CellVariant.BoxGoal;
}

export function isEmptyCell(cell: Cell): cell is CellEmpty {
	return cell.type === CellVariant.Empty;
}

export function isGoalCell(cell: Cell): cell is CellAgentGoal | CellBoxGoal {
	return cell.type === CellVariant.AgentGoal || cell.type === CellVariant.BoxGoal;
}

export function canHaveEntity(cell: Cell): cell is CellFree | CellAgentGoal | CellBoxGoal {
	return (
		cell.type === CellVariant.Free ||
		cell.type === CellVariant.AgentGoal ||
		cell.type === CellVariant.BoxGoal
	);
}

export function isAgentEntity(entity: EntityAgent | EntityBox): entity is EntityAgent {
	return entity.type === EntityVariant.Agent;
}

export function isBoxEntity(entity: EntityAgent | EntityBox): entity is EntityBox {
	return entity.type === EntityVariant.Box;
}

export function isEntityVariant(variant: EntityVariant | CellVariant): variant is EntityVariant {
	return variant === EntityVariant.Agent || variant === EntityVariant.Box;
}

export function isCellVariant(variant: EntityVariant | CellVariant): variant is CellVariant {
	return !isEntityVariant(variant);
}
