import { getContext, setContext, tick } from 'svelte';
import { CellVariant, type EntityVariant, type Color } from './cell';
import { localState } from '@sv-use/core';

const TOOL_KEY = 'tool';
const COLOR_KEY = 'color';
const AUTO_INC_AGENT_KEY = 'auto-inc-agent';
const AUTO_INC_BOX_KEY = 'auto-inc-box';

class ToolStore {
	#tool: { current: CellVariant | EntityVariant } = localState(TOOL_KEY, CellVariant.Free);
	#color: { current: Color } = localState(COLOR_KEY, 'blue');

	isDragging = $state(false);
	nextAgentId = $state('0');
	nextBoxId = $state('A');
	autoIncrementAgent = localState(AUTO_INC_AGENT_KEY, false);
	autoIncrementBox = localState(AUTO_INC_AGENT_KEY, false);

	get tool(): CellVariant | EntityVariant {
		return this.#tool.current;
	}
	get color(): Color {
		return this.#color.current;
	}

	setTool(tool: CellVariant | EntityVariant) {
		this.#tool.current = tool;
	}

	setColor(color: Color) {
		this.#color.current = color;
	}

	setIsDragging(val: boolean) {
		this.isDragging = val;
	}

	incrementAgentId() {
		if (!this.autoIncrementAgent.current) return;

		let nextAgentId = parseInt(this.nextAgentId) + 1;
		if (nextAgentId > 9) {
			nextAgentId = 1;
		}
		this.nextAgentId = String(nextAgentId);
	}

	incrementBoxId() {
		if (!this.autoIncrementBox.current) return;

		this.nextBoxId = String.fromCharCode(this.nextBoxId.charCodeAt(0) + 1);
		if (this.nextBoxId > 'Z') {
			this.nextBoxId = 'A';
		}
	}
}

const setTool = () => setContext('tool', new ToolStore());
const getTool = () => getContext('tool') as ToolStore;

export { setTool, getTool };
