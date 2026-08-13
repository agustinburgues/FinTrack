import { useNavigate } from "react-router-dom";

const monthNames = [
"",
"Enero",
"Febrero",
"Marzo",
"Abril",
"Mayo",
"Junio",
"Julio",
"Agosto",
"Septiembre",
"Octubre",
"Noviembre",
"Diciembre",
];

const formatCurrency = (value) =>
new Intl.NumberFormat("es-ES", {
style: "currency",
currency: "EUR",
}).format(value);

function BudgetTable({ budgets, onDelete }) {
const navigate = useNavigate();

if (budgets.length === 0) {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-body text-center py-5">
                <i className="fas fa-wallet fa-3x text-muted mb-3"></i>
                <p className="text-muted mb-0">
                    Todavía no existen presupuestos.
                </p>
            </div>
        </div>
    );
}

return (
    <div className="card shadow-sm border-0">
        <div className="card-body">
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Categoría</th>
                            <th>Mes</th>
                            <th>Año</th>
                            <th className="text-end">Presupuesto</th>
                            <th className="text-end">Gastado</th>
                            <th className="text-end">Disponible</th>
                            <th>Progreso</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>

                    <tbody>
                        {budgets.map((budget) => (
                            <tr key={budget.id}>
                                <td>
                                    <span className="me-2">📁</span>
                                    <strong>{budget.category_name}</strong>
                                </td>

                                <td>
                                    {monthNames[budget.month]}
                                </td>

                                <td>
                                    {budget.year}
                                </td>

                                <td className="text-end fw-bold">
                                    {formatCurrency(budget.amount)}
                                </td>

                                <td className="text-end text-danger fw-bold">
                                    {formatCurrency(budget.spent)}
                                </td>

                                <td className={`text-end fw-bold ${
                                    budget.remaining < 0
                                        ? "text-danger"
                                        : "text-success"
                                }`}>
                                    {formatCurrency(budget.remaining)}
                                </td>

                                <td style={{ minWidth: "150px" }}>
                                    <div className="progress" style={{ height: "20px" }}>
                                        <div
                                            className={`progress-bar bg-${budget.status}`}
                                            role="progressbar"
                                            style={{
                                                width: `${Math.min(budget.percentage, 100)}%`,
                                            }}
                                        >
                                            {budget.percentage}%
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className={`badge bg-${budget.status}`}>
                                        {budget.status_text}
                                    </span>
                                </td>

                                <td className="text-center">
                                    <button className="btn btn-primary btn-sm me-1" onClick={() => navigate(`/budgets/${budget.id}`)}>
                                        <i className="fas fa-eye me-1"></i>
                                        Ver detalle
                                    </button>

                                    <button className="btn btn-warning btn-sm me-1" onClick={() => navigate(`/budgets/${budget.id}/edit`)}>
                                        <i className="fas fa-pen me-1"></i>
                                        Editar
                                    </button>

                                    <button className="btn btn-danger btn-sm" onClick={() => onDelete(budget.id)}>
                                        <i className="fas fa-trash me-1"></i>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
}

export default BudgetTable;