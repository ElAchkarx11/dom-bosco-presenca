import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs, and } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/LOGO02.png'
import { BiUser, BiHome, BiDirections, BiEditAlt, BiArrowBack } from 'react-icons/bi';

function CadastrarClientes() {
    const navigate = useNavigate();
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [nome, setNome] = useState('');

    function cleanString(stringToClean = '') {
        return stringToClean.replace(/[^a-zA-Z0-9]/g, '').trim();
    }



    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                navigate('/');
            }
        });
        return unsubscribe;
    }, [navigate]);

    const handleBack = () => {
        navigate(-1);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();


        // Verifique se o CPF tem 11 dígitos
        if (cpf.trim().length >= 1 && cpf.trim().length < 11) {
            setMessage('O CPF deve conter 11 dígitos.')
            setError(true)
            return;
        } else if (cpf.length <= 0) {
            if (nome.trim().length >= 0 && nome.trim().length < 3) {
                setMessage('O nome deve conter pelo menos 3 dígitos.')
                setError(true)
                return;
            } else {
                validateClienteWithoutCPF()
            }
        } else if (cpf.trim().length === 11) {
            validateClienteWithCPF()
        }


    };

    async function cadastrarCliente() {
        await addDoc(collection(db, 'clientes'), {
            nome,
            cpf,
            endereco,
            numero
        });

        setMessage('Cliente cadastrado com sucesso!')
        setSuccess(true)
        setNome('');
        setCpf('');
        setEndereco('');
        setNumero('');
    }

    async function validateClienteWithoutCPF() {
        try {

            const isValidEndereco = endereco.length > 0 ? where('endereco', '==', endereco.trim()) : null;
            const isValidNumber = numero.length > 0 ? where('numero', '==', numero.trim()) : null;
            const isValidName = where('nome', '==', nome.trim());

            const clauses = [isValidName, isValidEndereco, isValidNumber].filter(clause => clause !== null);

            const clausules = and(...clauses);

            const q = query(collection(db, 'clientes'), clausules);
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setMessage('Cliente já cadastrado.')
                setError(true)
                return;
            }

            cadastrarCliente()
        } catch (error) {
            console.error('Erro ao verificar ou cadastrar cliente:', error);
            setMessage('Inconsistência ao cadastrar cliente')
            setError(true)

        }
    }

    async function validateClienteWithCPF() {
        // Verifique se o CPF já existe na coleção de clientes
        try {
            const q = query(collection(db, 'clientes'), where('cpf', '==', cpf.trim()));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setMessage('CPF já cadastrado.')
                setError(true)
                return;
            }

            cadastrarCliente()
        } catch (error) {
            console.error('Erro ao verificar ou cadastrar cliente:', error);
            setMessage('Inconsistência ao cadastrar cliente')
            setError(true)

        }
    }

    useEffect(() => {
        if (error) {
            const interval = setInterval(() => { setError(false) }, 2500);
            clearInterval(interval)
        }

        if (success) {
            const interval = setInterval(() => { setSuccess(false) }, 2500);
            clearInterval(interval)

        }
    }, [error, success]);

    return (
        <>
            {error && <div class="alert alert-danger" id='custom-alert' role="alert">
                {message}
            </div>}

            {success && <div class="alert alert-success" id='custom-alert' role="alert">
                {message}
            </div>}

            <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <img src={logo} style={{ width: '250px', height: '100px', marginTop: 16 }} />


                <div style={{ width: '75%', maxWidth: 500, textAlign: 'center', height: '60%', alignContent: 'center' }}>

                    <div style={{ display: 'flex', color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <BiArrowBack style={{ width: '10%' }} size={26} onClick={handleBack} />

                        Cadastrar cliente
                    </div>
                    <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5, }}>
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}
                            >
                                <BiEditAlt style={{ width: '10%' }} size={26} />
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nome"
                                    name="nome"
                                    placeholder="Nome completo"
                                    value={nome}
                                    onChange={e => setNome((e.target.value))}
                                    required
                                    style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                                />

                            </div>

                            <div
                                style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}
                            >
                                <BiUser style={{ width: '10%' }} size={26} />
                                <input
                                    type="number"
                                    className="form-control"
                                    id="cpf"
                                    name="cpf"
                                    placeholder="CPF"
                                    value={cpf}
                                    onChange={e => setCpf((e.target.value))}
                                    style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                                />

                            </div>

                            <div
                                style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}
                            >
                                <BiHome style={{ width: '10%' }} size={26} />
                                <input
                                    type="text"
                                    className="form-control"
                                    id="endereco"
                                    name="endereco"
                                    placeholder="Endereço"
                                    value={endereco}
                                    onChange={e => setEndereco((e.target.value))}
                                    style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}

                                />

                            </div>

                            <div
                                style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}
                            >
                                <BiDirections style={{ width: '10%' }} size={26} />
                                <input
                                    type="number"
                                    className="form-control"
                                    id="numero"
                                    name="numero"
                                    placeholder="Número"
                                    value={numero}
                                    onChange={e => setNumero(cleanString(e.target.value))}
                                    style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                                />

                            </div>

                            <button type="submit" style={{ border: '1px solid #273585', backgroundColor: '#273585', color: '#FFF', borderRadius: 5, width: '50%', height: 50, marginTop: 8 }}>
                                Cadastrar
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
}

export default CadastrarClientes;
