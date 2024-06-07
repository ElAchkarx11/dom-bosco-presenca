import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiDoorOpen, BiArrowBack } from 'react-icons/bi';
import { format, startOfDay, addDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

function Relatorios() {
    const [dias, setDias] = useState([]);
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
        const fetchData = async () => {
            const q = query(collection(db, 'entradas'), orderBy('timestamp', 'desc'));
            const querySnapshot = await getDocs(q);
            const diasMap = new Map();
            const timeZone = 'America/Sao_Paulo'; // Defina o fuso horário correto

            querySnapshot.forEach(doc => {
                const data = doc.data();
                if (data.timestamp && data.timestamp.toDate) {
                    const timestampDate = data.timestamp.toDate();
                    const zonedDate = toZonedTime(timestampDate, timeZone); // Converte para o fuso horário correto
                    const dateKey = format(startOfDay(zonedDate), 'yyyy-MM-dd');
                    if (!diasMap.has(dateKey)) {
                        diasMap.set(dateKey, new Date(dateKey));
                    }
                }
            });
            setDias(Array.from(diasMap.values()));
        };
        fetchData();
    }, []);

    const handleDiaClick = (dia) => {
        navigate(`/RelatorioDia/${dia.getTime()}`);
    };

    return (
        <div className="container-fluid">
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
                <h1 className='p-2'>Relatórios</h1>
                <hr />
            </div>
            <div className="row">
                {dias.map((dia, index) => {
                    const diaMaisUm = addDays(dia, 1); // Adiciona um dia à data
                    return (
                        <div className="col-md-3 mb-4" key={index}>
                            <div className="card text-center" onClick={() => handleDiaClick(dia)}>
                                <div className="card-body">
                                    <h5 className="card-title">{diaMaisUm.toLocaleDateString('pt-BR')}</h5> {/* Exibe o dia + 1 */}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Relatorios;
