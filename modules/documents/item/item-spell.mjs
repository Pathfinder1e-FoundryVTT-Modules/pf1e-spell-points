import {spellPointTemplates} from "../../pf1e-spellPoints-main.mjs";

export function extendSpellTemplate(SpellTemplate) {
    return class SpellPointSpellTemplate extends SpellTemplate {
        async use(args) {
            if (this.useSpellPoints()) {
                const spellpointConfig = this.spellbook.spellPoints;

                if (this.system.level === 0
                    && spellpointConfig.autoCalculate
                    && spellpointConfig.prepMode === 'spontaneous'
                    && !spellpointConfig.value
                ) {
                    // Require at least 1 spell point to cast cantrips as spontaneous caster
                    return void ui.notifications.warn(game.i18n.format("PF1.ErrorInsufficientCharges", {name: this.name}));
                }

                const spellpointPercentage = spellpointConfig.value / spellpointConfig.max;
                if (spellpointPercentage <= 0.5
                    && (this.actor.system.attributes.conditions.fatigued || this.actor.system.attributes.conditions.exhausted)) {
                    return void ui.notifications.warn(game.i18n.format("PF1SP.ExhaustedAndSpellpointsTooLow", {name: this.name}));
                }
            }

            const response = await super.use(args);
            this.update({
                "system.castCount": (this.system.castCount || 0) + 1
            })
            return response;
        }

        get isCharged() {
            if (this.system.level === 0 && this.useSpellPoints()) {
                return false;
            }

            return super.isCharged;
        }

        getDefaultChargeCost({rollData} = {}) {
            if (this.useSpellPoints()) {
                return this.getSpellPointCost();
            }

            return super.getDefaultChargeCost({rollData});
        }

        getRollData() {
            const data = super.getRollData();
            data.castCount = this.system.castCount || 0;
            return data;
        }

        getBaseSpellPointCost() {
            return this.getSpellPointCost(0);
        }

        // async addCharges(value, data = null) {
        //     if (!this.actor) return;
        //     if (this.system.atWill) return;
        //
        //     if (value < 0 && this.useSpellPoints() && this.system.level === 0) {
        //         // Cantrips are always for free
        //         return this;
        //     }
        //
        //     return super.addCharges(value, data);
        //
        // }

        getSpellPointCost(castCountOverride) {
            if (this.system.level === 0) {
                return 0;
            }

            const formula = "" || this.getSpellPointCostBaseFormula();
            const rollData = this.getRollData();

            if (castCountOverride !== undefined) {
                rollData.castCount = castCountOverride;
            }

            const costRoll = RollPF.safeRoll(formula, rollData);
            if (costRoll.err) console.error(costRoll.err, formula);

            return costRoll.total;
        }

        getSpellPointCostBaseFormula() {
            const spellbook = this.spellbook;
            const spellpointConfig = spellbook.spellPoints;

            if (!spellpointConfig.useSystem) {
                return "1 + @sl";
            }

            switch (spellpointConfig.prepMode) {
                case "spontaneous":
                    if (this.system.eldritchFocus) {
                        return "1 + @sl + max(0, @castCount - 2)";
                    }

                    return "1 + @sl + @castCount";

                case "prepared":
                    if (this.system.eldritchFocus) {
                        return "1 + @sl + @castCount";
                    }

                    return "1 + @sl * (@castCount + 1)";

                default:
                    return "1 + @sl";
            }
        }
    }
}

export function extendItemSpellPointOptions(sheet, [html], data) {
    html = $(html);
    const document = sheet.document;
    const spellbook = document.spellbook;

    if (!spellbook || !spellbook.spellPoints.useSystem) return;

    const spellPointInput = html.find("input[name='system.spellPoints.cost']");
    spellPointInput.attr("placeholder", document.getSpellPointCostBaseFormula());

    const spellSettings = $(spellPointTemplates.spellSettings({
        spell: document
    }));
    spellSettings.insertAfter(spellPointInput.closest('.form-group'));
}