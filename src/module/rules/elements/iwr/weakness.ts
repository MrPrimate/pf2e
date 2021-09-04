import { LabeledWeakness, WeaknessType } from "@actor/data/base";
import { IWRRuleElement, IWRRuleElementData } from "./base";

/** @category RuleElement */
class WeaknessRuleElement extends IWRRuleElement {
    dictionary = CONFIG.PF2E.weaknessTypes;

    get property(): LabeledWeakness[] {
        return this.actor.data.data.traits.dv;
    }

    validate(value: unknown): boolean {
        return (
            this.data.type in this.dictionary &&
            typeof value == "number" &&
            value > 0 &&
            (!this.data.except || typeof this.data.except === "string")
        );
    }

    getIWR(value: number): LabeledWeakness | null {
        const weaknesses = this.property;
        const current = weaknesses.find((weakness) => (weakness.type = this.data.type));
        if (current)
            this.data.override
                ? weaknesses.splice(weaknesses.indexOf(current), 1)
                : (current.value = Math.max(current.value, value));
        return {
            label: this.dictionary[this.data.type],
            type: this.data.type,
            value,
            exceptions: this.data.except,
        };
    }
}

interface WeaknessRuleElement extends IWRRuleElement {
    data: WeaknessData;
}

interface WeaknessData extends IWRRuleElementData {
    type: WeaknessType;
}

export { WeaknessRuleElement };
