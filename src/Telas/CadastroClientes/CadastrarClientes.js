import React, { useState, useEffect } from 'react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../../firebase';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiDoorOpen, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function CadastrarClientes() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [cpfExists, setCpfExists] = useState(false); // Estado para verificar se o CPF já existe
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);

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

    const handleLogout = () => {
        signOut(auth);
    }

    const handleBack = () => {
        navigate(-1);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verifique se o CPF tem 11 dígitos
        if (cpf.length !== 11) {
            alert('Erro: O CPF deve ter 11 dígitos.');
            return;
        }

        // Verifique se o CPF já existe na coleção de clientes
        try {
            const q = query(collection(db, 'clientes'), where('cpf', '==', cpf));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                setCpfExists(true);
                alert('Erro: CPF já cadastrado.');
                return;
            }

            // Se o CPF não existir, prossiga com o cadastro
            await addDoc(collection(db, 'clientes'), {
                nome,
                cpf,
                endereco,
                numero
            });

            alert('Cliente cadastrado com sucesso!');
            setNome('');
            setCpf('');
            setEndereco('');
            setNumero('');
            setCpfExists(false);
        } catch (error) {
            console.error('Erro ao verificar ou cadastrar cliente:', error);
            alert('Erro ao cadastrar cliente');
        }
    };

    return (
        <div className="container-fluid bg-pastel-blue vh-100">
            <div className="row justify-content-center">
                <div className='header row'>
                    <div className='p-4 col-6 text-start'>
                        <button className='btn border-none ' onClick={handleBack}>
                            <BiArrowBack className='' style={{ fontSize: "30px" }} />
                        </button>
                    </div>
                    <div className='p-4 col-6 text-end'>
                        <button className='btn border-none ' onClick={handleLogout}>
                            <BiDoorOpen className='' style={{ fontSize: "30px" }} />
                        </button>
                    </div>
                    <h1 className='p-2'>Cadastrar Clientes</h1>
                    <hr />
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome Completo:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        placeholder="Digite o nome completo"
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="cpf">CPF:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="cpf"
                                        name="cpf"
                                        placeholder="Digite o CPF"
                                        value={cpf}
                                        onChange={e => setCpf(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="endereco">Endereço:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="endereco"
                                        name="endereco"
                                        placeholder="Digite o endereço"
                                        value={endereco}
                                        onChange={e => setEndereco(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="numero">Número:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="numero"
                                        name="numero"
                                        placeholder="Digite o número"
                                        value={numero}
                                        onChange={e => setNumero(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-outline-primary btn-block mt-4">
                                    Cadastrar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastrarClientes;
