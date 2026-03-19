from django import forms
from .models import Booking
import json

# Optional: known items for dropdowns in quantities
KNOWN_ITEMS = [
    ("bedrooms", "Bedrooms"),
    ("bathrooms", "Bathrooms"),
    ("living_rooms", "Living Rooms"),
    ("kitchen", "Kitchen"),
    ("oven", "Oven"),
    ("windows", "Windows"),
]

# Cleaning type choices for selected_areas
CLEANING_TYPE_CHOICES = [
    ("end_of_tenancy", "End of Tenancy"),
    ("one_off", "One-off Deep Cleaning"),
    ("regular", "Regular Cleaning"),
]


class BookingAdminForm(forms.ModelForm):
    # Hidden field for JS-controlled quantities
    quantities_data = forms.CharField(
        required=False,
        widget=forms.HiddenInput()
    )

    # Checkbox field for selected_areas
    selected_areas = forms.MultipleChoiceField(
        choices=CLEANING_TYPE_CHOICES,
        required=False,
        widget=forms.CheckboxSelectMultiple
    )

    class Meta:
        model = Booking
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        # Load saved quantities into hidden field
        if self.instance.pk and self.instance.quantities:
            self.initial["quantities_data"] = json.dumps(self.instance.quantities)

        # Load saved selected_areas into checkboxes
        if self.instance.pk and isinstance(self.instance.selected_areas, list):
            self.initial["selected_areas"] = self.instance.selected_areas

    def clean(self):
        cleaned = super().clean()

        # Parse quantities_data from hidden JSON
        raw = self.cleaned_data.get("quantities_data", "{}")
        try:
            cleaned["quantities"] = json.loads(raw)
        except json.JSONDecodeError:
            raise forms.ValidationError("Invalid quantities data")
        if cleaned["quantities"] is None:
            cleaned["quantities"] = {}

        # Ensure selected_areas is a list (checkbox field returns a list)
        selected = cleaned.get("selected_areas", [])
        cleaned["selected_areas"] = selected if selected else []

        return cleaned
