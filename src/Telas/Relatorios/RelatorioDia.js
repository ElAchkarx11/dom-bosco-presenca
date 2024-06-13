import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import { BiDoorOpen, BiArrowBack } from 'react-icons/bi';
import 'bootstrap/dist/css/bootstrap.min.css';

function RelatorioDia() {
    const { dia } = useParams();
    const [entradas, setEntradas] = useState([]);
    const [dataFormatada, setDataFormatada] = useState('');
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
    };

    const handleBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        const timestamp = new Date(parseInt(dia)); // Converter o timestamp de volta para uma data
        const fetchData = async () => {
            const q = query(collection(db, 'entradas'),
                where('timestamp', '>=', timestamp),
                where('timestamp', '<=', new Date(timestamp.getTime() + 24 * 60 * 60 * 1000))); // Adicionando 24 horas para o final do dia
            const querySnapshot = await getDocs(q);
            const entradasArray = [];
            querySnapshot.forEach(doc => {
                entradasArray.push(doc.data());
            });
            setEntradas(entradasArray);
            setDataFormatada(timestamp.toLocaleDateString('pt-BR'));
        };
        fetchData();
    }, [dia]);

    return (
        <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
            <div style={{ width: '90%', textAlign: 'center', height: '60%' }}>
                <div style={{ display: 'flex', color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <BiArrowBack style={{ width: '10%' }} size={26} onClick={handleBack} />
                    Relatório do dia {dataFormatada} {/* Utiliza dataFormatada diretamente para exibir o dia correto */}
                </div>
                <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5 }}>
                    <div className="row">
                        {entradas.length > 0 ?
                            entradas.map((entrada, index) => {
                                return (
                                    <div
                                        style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, padding: 5, backgroundColor: '#FFF', fontWeight: 'bold' }}
                                        key={index}
                                    >
                                        <h5 className="mb-1">{entrada.nome}</h5>
                                        <p className="mb-1">CPF: {entrada.cpf.length > 0 ? entrada.cpf : 'Não informado'}</p>
                                        <small>Registrado em {entrada.timestamp && entrada.timestamp.toDate && entrada.timestamp.toDate().toLocaleString('pt-BR')}</small>
                                    </div>
                                );
                            })
                            : (
                                <div style={{ fontWeight: 'bold' }}>
                                    Não há dados.
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RelatorioDia;
