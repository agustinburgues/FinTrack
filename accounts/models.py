from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """
    Modelo de usuario personalizado.
    Hereda todo el comportamiento del usuario de Django.
    """

    CURRENCY_CHOICES = [
        ("EUR", "Euro (€)"),
        ("USD", "Dólar ($)"),
        ("ARS", "Peso Argentino ($)"),
    ]

    currency = models.CharField(
        "Moneda",
        max_length=3,
        choices=CURRENCY_CHOICES,
        default="EUR"
    )

    profile_picture = models.ImageField(
        "Foto de perfil",
        upload_to="profiles/",
        blank=True,
        null=True
    )

    def __str__(self):
        return self.username