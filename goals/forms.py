from django import forms
from .models import Goal, GoalContribution


class GoalForm(forms.ModelForm):

    class Meta:
        model = Goal

        fields = [
            "name",
            "description",
            "target_amount",
            "target_date",
        ]

        widgets = {
            "name": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Ej. Vacaciones en Japón"
            }),

            "description": forms.Textarea(attrs={
                "class": "form-control",
                "rows": 3,
                "placeholder": "Descripción (opcional)"
            }),

            "target_amount": forms.NumberInput(attrs={
                "class": "form-control",
                "step": "0.01",
                "min": "0"
            }),

            "saved_amount": forms.NumberInput(attrs={
                "class": "form-control",
                "step": "0.01",
                "min": "0"
            }),

            "target_date": forms.DateInput(attrs={
                "class": "form-control",
                "type": "date"
            }),
        }

    def clean(self):
        cleaned_data = super().clean()

        target = cleaned_data.get("target_amount")
        saved = cleaned_data.get("saved_amount")

        if target is not None and target <= 0:
            self.add_error(
                "target_amount",
                "El objetivo debe ser mayor que cero."
            )

        if saved is not None and saved < 0:
            self.add_error(
                "saved_amount",
                "El ahorro no puede ser negativo."
            )

        if (
            target is not None and
            saved is not None and
            saved > target
        ):
            self.add_error(
                "saved_amount",
                "El ahorro no puede superar el objetivo."
            )

        return cleaned_data


class GoalContributionForm(forms.ModelForm):

    class Meta:
        model = GoalContribution

        fields = [
            "amount",
            "note",
        ]

        widgets = {

            "amount": forms.NumberInput(attrs={
                "class": "form-control",
                "step": "0.01",
                "min": "0.01",
                "placeholder": "Cantidad"
            }),

            "note": forms.TextInput(attrs={
                "class": "form-control",
                "placeholder": "Nota (opcional)"
            }),

        }

    def clean_amount(self):

        amount = self.cleaned_data["amount"]

        if amount <= 0:
            raise forms.ValidationError(
                "La cantidad debe ser mayor que cero."
            )

        return amount