/**
 * Gym Evolution - Units Converter & Formatter (Global Scope)
 * Supports Metric (kg, cm) and Imperial (lb, in) systems
 */

window.GymEvo = window.GymEvo || {};

window.GymEvo.Units = {
    STORAGE_KEY: 'gym_evo_unit_system',

    /**
     * Get current unit system: 'metric' or 'imperial'
     */
    getSystem() {
        return localStorage.getItem(this.STORAGE_KEY) || 'metric';
    },

    /**
     * Set unit system and trigger update
     */
    setSystem(system) {
        if (system === 'metric' || system === 'imperial') {
            localStorage.setItem(this.STORAGE_KEY, system);
            window.dispatchEvent(new CustomEvent('gym-evo-unit-change', { detail: { system } }));
            return system;
        }
        return 'metric';
    },

    /**
     * Toggle between metric and imperial
     */
    toggle() {
        const next = this.getSystem() === 'metric' ? 'imperial' : 'metric';
        return this.setSystem(next);
    },

    // Conversion formulas (Internal data always stored in Metric: kg, cm)
    kgToLb(kg) {
        if (kg === null || kg === undefined || isNaN(kg)) return null;
        return parseFloat((kg * 2.20462).toFixed(1));
    },

    lbToKg(lb) {
        if (lb === null || lb === undefined || isNaN(lb)) return null;
        return parseFloat((lb / 2.20462).toFixed(1));
    },

    cmToIn(cm) {
        if (cm === null || cm === undefined || isNaN(cm)) return null;
        return parseFloat((cm / 2.54).toFixed(1));
    },

    inToCm(inch) {
        if (inch === null || inch === undefined || isNaN(inch)) return null;
        return parseFloat((inch * 2.54).toFixed(1));
    },

    /**
     * Format weight value based on active system
     * @param {number} kgVal - Weight stored in kg
     * @returns {Object} { val: number, unit: string, formatted: string }
     */
    formatWeight(kgVal) {
        if (kgVal === null || kgVal === undefined || isNaN(kgVal)) {
            return { val: 0, unit: this.getWeightUnit(), formatted: `0 ${this.getWeightUnit()}` };
        }
        const isImperial = this.getSystem() === 'imperial';
        const val = isImperial ? this.kgToLb(kgVal) : parseFloat(Number(kgVal).toFixed(1));
        const unit = isImperial ? 'باوند (lb)' : 'كجم (kg)';
        return { val, unit, formatted: `${val} ${unit}` };
    },

    /**
     * Format length/waist value based on active system
     * @param {number} cmVal - Length stored in cm
     * @returns {Object} { val: number, unit: string, formatted: string }
     */
    formatLength(cmVal) {
        if (cmVal === null || cmVal === undefined || isNaN(cmVal)) {
            return { val: 0, unit: this.getLengthUnit(), formatted: `0 ${this.getLengthUnit()}` };
        }
        const isImperial = this.getSystem() === 'imperial';
        const val = isImperial ? this.cmToIn(cmVal) : parseFloat(Number(cmVal).toFixed(1));
        const unit = isImperial ? 'إنش (in)' : 'سم (cm)';
        return { val, unit, formatted: `${val} ${unit}` };
    },

    getWeightUnit() {
        return this.getSystem() === 'imperial' ? 'باوند' : 'كجم';
    },

    getLengthUnit() {
        return this.getSystem() === 'imperial' ? 'إنش' : 'سم';
    }
};
