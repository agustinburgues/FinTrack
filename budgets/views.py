from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, redirect, render
from django.db.models import Sum, DecimalField, Value
from django.db.models.functions import Coalesce
from decimal import Decimal

from transactions.models import Transaction

from .forms import BudgetForm
from .models import Budget


@login_required
def budget_list(request):
    budgets = Budget.objects.filter(user=request.user)

    budget_data = []

    for budget in budgets:

        spent = (
            Transaction.objects.filter(
                user=request.user,
                category=budget.category,
                transaction_type="expense",
                date__year=budget.year,
                date__month=budget.month,
            )
            .aggregate(
                total=Coalesce(
                    Sum("amount"),
                    Value(0),
                    output_field=DecimalField(max_digits=10, decimal_places=2),
                )
            )["total"]
        )

        remaining = budget.amount - spent

        percentage = 0

        if budget.amount > 0:
            percentage = round(min((spent / budget.amount) * 100, 100))

        if spent >= budget.amount:
            status = "danger"
            status_text = "Superado"

        elif spent >= budget.amount * Decimal("0.80"):
            status = "warning"
            status_text = "Atención"

        else:
            status = "success"
            status_text = "Correcto"

        budget_data.append({
            "budget": budget,
            "spent": spent,
            "remaining": remaining,
            "percentage": percentage,
            "status": status,
            "status_text": status_text,
        })

    return render(
        request,
        "budgets/list.html",
        {
            "budget_data": budget_data
        },
    )


@login_required
def budget_detail(request, pk):

    budget = get_object_or_404(
        Budget,
        pk=pk,
        user=request.user,
    )

    transactions = Transaction.objects.filter(
        user=request.user,
        category=budget.category,
        transaction_type="expense",
        date__year=budget.year,
        date__month=budget.month,
    ).order_by("-date")

    spent = (
        transactions.aggregate(
            total=Coalesce(
                Sum("amount"),
                Value(0),
                output_field=DecimalField(
                    max_digits=10,
                    decimal_places=2,
                ),
            )
        )["total"]
    )

    remaining = budget.amount - spent

    percentage = 0

    if budget.amount > 0:
        percentage = min((spent / budget.amount) * 100, 100)

    return render(
        request,
        "budgets/detail.html",
        {
            "budget": budget,
            "transactions": transactions,
            "spent": spent,
            "remaining": remaining,
            "percentage": percentage,
        },
    )


@login_required
def budget_create(request):

    if request.method == "POST":
        form = BudgetForm(request.POST, user=request.user)

        if form.is_valid():
            budget = form.save(commit=False)
            budget.user = request.user
            budget.save()

            messages.success(request, "Presupuesto creado correctamente.")
            return redirect("budgets:list")

    else:
        form = BudgetForm(user=request.user)

    return render(
        request,
        "budgets/form.html",
        {
            "form": form,
            "title": "Nuevo presupuesto",
        },
    )


@login_required
def budget_update(request, pk):

    budget = get_object_or_404(
        Budget,
        pk=pk,
        user=request.user
    )

    if request.method == "POST":

        form = BudgetForm(
            request.POST,
            instance=budget,
            user=request.user,
        )

        if form.is_valid():
            form.save()

            messages.success(request, "Presupuesto actualizado.")
            return redirect("budgets:list")

    else:
        form = BudgetForm(
            instance=budget,
            user=request.user,
        )

    return render(
        request,
        "budgets/form.html",
        {
            "form": form,
            "title": "Editar presupuesto",
        },
    )


@login_required
def budget_delete(request, pk):

    budget = get_object_or_404(
        Budget,
        pk=pk,
        user=request.user,
    )

    if request.method == "POST":
        budget.delete()

        messages.success(request, "Presupuesto eliminado.")
        return redirect("budgets:list")

    return render(
        request,
        "budgets/delete.html",
        {
            "budget": budget
        },
    )