from decimal import Decimal
from datetime import datetime

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.db.models import Sum, DecimalField, Value
from django.db.models.functions import Coalesce
from django.middleware.csrf import get_token
from django.utils import timezone

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from transactions.models import Transaction
from categories.models import Category
from budgets.models import Budget
from goals.models import Goal, GoalContribution

from .serializers import (CategorySerializer, BudgetSerializer, GoalSerializer, GoalContributionSerializer, ProfileSerializer)

@api_view(["GET"])
@permission_classes([AllowAny])
def csrf(request):
    token = get_token(request)
    return Response({
        "csrfToken": token
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def dashboard_api(request):

    today = timezone.now().date()


    transactions = Transaction.objects.filter(
        user=request.user,
        date__year=today.year,
        date__month=today.month,
    )

    total_income = (
        transactions
        .filter(transaction_type="income")
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

    total_expense = (
        transactions
        .filter(transaction_type="expense")
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

    balance = total_income - total_expense

    last_transactions = (
        transactions
        .select_related("category")
        .order_by("-date")[:5]
    )

    last_transactions_data = [
        {
            "id": t.id,
            "date": t.date.strftime("%d/%m/%Y"),
            "description": t.description,
            "category": t.category.name,
            "type": t.transaction_type,
            "amount": float(t.amount),
        }
        for t in last_transactions
    ]

    expenses_by_category = (
        transactions
        .filter(transaction_type="expense")
        .values(
            "category__name",
            "category__color",
        )
        .annotate(total=Sum("amount"))
    )

    budgets = Budget.objects.filter(
        user=request.user,
        month=today.month,
        year=today.year,
    )

    budgets_data = []

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
            percentage = round(float(spent / budget.amount * 100), 1)

        budgets_data.append({
            "id": budget.id,
            "category": budget.category.name,
            "amount": float(budget.amount),
            "spent": float(spent),
            "percentage": percentage,
        })

    goals = Goal.objects.filter(user=request.user)

    goals_data = []

    for goal in goals:

        percentage = 0

        if goal.target_amount > 0:
            percentage = round(
                float(goal.saved_amount / goal.target_amount * 100),
                1,
            )

        goals_data.append({
            "id": goal.id,
            "name": goal.name,
            "saved": float(goal.saved_amount),
            "target": float(goal.target_amount),
            "percentage": percentage,
        })

    highest_income = (
        transactions
        .filter(transaction_type="income")
        .order_by("-amount")
        .first()
    )

    highest_expense = (
        transactions
        .filter(transaction_type="expense")
        .order_by("-amount")
        .first()
    )

    return Response({
        "balance": balance,
        "total_income": total_income,
        "total_expense": total_expense,
        "total_transactions": transactions.count(),
        "categories_count": Category.objects.filter(user=request.user).count(),

        "transactions_month": transactions.count(),
        "highest_income": float(highest_income.amount) if highest_income else 0,
        "highest_expense": float(highest_expense.amount) if highest_expense else 0,

        "last_transactions": last_transactions_data,

        "expenses_by_category": list(expenses_by_category),

        "income_vs_expense": {
            "income": float(total_income),
            "expense": float(total_expense),
        },

        "budgets": budgets_data,
        "goals": goals_data,

    })

@api_view(["POST"])
@permission_classes([AllowAny])
def login_api(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(
        request,
        username=username,
        password=password,
    )

    if user is None:
        return Response(
            {"error": "Credenciales inválidas"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    login(request, user)
    
    return Response(
        {
            "message": "Login correcto",
            "username": user.username,
        }
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_api(request):
    logout(request)

    return Response({
        "message": "Logout correcto"
    })

@api_view(["GET"])
@permission_classes([AllowAny])
def me(request):

    if request.user.is_authenticated:

        return Response({
            "authenticated": True,
            "username": request.user.username,
        })

    return Response({
        "authenticated": False,
    })

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def transactions_api(request):

    if request.method == "GET":

        transactions = (
            Transaction.objects
            .filter(user=request.user)
            .select_related("category")
            .order_by("-date", "-id")
        )

        transaction_type = request.GET.get("type")
        if transaction_type:
            transactions = transactions.filter(
                transaction_type=transaction_type
            )

        category = request.GET.get("category")
        if category:
            transactions = transactions.filter(
                category_id=category
            )

        search = request.GET.get("search")
        if search:
            transactions = transactions.filter(
                description__icontains=search
            )

        month = request.GET.get("month")
        if month:
            transactions = transactions.filter(
                date__month=month
            )
            
        year = request.GET.get("year")
        if year:
            transactions = transactions.filter(
                date__year=year
            )

        data = []

        for t in transactions:
            data.append({
                "id": t.id,
                "date": t.date.strftime("%Y-%m-%d"),
                "description": t.description,
                "category": t.category.name,
                "category_id": t.category.id,
                "category_color": t.category.color,
                "type": t.transaction_type,
                "amount": float(t.amount),
            })

        return Response(data)
    try:
        category = Category.objects.get(
            id=request.data["category"],
            user=request.user,
        )
    except Category.DoesNotExist:
        return Response(
            {"error": "Categoría no encontrada"},
            status=status.HTTP_404_NOT_FOUND,
        )

    date_value = request.data.get("date")
    description = request.data.get("description", "")
    amount_value = request.data.get("amount")
    transaction_type = request.data.get("type")

    if not date_value:
        return Response(
            {"error": "La fecha es obligatoria."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        datetime.strptime(date_value, "%Y-%m-%d")
    except (ValueError, TypeError):
        return Response(
            {"error": "La fecha no es válida."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if amount_value in (None, ""):
        return Response(
            {"error": "El importe es obligatorio."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        amount = Decimal(str(amount_value))
    except Exception:
        return Response(
            {"error": "El importe no es válido."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if amount <= 0:
        return Response(
            {"error": "El importe debe ser mayor que 0."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if transaction_type not in ("income", "expense"):
        return Response(
            {"error": "El tipo de transacción no es válido."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if category.category_type != transaction_type:
        return Response(
            {"error": "La categoría no corresponde al tipo de transacción."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    transaction = Transaction.objects.create(
        user=request.user,
        date=date_value,
        description=description,
        amount=amount,
        transaction_type=transaction_type,
        category=category,
    )

    return Response(
        {
            "id": transaction.id,
            "message": "Transacción creada correctamente",
        },
        status=status.HTTP_201_CREATED,
    )

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def transaction_detail_api(request, pk):

    try:
        transaction = Transaction.objects.get(
            pk=pk,
            user=request.user,
        )
    except Transaction.DoesNotExist:
        return Response(
            {"error": "Transacción no encontrada"},
            status=status.HTTP_404_NOT_FOUND,
        )

    if request.method == "GET":

        return Response({
            "id": transaction.id,
            "date": transaction.date.strftime("%Y-%m-%d"),
            "description": transaction.description,
            "amount": float(transaction.amount),
            "type": transaction.transaction_type,
            "category": transaction.category.id,
        })
    
    if request.method == "PUT":

        category = Category.objects.get(
            id=request.data["category"],
            user=request.user,
        )

        transaction.date = request.data["date"]
        transaction.description = request.data.get(
            "description",
            ""
        )
        transaction.amount = request.data["amount"]
        transaction.transaction_type = request.data["type"]
        transaction.category = category

        transaction.save()

        return Response({
            "message": "Transacción actualizada correctamente"
        })

    transaction.delete()

    return Response({
        "message": "Transacción eliminada correctamente"
    })

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def categories_api(request):

    if request.method == "GET":

        categories = Category.objects.filter(
            user=request.user
        ).order_by("name")

        serializer = CategorySerializer(categories, many=True)

        return Response(serializer.data)

    if request.method == "POST":

        serializer = CategorySerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def category_detail_api(request, pk):

    try:
        category = Category.objects.get(
            pk=pk,
            user=request.user
        )
    except Category.DoesNotExist:
        return Response(status=404)

    if request.method == "GET":

        serializer = CategorySerializer(category)

        return Response(serializer.data)

    if request.method == "PUT":

        serializer = CategorySerializer(
            category,
            data=request.data
        )

        if serializer.is_valid():

            serializer.save(user=request.user)

            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    if category.transactions.exists():
        return Response(
            {
                "error": (
                    "No puedes eliminar una categoría que "
                    "tiene transacciones asociadas."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    category.delete()

    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def budgets_api(request):

    if request.method == "GET":

        budgets = (
            Budget.objects
            .filter(user=request.user)
            .select_related("category")
            .order_by("-year", "-month")
        )

        budgets_data = []

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

            remaining = budget.amount - spent

            percentage = 0

            if budget.amount > 0:
                percentage = round(
                    float(spent / budget.amount * 100)
                )

            if spent >= budget.amount:
                status_text = "Superado"
                budget_status = "danger"
            elif spent >= budget.amount * Decimal("0.80"):
                status_text = "Atención"
                budget_status = "warning"
            else:
                status_text = "Correcto"
                budget_status = "success"

            budgets_data.append({
                "id": budget.id,
                "category": budget.category.id,
                "category_name": budget.category.name,
                "amount": float(budget.amount),
                "spent": float(spent),
                "remaining": float(remaining),
                "percentage": percentage,
                "status": budget_status,
                "status_text": status_text,
                "month": budget.month,
                "year": budget.year,
            })

        return Response(budgets_data)

    serializer = BudgetSerializer(
        data=request.data,
        context={
            "request": request
        }
    )

    if serializer.is_valid():

        serializer.save(
            user=request.user
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def budget_detail_api(request, pk):

    try:
        budget = Budget.objects.get(
            pk=pk,
            user=request.user
        )
    except Budget.DoesNotExist:
        return Response(
            {"error": "Presupuesto no encontrado"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":

        serializer = BudgetSerializer(
            budget,
            context={
                "request": request
            }
        )

        return Response(serializer.data)

    if request.method == "PUT":

        serializer = BudgetSerializer(
            budget,
            data=request.data,
            context={
                "request": request
            }
        )

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    budget.delete()

    return Response(
        status=status.HTTP_204_NO_CONTENT
    )

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def goals_api(request):
    if request.method == "GET":
        goals = Goal.objects.filter(
            user=request.user
        ).order_by("-created_at")
        serializer = GoalSerializer(
            goals,
            many=True
        )
        return Response(serializer.data)
    serializer = GoalSerializer(
        data=request.data
    )
    if serializer.is_valid():
        serializer.save(
            user=request.user
        )
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET", "PUT", "DELETE"])
@permission_classes([IsAuthenticated])
def goal_detail_api(request, pk):
    try:
        goal = Goal.objects.get(pk=pk, user=request.user)
    except Goal.DoesNotExist:
        return Response({"error": "Meta no encontrada"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = GoalSerializer(goal)
        contributions = GoalContribution.objects.filter(goal=goal)
        contributions_serializer = GoalContributionSerializer(contributions, many=True)
        data = serializer.data
        data["contributions"] = contributions_serializer.data
        return Response(data)

    if request.method == "PUT":
        serializer = GoalSerializer(
            goal,
            data=request.data
        )
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    goal.delete()
    return Response(
        status=status.HTTP_204_NO_CONTENT
    )

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def goal_contributions_api(request, goal_id):
    try:
        goal = Goal.objects.get(
            pk=goal_id,
            user=request.user
        )
    except Goal.DoesNotExist:
        return Response(
            {"error": "Meta no encontrada"},
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == "GET":
        contributions = GoalContribution.objects.filter(goal=goal)
        serializer = GoalContributionSerializer(contributions, many=True)
        return Response(serializer.data)

    serializer = GoalContributionSerializer(data=request.data)

    if serializer.is_valid():
        contribution = serializer.save(goal=goal)
        goal.update_saved_amount()
        return Response(
            GoalContributionSerializer(contribution).data,
            status=status.HTTP_201_CREATED
        )
    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def profile_api(request):

    user = request.user

    if request.method == "GET":

        serializer = ProfileSerializer(
            user,
            context={"request": request}
        )

        return Response(serializer.data)

    serializer = ProfileSerializer(
        user,
        data=request.data,
        partial=True,
        context={"request": request}
    )

    if serializer.is_valid():

        serializer.save()

        return Response({
            "message": "Perfil actualizado correctamente",
            "profile": serializer.data,
        })

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def password_change_api(request):

    form = PasswordChangeForm(
        request.user,
        request.data
    )

    if form.is_valid():

        form.save()

        update_session_auth_hash(request, request.user)

        return Response({
            "message": "Contraseña actualizada correctamente."
        })

    errors = {}

    for field, messages in form.errors.items():
        errors[field] = messages

    return Response(
        {
            "error": "No se pudo cambiar la contraseña.",
            "errors": errors,
        },
        status=status.HTTP_400_BAD_REQUEST
    )

