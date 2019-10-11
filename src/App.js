import React, { useState } from 'react';
import HookComponent from './HookComponent';

import Context from './context';

export default () => {
    const [val, setValue] = useState('');
    const [contextVal, setContextVal] = useState('');

    return (
        <Context.Provider value={contextVal}>
            <div>
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter name"
                    value={val}
                    onChange={e => {
                        setValue(e.target.value);
                    }}
                />
            </div>
            <div>
                <label htmlFor="name">Context: </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter context value"
                    value={contextVal}
                    onChange={e => {
                        setContextVal(e.target.value);
                    }}
                />
            </div>
            <hr />
            <HookComponent name={val} />
        </Context.Provider>
    );
};
