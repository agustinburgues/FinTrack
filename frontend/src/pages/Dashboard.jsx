import { useEffect, useState } from "react";
import api from "../services/api";


import Navbar from "../components/Navbar";
import SummaryCard from "../components/SummaryCard";
import TransactionTable from "../components/TransactionTable";
import ExpenseChart from "../components/ExpenseChart";
import BudgetCard from "../components/BudgetCard";
import GoalCard from "../components/GoalCard";
import QuickActions from "../components/QuickActions";
import MonthlySummary from "../components/MonthlySummary";
import BudgetStatus from "../components/BudgetStatus";

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(value);

function Dashboard({ onLogout }) {
    const [data, setData] = useState(null);
    useEffect(() => {
        api.get("dashboard/")
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, []);

    if (!data) {
        return (
            <h2 className="text-center mt-5">
                Cargando...
            </h2>
        );
    }
    return (
        <>
            <Navbar onLogout={onLogout} />
            <div className="container py-4">
                <h1 className="fw-bold mb-2">Inicio</h1>
                <p className="text-muted">Resumen financiero del mes actual.</p>

                <QuickActions />

                <div className="row g-4">
                    <div className="row g-4">
                        <SummaryCard title="Balance" value={formatCurrency(data.balance)}/>
                        <SummaryCard title="Ingresos" value={formatCurrency(data.total_income)}/>
                        <SummaryCard title="Gastos" value={formatCurrency(data.total_expense)}/>
                        <SummaryCard title="Transacciones" value={data.total_transactions}/>
                        <SummaryCard title="Categorías" value={data.categories_count}/>
                        <SummaryCard title="Mayor ingreso" value={formatCurrency(data.highest_income)}/>
                        <SummaryCard title="Mayor gasto" value={formatCurrency(data.highest_expense)}/>
                        <SummaryCard title="Transacciones del mes actual" value={data.transactions_month}/>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-6 mb-4">
                        <MonthlySummary data={data} />
                    </div>

                    <div className="col-lg-6 mb-4">
                        <BudgetStatus budgets={data.budgets} />
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-lg-6 mb-4">
                        <TransactionTable transactions={data.last_transactions} showAddButton={true} compact={true}/>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <ExpenseChart expenses={data.expenses_by_category}/>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <BudgetCard budgets={data.budgets}/>
                    </div>

                    <div className="col-lg-6 mb-4">
                        <GoalCard goals={data.goals}/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;