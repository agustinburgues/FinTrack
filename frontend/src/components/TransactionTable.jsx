import { useNavigate } from "react-router-dom";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

const formatCurrency = (value) =>
    new Intl.NumberFormat("es-ES", {
        style: "currency",
        currency: "EUR",
    }).format(value);

function TransactionTable({
    transactions,
    title = "",
    showAddButton = false,
    onDelete,
    compact = false,
}) {
    const navigate = useNavigate();

    return (
        <div className="card shadow-sm border-0">
            {title && (
                <div className="card-header bg-white border-0 pt-3">
                    <h4 className="mb-0">{title}</h4>
                </div>
            )}

            <div className="card-body">
                {showAddButton && (
                    <div className="d-flex justify-content-end mb-3">
                        <button className="btn btn-primary" onClick={() => navigate("/transactions/new")}>
                            <i className="fas fa-plus me-2"></i>
                            Nueva transacción
                        </button>
                    </div>
                )}

                {transactions.length === 0 ? (
                    <div className="text-center text-muted py-4">
                        Todavía no existen transacciones.
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle mb-0">
                             <thead className="table-light">
                                <tr>
                                    <th>Fecha</th>
                                    {!compact && <th>Descripción</th>}
                                    <th>Categoría</th>
                                    {!compact && <th>Tipo</th>}
                                    <th className="text-end">Importe</th>
                                    {!compact && (
                                        <th className="text-center">Acciones</th>
                                    )}
                                </tr>
                            </thead>

                            <tbody>
                                {transactions.map((t) => (
                                    <tr key={t.id}>
                                        <td>{formatDate(t.date)}</td>

                                        {!compact && (
                                            <td>
                                                {t.description || "-"}
                                            </td>
                                        )}

                                        <td>
                                            <span className="badge rounded-pill text-bg-light border">
                                                {t.category}
                                            </span>
                                        </td>

                                        {!compact && (
                                            <td>
                                                <span
                                                    className={
                                                        t.type === "income"
                                                            ? "badge bg-success"
                                                            : "badge bg-danger"
                                                    }
                                                >
                                                    {t.type === "income"
                                                        ? "Ingreso"
                                                        : "Gasto"}
                                                </span>
                                            </td>
                                        )}

                                        <td
                                            className={`text-end fw-bold ${
                                                t.type === "income"
                                                    ? "text-success"
                                                    : "text-danger"
                                            }`}
                                        >
                                            {t.type === "income" ? "+" : "-"}{" "}
                                            {formatCurrency(t.amount)}
                                        </td>

                                        {!compact && (
                                            <td className="text-center">
                                                <button
                                                    className="btn btn-outline-primary btn-sm me-2"
                                                    onClick={() =>
                                                        navigate(`/transactions/${t.id}/edit`)
                                                    }
                                                >
                                                    ✏️
                                                </button>

                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() =>
                                                        onDelete?.(t.id)
                                                    }
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TransactionTable;