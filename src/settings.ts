import LinkRange from "main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { postProcessorUpdate } from "./utils";

export interface LinkRangeSettings {
	bibleFolder: string;
	settingsVersion: string;
}

export const DEFAULT_SETTINGS: LinkRangeSettings = {
	bibleFolder: '',
	settingsVersion: 'v4',
}

export class LinkRangeSettingTab extends PluginSettingTab {
	plugin: LinkRange;

	constructor(app: App, plugin: LinkRange) {
		super(app, plugin);
		this.plugin = plugin;
		this.migrateOldSettings();
	}

	migrateOldSettings() {
		// Settings migration can be removed as this is now Bible-specific
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		this.createH2('Bible Embed Settings')

		new Setting(containerEl)
			.setName('Bible Folder Path')
			.setDesc('Path to the folder containing your Bible books and chapters (e.g., "Bible" for a folder named "Bible")')
			.addText(text => text
				.setPlaceholder('Enter folder path (e.g., "Bible")')
				.setValue(this.plugin.settings.bibleFolder)
				.onChange(async (value) => {
					this.plugin.settings.bibleFolder = value;
					await this.plugin.saveSettings();
					postProcessorUpdate(this.app)
				}));
	}

	createH2(text: string) {
		const {containerEl} = this;
		containerEl.createEl('h2', { text: text });
	}

	
}
