import { getContext, setContext, tick } from 'svelte';
import { type CellVariant, type Color } from './cell';

const TOOL_KEY = 'tool';
const COLOR_KEY = 'color';

class ToolStore {
	tool: CellVariant | null = $state(null);
	color: Color | null = $state(null);

	isDragging = $state(false);
	nextAgentId = $state('0');
	nextBoxId = $state('A');

	constructor() {
		this.tool = localStorage.getItem(TOOL_KEY) as CellVariant | null;
		this.color = localStorage.getItem(COLOR_KEY) as Color | null;
	}

	setTool(tool: CellVariant) {
		this.tool = tool;
		localStorage.setItem(TOOL_KEY, tool);
	}

	setColor(color: Color) {
		this.color = color;
		localStorage.setItem(COLOR_KEY, color);
	}

	setIsDragging(val: boolean) {
		this.isDragging = val;
	}
}

const setTool = () => setContext('tool', new ToolStore());
const getTool = () => getContext('tool') as ToolStore;

export { setTool, getTool };
