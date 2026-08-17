import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import Navbar from "../components/Navbar";

function BudgetDetail({ onLogout }) {

    const { id } = useParams();
    const navigate = useNavigate();

    const [budget, setBudget] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadData = async () => {

            try {

                const budgetResponse = await api.get(`budgets/${id}/`);

                const budgetData = budgetResponse.data;

                setBudget(budgetData);

                const transactionsResponse = await api.get(
                    "transactions/",
                    {
                        params: {
                            category: budgetData.category,
                            type: "expense",
                            month: budgetData.month,
                            year: budgetData.year,
                        },
                    }
                );

                setTransactions(transactionsResponse.data);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, [id]);

    const formatCurrency = (value) =>
        new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
        }).format(value);

    const formatDate = (date) => {

        return new Intl.DateTimeFormat("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(new Date(`${date}T00:00:00`));

    };

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

                    <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigate("/budgets")}
                    >
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

                {/* PROGRESO DEL PRESUPUESTO */}

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

                {/* GASTOS DEL PRESUPUESTO */}

                <div className="card shadow-sm border-0 mb-4">

                    <div className="card-header bg-white d-flex justify-content-between align-items-center">

                        <h5 className="fw-bold mb-0">
                            Gastos del presupuesto
                        </h5>

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate("/transactions/new")}
                        >
                            <i className="fas fa-plus me-1"></i>
                            Nueva transacción
                        </button>

                    </div>

                    <div className="card-body p-0">

                        {transactions.length === 0 ? (

                            <div className="p-4 text-center text-muted">
                                No hay gastos registrados para este presupuesto.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-hover mb-0">

                                    <thead>

                                        <tr>

                                            <th className="ps-4">
                                                Fecha
                                            </th>

                                            <th>
                                                Descripción
                                            </th>

                                            <th className="text-end pe-4">
                                                Importe
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {transactions.map((transaction) => (

                                            <tr key={transaction.id}>

                                                <td className="ps-4">
                                                    {formatDate(transaction.date)}
                                                </td>

                                                <td>
                                                    {transaction.description || "Sin descripción"}
                                                </td>

                                                <td className="text-end pe-4 text-danger fw-semibold">
                                                    - {formatCurrency(transaction.amount)}
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

                {/* BOTONES */}

                <div className="d-flex justify-content-end gap-2">

                    <button
                        className="btn btn-warning"
                        onClick={() =>
                            navigate(`/budgets/${budget.id}/edit`)
                        }
                    >
                        <i className="fas fa-pen me-2"></i>
                        Editar presupuesto
                    </button>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/transactions/new")}
                    >
                        <i className="fas fa-plus me-2"></i>
                        Nueva transacción
                    </button>

                </div>

            </div>
        </>
    );
}

export default BudgetDetail;