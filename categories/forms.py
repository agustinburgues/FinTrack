from django import forms
from .models import Category


class CategoryForm(forms.ModelForm):

    class Meta:
        model = Category
        fields = [
            'name',
            'category_type',
            'color',
            'icon',
        ]

        widgets = {
            'name': forms.TextInput(attrs={
                'class': 'form-control'
            }),

            'category_type': forms.Select(attrs={
                'class': 'form-select'
            }),

            'color': forms.TextInput(attrs={
                'type': 'color',
                'class': 'form-control form-control-color'
            }),

            'icon': forms.TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Ej: 💰 🍔 🚗'
            }),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user", None)
        super().__init__(*args, **kwargs)

    def clean_name(self):
        name = self.cleaned_data["name"]

        if self.user:
            exists = Category.objects.filter(
                user=self.user,
                name__iexact=name
            )

            if self.instance.pk:
                exists = exists.exclude(pk=self.instance.pk)

            if exists.exists():
                raise forms.ValidationError("Ya existe una categoría con ese nombre.")

        return name