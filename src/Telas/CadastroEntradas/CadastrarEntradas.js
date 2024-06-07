// src/RegistrarEntrada.js
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiDoorOpen, BiArrowBack } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';


function CadastrarEntrada() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
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

        try {
            // Verifica se o cliente existe na coleção "Clientes"
            const q = query(collection(db, 'clientes'), where('nome', '==', nome), where('cpf', '==', cpf));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                alert('Cliente não encontrado!');
            } else {
                // Registro da entrada na coleção "Entradas"
                const cliente = querySnapshot.docs[0].data();
                await addDoc(collection(db, 'entradas'), {
                    clienteId: querySnapshot.docs[0].id,
                    nome: cliente.nome,
                    cpf: cliente.cpf,
                    timestamp: new Date()
                });
                alert('Entrada registrada com sucesso!');
                setNome('');
                setCpf('');
            }
        } catch (error) {
            console.error('Erro ao registrar entrada:', error);
            alert('Erro ao registrar entrada');
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
                    <h1 className='p-2'>Registrar Entrada</h1> {/* Exibe o nome do usuário autenticado */}
                    <hr />
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header text-dark">
                            <h3 className="mb-0 text-center">Registro de Entrada</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="nome">Nome:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="nome"
                                        name="nome"
                                        placeholder="Digite o nome"
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
                                <button type="submit" className="btn btn-outline-primary btn-block mt-4">
                                    Registrar Entrada
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CadastrarEntrada;
