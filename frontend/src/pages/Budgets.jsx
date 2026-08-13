import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";

import Navbar from "../components/Navbar";
import BudgetTable from "../components/BudgetTable";

function Budgets({ onLogout }) {

    const navigate = useNavigate();

    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadBudgets = () => {

        api.get("budgets/")
            .then((response) => {
                setBudgets(response.data);
            })
            .catch(console.error)
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        loadBudgets();
    }, []);

    const deleteBudget = async (id) => {

        if (!window.confirm("¿Eliminar presupuesto?")) {
            return;
        }

        try {

            const csrf = await api.get("csrf/");

            await api.delete(
                `budgets/${id}/`,
                {
                    headers: {
                        "X-CSRFToken": csrf.data.csrfToken,
                    },
                }
            );

            loadBudgets();

        } catch (error) {

            console.error(error);

            alert("No se pudo eliminar.");

        }

    };

    if (loading) {
        return <h3 className="text-center mt-5">Cargando...</h3>;
    }

    return (
        <>
            <Navbar onLogout={onLogout} />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2 className="fw-bold">
                        Presupuestos
                    </h2>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/budgets/new")}
                    >
                        <i className="fas fa-plus me-2"></i>

                        Nuevo presupuesto
                    </button>

                </div>

                <BudgetTable
                    budgets={budgets}
                    onDelete={deleteBudget}
                />

            </div>

        </>
    );
}

export default Budgets;