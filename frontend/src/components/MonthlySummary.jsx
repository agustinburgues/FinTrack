function MonthlySummary({ data }) {
    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="fw-bold mb-3">📋 Resumen del mes</h5>

                <div className="mb-3">
                    <small className="text-muted">Balance del mes</small>

                    <h3 className={
                        data.balance >= 0
                            ? "text-success"
                            : "text-danger"
                    }>
                        {data.balance >= 0 ? "Positivo" : "Negativo"}
                    </h3>
                </div>

                <hr />

                <div>
                    <small className="text-muted">
                        Categoría con mayor gasto
                    </small>

                    <h5>
                        {data.expenses_by_category.length
                            ? data.expenses_by_category.reduce(
                                  (max, item) =>
                                      item.total > max.total ? item : max
                              ).category__name
                            : "Sin datos"}
                    </h5>
                </div>
            </div>
        </div>
    );
}

export default MonthlySummary;