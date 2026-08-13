function BudgetCard({ budgets }) {

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-4">Presupuestos</h5>
                {budgets.length === 0 ? (
                    <p className="text-muted mb-0">No hay presupuestos.</p>
                ) : (
                    budgets.map((budget) => (
                        <div key={budget.id} className="mb-4">
                            <div className="d-flex justify-content-between">
                                <strong>{budget.category}</strong>

                                <span> €{budget.spent} / €{budget.amount}</span>
                            </div>

                            <div className="progress mt-2">
                                <div
                                    className={`progress-bar ${
                                        budget.percentage >= 100
                                            ? "bg-danger"
                                            : budget.percentage >= 80
                                            ? "bg-warning"
                                            : "bg-success"
                                    }`}
                                    style={{ 
                                        width: `${Math.min( budget.percentage,100)}%`,
                                    }}
                                >
                                    {budget.percentage}%
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default BudgetCard;