import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { EDIT_AUTHOR_BORN, ALL_AUTHORS } from '../queries';

const AuthorBirthForm = () => {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [setBirthYear] = useMutation(EDIT_AUTHOR_BORN, {
        refetchQueries: [{ query: ALL_AUTHORS }],
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        setBirthYear({ variables: { name, setBornTo: Number(born) } });
        setBorn('');
    };
    return (
        <div>
            <h2>Set birthyear</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    name
                    <input
                        type='text'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
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
