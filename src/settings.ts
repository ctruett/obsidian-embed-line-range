import LinkRange from "main";
import { App, PluginSettingTab, Setting, ButtonComponent } from "obsidian";
import { postProcessorUpdate } from "./utils";

export interface Pattern {
	lineVisual: string;
	lineSeparatorVisual: string;
	path: string;
}

export interface LinkRangeSettings {
	lineSeparator: string;
	endInclusive: boolean;
	altFormat: string; // This is for backwards compatibility
	settingsVersion: string;
	patterns: [Pattern]
	getDefaultPattern() : Pattern
}

export const DEFAULT_SETTINGS: LinkRangeSettings = {
	lineSeparator: '..',
	endInclusive: true,
	altFormat: '',
	settingsVersion: 'v3',
	patterns: [{ lineVisual: ':', lineSeparatorVisual: '-', path: '/' }],

	getDefaultPattern() {
		const first = this.patterns[0];
		if (!first) {
			return { lineVisual: ':', lineSeparatorVisual: '-', path: '/' }
		}

		return first;
	},
}

export class LinkRangeSettingTab extends PluginSettingTab {
	plugin: LinkRange;

	constructor(app: App, plugin: LinkRange) {
		super(app, plugin);
		this.plugin = plugin;
		this.migrateOldSettings();
	}

	migrateOldSettings() {
		const stgs = this.plugin.settings;

		const hasV1Settings = stgs.altFormat != undefined && stgs.altFormat.length > 0;
		if (hasV1Settings) {	

			// default altFormat string: `$note:$h1-$h2` (legacy heading format)
			const altFormat = stgs.altFormat;
			const indexOfNote = altFormat.indexOf('$note');
			const indexOfH1 = altFormat.indexOf('$h1');
			const indexOfH2 = altFormat.indexOf('$h2');

			const formatIsValid = indexOfNote === 0 && indexOfH1 !== -1 && indexOfH2 !== -2;
			
			if (formatIsValid) {
				const firstValue = altFormat.substring('$note'.length, indexOfH1);
				const secondValue = altFormat.substring(indexOfH1 + '$h1'.length, indexOfH2);

				stgs.patterns = [{ lineVisual: firstValue, lineSeparatorVisual: secondValue, path: '' }]
			}

			stgs.altFormat = '';
			this.plugin.saveSettings();
		}
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		this.createH2('Settings for link-range plugin')

		new Setting(containerEl)
			.setName('Line Separator')
			.setDesc('Defines the separator to be used to define a link line range. Defaults to ".." (e.g. [[Note Name:10..25]])')
			.addText(text => text
				.setPlaceholder('Enter a separator string (defaults to ..)')
				.setValue(this.plugin.settings.lineSeparator)
				.onChange(async (value) => {
					this.plugin.settings.lineSeparator = value;
					await this.plugin.saveSettings();
					postProcessorUpdate(this.app)
				}));

		new Setting(containerEl)
			.setName('End Inclusive')
			.setDesc('Whether or not the end line should be inclusive or exclusive')
			.addToggle(bool => bool
				.setValue(this.plugin.settings.endInclusive)
				.onChange(async (value) => {
					this.plugin.settings.endInclusive = value;
					await this.plugin.saveSettings();
					postProcessorUpdate(this.app)
				}));
	
		new Setting(this.containerEl)
			.setName("Add a New Visual Pattern")
			.setDesc("Add new pattern to match files in a directory. The first value will change the visual for the line prefix in a link. The second value will change the visual for separator. The third specifies the folder in which the files must be to match. The first match, starting bottom up, will be applied. Therefore, the first is the default pattern.")
			.addButton((button: ButtonComponent) => {
				button
					.setTooltip("Add new pattern to match files in a directory.")
					.setButtonText("+")
					.setCta()
					.onClick(() => {
						this.plugin.settings.patterns.push({
							lineVisual: '',
							lineSeparatorVisual: '',
							path: ''
						});
						this.plugin.saveSettings();
						this.display();
					});
			});
		
			this.plugin.settings.patterns.forEach(
				(pattern, index) => {
					const s = new Setting(this.containerEl)
					.addText(text => text
						.setPlaceholder('Enter a line prefix override')
						.setValue(pattern.lineVisual)
						.onChange(async (value) => {
							pattern.lineVisual = value;
							await this.plugin.saveSettings();
							postProcessorUpdate(this.app)
						}))
					.addText(text => text
						.setPlaceholder('Enter a separator override')
						.setValue(pattern.lineSeparatorVisual)
						.onChange(async (value) => {
							pattern.lineSeparatorVisual = value;
							await this.plugin.saveSettings();
							postProcessorUpdate(this.app)
						}))
					.addText(text => text
						.setPlaceholder(index === 0 ? '(global)' : 'Enter a path')
						.setValue(pattern.path)
						.setDisabled(index === 0)
						.onChange(async (value) => {
							pattern.path = value;
							await this.plugin.saveSettings();
							postProcessorUpdate(this.app)
						}));

					if (index === 0) {
						s.addExtraButton((cb) => {
							cb.setIcon("lock")
								.setTooltip("This pattern is the default and cannot be completed");					
						});
					}
					else {
						if (index !== 0) {
							s.addExtraButton((cb) => {
								cb.setIcon("cross")
									.setTooltip("Delete")
									.onClick(() => {
										this.plugin.settings.patterns.splice(
											index,
											1
										);
										this.plugin.saveSettings();
										this.display();
									});
						
							});
						}
					}
				}
			);
	}

	createH2(text: string) {
		const {containerEl} = this;
		containerEl.createEl('h2', { text: text });
	}

	
}
