import React, { useEffect, useState, useContext } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { UserContext } from '../../contexts/userContext';

function Home() {
    const navigate = useNavigate();

    const [userName, setUserName] = useState(null); // Estado para armazenar o nome do usuário autenticado
    const [authenticated, setAuthenticated] = useState(false);
    const { user, setUser } = useContext(UserContext);

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
                setUser(JSON.stringify(doc.data()))

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


        <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>


            <div style={{ width: '75%', maxWidth: 500, textAlign: 'center', height: '90%', alignContent: 'center' }}>

                {
                    userName && (
                        <div style={{ color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26 }}>
                            Olá, {userName?.trim()}!
                        </div>
                    )
                }


                <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5, }}>
                    <div className='content text-center'>
                        <div className='col-12 py-2'>
                            <Link to={"/CadastrarClientes"} className='btn col-6 btn-lg btn-outline-primary custom-button'>Cadastrar Cliente</Link>
                        </div>
                        <div className='col-12 py-2'>
                            <Link to={"/CadastrarEntradas"} className='btn col-6 btn-lg btn-outline-primary custom-button'>Registrar Entrada</Link>
                        </div>
                        <div className='col-12 py-2'>
                            <Link to={"/Relatorios"} className='btn col-6 btn-lg btn-outline-primary custom-button'>Acessar Relatórios</Link>
                        </div>

                        <div className='col-12 py-2'>
                            <Link onClick={handleLogout} style={{ color: 'red' }}>Sair</Link>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

export default Home;
