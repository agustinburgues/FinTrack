from django import forms
from .models import Transaction
from categories.models import Category

class TransactionForm(forms.ModelForm):

    class Meta:
        model = Transaction

        fields = [
            "transaction_type",
            "category",
            "amount",
            "description",
            "date",
        ]

        widgets = {
            "transaction_type": forms.Select(
                attrs={
                    "class": "form-select"
                    }
            ),
            "category": forms.Select(
                attrs={
                    "class": "form-select"
                }
            ),
            "amount": forms.NumberInput(
                attrs={
                    "class": "form-control",
                    "step": "0.01",
                    "min": "0.01",
                    "placeholder": "0.00"
                }
            ),
            "description": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "placeholder": "Ej. Compra en supermercado"
                }
            ),
            "date": forms.DateInput(
                attrs={
                    "type": "date",
                    "class": "form-control"
                }
            ),
        }

    def __init__(self, *args, **kwargs):
        user = kwargs.pop("user", None)

        super().__init__(*args, **kwargs)

        if user:

            self.fields["category"].queryset = Category.objects.filter(
                user=user
            )
    
    def clean_amount(self):
        amount = self.cleaned_data["amount"]

        if amount <= 0:
            raise forms.ValidationError(
                "El importe debe ser mayor que cero."
            )

        return amount