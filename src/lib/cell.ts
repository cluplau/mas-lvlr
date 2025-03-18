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

export enum CellType {
	Wall = 'wall',
	Free = 'free',
	Goal = 'goal',
	Empty = 'empty'
}

export enum EntityType {
	Agent = 'agent',
	Box = 'box'
}

export interface Agent {
	type: EntityType.Agent;
	color: Color;
	id: string;
}

export interface Box {
	type: EntityType.Box;
	color: Color;
	id: string;
}

export interface Wall {
	type: CellType.Wall;
}

export interface FreeCell {
	type: CellType.Free;
	entity?: Agent | Box;
}

export interface GoalCell {
	type: CellType.Goal;
	entity?: Agent | Box;
	id: string;
}

export interface EmptyCell {
	type: CellType.Empty;
	id: string;
}

export type Cell = Wall | FreeCell | GoalCell | EmptyCell;
