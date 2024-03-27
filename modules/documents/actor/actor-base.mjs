import {spellPointTemplates} from "../../pf1e-spellPoints-main.mjs";
export const getSourceInfo = function (obj, key) {
    if (!obj[key]) {
        obj[key] = {negative: [], positive: []};
    }
    return obj[key];
};

export const setSourceInfoByName = function (obj, key, name, value, positive = true) {
    const target = positive ? "positive" : "negative";
    const sourceInfo = getSourceInfo(obj, key)[target];
    const data = sourceInfo.find((o) => o.name === name);
    if (data) data.value = value;
    else {
        sourceInfo.push({
            name: name,
            value: value,
        });
    }
};

export function displaySpellCost(sheet, [html], data) {
    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        const spellbookData = spellbook.orig;
        if (!spellbookData.spellPoints?.useSystem) {
            // Bail out if we're not using spell points
            continue;
        }

        for (const spellLevel in spellbook.data) {
            const spells = spellbook.data[spellLevel];
            spells.items.forEach((spell) => {
                const baseSpellCost = spell.document.getBaseSpellPointCost();
                const adjustedSpellCost = spell.document.getSpellPointCost();

                const spellRow = html.querySelector(`.item[data-item-id="${spell.id}"]`);
                const spellInfo = spellRow.querySelector(`.spell-uses > div`);

                spellInfo.innerHTML += adjustedSpellCost;

                if (adjustedSpellCost > baseSpellCost) {
                    spellInfo.classList.add("spell-cost-increased");
                }
            });
        }
    }
}

export function displaySpellsRemaining(sheet, [html], data) {
    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        const spellbookData = spellbook.orig;

        if (!spellbookData.spellPoints?.useSystem || !spellbookData.spellPoints?.autoCalculate) {
            // Bail out if we're not using spell points
            continue;
        }

        const allSpellsKnown = spellsAvailableMax[spellbookData.spellPoints.prepMode][spellbookData.spellPoints.autoAmount];
        const casterLevel = Math.max(0, Math.min(20, spellbookData.cl.total));
        const abilityScore = sheet.actor.system.abilities[spellbookData.ability].value;

        for (const spellLevel in spellbook.data) {
            const section = html.querySelector(`.book-${spellbookId}-body > .item-list[data-level="${spellLevel}"]`);
            const existingMessage = section.querySelector(".spell-level-message")
            if(existingMessage) existingMessage.remove()

            if (!+spellLevel && spellbookData.spellPoints.prepMode === 'prepared') {
                // Can prep as many as we want
                continue;
            }

            let removeLevel = false;
            if (!allSpellsKnown[spellLevel]) {
                removeLevel = true;
            }

            let maxSpellsKnown = (allSpellsKnown[spellLevel] || [])[casterLevel] || 0;
            if (spellbookData.spellPoints.prepMode && spellLevel > 0) {
                maxSpellsKnown += Math.max(0, Math.ceil((abilityScore - 9 - spellLevel * 2) / 8));
            }
            if (!maxSpellsKnown) {
                removeLevel = true;
            }

            const spellsKnownInLevel = spellbook.data[spellLevel].items.length;

            if (removeLevel && !spellsKnownInLevel) {
                section?.remove();
                const filterHeader = html.querySelector(`.filter-list[data-filter="spellbook-${spellbookId}"] > .filter-item[data-filter="type-${spellLevel}"]`);
                filterHeader?.remove();
            } else {
                let message = null;
                let diff = 0;

                const requiredAbilityScore = 10 + parseInt(spellLevel);
                if (abilityScore < requiredAbilityScore) {
                    message = "PF1.SpellScoreTooLow";
                } else {
                    let currentSpells = 0;
                    let tooLowMessage = "";

                    switch (spellbookData.spellPoints.prepMode) {
                        case 'prepared':
                            tooLowMessage = "PF1.PrepareMoreSpell";
                            currentSpells = spellbook.data[spellLevel].items.filter((item) => item.preparation.spontaneousPrepared).length;
                            break;

                        case 'spontaneous':
                            tooLowMessage = "PF1.LearnMoreSpell";
                            currentSpells = spellsKnownInLevel;
                            break;
                    }

                    diff = Math.abs(maxSpellsKnown - currentSpells);
                    if (currentSpells < maxSpellsKnown) {
                        message = (diff === 1) ? (tooLowMessage) : (tooLowMessage + "s");
                    } else if (currentSpells > maxSpellsKnown) {
                        message = "PF1.TooManySpells";
                    }
                }

                if (message) {
                    const preparedPhrase = game.i18n.localize(message).replace("{quantity}", diff);
                    const preparedMessage = $(`<h4 class=\"spell-level-message\">${preparedPhrase}</h4>`);
                    section.append(preparedMessage[0]);
                }
            }
        }
    }
}

export function subtractPreparedCantripCostOnRest(actor, options, updateData, itemUpdates) {
    if (!options.restoreDailyUses) {
        return;
    }

    let spellbooks = actor.system.attributes.spells.spellbooks;

    actor.items.forEach((item) => {
        if (item.type !== "spell") {
            return;
        }

        if (item.system.level > 0) {
            return;
        }

        if (!item.system.preparation.spontaneousPrepared) {
            return;
        }

        const spellbook = spellbooks[item.system.spellbook];
        if (!spellbook.spellPoints?.useSystem || !spellbook.spellPoints.autoCalculate) {
            // Bail out if we're not using spell points
            return;
        }

        if (spellbook.spellPoints.prepMode !== 'prepared') {
            return;
        }

        spellbook.spellPoints.value--;
    });

    actor.update({
        "system.attributes.spells.spellbooks": spellbooks
    })
}

export function resetSpellCosts(actor, options, updateData, itemUpdates) {
    if (!options.restoreDailyUses) {
        return;
    }

    const spellbooks = actor.system.attributes.spells.spellbooks;

    actor.items.forEach((item) => {
        if (item.type !== "spell") {
            return;
        }

        const spellbook = spellbooks[item.system.spellbook];
        if (!spellbook.spellPoints?.useSystem || !spellbook.spellPoints.autoCalculate) {
            // Bail out if we're not using spell points
            return;
        }

        item.update({
            "system.castCount": 0
        })
    });
}

const spellPointsBaseValues = {
    prepared: {
        low: [0, 0, 0, 0, 0, 2, 2, 2, 5, 7, 7, 11, 14, 16, 21, 25, 28, 30, 35, 39, 47],
        medium: [0, 5, 8, 10, 13, 18, 22, 26, 30, 39, 44, 49, 54, 67, 78, 84, 91, 108, 120, 133, 140],
        high: [0, 5, 8, 11, 16, 20, 27, 34, 43, 52, 63, 74, 87, 100, 115, 130, 147, 164, 183, 201, 220]
    },
    spontaneous: {
        low: [0, 0, 0, 0, 2, 2, 2, 5, 5, 7, 11, 11, 14, 21, 21, 25, 28, 30, 35, 39, 42],
        medium: [0, 2, 4, 6, 9, 14, 17, 21, 25, 34, 39, 44, 49, 62, 73, 79, 86, 103, 115, 128, 135],
        high: [0, 6, 8, 10, 21, 24, 39, 46, 65, 74, 97, 108, 135, 148, 179, 194, 229, 246, 285, 304, 324]
    }
}

const spellsAvailableMax = {
    prepared: {
        low: {
            1: [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4],
            2: [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4],
            3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 3]
        },
        medium: {
            0: [0, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            1: [0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            2: [0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            3: [0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 4, 4, 5, 5],
            6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5],
        },
        high: {
            0: [0, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            1: [0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            2: [0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            3: [0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            4: [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 4],
            6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4, 4, 4],
            7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 4, 4],
            8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4],
            9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4]
        }
    },
    spontaneous: {
        low: {
            1: [0, 0, 0, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            2: [0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6, 6, 6],
            3: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 5, 5, 5]
        },
        medium: {
            0: [4, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            1: [2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
            2: [0, 0, 0, 0, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6],
            3: [0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 6, 6],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 4, 5, 5, 5, 5, 6],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 4, 4, 5, 5],
            6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 4, 4, 5]
        },
        high: {
            0: [0, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],
            1: [0, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            2: [0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
            3: [0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
            4: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4],
            5: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4],
            6: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3, 3, 3],
            7: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 3],
            8: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 3, 3],
            9: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3]
        }
    }
}

export function extendSpellPointsOptions(sheet, [html], data) {
    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        if (!spellbook.orig?.spellPoints?.useSystem) {
            // Bail out if we're not using spell points
            continue;
        }

        html = $(html);
        const spellbookHtml = html.find(`.spellbook-group[data-tab="${spellbookId}"]`);

        const settingsRightContainer = spellbookHtml.find(".spell-settings").last();

        const settingsRightHtml = $(spellPointTemplates.actorSettingsRight({
            spellbook: spellbook.orig,
            spellbookId: spellbookId
        }));
        sheet.activateListeners(settingsRightHtml);
        settingsRightContainer.append(settingsRightHtml);

        const autoSpellLevelCalculation = settingsRightContainer.find(`input[name="system.attributes.spells.spellbooks.${spellbookId}.autoSpellLevelCalculation"]`);
        autoSpellLevelCalculation.parent().remove();

        const autoSpellLevels = settingsRightContainer.find(`input[name="system.attributes.spells.spellbooks.${spellbookId}.autoSpellLevels"]`);
        autoSpellLevels.parent().remove();

        const domainSlotValue = spellbookHtml.find(".domain-slot-value");
        domainSlotValue.remove();

        if (spellbook.rollData.spellPoints.autoCalculate) {
            const spellPointsValue = spellbookHtml.find(".spell-points");
            spellPointsValue.remove();

            const spellPointsRestValue = spellbookHtml.find(".spell-points-rest");
            spellPointsRestValue.remove();

            const settingsLeftHtml = $(spellPointTemplates.actorSettingsLeft({
                spellbook: spellbook.orig,
                spellbookId: spellbookId
            }));
            sheet.activateListeners(settingsLeftHtml);
            const settingsLeftContainer = spellbookHtml.find(".spell-settings").first();
            settingsLeftContainer.append(settingsLeftHtml);
        }
    }
}

export function extendActorTemplate(ActorTemplate) {
    return class SpellPointActorTemplate extends ActorTemplate {
        _updateSpellBook(bookId, rollData, cache) {
            super._updateSpellBook(bookId, rollData, cache);
            const actorData = this.system;
            const spellbook = actorData.attributes.spells.spellbooks[bookId];
            if (!spellbook) {
                return;
            }

            if (!spellbook.spellPoints?.useSystem && !spellbook.spellPoints?.autoCalculate) {
                return;
            }

            const casterLevelRoll = RollPF.safeRoll(spellbook.spellPoints.classLevelModification || "0", rollData);
            if (casterLevelRoll.err) console.error(casterLevelRoll.err, spellbook.spellPoints.classLevelModification);

            if (casterLevelRoll.total) {
                spellbook.cl.total += casterLevelRoll.total;
                setSourceInfoByName(
                    this.sourceInfo,
                    `system.attributes.spells.spellbooks.${bookId}.cl.total`,
                    game.i18n.localize("PF1.AutoSpellClassLevelOffset.Formula"),
                    casterLevelRoll.total
                );
            }
        }

        prepareDerivedData() {
            super.prepareDerivedData();
            const actorData = this.system;
            const rollData = this.getRollData();

            const spellBooks = actorData.attributes.spells.spellbooks;

            for (const [spellbookId, spellbook] of Object.entries(spellBooks)) {
                if (!spellbook.spellPoints?.useSystem && !spellbook.spellPoints?.autoCalculate) {
                    // Bail out if we're not using spell points
                    continue;
                }

                const classLevel = Math.min(20, Math.max(0, +spellbook.cl.total));
                const basePoints = spellPointsBaseValues[spellbook.spellPoints.prepMode][spellbook.spellPoints.autoAmount][classLevel];

                let maxAttributeBonus = 0;
                if (spellbook.spellPoints.eldritchAptitude) {
                    maxAttributeBonus = classLevel;
                } else {
                    switch (spellbook.spellPoints.autoAmount) {
                        case 'low':
                            maxAttributeBonus = Math.min(4, Math.ceil((classLevel - 3) / 3));
                            break;

                        case 'medium':
                            maxAttributeBonus = Math.min(6, Math.ceil(classLevel / 3));
                            break;

                        case 'high':
                            const offset = spellbook.spellPoints.prepMode === 'prepared' ? 0 : 1;
                            maxAttributeBonus = Math.min(9, Math.ceil((classLevel - offset) / 2));
                            break;
                    }
                }

                const attributeModifier = spellbook.ability ? actorData.abilities[spellbook.ability].mod : 0;
                const attributeBonus = Math.max(0, Math.min(maxAttributeBonus, attributeModifier));

                const extraPointsRoll = RollPF.safeRoll(spellbook.spellPoints.extraPointsFormula || "0", rollData);
                if (extraPointsRoll.err) console.error(extraPointsRoll.err, spellbook.spellPoints.extraPointsFormula);

                const spellPoints = basePoints + attributeBonus + extraPointsRoll.total;

                spellbook.spellPoints.max = spellPoints;
                spellbook.spellPoints.restore = spellPoints;
                spellbook.spellPoints.value = Math.min(spellPoints, spellbook.spellPoints.value);
            }
        }
    }
}