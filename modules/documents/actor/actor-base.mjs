import {spellPointTemplates} from "../../pf1e-spellPoints-main.mjs";

const spellPointsBaseValues = {
    prepared: {
        low: [0, 0, 0, 0, 0, 2, 2, 2, 5, 7, 7, 11, 14, 16, 21, 25, 28, 30, 35, 39, 47],
        med: [0, 5, 8, 10, 13, 18, 22, 26, 30, 39, 44, 49, 54, 67, 78, 84, 91, 108, 120, 133, 140],
        high: [0, 5, 8, 11, 16, 20, 27, 34, 43, 52, 63, 74, 87, 100, 115, 130, 147, 164, 183, 201, 220]
    },
    spontaneous: {
        low: [0, 0, 0, 0, 2, 2, 2, 5, 5, 7, 11, 11, 14, 21, 21, 25, 28, 30, 35, 39, 42],
        med: [0, 2, 4, 6, 9, 14, 17, 21, 25, 34, 39, 44, 49, 62, 73, 79, 86, 103, 115, 128, 135],
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
        med: {
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
        med: {
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

export function displaySpellCost(sheet, [html], data) {
    if(data.spellbookData === undefined) return;

    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        if (!spellbook.spellPoints?.useSystem) {
            // Bail out if we're not using spell points
            continue;
        }

        for (const spellLevel in spellbook.sections) {
            const spells = spellbook.sections[spellLevel];
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
    const rollData = sheet.actor.getRollData();

    if(data.spellbookData === undefined) return;

    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        if (!spellbook.spellPoints?.useSystem || !spellbook.spellPoints?.autoCalculate) {
            // Bail out if we're not using spell points
            continue;
        }

        const allSpellsKnown = spellsAvailableMax[spellbook.spellPreparationMode][spellbook.casterType];
        const casterLevel = data.actor.getEffectiveSpellPointCasterLevel(spellbook);
        const abilityScore = sheet.actor.system.abilities[spellbook.ability].value;

        const allLevelModFormula = spellbook.preparedAllOffsetFormula || "0";
        const allLevelMod = RollPF.safeRollSync(allLevelModFormula, rollData).total;

        for (let spellLevel = 0; spellLevel <= 9; spellLevel++) {
            const section = html.querySelector(`.book-${spellbookId}-body > .item-list[data-level="${spellLevel}"]`);

            let notificationTarget = section.querySelector(".spell-notifications");
            if (notificationTarget) {
                notificationTarget.innerHTML = "";
            } else {
                notificationTarget = document.createElement("div");
                notificationTarget.classList.add("spell-notifications");
                section.append(notificationTarget);
            }


            if (spellLevel === 0 && spellbook.spellPreparationMode === 'prepared') {
                // Can prep as many as we want
                continue;
            }

            let removeLevel = false;
            if (!allSpellsKnown[spellLevel]) {
                removeLevel = true;
            }

            let maxSpellsKnown = (allSpellsKnown[spellLevel] || [])[casterLevel] || null;

            if (maxSpellsKnown === null) {
                removeLevel = true;
            } else {
                // Add bonus spells for manual modification
                if (spellbook.spellPreparationMode === 'prepared') {
                    maxSpellsKnown += allLevelMod;

                    const levelModFormula = spellbook.spells["spell" + spellLevel].preparedOffsetFormula || "0";
                    const levelMod = RollPF.safeRollSync(levelModFormula, rollData).total;

                    maxSpellsKnown += levelMod;
                }

                // Add bonus spells for high ability scores
                if (spellbook.spellPreparationMode && spellLevel > 0) {
                    maxSpellsKnown += Math.max(0, Math.ceil((abilityScore - 9 - spellLevel * 2) / 8));
                }

                if (!maxSpellsKnown) {
                    removeLevel = true;
                }
            }

            const spellsInLevel = spellbook.sections[spellLevel].items;

            if (removeLevel) {
                if (!spellsInLevel.length) {
                    section?.remove();
                    const filterHeader = html.querySelector(`.spellbook[data-group="${spellbookId}"] .filter-item[data-filter="level-${spellLevel}"]`);
                    filterHeader?.remove();
                    continue;
                }
                // TODO: Implement at some point, maybe
                // else {
                //     notificationTarget.append(createMessage("PF1.Spellbook.InsufficientLevel", 10, true, true));
                // }
            }
            if (abilityScore < 10 + spellLevel) {
                notificationTarget.append(createMessage("PF1.Spellbook.InsufficientAbility", 10 + spellLevel, true, true));
            }

            switch (spellbook.spellPreparationMode) {
                case 'prepared':
                    const preparedSpells = spellsInLevel.filter((item) => item.preparation.value).length;
                    const preparedMessage = createMessage("PF1.Prepared", maxSpellsKnown - preparedSpells)
                    if (preparedMessage) {
                        notificationTarget.append(preparedMessage);
                    }
                    break;

                case 'spontaneous':
                    const knownMessage = createMessage("PF1.Spellbook.Known", maxSpellsKnown - spellsInLevel.length);
                    if (knownMessage) {
                        notificationTarget.append(knownMessage);
                    }
                    break;
            }
        }
    }
}

function createMessage(message, value = 0, unsigned = false, isWarning = false) {
    if (value === 0) return;
    if (value > 0 && !unsigned) value = `+${value}`;
    const wrapper = document.createElement("div");
    wrapper.classList.add("notification-box", "spellpoint-message");
    if (isWarning) {
        wrapper.classList.add("warning");
    }
    message = game.i18n.localize(message)
    wrapper.innerHTML = `<h5>${message}</h5><span class="value">${value}</span>`;
    return wrapper;
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

export function extendSpellPointsOptions(sheet, [html], data) {
    html = $(html);

    if(data.spellbookData === undefined) return;

    for (const [spellbookId, spellbook] of Object.entries(data.spellbookData)) {
        const spellbookHtml = html.find(`.spellbook-group[data-tab="${spellbookId}"]`);

        /*== START Add Spell Point Auto Calculate Option ==*/
        const spellPointToggleName = `system.attributes.spells.spellbooks.${spellbookId}.spellPoints.useSystem`;
        const toggleInput = spellbookHtml.find(`input[name="${spellPointToggleName}"]`);
        const toggleWrapper = toggleInput.closest("label");
        const autoWrapper = toggleInput.closest(".autopoints")
        const autoCalculateSpellPointsToggle = $(spellPointTemplates.spellPointAutoToggle({
            spellbook: spellbook,
            spellbookId: spellbookId
        }))
        if (autoWrapper.length) autoWrapper.replaceWith(autoCalculateSpellPointsToggle);
        else toggleWrapper.replaceWith(autoCalculateSpellPointsToggle);
        /*== END Add Spell Point Auto Calculate Option ==*/

        if (!spellbook.spellPoints?.useSystem || !spellbook.spellPoints?.autoCalculate) {
            // we're all done here, the system is not enabled
            continue;
        }

        // Remove domain slot and spell point options
        spellbookHtml.find(".form-group.domain-slot-value, .form-group.spell-points, .form-group.spell-points-rest").remove();

        const spellSettings = spellbookHtml.find('.spell-settings');

        const leftOptions = $(spellPointTemplates.actorSettingsLeft({
            spellbook: spellbook,
            spellbookId: spellbookId
        }))
        spellSettings.first().append(leftOptions);

        const rightOptions = $(spellPointTemplates.actorSettingsRight({
            spellbook: spellbook,
            spellbookId: spellbookId
        }))
        spellSettings.last().append(rightOptions);
    }
}

export function extendActorTemplate(ActorTemplate) {
    return class SpellPointActorTemplate extends ActorTemplate {
        getEffectiveSpellPointCasterLevel(spellbook) {
            let casterLevel = +spellbook.cl.total
            if (this.system.conditions.wtWounded) {
                casterLevel += 2;
            }
            if (this.system.conditions.wtCritical) {
                casterLevel += 4;
            }

            return Math.clamped(casterLevel, 0, 20);
        }

        _updateSpellBook(bookId, rollData, cache) {
            super._updateSpellBook(bookId, rollData, cache);
            const actorData = this.system;
            const spellbook = actorData.attributes.spells.spellbooks[bookId];
            if (!spellbook || (!spellbook.spellPoints?.useSystem && !spellbook.spellPoints?.autoCalculate)) {
                return;
            }

            const casterLevelRoll = RollPF.safeRollSync(spellbook.spellPoints.classLevelModification || "0", rollData, {}, {});
            if (casterLevelRoll.err) console.error(casterLevelRoll.err, spellbook.spellPoints.classLevelModification);
            else spellbook.cl.total += casterLevelRoll.total || 0;
        }

        prepareDerivedData() {
            super.prepareDerivedData();
            const actorData = this.system;
            const rollData = this.getRollData();

            const spellBooks = actorData.attributes.spells.spellbooks;

            for (const [spellbookId, spellbook] of Object.entries(spellBooks)) {
                if (!spellbook.spellPoints) {
                    spellbook.spellPoints = {
                        useSystem: false,
                        autoCalculate: false,
                    }
                }

                if (!spellbook.spellPoints.useSystem && !spellbook.spellPoints.autoCalculate) {
                    // Bail out if we're not using spell points
                    continue;
                }

                const classLevel = this.getEffectiveSpellPointCasterLevel(spellbook);
                const basePoints = spellPointsBaseValues[spellbook.spellPreparationMode][spellbook.casterType][classLevel];

                let maxAttributeBonus = 0;
                if (spellbook.spellPoints.eldritchAptitude) {
                    maxAttributeBonus = classLevel;
                } else {
                    switch (spellbook.casterType) {
                        case 'low':
                            maxAttributeBonus = Math.clamped(Math.ceil((classLevel - 3) / 3), 0, 4);
                            break;

                        case 'med':
                            maxAttributeBonus = Math.clamped(Math.ceil(classLevel / 3), 0, 6);
                            break;

                        case 'high':
                            const offset = spellbook.spellPreparationMode === 'prepared' ? 0 : 1;
                            maxAttributeBonus = Math.clamped(Math.ceil((classLevel - offset) / 2), 0, 9);
                            break;
                    }
                }

                const attributeModifier = spellbook.ability ? actorData.abilities[spellbook.ability].mod : 0;
                const attributeBonus = Math.clamped(attributeModifier, 0, maxAttributeBonus);

                const extraPointsRoll = RollPF.safeRollSync(spellbook.spellPoints.extraPointsFormula || "0", rollData, {}, {});
                if (extraPointsRoll.err) console.error(extraPointsRoll.err, spellbook.spellPoints.extraPointsFormula);

                const spellPoints = basePoints + attributeBonus + extraPointsRoll.total;
                let preparedCantripCost = 0;
                if(spellbook.spellPreparationMode === 'prepared' && !spellbook.spellPoints?.freeCantrips) {
                    preparedCantripCost += this.itemTypes.spell.filter(spell =>
                        spell.system.spellbook === spellbookId
                        && spell.system.level === 0
                        && spell.system.preparation.value
                    ).length
                }

                spellbook.spellPoints.maxFormula = "" + spellPoints;
                spellbook.spellPoints.max = spellPoints;
                spellbook.spellPoints.restore = spellPoints - spellbook.spellPoints.value - preparedCantripCost;
                spellbook.spellPoints.restoreFormula = "" + spellbook.spellPoints.restore;
                spellbook.spellPoints.value = Math.min(spellPoints, spellbook.spellPoints.value);
                console.log(spellbook.spellPoints);
            }
        }
    }
}