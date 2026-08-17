import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(Number(value) || 0);

const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

const formatDateTime = (date) =>
    new Date(date).toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
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
                const response = await api.get(`goals/${id}/`);

                setGoal(response.data);
                setContributions(response.data.contributions || []);
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
                    <div className="alert alert-danger">
                        No se encontró la meta.
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/goals")}
                    >
                        Volver a metas
                    </button>
                </div>
            </>
        );
    }

    const target = Number(goal.target_amount) || 0;
    const saved = Number(goal.saved_amount) || 0;

    const remaining = Math.max(target - saved, 0);

    const percentage =
        target > 0
            ? Math.min(Math.round((saved / target) * 100), 100)
            : 0;

    let status = "En progreso";
    let statusClass = "bg-primary";

    if (saved >= target && target > 0) {
        status = "Completada";
        statusClass = "bg-success";
    } else if (percentage >= 80) {
        status = "Cerca del objetivo";
        statusClass = "bg-warning text-dark";
    }

    return (
        <>
            <Navbar onLogout={onLogout} />

            <div className="container mt-4">

                {/* CABECERA */}
                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                        <h2 className="fw-bold mb-0">
                            {goal.name}
                        </h2>

                        {goal.target_date && (
                            <small className="text-muted">
                                Objetivo para{" "}
                                {formatDate(goal.target_date)}
                            </small>
                        )}
                    </div>

                    <div>
                        <button
                            className="btn btn-outline-secondary me-2"
                            onClick={() => navigate("/goals")}
                        >
                            <i className="fas fa-arrow-left me-1"></i>
                            Volver
                        </button>

                        <button
                            className="btn btn-success me-2"
                            onClick={() =>
                                navigate(`/goals/${goal.id}/contribute`)
                            }
                        >
                            <i className="fas fa-plus me-1"></i>
                            Agregar dinero
                        </button>

                        <button
                            className="btn btn-warning"
                            onClick={() =>
                                navigate(`/goals/${goal.id}/edit`)
                            }
                        >
                            <i className="fas fa-pen me-1"></i>
                            Editar
                        </button>
                    </div>

                </div>


                {/* RESUMEN */}
                <div className="row g-4 mb-4">

                    {/* OBJETIVO */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm text-center h-100">
                            <div className="card-body">

                                <i className="fas fa-bullseye fa-2x text-primary mb-3"></i>

                                <h6>Objetivo</h6>

                                <h3>
                                    {formatCurrency(target)}
                                </h3>

                            </div>
                        </div>
                    </div>


                    {/* AHORRADO */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm text-center h-100">
                            <div className="card-body">

                                <i className="fas fa-piggy-bank fa-2x text-success mb-3"></i>

                                <h6>Ahorrado</h6>

                                <h3 className="text-success">
                                    {formatCurrency(saved)}
                                </h3>

                            </div>
                        </div>
                    </div>


                    {/* RESTANTE */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm text-center h-100">
                            <div className="card-body">

                                <i className="fas fa-coins fa-2x text-warning mb-3"></i>

                                <h6>Restante</h6>

                                <h3
                                    className={
                                        remaining === 0
                                            ? "text-success"
                                            : "text-warning"
                                    }
                                >
                                    {formatCurrency(remaining)}
                                </h3>

                            </div>
                        </div>
                    </div>


                    {/* ESTADO */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm text-center h-100">
                            <div className="card-body">

                                <i className="fas fa-flag-checkered fa-2x text-info mb-3"></i>

                                <h6>Estado</h6>

                                <span
                                    className={`badge ${statusClass} fs-6`}
                                >
                                    {status}
                                </span>

                            </div>
                        </div>
                    </div>

                </div>


                {/* PROGRESO */}
                <div className="card border-0 shadow-sm">

                    <div className="card-header">
                        <strong>Progreso de la meta</strong>
                    </div>

                    <div className="card-body">

                        <div
                            className="progress"
                            style={{ height: "30px" }}
                        >
                            <div
                                className={`progress-bar ${statusClass}`}
                                style={{
                                    width: `${percentage}%`,
                                }}
                            >
                                {percentage}%
                            </div>
                        </div>

                        {goal.description && (
                            <>
                                <hr />

                                <h5>Descripción</h5>

                                <p className="mb-0">
                                    {goal.description}
                                </p>
                            </>
                        )}

                    </div>
                </div>


                {/* HISTORIAL */}
                <div className="card border-0 shadow-sm mt-4">

                    <div className="card-header">
                        <strong>Historial de aportes</strong>
                    </div>

                    <div className="card-body p-0">

                        {contributions.length > 0 ? (

                            <div className="table-responsive">

                                <table className="table table-hover align-middle mb-0">

                                    <thead className="table-light">

                                        <tr>
                                            <th>Fecha</th>
                                            <th>Importe</th>
                                            <th>Nota</th>
                                        </tr>

                                    </thead>

                                    <tbody>

                                        {contributions.map(
                                            (contribution) => (
                                                <tr
                                                    key={
                                                        contribution.id
                                                    }
                                                >

                                                    <td>
                                                        {formatDateTime(
                                                            contribution.created_at
                                                        )}
                                                    </td>

                                                    <td className="text-success fw-bold">
                                                        {formatCurrency(
                                                            contribution.amount
                                                        )}
                                                    </td>

                                                    <td>
                                                        {contribution.note ? (
                                                            contribution.note
                                                        ) : (
                                                            <span className="text-muted">
                                                                Sin nota
                                                            </span>
                                                        )}
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        ) : (

                            <div className="p-4 text-center text-muted">

                                <i className="fas fa-piggy-bank fa-2x mb-3"></i>

                                <p className="mb-0">
                                    Todavía no registraste ningún aporte
                                    para esta meta.
                                </p>

                            </div>

                        )}

                    </div>
                </div>

            </div>
        </>
    );
}

export default GoalDetail;