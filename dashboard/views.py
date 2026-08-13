from django.contrib.auth.decorators import login_required
from django.shortcuts import render

from django.db.models import Sum, DecimalField, Value
from django.db.models.functions import Coalesce
from django.utils import timezone
from datetime import timedelta
from collections import OrderedDict
from budgets.models import Budget
from decimal import Decimal

from transactions.models import Transaction


@login_required
def home(request):

    transactions = Transaction.objects.filter(user=request.user)
    today = timezone.now().date()

    month_transactions = transactions.filter(
        date__year=today.year,
        date__month=today.month
    )

    total_income = month_transactions.filter(transaction_type="income").aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(0),
            output_field=DecimalField(max_digits=10, decimal_places=2)
        ))["total"]

    total_expense = month_transactions.filter(transaction_type="expense").aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(0),
            output_field=DecimalField(max_digits=10, decimal_places=2)
        ))["total"]

    balance = total_income - total_expense

    last_transactions = transactions.order_by("-date")[:5]

    expenses_by_category = (
        month_transactions
        .filter(transaction_type="expense")
        .values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    top_category = expenses_by_category.first()

    monthly_data = OrderedDict()

    transactions_count = month_transactions.count()

    categories_count = request.user.categories.count()

    largest_expense = month_transactions.filter(transaction_type="expense").order_by("-amount").first()

    largest_income = month_transactions.filter(transaction_type="income").order_by("-amount").first()

    today = timezone.now().date()

    for i in range(5, -1, -1):

        month = today.month - i
        year = today.year

        while month <= 0:
            month += 12
            year -= 1

        key = f"{month:02d}/{year}"

        monthly_data[key] = {
            "income": 0,
            "expense": 0,
        }

    for key in monthly_data.keys():
        month, year = key.split("/")
        income = (
            transactions
            .filter(
                transaction_type="income",
                date__month=int(month),
                date__year=int(year)
            )
            .aggregate(total=Coalesce(
                Sum("amount"),
                Value(0),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            ))["total"]
        )
        expense = (
            transactions
            .filter(
                transaction_type="expense",
                date__month=int(month),
                date__year=int(year)
            )
            .aggregate(total=Coalesce(
                Sum("amount"),
                Value(0),
                output_field=DecimalField(max_digits=10, decimal_places=2)
            ))["total"]
        )
        monthly_data[key]["income"] = float(income)
        monthly_data[key]["expense"] = float(expense)

    total_transactions = month_transactions.count()

    budgets = Budget.objects.filter(user=request.user)

    budget_summary = {
        "success": 0,
        "warning": 0,
        "danger": 0,
    }

    for budget in budgets:
        spent = (
            Transaction.objects.filter(
                user=request.user,
                category=budget.category,
                transaction_type="expense",
                date__year=budget.year,
                date__month=budget.month,
            ).aggregate(
                total=Coalesce(
                    Sum("amount"),
                    Value(0),
                    output_field=DecimalField(max_digits=10, decimal_places=2),
                )
            )["total"]
        )
        if spent >= budget.amount:
            budget_summary["danger"] += 1
        elif spent >= budget.amount * Decimal("0.80"):
            budget_summary["warning"] += 1
        else:
            budget_summary["success"] += 1

    budget_progress = []

    budgets = Budget.objects.filter(
        user=request.user,
        month=today.month,
        year=today.year,
    )

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
                    output_field=DecimalField(
                        max_digits=10,
                        decimal_places=2,
                    ),
                )
            )["total"]
        )

        percentage = 0

        if budget.amount > 0:
            percentage = min(float((spent / budget.amount) * 100), 100)

        budget_progress.append({
            "budget": budget,
            "spent": spent,
            "percentage": f"{percentage:.2f}",
        })

    budget_progress.sort(
        key=lambda x: x["percentage"],
        reverse=True,
    )

    budget_progress = budget_progress[:3]

    context = {
        "transactions": last_transactions,
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance,
        "total_transactions": total_transactions,
        "expenses_by_category": list(expenses_by_category),
        "top_category": top_category,
        "monthly_data": monthly_data,
        "today": today,
        "transactions_count": transactions_count,
        "categories_count": categories_count,
        "largest_expense": largest_expense,
        "largest_income": largest_income,
        "budget_summary": budget_summary,
        "budget_progress": budget_progress,
    }

    return render(
        request,
        "dashboard/dashboard.html",
        context
    )