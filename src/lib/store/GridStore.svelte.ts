import {
	CellVariant,
	EntityType,
	canHaveEntity,
	type EntityAgent,
	type EntityBox,
	type Cell,
	type Color,
	type CellFree,
	type CellWall,
	type CellEmpty,
	type CellBoxGoal,
	type CellAgentGoal
} from '$lib/store/cell';
import { getContext, setContext } from 'svelte';

class GridStore {
	width: number = $state(0);
	height: number = $state(0);
	grid: Cell[][] = $state([[]]);

	constructor(width: number, height: number, grid: Cell[][]) {
		this.width = width;
		this.height = height;
		this.grid = grid;
	}

	addRow() {
		const newRow: Cell[] = Array(this.width)
			.fill(null)
			.map((_, x) => ({
				type: CellVariant.Free,
				id: `${this.height}-${x}`
			}));

		this.grid.push(newRow);
		this.height++;
	}

	removeRow() {
		if (this.height > 3) {
			this.grid.pop();
			this.height--;
		}
	}

	addColumn() {
		this.grid.forEach((row, y) => {
			const newCell: Cell = {
				type: CellVariant.Free,
				id: `${y}-${this.width}`
			};
			row.push(newCell);
		});
		this.width++;
	}

	removeColumn() {
		if (this.width > 3) {
			this.grid.forEach((row) => row.pop());
			this.width--;
		}
	}

	getCell(row: number, col: number): Cell | undefined {
		const cell = this.grid[row][col];

		if (cell) {
			return cell;
		}

		return undefined;
	}

	setCell(row: number, col: number, type: CellVariant): Cell | undefined {
		let cell = this.getCell(row, col);
		if (!cell) {
			return;
		}

		if (type === CellVariant.Wall && !this.hasEntity(row, col)) {
			this.grid[row][col] = { id: cell.id, type: CellVariant.Wall } satisfies CellWall;
			return;
		}
		if (type === CellVariant.Empty && !this.hasEntity(row, col)) {
			this.grid[row][col] = { id: cell.id, type: CellVariant.Empty } satisfies CellEmpty;
			return;
		}

		if (type === CellVariant.Free) {
			this.grid[row][col] = {
				id: cell.id,
				type: CellVariant.Free,
				entity: canHaveEntity(cell) ? cell.entity : undefined
			} satisfies CellFree;
			return;
		}

		if (type === CellVariant.BoxGoal && canHaveEntity(cell)) {
			this.grid[row][col] = {
				id: cell.id,
				type: CellVariant.BoxGoal,
				goalFor: 'A',
				entity: canHaveEntity(cell) ? cell.entity : undefined
			} satisfies CellBoxGoal;
			return;
		}
		if (type === CellVariant.AgentGoal && canHaveEntity(cell)) {
			this.grid[row][col] = {
				id: cell.id,
				type: CellVariant.AgentGoal,
				goalFor: '0',
				entity: canHaveEntity(cell) ? cell.entity : undefined
			} satisfies CellAgentGoal;
			return;
		}
	}

	addEntity(row: number, col: number, entity: EntityAgent | EntityBox): boolean {
		const cell = this.getCell(row, col);

		if (cell && canHaveEntity(cell) && !cell.entity) {
			(cell as CellFree).entity = entity;
			return true;
		}

		return false;
	}

	removeEntity(row: number, col: number): boolean {
		const cell = this.getCell(row, col);

		if (cell && canHaveEntity(cell) && cell.entity) {
			(cell as CellFree).entity = undefined;
			return true;
		}

		return false;
	}

	hasEntity(row: number, col: number): boolean {
		const cell = this.getCell(row, col);

		if (cell && canHaveEntity(cell) && cell.entity) {
			return true;
		}

		return false;
	}

	moveEntity(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
		const fromCell = this.getCell(fromRow, fromCol);
		const toCell = this.getCell(toRow, toCol);

		if (!fromCell || !canHaveEntity(fromCell) || !fromCell.entity) {
			return false;
		}

		if (!toCell || !canHaveEntity(toCell) || toCell.entity) {
			return false;
		}

		const entity = fromCell.entity;
		this.removeEntity(fromRow, fromCol);
		this.addEntity(toRow, toCol, entity);
		return true;
	}

	fromLevel(level: string) {
		const sections = parseSections(level);
		const colors = parseColors(sections['colors'] || []);
		const grid = parseLevel(sections['initial'] || [], colors);
		const width = grid[0]?.length || 0;
		const height = grid.length;

		this.width = width;
		this.height = height;
		this.grid = grid;
	}

	toString() {
		return 'awer';
	}
}

const setGrid = () => setContext('grid', fromLevel(default_level));
const getGrid = () => getContext('grid') as GridStore;

export { setGrid, getGrid };

const default_level = `#domain
hospital
#levelname
Spds
#colors
blue: 0,1,2
#initial
+++++++++++++
+      1    +
+           +
++++++ ++++++
+    0   2  +
+  +     +  +
+        +  +
+++++++++++++
#goal
+++++++++++++
+       0   +
+           +
++++++ ++++++
+           +
+2 +     +  +
+1       +  +
+++++++++++++
#end
`;

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

const parseLevel = (lines: string[], colors: Record<string, Color>): Cell[][] => {
	const width = Math.max(...lines.map((line) => line.trim().length));
	const height = lines.length;
	const grid: Cell[][] = [];

	let id = 0;

	for (let y = 0; y < height; y++) {
		const row: Cell[] = [];
		let haveSeenWall = false;
		for (let x = 0; x < width; x++) {
			const char = lines[y][x] || '';
			let cell: Cell;

			if (char === '+') {
				haveSeenWall = true;
				cell = { type: CellVariant.Wall, id: (id++).toString() };
			} else if (!haveSeenWall) {
				cell = { type: CellVariant.Empty, id: (id++).toString() };
			} else if (char === ' ') {
				cell = { type: CellVariant.Free, id: (id++).toString() };
			} else if (colors?.[char]) {
				const entity = { type: EntityType.Agent, color: colors[char], id: char };
				cell = { type: CellVariant.Free, entity, id: (id++).toString() };
			} else if (char.match(/[A-Z]/i)) {
				const entity = { type: EntityType.Box, color: colors[char], id: char };
				cell = { type: CellVariant.Free, entity, id: (id++).toString() };
			} else {
				cell = { type: CellVariant.Empty, id: (id++).toString() };
			}
			row.push(cell);
		}
		grid.push(row);
	}
	return grid;
};

export const fromLevel = (levelString: string) => {
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
	return colorMap[color.toLowerCase() as Color];
}
