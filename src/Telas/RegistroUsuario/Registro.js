// src/Register.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import logo from '../../assets/LOGO02.png'
import { BiUser, BiKey, BiHide, BiShow, BiEditAlt } from 'react-icons/bi';

function Registro() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

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

            setSuccess(true)

            setInterval(() => {
                setSuccess(false);
                navigate('/');
            }, 2500)
            
        } catch (error) {
            setError(true)
            setInterval(() => { setError(false) }, 2500)
        }
    };



    return (
        <>
            {error && <div class="alert alert-danger" id='custom-alert' role="alert">
                Inconsistência ao realizar o cadastro, tente novamente.
            </div>}

            {success && <div class="alert alert-success" id='custom-alert' role="alert">
                Registro bem-sucedido, realize o login!
            </div>}

            <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
                <img src={logo} style={{ width: '250px', height: '100px', marginTop: 16 }} />


                <div style={{ width: '75%', maxWidth: 500, textAlign: 'center', height: '60%', alignContent: 'center' }}>

                    <div style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26 }}>
                        Registre-se!
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
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    placeholder="E-mail"
                                    value={email}
                                    onChange={e => setEmail((e.target.value))}
                                    required
                                    style={{ width: '90%', height: '100%', border: 0, borderRadius: 0, backgroundColor: '#FFF' }}
                                />

                            </div>



                            <div
                                style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                            >
                                <BiKey style={{ width: '10%' }} size={26} />
                                <input
                                    type={mostrarSenha ? 'text' : "password"}
                                    className="form-control"
                                    id="senha"
                                    name="senha"
                                    placeholder="Senha"
                                    value={senha}
                                    onChange={e => setSenha((e.target.value))}
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
                                <p>Já possui conta? <Link className='text-danger' to={"/"}>Conecte-se!</Link></p>
                            </div>

                            <button type="submit" style={{ border: '1px solid #273585', backgroundColor: '#273585', color: '#FFF', borderRadius: 5, width: '50%', height: 50 }}>
                                Registrar-me
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Registro;
