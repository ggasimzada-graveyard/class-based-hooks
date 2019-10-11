import { useState, useEffect, useContext } from 'react';

export class Hook {
    run() {
        throw new Error('Not Implemented');
    }
}

export class StateHook extends Hook {
    constructor(initialValue = null) {
        super();
        this._initialValue = initialValue;
        this._hookRet = null;
    }

    run() {
        this._hookRet = useState(this._initialValue);
    }

    get value() {
        // if hook hasn't returned anything, return initial value
        if (!this._hookRet) return this._initialValue;

        // return value from hook return
        return this._hookRet[0];
    }

    set value(val) {
        // if hook hasn't returned anything, do nothing
        if (!this._hookRet) return;

        // call setter from hook return
        this._hookRet[1](val);
    }
}

export class ContextHook extends Hook {
    constructor(context) {
        super();
        this._contextObj = context;
        this._contextVal = context.defaultValue; // not sure if this exists
    }

    run() {
        this._contextVal = useContext(this._contextObj);
    }

    get value() {
        return this._contextVal;
    }
}

export class EffectHook extends Hook {
    constructor(effect, deps) {
        super();
        this._effect = effect;
        this._deps = deps;
    }

    run() {
        const realDeps = this._deps.map(dep => {
            if (dep instanceof StateHook) {
                // if dependency is state, take value from it
                return dep.value;
            } else if (dep instanceof ContextHook) {
                // if dependency is context, take context value
                return dep.value;
            }

            // return default value
            return dep;
        });
        useEffect(this._effect, realDeps); // eslint-disable-line
    }
}

export class CustomHook extends Hook {
    run() {
        Object.values(this)
            .filter(val => val instanceof Hook)
            .forEach(hook => hook.run());
    }
}
