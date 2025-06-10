import { App } from 'obsidian';
import { Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType } from "@codemirror/view";
import { RangeSetBuilder } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";
import { LinkRangeSettings } from "./settings";
import { findPatternForFile } from './utils';

class CharacterOverwriteWidget extends WidgetType {

    private char: string;
    constructor(char: string) {
        super();
        this.char = char;
    }

    toDOM() {
        const el = document.createElement("span");
        el.innerText = this.char;
        el.style.textDecoration = 'underline';
        return el;
    }
}

export function buildCMViewPlugin(app: App, settings: LinkRangeSettings) {

    const viewPlugin = ViewPlugin.fromClass(
        class {
            decorations: DecorationSet;
            decoratedRanges: Array<{ from: number, to: number }>;
            lastLocation: { from: number; to: number; };
            
            constructor(view: EditorView) {
                this.decorations = this.buildDecorations(view, null);
                this.lastLocation = { from: 0, to: 0 };
            }

            update(update: ViewUpdate) {
                const currentLocation = {
                    from: update.state.selection.ranges[0].from,
                    to: update.state.selection.ranges[0].to
                };
                if (update.docChanged || update.viewportChanged) {
                    this.decorations = this.buildDecorations(update.view, currentLocation);
                }
                else {
                    // isRepeatUpdate - avoid repeated updates and renders
                    const isRepeatUpdate = this.lastLocation.from == currentLocation.from && this.lastLocation.to === currentLocation.to;
                    if (update.state.selection.ranges.length > 0 && !isRepeatUpdate) {
                        this.decorations = this.buildDecorations(update.view, currentLocation);
                    }
                }
                this.lastLocation = currentLocation;
            }

            buildDecorations(view: EditorView, location: { from: number, to: number } | null): DecorationSet {
                const builder = new RangeSetBuilder<Decoration>();

                const lastPassDecoratedRanges: Array<{from: number, to: number}> = this.decoratedRanges;
                this.decoratedRanges = [];

                const inLastPass = function(nodeStart: number, index: number | undefined): boolean {
                    if (index === undefined) {
                        return false;
                    }

                    for (const i in lastPassDecoratedRanges) {
                        const rng = lastPassDecoratedRanges[i];

                        if (rng.from == nodeStart && index >= rng.from && index <= rng.to) {
                        return true;
                        }
                    }
                    return false;
                }

                for (const {from, to} of view.visibleRanges) {

                    syntaxTree(view.state).iterate({
                        from,
                        to,
                        enter: (node) => {
                            // Big thanks to Supercharged Links. Used your code as an example! https://github.com/mdelobelle/obsidian_supercharged_links
                            
                            // TODO: there used to be a different way than splitting the name but the api for this has
                            //   changed in CodeMirror. Should look into it more.
                            const tokenProps = node.type.name.split('_');
                            if (tokenProps) {
                                const props = new Set(tokenProps);
                                const isLink = props.has("hmd-internal-link");
                                const isAlias = props.has("link-alias");
                                const isPipe = props.has("link-alias-pipe");
                                
                                const isMDUrl = props.has('url');
                                
                                if (isLink && !isAlias && !isPipe || isMDUrl) {
                                    const linkText = view.state.doc.sliceString(node.from, node.to);
                                    
                                    const indexOfHeaderMarker = linkText.indexOf(':');
                                    const indexOfHeaderMarkerInDoc = indexOfHeaderMarker + node.from;
                                    if (indexOfHeaderMarkerInDoc >= node.from && indexOfHeaderMarkerInDoc <= node.to) {
                                        if (!inLastPass(node.from - 2, location?.from)) {
                                        
                                            const fileName = linkText.substring(0, indexOfHeaderMarker);
                                            const pattern = findPatternForFile(fileName, settings);                                            
                                            
                                            // Overrides the line prefix character (':') to what is specified in settings
                                            if (pattern.lineVisual !== '') {
                                                const overrideP2HWidget = Decoration.widget({
                                                    widget: new CharacterOverwriteWidget(pattern.lineVisual),
                                                });
                                                builder.add(indexOfHeaderMarkerInDoc, indexOfHeaderMarkerInDoc + 1, overrideP2HWidget);  
                                            }

                                            // Overrides the line separator character to what is specified in settings
                                            if (pattern.lineSeparatorVisual !== '') {
                                                const indexOfRangeMarker = linkText.indexOf(settings.lineSeparator) + node.from;
                                                if (indexOfRangeMarker >= node.from && indexOfRangeMarker <= node.to) {
                                                    const overrideH2HWidget = Decoration.widget({
                                                        widget: new CharacterOverwriteWidget(pattern.lineSeparatorVisual),
                                                    });
                                                    builder.add(indexOfRangeMarker, indexOfRangeMarker + settings.lineSeparator.length, overrideH2HWidget);
                                                }
                                            }
                                        }

                                        this.decoratedRanges.push({
                                            from: node.from - 2,
                                            to: node.to + 2
                                        });  
                                    }
                                }
                            }
                        }
                    })
                }

                const bufferedDecs = builder.finish();
                return bufferedDecs;
            }
        },
        {
            decorations: v => v.decorations
        }
    );

    return viewPlugin;
} 