import React, { useState } from 'react';
import Select from 'react-select';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries';

const AuthorBirthForm = ({ authors }) => {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');
    const [selected, setSelected] = useState(null); // this extra state will be used for Select

    const [setBirthYear] = useMutation(EDIT_AUTHOR_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    // Select component needs an options array of objects that consists of value and label
    const options = authors.map((author) => {
        return { value: author.name, label: author.name };
    });

    // Select component will pass every option in the options array
    // and when the change happens we can reach the option as first parameter
    const handleSelection = (option) => {
        setSelected(option);
        setName(option.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setBirthYear({ variables: { name, setBornTo: Number(born) } });
        setName('');
        setBorn('');
        setSelected(null);
    };
    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <Select
                        options={options}
                        value={selected}
                        onChange={handleSelection}
                    />
                </div>
                <div>
                    born
                    <input
                        type='number'
                        value={born}
                        onChange={(e) => setBorn(e.target.value)}
                    />
                </div>
                <button>update author</button>
            </form>
        </div>
    );
};

export default AuthorBirthForm;
