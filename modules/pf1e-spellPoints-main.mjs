import {
    displaySpellCost, displaySpellsRemaining, extendActorTemplate,
    extendSpellPointsOptions,
    resetSpellCosts,
} from "./documents/actor/actor-base.mjs";
import {extendItemSpellPointOptions, extendSpellTemplate} from "./documents/item/item-spell.mjs";

export const MODULE_NAME = "pf1e-spell-points";

export let spellPointTemplates = {
    spellPointAutoToggle: `modules/pf1e-spell-points/template/actor/spellPointAutoToggle.hbs`,

    actorSettingsLeft: `modules/pf1e-spell-points/template/actor/settingsLeft.hbs`,
    actorSettingsRight: `modules/pf1e-spell-points/template/actor/settingsRight.hbs`,
    spellSettings: `modules/pf1e-spell-points/template/item/spellSettings.hbs`,
};

Hooks.once("setup", () => {
    for (let i in spellPointTemplates) {
        const templatePath = spellPointTemplates[i];
        getTemplate(templatePath).then(t => spellPointTemplates[i] = t)
    }
});

Hooks.once("pf1PostInit", () => {
    pf1.documents.actor = Object.assign(pf1.documents.actor, {
        ActorBasePF: extendActorTemplate(pf1.documents.actor.ActorBasePF),
        ActorCharacterPF: extendActorTemplate(pf1.documents.actor.ActorCharacterPF),
        ActorNPCPF: extendActorTemplate(pf1.documents.actor.ActorNPCPF),
        ActorPF: extendActorTemplate(pf1.documents.actor.ActorPF)
    });

    pf1.documents.item = Object.assign(pf1.documents.item, {
        ItemSpellPF: extendSpellTemplate(pf1.documents.item.ItemSpellPF)
    });

    CONFIG.Actor.documentClasses = Object.assign(CONFIG.Actor.documentClasses, {
        basic: extendActorTemplate(CONFIG.Actor.documentClasses.basic),
        character: extendActorTemplate(CONFIG.Actor.documentClasses.character),
        npc: extendActorTemplate(CONFIG.Actor.documentClasses.npc)
    })

    CONFIG.Item.documentClasses = Object.assign(CONFIG.Item.documentClasses, {
        spell: extendSpellTemplate(CONFIG.Item.documentClasses.spell)
    });
});

Hooks.on("renderItemSheetPF", extendItemSpellPointOptions);
Hooks.on("renderActorSheetPF", extendSpellPointsOptions);
Hooks.on("renderActorSheetPF", displaySpellCost);
Hooks.on("renderActorSheetPF", displaySpellsRemaining);
Hooks.on("pf1ActorRest", resetSpellCosts);