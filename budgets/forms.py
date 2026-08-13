from django import forms
from .models import Budget
from categories.models import Category
from datetime import date


class BudgetForm(forms.ModelForm):

    class Meta:
        model = Budget
        fields = ["category", "amount", "month", "year"]

        widgets = {
            "category": forms.Select(attrs={"class": "form-select"}),
            "amount": forms.NumberInput(attrs={
                "class": "form-control",
                "step": "0.01",
                "min": "0"
            }),
            "month": forms.Select(
                choices=[(i, i) for i in range(1, 13)],
                attrs={"class": "form-select"}
            ),
            "year": forms.NumberInput(attrs={
                "class": "form-control"
            }),
        }

    def __init__(self, *args, user=None, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)

        if user:
            self.fields["category"].queryset = Category.objects.filter(
                user=user,
                category_type="expense"
            )

        self.fields["year"].initial = date.today().year
        self.fields["month"].initial = date.today().month

    def clean(self):
        cleaned_data = super().clean()

        category = cleaned_data.get("category")
        month = cleaned_data.get("month")
        year = cleaned_data.get("year")

        if not all([category, month, year]):
            return cleaned_data

        queryset = Budget.objects.filter(
            user=self.user,
            category=category,
            month=month,
            year=year,
        )

        if self.instance.pk:
            queryset = queryset.exclude(pk=self.instance.pk)

        if queryset.exists():
            raise forms.ValidationError(
                "Ya existe un presupuesto para esa categoría en ese mes."
            )

        return cleaned_data