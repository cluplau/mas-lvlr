import {
	CellType,
	EntityType,
	type Agent,
	type Box,
	type Cell,
	type Color,
	type FreeCell
} from '$lib/cell';
import { getContext, setContext } from 'svelte';

export function hasEntity(cell: Cell) {
	return cell.type === 'free' || cell.type === 'goal';
}

export function isAgent(entity: Agent | Box) {
	return entity.type == 'agent';
}
export function isBox(entity: Agent | Box) {
	return entity.type == 'box';
}

export function isGoal(cell: Cell) {
	return cell.type === 'goal';
}

class GridStore {
	width: number = 3;
	height: number = 3;
	grid: Cell[][] = $state([[]]);

	constructor(width: number, height: number, grid: Cell[][]) {
		this.width = width;
		this.height = height;
		this.grid = grid;
	}

	getCell(row: number, col: number): Cell | undefined {
		if (row >= 0 && row < this.height && col >= 0 && col < this.width) {
			return this.grid[row][col];
		}
		return undefined;
	}

	addEntity(row: number, col: number, entity: Agent | Box): boolean {
		const cell = this.getCell(row, col);

		if (cell && hasEntity(cell) && !cell.entity) {
			(cell as FreeCell).entity = entity;
			return true;
		}

		return false;
	}

	removeEntity(row: number, col: number): boolean {
		const cell = this.getCell(row, col);

		if (cell && hasEntity(cell) && cell.entity) {
			(cell as FreeCell).entity = undefined;
			return true;
		}

		return false;
	}

	moveEntity(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
		const fromCell = this.getCell(fromRow, fromCol);
		const toCell = this.getCell(toRow, toCol);

		if (!fromCell || !hasEntity(fromCell) || !fromCell.entity) {
			return false;
		}

		if (!toCell || !hasEntity(toCell) || toCell.entity) {
			return false;
		}

		const entity = fromCell.entity;
		this.removeEntity(fromRow, fromCol);
		this.addEntity(toRow, toCol, entity);
		return true;
	}
}

const setGrid = () => setContext('grid', fromLevel(default_level));
const getGrid = () => getContext('grid') as GridStore;

export { setGrid, getGrid };

const default_level = `#domain
hospital
#levelname
Bouncer
#colors
red: 0, A, S, Y
purple: 2
blue: 3
grey: C, L, U, B, D, H
pink: 1, T, O
orange: E
cyan: 4, F, G
brown: 5
#initial
++++++++++++
+ ++4+SOO+ +
+T   +A  +F+
++    Y  5 +
+CL2UB+3++ +
+     +  +G+
+ 1  0+E + +
+     +  + +
+     + H+ +
+     + D+ +
++++++++++++
#goal
++++++++++++
+0++ +   +F+
+    +   + +
++       54+
+  2  +3++ +
+     +  + +
+     +  + +
+    T+A + +
+    O+S + +
+1   O+Y +G+
++++++++++++
#end`;

const parseSections = (levelString: string) => {
	const sections: Record<string, string[]> = {};
	let currentSection: string | null = null;

	levelString.split('\n').forEach((line) => {
		if (line.startsWith('#')) {
			currentSection = line.substring(1).trim();
			sections[currentSection] = [];
		} else if (currentSection) {
			sections[currentSection].push(line);
		}
	});
	return sections;
};

const parseColors = (colorsSection: string[]) => {
	const colors: Record<string, Color> = {};
	colorsSection.forEach((line) => {
		const [color, entities] = line.split(':').map((s) => s.trim());
		const ids = entities.split(',').map((id) => id.trim());
		ids.forEach((id) => (colors[id] = color as Color));
	});
	return colors;
};

const parseLevel = (lines: string[], colors: Record<string, Color>, isGoal = false): Cell[][] => {
	const width = Math.max(...lines.map((line) => line.length));
	const height = lines.length;
	const grid: Cell[][] = [];

	for (let y = 0; y < height; y++) {
		const row: Cell[] = [];
		for (let x = 0; x < width; x++) {
			const char = lines[y][x] || ' ';
			let cell: Cell;

			if (char === '+') {
				cell = { type: CellType.Wall };
			} else if (char === ' ') {
				cell = { type: CellType.Free };
			} else if (colors?.[char]) {
				const entity = { type: EntityType.Agent, color: colors[char], id: char };
				cell = isGoal ? { type: CellType.Goal, entity, id: char } : { type: CellType.Free, entity };
			} else if (char.match(/[A-Z]/i)) {
				cell = isGoal ? { type: CellType.Goal, id: char } : { type: CellType.Free };
			} else {
				cell = { type: CellType.Empty, id: `${x},${y}` };
			}
			row.push(cell);
		}
		grid.push(row);
	}
	return grid;
};

const fromLevel = (levelString: string) => {
	const sections = parseSections(levelString);
	const colors = parseColors(sections['colors'] || []);
	const initialGrid = parseLevel(sections['initial'] || [], colors);
	const width = initialGrid[0]?.length || 0;
	const height = initialGrid.length;
	const gridStore = new GridStore(width, height, initialGrid);

	return gridStore;
};

const colorMap: Record<Color, string> = {
	blue: '#3050fe',
	red: '#ff0000',
	cyan: '#02ffff',
	purple: '#6001b0',
	green: '#02ff00',
	orange: '#ff8001',
	pink: '#f060c0',
	grey: '#707070',
	lightblue: '#70c0ff',
	brown: '#602f00'
};

export function toCSSColor(color: Color): string {
	return colorMap[color];
}
