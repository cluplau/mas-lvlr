import {
	CellVariant,
	EntityVariant,
	canHaveEntity,
	isWallCell,
	isEmptyCell,
	isAgentGoalCell,
	isBoxGoalCell,
	type Entity,
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
import { localState } from '@sv-use/core';
import { getContext, setContext } from 'svelte';

const LEVEL_NAME_KEY = 'levelname';
const GRID_KEY = 'grid';
const WIDTH_KEY = 'width';
const HEIGHT_KEY = 'height';

class GridStore {
	#name: { current: string } = localState(LEVEL_NAME_KEY, 'New level');
	#grid: { current: Cell[][] } = localState(GRID_KEY, [[]]);
	#width: { current: number } = localState(WIDTH_KEY, 0);
	#height: { current: number } = localState(HEIGHT_KEY, 0);

	get name(): string {
		return this.#name.current;
	}
	get grid(): Cell[][] {
		return this.#grid.current;
	}
	get width(): number {
		return this.#width.current;
	}
	get height(): number {
		return this.#height.current;
	}

	set name(v: string) {
		this.#name.current = v;
	}
	set grid(v: Cell[][]) {
		this.#grid.current = v;
	}
	set width(v: number) {
		this.#width.current = v;
	}
	set height(v: number) {
		this.#height.current = v;
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

	setCell(row: number, col: number, type: CellVariant, id: string = 'A'): Cell | undefined {
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
				goalFor: id,
				entity: canHaveEntity(cell) ? cell.entity : undefined
			} satisfies CellBoxGoal;
			return;
		}
		if (type === CellVariant.AgentGoal && canHaveEntity(cell)) {
			this.grid[row][col] = {
				id: cell.id,
				type: CellVariant.AgentGoal,
				goalFor: id,
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

	toString() {
		const domain = 'hospital';
		const levelName = this.name;

		const colorMap = new Map<string, Set<string>>();
		const addToColorMap = (color: string, id: string) => {
			if (!colorMap.has(color)) colorMap.set(color, new Set());
			colorMap.get(color)!.add(id);
		};

		// Collect colors info from the grid
		for (const row of this.grid) {
			for (const cell of row) {
				if (canHaveEntity(cell) && cell.entity) {
					addToColorMap(cell.entity.color, cell.entity.id);
				}
			}
		}

		// Generate #colors section
		const colorsSection = Array.from(colorMap.entries())
			.map(([color, ids]) => `${color}: ${Array.from(ids).join(',')}`)
			.join('\n');

		// Grid renderer
		const renderGrid = (isGoal: boolean): string => {
			return this.grid
				.map((row) =>
					row
						.map((cell) => {
							if (isWallCell(cell)) return '+';
							if (isEmptyCell(cell)) return ' ';
							if (isGoal) {
								if (isAgentGoalCell(cell)) return cell.goalFor;
								if (isBoxGoalCell(cell)) return cell.goalFor;
								return ' ';
							} else {
								if (canHaveEntity(cell) && cell.entity) {
									return cell.entity.id;
								}
								return ' ';
							}
						})
						.join('')
				)
				.join('\n');
		};

		return `#domain
${domain}
#levelname
${levelName}
#colors
${colorsSection}
#initial
${renderGrid(false)}
#goal
${renderGrid(true)}
#end`;
	}

	load(level: string) {
		const { width, height, initialGrid, name } = fromLevel(level);
		this.width = width;
		this.height = height;
		this.grid = initialGrid;
		this.name = name;
	}

	fromDimensions(width: number, height: number, cells: CellVariant, name: string) {
		let grid: Cell[][] = [];
		let id = 0;
		for (let i = 0; i < height; i++) {
			let row = [];
			for (let j = 0; j < width; j++) {
				row.push({ type: cells, id: (id++).toString() } as Cell);
			}
			grid.push(row);
		}

		this.width = width;
		this.height = height;
		this.grid = grid;
		this.name = name;
	}
}

const defaultLevel = `#domain
hospital
#levelname
Spds
#colors
blue: 0
#initial
+++++++++++++
+0          +
+           +
+           +
+           +
+           +
+           +
+++++++++++++
#goal
+++++++++++++
+           +
+           +
+           +
+           +
+           +
+          0+
+++++++++++++
#end
`;

const normalizeLines = (lines: string[]): string[] => {
	const trimmed = lines.map((line) => line.replace(/\s+$/, '')); // remove trailing spaces
	const width = Math.max(...trimmed.map((line) => line.length));
	return trimmed.map((line) => line.padEnd(width, ' '));
};

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

const floodFillOutside = (lines: string[]): boolean[][] => {
	const height = lines.length;
	const width = Math.max(...lines.map((line) => line.length));
	const visited = Array.from({ length: height }, () => Array(width).fill(false));

	const inBounds = (y: number, x: number) => y >= 0 && y < height && x >= 0 && x < lines[y].length;

	const queue: [number, number][] = [];

	for (let y = 0; y < height; y++) {
		for (let x of [0, width - 1]) {
			if (inBounds(y, x) && lines[y][x] !== '+') queue.push([y, x]);
		}
	}
	for (let x = 0; x < width; x++) {
		for (let y of [0, height - 1]) {
			if (inBounds(y, x) && lines[y][x] !== '+') queue.push([y, x]);
		}
	}

	while (queue.length > 0) {
		const [y, x] = queue.shift()!;
		if (!inBounds(y, x) || visited[y][x]) continue;
		if (lines[y][x] === '+') continue;

		visited[y][x] = true;

		[
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0]
		].forEach(([dy, dx]) => {
			const ny = y + dy;
			const nx = x + dx;
			if (inBounds(ny, nx) && !visited[ny][nx] && lines[ny][nx] !== '+') {
				queue.push([ny, nx]);
			}
		});
	}

	return visited;
};

const detectEnclosedVoids = (lines: string[], alreadyVisited: boolean[][]): boolean[][] => {
	const height = lines.length;
	const width = lines[0]?.length || 0;
	const voids = Array.from({ length: height }, () => Array(width).fill(false));
	const visited = alreadyVisited.map((row) => [...row]);

	const inBounds = (y: number, x: number) => y >= 0 && y < height && x >= 0 && x < width;

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x++) {
			if (visited[y][x] || lines[y][x] === '+') continue;

			const region: [number, number][] = [];
			const queue: [number, number][] = [[y, x]];
			let isEnclosed = true;
			let containsContent = false;

			while (queue.length > 0) {
				const [cy, cx] = queue.pop()!;
				if (!inBounds(cy, cx) || visited[cy][cx] || lines[cy][cx] === '+') continue;

				const ch = lines[cy][cx];
				if (ch.match(/[A-Z0-9]/)) containsContent = true;

				visited[cy][cx] = true;
				region.push([cy, cx]);

				if (cy === 0 || cy === height - 1 || cx === 0 || cx === width - 1) {
					isEnclosed = false;
				}

				for (const [dy, dx] of [
					[0, 1],
					[1, 0],
					[0, -1],
					[-1, 0]
				]) {
					queue.push([cy + dy, cx + dx]);
				}
			}

			if (isEnclosed && !containsContent) {
				for (const [vy, vx] of region) {
					voids[vy][vx] = true;
				}
			}
		}
	}
	return voids;
};

const parseLevel = (lines: string[], goals: string[], colors: Record<string, Color>): Cell[][] => {
	const width = Math.max(...lines.map((line) => line.length));
	const height = lines.length;
	const grid: Cell[][] = [];
	const outside = floodFillOutside(lines);
	const voids = detectEnclosedVoids(lines, outside);

	let id = 0;

	for (let y = 0; y < height; y++) {
		const row: Cell[] = [];
		for (let x = 0; x < width; x++) {
			const char = lines[y][x] || '';
			const goal = goals[y][x] || '';
			let cell: Cell;
			let entity: Entity | null = null;

			if (char.match(/[A-Z]/i)) {
				entity = { type: EntityVariant.Box, color: colors[char], id: char };
			} else if (colors?.[char]) {
				entity = { type: EntityVariant.Agent, color: colors[char], id: char };
			}

			if (outside[y][x] || voids[y][x]) {
				cell = { type: CellVariant.Empty, id: (id++).toString() };
			} else if (char === '+') {
				cell = { type: CellVariant.Wall, id: (id++).toString() };
			} else if (goal.match(/[A-Z]/i)) {
				cell = { type: CellVariant.BoxGoal, id: (id++).toString(), goalFor: goal };
			} else if (!isNaN(parseInt(goal, 10))) {
				cell = { type: CellVariant.AgentGoal, id: (id++).toString(), goalFor: goal };
			} else {
				cell = { type: CellVariant.Free, id: (id++).toString() };
			}

			if (canHaveEntity(cell) && entity != null) {
				cell.entity = entity;
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

	const initial = normalizeLines(sections['initial'] || []);
	const goal = normalizeLines(sections['goal'] || []);

	const initialGrid = parseLevel(initial, goal, colors);
	const width = initialGrid[0]?.length || 0;
	const height = initialGrid.length;
	const name = sections['levelname'][0].trim();

	return { initialGrid, height, width, name };
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

const getGrid = () => getContext('grid') as GridStore;
const setGrid = () => {
	let savedGrid = localStorage.getItem(GRID_KEY);
	let savedWidth = localStorage.getItem(WIDTH_KEY);
	let savedHeight = localStorage.getItem(HEIGHT_KEY);

	if (!savedGrid || !savedWidth || !savedHeight) {
		const { width, height, initialGrid } = fromLevel(defaultLevel);

		localStorage.setItem(GRID_KEY, JSON.stringify(initialGrid));
		localStorage.setItem(WIDTH_KEY, width.toString());
		localStorage.setItem(HEIGHT_KEY, height.toString());
	}

	setContext('grid', new GridStore());
};

export { setGrid, getGrid, GridStore };
