import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { BiDoorOpen } from 'react-icons/bi';
import { db, auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
    const [userName, setUserName] = useState(null); // Estado para armazenar o nome do usuário autenticado
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthenticated(true);
                fetchUserName(user.email); // Chame fetchUserName quando o usuário estiver autenticado
            } else {
                setAuthenticated(false);
                navigate('/');
            }
        });
        return unsubscribe;
    }, [navigate]);

    const fetchUserName = async (email) => {
        try {
            const q = query(collection(db, "users"), where("email", "==", email)); //Pesquisa na base de dados o campo específico
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(doc => {
                setUserName(doc.data().nome); // Atualiza o estado com o nome do usuário
            });
        } catch (error) {
            console.error('Erro ao buscar dados do Firestore:', error);
        }
    };

    const handleLogout = () => {
        signOut(auth);
    }

    const handleBack = () => {
        navigate(-1);//Volta para a tela anterior
    }

    return (
        <div className='container-fluid'>
            <div className='row justify-content-center'>
                <div className='header row'>
                    <div className='p-4 col-12 text-end'>
                        <button className='btn border-none' onClick={handleLogout}>
                            <BiDoorOpen className='' style={{ fontSize: "30px" }} />
                        </button>
                    </div>
                    <h1 className='p-2'>Olá, {userName}</h1> {/* Exibe o nome do usuário autenticado */}
                    <hr />
                </div>
                <div className='content text-center'>
                    <div className='col-12 py-2'>
                        <Link to={"/CadastrarClientes"} className='btn col-6 btn-lg btn-outline-primary'>Cadastrar Cliente</Link>
                    </div>
                    <div className='col-12 py-2'>
                        <Link to={"/CadastrarEntradas"} className='btn col-6 btn-lg btn-outline-primary'>Registrar Entrada</Link>
                    </div>
                    <div className='col-12 py-2'>
                        <Link to={"/Relatorios"} className='btn col-6 btn-lg btn-outline-primary'>Acessar Relatórios</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
