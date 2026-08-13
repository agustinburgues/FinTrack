import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function Goals({ onLogout }) {
    const navigate = useNavigate();
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const loadGoals = () => {
        api.get("goals/")
            .then((response) => {
                setGoals(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };
    const deleteGoal = async (id) => {
        if (!window.confirm("¿Eliminar esta meta?")) {
            return;
        }
        try {
            const csrf = await api.get("csrf/");

            await api.delete(
                `goals/${id}/`,
                {
                    headers: {
                        "X-CSRFToken": csrf.data.csrfToken,
                    },
                }
            );
            loadGoals();
        } catch (error) {
            console.error(error);
            alert("No se pudo eliminar la meta.");
        }
    };

    useEffect(() => {
        loadGoals();
    }, []);

    if (loading) {
        return (
            <h3 className="text-center mt-5">Cargando metas...</h3>
        );
    }
    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">Metas</h2>
                    <button className="btn btn-primary" onClick={() => navigate("/goals/new")}>
                        <i className="fas fa-plus me-2"></i>
                        Nueva meta
                    </button>
                </div>
                {goals.length === 0 ? (
                    <div className="card shadow-sm border-0">
                        <div className="card-body text-center py-5">
                            <i className="fas fa-bullseye fa-3x text-muted mb-3"></i>
                            <p className="text-muted mb-0">Todavía no existen metas.</p>
                        </div>
                    </div>
                ) : (
                    <div className="row g-4">
                        {goals.map((goal) => (
                            <div key={goal.id} className="col-lg-6">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body">
                                        <h5 className="fw-bold" style={{ cursor: "pointer" }} onClick={() => navigate(`/goals/${goal.id}`)}>
                                            {goal.name}
                                        </h5>
                                        {goal.description && (
                                            <p className="text-muted">{goal.description}</p>
                                        )}
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Ahorrado</span>
                                            <strong>{goal.saved_amount} € / {goal.target_amount} € </strong>
                                        </div>

                                        <div className="progress">
                                            <div className="progress-bar bg-info"style={{width: `${Math.min(goal.percentage, 100)}%`}}>
                                                {goal.percentage}%
                                            </div>
                                        </div>

                                        <div className="mt-3 d-flex justify-content-between">
                                            <button className="btn btn-success btn-sm" onClick={() => navigate(`/goals/${goal.id}/contribute`)}>
                                                <i className="fas fa-plus me-1"></i>
                                                Agregar dinero
                                            </button>

                                            <div>
                                                <button className="btn btn-outline-primary btn-sm me-2" onClick={() => navigate(`/goals/${goal.id}/edit`)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>

                                                <button className="btn btn-outline-danger btn-sm" onClick={() => deleteGoal(goal.id)}>
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default Goals;