function BudgetStatus({ budgets }) {

    const completed = budgets.filter(
        (b) => b.percentage < 80
    ).length;

    const warning = budgets.filter(
        (b) => b.percentage >= 80 && b.percentage <= 100
    ).length;

    const exceeded = budgets.filter(
        (b) => b.percentage > 100
    ).length;

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">

                <h5 className="fw-bold mb-3">
                    💰 Estado de presupuestos
                </h5>

                <p>
                    🟢 Dentro del presupuesto: <strong>{completed}</strong>
                </p>

                <p>
                    🟡 En proceso: <strong>{warning}</strong>
                </p>

                <p className="mb-0">
                    🔴 Superados: <strong>{exceeded}</strong>
                </p>

            </div>
        </div>
    );
}

export default BudgetStatus;