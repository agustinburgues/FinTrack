import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(value);

const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

function GoalDetail({ onLogout }) {

    const navigate = useNavigate();
    const { id } = useParams();

    const [goal, setGoal] = useState(null);
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const goalResponse = await api.get("goals/");
                const foundGoal = goalResponse.data.find(
                    (item) => item.id === Number(id)
                );
                if (foundGoal) {
                    setGoal(foundGoal);
                }
                const contributionsResponse = await api.get(
                    `goals/${id}/contributions/`
                );
                setContributions(contributionsResponse.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar onLogout={onLogout} />
                <div className="container mt-5 text-center">
                    <h4>Cargando meta...</h4>
                </div>
            </>
        );
    }

    if (!goal) {
        return (
            <>
                <Navbar onLogout={onLogout} />
                <div className="container mt-5">
                    <div className="alert alert-danger">No se encontró la meta.</div>
                    <button className="btn btn-primary" onClick={() => navigate("/goals")}>
                        Volver a metas
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="fw-bold mb-0">{goal.name}</h2>
                    <button className="btn btn-outline-secondary" onClick={() => navigate("/goals")}>
                        Volver
                    </button>
                </div>

                <div className="row g-4">
                    <div className="col-lg-5">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                <h5 className="fw-bold mb-3">Resumen</h5>

                                {goal.description && (
                                    <p className="text-muted">{goal.description}</p>
                                )}

                                <div className="d-flex justify-content-between mb-2">
                                    <span>Ahorrado</span>
                                    <strong>{formatCurrency(goal.saved_amount)}</strong>
                                </div>

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Objetivo</span>
                                    <strong>{formatCurrency(goal.target_amount)}</strong>
                                </div>

                                <div className="progress">
                                    <div
                                        className="progress-bar bg-info"
                                        style={{
                                            width: `${Math.min(
                                                goal.percentage,
                                                100
                                            )}%`,
                                        }}
                                    >
                                        {goal.percentage}%
                                    </div>

                                </div>

                                {goal.target_date && (
                                    <p className="text-muted mt-3 mb-0">
                                        <i className="fas fa-calendar me-2"></i>
                                        Fecha objetivo:{" "}
                                        {formatDate(goal.target_date)}
                                    </p>
                                )}

                                <div className="mt-4">
                                    <button className="btn btn-success" onClick={() => navigate(`/goals/${goal.id}/contribute`)}>
                                        <i className="fas fa-plus me-2"></i>
                                        Agregar dinero
                                    </button>

                                    <button className="btn btn-outline-primary ms-2" onClick={() => navigate(`/goals/${goal.id}/edit`)}>
                                        <i className="fas fa-edit me-2"></i>
                                        Editar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-7">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5 className="fw-bold mb-4">Historial de aportaciones</h5>
                                {contributions.length === 0 ? (
                                    <div className="text-center py-4">
                                        <i className="fas fa-coins fa-2x text-muted mb-3"></i>
                                        <p className="text-muted mb-0">Todavía no existen aportaciones.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Nota</th>
                                                    <th className="text-end">
                                                        Cantidad
                                                    </th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {contributions.map(
                                                    (contribution) => (
                                                        <tr key={contribution.id}>
                                                            <td>
                                                                {formatDate(contribution.created_at)}
                                                            </td>

                                                            <td>{contribution.note || "-"}
                                                            </td>

                                                            <td className="text-end fw-bold text-success"> + {formatCurrency(contribution.amount)}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}

                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GoalDetail;