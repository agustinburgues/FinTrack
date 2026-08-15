from rest_framework import serializers
from categories.models import Category
from transactions.models import Transaction
from budgets.models import Budget
from goals.models import Goal, GoalContribution
from accounts.models import User

class DashboardSerializer(serializers.Serializer):
    balance = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    total_income = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    total_expense = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    total_transactions = serializers.IntegerField()

    categories_count = serializers.IntegerField()

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category

        fields = [
            "id",
            "name",
            "category_type",
            "color",
        ]

class BudgetSerializer(serializers.ModelSerializer):

    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )

    class Meta:
        model = Budget

        fields = [
            "id",
            "category",
            "category_name",
            "amount",
            "month",
            "year",
        ]

    def validate_category(self, category):

        request = self.context.get("request")

        if request and category.user != request.user:
            raise serializers.ValidationError(
                "La categoría no pertenece al usuario."
            )

        if category.category_type != "expense":
            raise serializers.ValidationError(
                "Los presupuestos solo pueden utilizar categorías de gasto."
            )

        return category

    def validate(self, attrs):

        request = self.context.get("request")

        if not request:
            return attrs

        category = attrs.get(
            "category",
            self.instance.category if self.instance else None
        )

        month = attrs.get(
            "month",
            self.instance.month if self.instance else None
        )

        year = attrs.get(
            "year",
            self.instance.year if self.instance else None
        )

        queryset = Budget.objects.filter(
            user=request.user,
            category=category,
            month=month,
            year=year,
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "Ya existe un presupuesto para esa categoría en ese mes."
            )

        return attrs

class GoalSerializer(serializers.ModelSerializer):

    percentage = serializers.SerializerMethodField()
    
    class Meta:
        model = Goal

        fields = [
            "id",
            "name",
            "description",
            "target_amount",
            "saved_amount",
            "target_date",
            "percentage",
        ]

        read_only_fields = [
            "id",
            "saved_amount",
            "percentage",
        ]

    def get_percentage(self, obj):

        if obj.target_amount <= 0:
            return 0

        percentage = (
            obj.saved_amount / obj.target_amount
        ) * 100

        return round(float(percentage), 2)

class GoalContributionSerializer(serializers.ModelSerializer):
    class Meta:
        model = GoalContribution
        fields = [
            "id",
            "amount",
            "note",
            "created_at",
        ]
        read_only_fields = [
            "id",
            "created_at",
        ]

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User

        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "currency",
            "profile_picture",
        ]

        extra_kwargs = {
            "profile_picture": {
                "required": False,
                "allow_null": True,
            }
        }

    def to_representation(self, instance):

        data = super().to_representation(instance)

        if instance.profile_picture:
            request = self.context.get("request")

            if request:
                data["profile_picture"] = request.build_absolute_uri(
                    instance.profile_picture.url
                )
            else:
                data["profile_picture"] = instance.profile_picture.url
        else:
            data["profile_picture"] = None

        return data