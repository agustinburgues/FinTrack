import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function BudgetDetail({ onLogout }) {
const { id } = useParams();
const navigate = useNavigate();

const [budget, setBudget] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
    api.get(`budgets/${id}/`)
        .then((response) => {
            setBudget(response.data);
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            setLoading(false);
        });
}, [id]);

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(value);

if (loading) {
    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <h3>Cargando presupuesto...</h3>
            </div>
        </>
    );
}

if (!budget) {
    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container mt-4">
                <div className="alert alert-danger">
                    No se encontró el presupuesto.
                </div>
            </div>
        </>
    );
}

return (
    <>
        <Navbar onLogout={onLogout} />

        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold mb-1">
                        {budget.category_name}
                    </h2>
                    <p className="text-muted mb-0">
                        Presupuesto de {budget.month}/{budget.year}
                    </p>
                </div>

                <button className="btn btn-outline-secondary" onClick={() => navigate("/budgets")}>
                    <i className="fas fa-arrow-left me-2"></i>
                    Volver
                </button>
            </div>

            <div className="row g-3 mb-4">

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Presupuesto
                            </h6>

                            <h3 className="fw-bold mt-3">
                                {formatCurrency(budget.amount)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Gastado
                            </h6>

                            <h3 className="fw-bold text-danger mt-3">
                                {formatCurrency(budget.spent)}
                            </h3>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-body">
                            <h6 className="text-muted">
                                Disponible
                            </h6>

                            <h3
                                className={`fw-bold mt-3 ${
                                    budget.remaining < 0
                                        ? "text-danger"
                                        : "text-success"
                                }`}
                            >
                                {formatCurrency(budget.remaining)}
                            </h3>
                        </div>
                    </div>
                </div>

            </div>

            <div className="card shadow-sm border-0 mb-4">
                <div className="card-body">

                    <div className="d-flex justify-content-between mb-2">
                        <span className="fw-bold">
                            Progreso
                        </span>

                        <span className="fw-bold">
                            {budget.percentage}%
                        </span>
                    </div>

                    <div
                        className="progress"
                        style={{ height: "25px" }}
                    >
                        <div
                            className={`progress-bar bg-${budget.status}`}
                            style={{
                                width: `${Math.min(
                                    budget.percentage,
                                    100
                                )}%`,
                            }}
                        >
                            {budget.percentage}%
                        </div>
                    </div>

                    <div className="mt-3">
                        <span className={`badge bg-${budget.status}`}>
                            {budget.status_text}
                        </span>
                    </div>

                </div>
            </div>

            <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-warning" onClick={() => navigate(`/budgets/${budget.id}/edit`)}>
                    <i className="fas fa-pen me-2"></i>
                    Editar presupuesto
                </button>

                <button className="btn btn-primary" onClick={() => navigate("/transactions/new")}>
                    <i className="fas fa-plus me-2"></i>
                    Nueva transacción
                </button>
            </div>

        </div>
    </>
);
}

export default BudgetDetail;