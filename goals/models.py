from django.db import models
from django.conf import settings

from django.db.models import Sum
from django.db.models.functions import Coalesce
from decimal import Decimal


class Goal(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="goals"
    )

    name = models.CharField(
        "Nombre",
        max_length=100
    )

    description = models.TextField(
        "Descripción",
        blank=True
    )

    target_amount = models.DecimalField(
        "Objetivo (€)",
        max_digits=10,
        decimal_places=2
    )

    saved_amount = models.DecimalField(
        "Ahorrado (€)",
        max_digits=10,
        decimal_places=2,
        default=0
    )

    target_date = models.DateField(
        "Fecha objetivo",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.name

    def update_saved_amount(self):

        total = self.contributions.aggregate(
            total=Coalesce(
                Sum("amount"),
                Decimal("0.00")
            )
        )["total"]

        self.saved_amount = total
        self.save(update_fields=["saved_amount"])    

class GoalContribution(models.Model):

    goal = models.ForeignKey(
        Goal,
        on_delete=models.CASCADE,
        related_name="contributions"
    )

    amount = models.DecimalField(
        "Cantidad",
        max_digits=10,
        decimal_places=2
    )

    note = models.CharField(
        "Nota",
        max_length=200,
        blank=True
    )

    created_at = models.DateTimeField(
        "Fecha",
        auto_now_add=True
    )

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.goal.name} - {self.amount} €"