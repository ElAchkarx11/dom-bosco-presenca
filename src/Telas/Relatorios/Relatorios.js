import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiSortAlt2, BiArrowBack } from 'react-icons/bi';
import { startOfDay, endOfDay, addDays } from 'date-fns';

function Relatorios() {
    const [dias, setDias] = useState([]);
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [order, setOrder] = useState('desc');

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

    const fetchRelatorios = async () => {
        if (!startDate || !endDate) {
            console.error("Por favor, selecione o intervalo de datas.");
            return;
        }

        // Ajuste na definição da data inicial
        const inicio = startOfDay(addDays(new Date(startDate), 1));
        const fim = endOfDay(addDays(new Date(endDate), 1)); // Adiciona um dia para inclusão do último dia

        try {
            const q = query(
                collection(db, 'entradas'),
                where('timestamp', '>=', inicio),
                where('timestamp', '<', fim), // Utilize '<' para garantir que o dia final não seja incluído
                orderBy('timestamp', order)
            );

            const querySnapshot = await getDocs(q);
            const diasMap = new Map();
            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.timestamp && data.timestamp.toDate) {
                    const timestampDate = data.timestamp.toDate();
                    const dateKey = timestampDate.toISOString().split('T')[0];
                    if (!diasMap.has(dateKey)) {
                        diasMap.set(dateKey, timestampDate);
                    }
                }
            });

            setDias(Array.from(diasMap.values()));
        } catch (error) {
            console.error("Erro ao buscar relatórios: ", error);
        }
    };

    const handleStartDateChange = (e) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        setStartDate(newDate);
    };

    const handleEndDateChange = (e) => {
        const newDate = e.target.value ? new Date(e.target.value) : null;
        setEndDate(newDate);
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchRelatorios();
        }
    }, [startDate, endDate, order]);

    const handleDiaClick = (dia) => {
        navigate(`/RelatorioDia/${dia.getTime()}`);
    };

    return (
        <div style={{ display: 'flex', backgroundColor: '#273585', width: '100vw', height: '100vh', alignItems: 'center', alignContent: 'center', flexDirection: 'column' }}>
            <div style={{ width: '90%', textAlign: 'center', height: '60%' }}>
                <div style={{ display: 'flex', color: '#FFF', fontWeight: 'bold', marginBottom: 16, fontSize: 26, flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                    <BiArrowBack style={{ width: '10%' }} size={26} onClick={handleBack} />
                    Relatórios
                </div>
                <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5, marginBottom: 8, justifyContent: 'space-evenly', display: 'flex', alignItems: 'center' }}>
                    De
                    <input
                        type="date"
                        value={startDate ? startDate.toISOString().split('T')[0] : ''}
                        onChange={handleStartDateChange}
                        style={{ border: '2px solid #273585', height: '100%', borderRadius: 5, backgroundColor: '#FFF', padding: 5 }}
                    />
                    até
                    <input
                        type="date"
                        value={endDate ? endDate.toISOString().split('T')[0] : ''}
                        onChange={handleEndDateChange}
                        style={{ border: '2px solid #273585', height: '100%', borderRadius: 5, backgroundColor: '#FFF', padding: 5 }}
                    />
                    <BiSortAlt2 style={{ width: '10%' }} size={26} onClick={() => setOrder(curr => curr === 'asc' ? 'desc' : 'asc')} />
                </div>
                <div style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 5, height: '400px', overflowY: 'auto' }}>
                    <div className="row">
                        {dias.length > 0 ?
                            dias.map((dia, index) => {
                                return (
                                    <button
                                        style={{ border: '2px solid #273585', borderRadius: 5, marginBottom: 8, height: 50, alignContent: 'center', justifyContent: 'center', backgroundColor: '#FFF', fontWeight: 'bold' }}
                                        key={index}
                                        onClick={() => handleDiaClick(dia)}
                                    >
                                        {dia.toLocaleDateString('pt-BR')}
                                    </button>
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

export default Relatorios;
