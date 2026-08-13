function GoalCard({ goals }) {

    return (
        <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
                <h5 className="card-title mb-4">Metas</h5>
                {goals.length === 0 ? (
                    <p className="text-muted mb-0">No hay metas.</p>
                ) : (
                    goals.map((goal) => (
                        <div key={goal.id} className="mb-4">
                            <div className="d-flex justify-content-between">
                                <strong>{goal.name}</strong>

                                <span>€{goal.saved} / €{goal.target}</span>
                            </div>

                            <div className="progress mt-2">
                                <div 
                                className="progress-bar bg-info" 
                                style={{ 
                                    width: `${Math.min(goal.percentage,100)}%`,
                                }}>
                                    {goal.percentage}%
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default GoalCard;