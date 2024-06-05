// src/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../assets/LOGO01.png'
import { BiUser, BiKey, BiHide, BiShow } from 'react-icons/bi';

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
                navigate('/Home');
            })
            .catch(error => {
                alert("Erro ao realizar Login.")
            });
    };


    return (
        <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
            <img src={logo} style={{ width: '150px', height: '150px',marginTop: 16 }} />


            <div style={{ width: '75%', maxWidth: 500, textAlign: 'center', height: '60%', alignContent: 'center' }}>

                <div style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26 }}>
                    Olá, bem-vindo(a)!
                </div>

                <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5, }}>
                    <form onSubmit={handleSubmit}>
                        <div
                            style={{ border: '2px solid #273585',borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', alignItems: 'center' }}
                        >
                            <BiUser style={{ width: '10%' }} size={26} />
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                name="email"
                                placeholder="E-mail"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                            />

                        </div>



                        <div
                            style={{ border: '2px solid #273585',borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <BiKey style={{ width: '10%' }} size={26} />
                            <input
                                type={mostrarSenha ? 'text': "password"}
                                className="form-control"
                                id="senha"
                                name="senha"
                                placeholder="Senha"
                                value={senha}
                                onChange={e => setSenha(e.target.value)}
                                required
                                style={{ width: '80%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                            />
                            <div onClick={() => setMostrarSenha((curr) => !curr)} style={{ width: '10%' }} >

                                {
                                    mostrarSenha ? <BiShow size={26} /> : <BiHide size={26} />
                                }
                            </div>

                        </div>

                        <div className="text-center mt-3">
                            <p>Não possui conta? <Link className='text-danger' to={"/Registro"}>Registre-se!</Link></p>
                        </div>

                        <button type="submit" style={{ border: '1px solid #273585', backgroundColor: '#273585', color: '#FFF', borderRadius: 5, width: '50%', height: 50 }}>
                            Entrar
                        </button>
                    </form>
                </div>
            </div>

        </div>
    );
}

export default Login;
