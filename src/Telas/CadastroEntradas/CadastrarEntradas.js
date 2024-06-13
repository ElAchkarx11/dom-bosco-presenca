import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import logo from '../../assets/LOGO02.png';
import { BiUser, BiArrowBack } from 'react-icons/bi';

function CadastrarEntrada() {
    const navigate = useNavigate();

    const [selectedCliente, setSelectedCliente] = useState(null);
    const [authenticated, setAuthenticated] = useState(false);
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);

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

    const fetchClientes = async (inputValue) => {
        if (!inputValue) return [];

        const lowercasedInput = inputValue.toLowerCase();
        const q = query(collection(db, 'clientes'));
        const querySnapshot = await getDocs(q);

        return querySnapshot.docs
            .map(doc => {
                const nome = doc.data().nome.toLowerCase();
                if (nome.includes(lowercasedInput)) {
                    return {
                        value: doc.id,
                        label: `${doc.data().nome} (${doc.data().cpf})`
                    };
                }
                return null;
            })
            .filter(doc => doc !== null);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            if (selectedCliente === null) {
                setMessage('Selecione um cliente válido.');
                setError(true);
                return;
            }

            const clienteId = selectedCliente.value;
            const clienteSnapshot = await getDocs(query(collection(db, 'clientes'), where('__name__', '==', clienteId)));
            const clienteData = clienteSnapshot.docs[0].data();

            await addDoc(collection(db, 'entradas'), {
                clienteId: clienteId,
                nome: clienteData.nome,
                cpf: clienteData.cpf,
                timestamp: new Date()
            });

            setMessage('Entrada registrada com sucesso!');
            setSuccess(true);
            setSelectedCliente(null);
        } catch (error) {
            console.error('Erro ao registrar entrada:', error);
            setMessage('Inconsistência ao registrar entrada.');
            setError(true);
        }
    };

    useEffect(() => {
        if (error) {
            const interval = setInterval(() => { setError(false); }, 2500);
            return () => clearInterval(interval);
        }

        if (success) {
            const interval = setInterval(() => { setSuccess(false); }, 2500);
            return () => clearInterval(interval);
        }
    }, [error, success]);

    return (
        <>
            {error && <div className="alert alert-danger" id="custom-alert" role="alert">
                {message}
            </div>}

            {success && <div className="alert alert-success" id="custom-alert" role="alert">
                {message}
            </div>}

            <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <img src={logo} style={{ width: '250px', height: '100px', marginTop: 16 }} alt="Logo" />

                <div style={{ width: '75%', maxWidth: 500, textAlign: 'center', height: '60%', alignContent: 'center' }}>
                    <div style={{ display: 'flex', color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                        <BiArrowBack style={{ width: '10%' }} size={26} onClick={handleBack} />

                        Registar entrada
                    </div>

                    <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5 }}>
                        <form onSubmit={handleSubmit}>
                            <div style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, display: 'flex', alignItems: 'center' }}>
                                <BiUser style={{ width: '10%' }} size={26} />
                                <div style={{ width: '90%'}}>
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={fetchClientes}
                                        defaultOptions
                                        value={selectedCliente}
                                        onChange={setSelectedCliente}
                                        placeholder="Nome completo"
                                        styles={{
                                            control: (provided) => ({ ...provided,padding: '5px', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }),
                                        }}
                                    />
                                </div>
                            </div>

                            <button type="submit" style={{ border: '1px solid #273585', backgroundColor: '#273585', color: '#FFF', borderRadius: 5, width: '50%', height: 50, marginTop: 8 }}>
                                Registrar
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CadastrarEntrada;
