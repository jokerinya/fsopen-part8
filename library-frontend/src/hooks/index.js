import { useState } from 'react';

export const useField = (type) => {
    const [value, setValue] = useState('');

    const onChange = (event) => {
        setValue(event.target.value);
    };

    const clear = (value = '') => {
        setValue(value);
    };

    return { type, value, onChange, clear };
};
