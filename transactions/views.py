from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect, render, get_object_or_404

from .forms import TransactionForm
from .models import Transaction
from categories.models import Category
from django.core.paginator import Paginator
from django.db.models import Sum, Q, DecimalField, Value
from django.db.models.functions import Coalesce
import csv
from django.http import HttpResponse


@login_required
def transaction_list(request):

    transactions = Transaction.objects.filter(user=request.user)

    # Buscar por descripción
    search = request.GET.get("search")

    if search:
        transactions = transactions.filter(description__icontains=search)

    # Filtrar por categoría
    category = request.GET.get("category")

    if category:
        transactions = transactions.filter(category_id=category)

    # Filtrar por tipo
    transaction_type = request.GET.get("type")

    if transaction_type:
        transactions = transactions.filter(transaction_type=transaction_type)

    # Filtrar por fechas
    date_from = request.GET.get("date_from")

    if date_from:
        transactions = transactions.filter(date__gte=date_from)

    date_to = request.GET.get("date_to")

    if date_to:
        transactions = transactions.filter(date__lte=date_to)

    transactions = transactions.order_by("-date")

    paginator = Paginator(transactions, 10)

    page_number = request.GET.get("page")

    transactions = paginator.get_page(page_number)

    # Categorías del usuario para el filtro
    categories = Category.objects.filter(user=request.user).order_by("name")

    return render(
        request,
        "transactions/list.html",
        {
            "transactions": transactions,
            "categories": categories,
        }
    )

@login_required
def transaction_create(request):

    if request.method == "POST":

        form = TransactionForm(
            request.POST,
            user=request.user
        )

        if form.is_valid():
            transaction = form.save(commit=False)
            transaction.user = request.user
            transaction.save()

            messages.success(
                request,
                "La transacción se creó correctamente."
            )

            return redirect("transaction_list")

    else:
        form = TransactionForm(
            user=request.user
        )

    return render(
        request,
        "transactions/form.html",
        {
            "form": form
        }
    )

@login_required
def transaction_update(request, pk):

    transaction = get_object_or_404(
        Transaction,
        pk=pk,
        user=request.user
    )

    if request.method == "POST":

        form = TransactionForm(
            request.POST,
            instance=transaction,
            user=request.user
        )

        if form.is_valid():
            form.save()

            messages.success(
                request,
                "La transacción se actualizó correctamente."
            )

            return redirect("transaction_list")

    else:

        form = TransactionForm(
            instance=transaction,
            user=request.user
        )

    return render(
        request,
        "transactions/form.html",
        {
            "form": form
        }
    )

@login_required
def transaction_delete(request, pk):

    transaction = get_object_or_404(
        Transaction,
        pk=pk,
        user=request.user
    )

    if request.method == "POST":

        transaction.delete()

        messages.success(
            request,
            "La transacción se eliminó correctamente."
        )

        return redirect("transaction_list")

    return render(
        request,
        "transactions/confirm_delete.html",
        {
            "transaction": transaction
        }
    )

@login_required
def dashboard(request):

    transactions = Transaction.objects.filter(user=request.user)

    income = transactions.filter(transaction_type="income").aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(0),
            output_field=DecimalField(max_digits=10, decimal_places=2),
        ))["total"]

    expense = transactions.filter(transaction_type="expense").aggregate(
        total=Coalesce(
            Sum("amount"),
            Value(0),
            output_field=DecimalField(max_digits=10, decimal_places=2),
    ))["total"]

    balance = income - expense

    last_transactions = transactions.order_by("-date")[:5]

    expenses_by_category = (
        transactions
        .filter(transaction_type="expense")
        .values("category__name")
        .annotate(total=Sum("amount"))
        .order_by("-total")
    )

    return render(
        request,
        "transactions/dashboard.html",
        {
            "balance": balance,
            "income": income,
            "expense": expense,
            "last_transactions": last_transactions,
            "expenses_by_category": expenses_by_category,
        }
    )

@login_required
def export_transactions_csv(request):

    transactions = Transaction.objects.filter(user=request.user).order_by("-date")

    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="transactions.csv"'

    writer = csv.writer(response)

    writer.writerow([
        "Fecha",
        "Tipo",
        "Categoría",
        "Descripción",
        "Importe",
    ])

    for transaction in transactions:

        writer.writerow([
            transaction.date,
            transaction.get_transaction_type_display(),
            transaction.category.name,
            transaction.description,
            transaction.amount,
        ])

    return response


