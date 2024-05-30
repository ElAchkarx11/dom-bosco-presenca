// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';

function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();

        signInWithEmailAndPassword(auth, email, senha)
            .then(userCredential => {
                const user = userCredential.user;
                alert('Login bem-sucedido!');
                navigate('/Home');
            })
            .catch(error => {
                alert("Erro ao fazer Login!")
            });
    };

    return (
        <div className="container-fluid bg-pastel-blue vh-100">
            <div className="row justify-content-center">
                <h1 className="text-center p-4">Instituto Dom Bosco</h1>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header text-dark">
                            <h3 className="mb-0 text-center">Olá, Bem-Vindo(a)!</h3>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="usuario">Usuário:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="usuario"
                                        name="usuario"
                                        placeholder="Digite seu usuário"
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
                                    Entrar
                                </button>
                            </form>
                            <div className="text-center mt-3">
                                <p>Não possui conta? <Link className='text-danger' to={"/Registro"}>Registre-se aqui!</Link></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
