import React from 'react';
import {
    State,
    Effect,
    CustomHook,
    createComponent,
    NewComponent,
    Context
} from './class-hooks';

import someContext from './context';

class TimerHook extends CustomHook {
    timerValue = new State('');
    timerStatus = new State(false);

    constructor(intervalStep) {
        super();
        this._intervalStep = intervalStep;
    }

    randomStr() {
        let str = '';
        for (let i = 0; i < 12; i++) {
            str += this.randomChar();
        }
        return str;
    }

    randomChar() {
        const chars =
            '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
        return chars.substr(Math.floor(Math.random() * 62), 1);
    }

    effect = new Effect(() => {
        if (this.timerStatus.value) {
            this.timerRef = setInterval(() => {
                this.timerValue.value = this.randomStr();
            }, this._intervalStep);
        } else {
            clearInterval(this.timerRef);
        }

        return () => clearInterval(this.timerRef);
    }, [this.timerStatus]);

    get value() {
        return this.timerValue.value;
    }

    get status() {
        return this.timerStatus.value;
    }

    toggleTimer() {
        this.timerStatus.value = val => !val;
    }
}

class MyHookComponent extends NewComponent {
    timedState = new State('Test');

    randomState = new State(1);

    context = new Context(someContext);

    customHook = new TimerHook(1000);

    // Use effect to update state
    effect = new Effect(() => {
        setTimeout(() => {
            this.timedState.value = 'new value';
        }, 2000);
    }, []);

    // use effect with states
    effect2 = new Effect(() => {
        console.log('randomState:', this.randomState.value);
    }, [this.anotherState]);

    effect3 = new Effect(() => {
        console.log('timedState:', this.timedState.value);
    }, [this.myState]);

    // use effect with props
    effect4 = new Effect(() => {
        console.log('Name prop:', this.props.name);
    }, [this.props.name]);

    // use effect with context
    effect5 = new Effect(() => {
        console.log('Context value:', this.context.value);
    }, [this.context]);

    render() {
        return (
            <div>
                <ul>
                    <li>Name prop: {this.props.name}</li>
                    <li>Timed value: {this.timedState.value}</li>
                    <li>Random value: {this.randomState.value}</li>
                    <li>Context value: {this.context.value}</li>
                    <li>
                        Custom hook value (click{' '}
                        {!this.customHook.status ? (
                            <>"Start timer" to randomize</>
                        ) : (
                            <>"Stop timer" to stop the timer</>
                        )}
                        ): {this.customHook.value}
                    </li>
                </ul>
                <button
                    type="button"
                    onClick={e => {
                        e.preventDefault();
                        // this variable calls the implemented setter in StateHook
                        this.randomState.value = Math.floor(
                            Math.random() * 100
                        );
                    }}
                >
                    Randomize!
                </button>
                <button
                    type="button"
                    onClick={() => this.customHook.toggleTimer()}
                >
                    {this.customHook.status ? 'Stop' : 'Start'} timer
                </button>
            </div>
        );
    }
}

export default createComponent(MyHookComponent);
