import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

function ExpenseChart({ expenses }) {
    if (!expenses || expenses.length === 0) {
        return (
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body text-center d-flex flex-column justify-content-center">
                    <h5 className="mb-3">Gastos por categoría</h5>
                    <>
                        <i className="fas fa-chart-pie fa-3x text-secondary mb-3"></i>

                        <p className="text-muted mb-0">
                            No hay gastos registrados este mes.
                        </p>
                    </>
                </div>
            </div>
        );
    }
    const data = {
        labels: expenses.map(
            item => item.category__name
        ),
        datasets: [
            {
                label: "Gastos",
                data: expenses.map(
                    item => item.total
                ),

                backgroundColor: expenses.map(
                    item => item.category__color
                ),

                borderColor: "#ffffff",
                borderWidth: 2,
                hoverOffset: 12,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {

            legend: {
                position: "bottom",
            },

            tooltip: {
                enabled: true,
            },

        },
    };

    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
                <h5 className="fw-bold mb-3">Gastos por categoría</h5>
                <div style={{ height: "320px" }}>
                    <Pie
                        data={data}
                        options={options}
                    />
                </div>
            </div>
        </div>
    );
}

export default ExpenseChart;