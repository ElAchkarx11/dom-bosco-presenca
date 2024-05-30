// src/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Registro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
            const user = userCredential.user;

            // Salvar informações adicionais do usuário no Firestore
            await addDoc(collection(db, 'users'), {
                uid: user.uid,
                nome: nome,
                email: email
            });

            alert('Registro bem-sucedido!');
            navigate('/Home');
        } catch (error) {
            alert("Erro ao Registrar!")
        }
    };


    return (
        <div className="container-fluid bg-pastel-blue vh-100">
            <div className="row justify-content-center">
                <h1 className="text-center p-4">Instituto Dom Bosco</h1>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header text-dark">
                            <h3 className="mb-0 text-center">Crie uma conta</h3>
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
                                        placeholder="Digite seu nome"
                                        value={nome}
                                        onChange={e => setNome(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        placeholder="Digite seu email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="senha">Senha:</label>
                                    <div className="input-group">
                                        <input
                                            type={mostrarSenha ? 'text' : 'password'}
                                            className="form-control"
                                            id="senha"
                                            name="senha"
                                            placeholder="Digite sua senha"
                                            value={senha}
                                            onChange={e => setSenha(e.target.value)}
                                            required
                                        />
                                        <div className="input-group-append">
                                            <button
                                                className="btn btn-outline-secondary"
                                                type="button"
                                                onClick={() => setMostrarSenha(!mostrarSenha)}
                                            >
                                                {mostrarSenha ? 'Ocultar' : 'Mostrar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-outline-primary btn-block mt-4">
                                    Registrar
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>Já possui uma conta? <Link className='text-danger' to={"/"}>Entre aqui</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;
