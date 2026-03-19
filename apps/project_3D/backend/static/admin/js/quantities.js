document.addEventListener("DOMContentLoaded", function () {
    const hiddenInput = document.getElementById("id_quantities_data");
    const container = document.getElementById("quantities-container");
    const addButton = document.getElementById("add-quantity");

    const KNOWN_ITEMS = [
        { value: "bedrooms", label: "Bedrooms" },
        { value: "bathrooms", label: "Bathrooms" },
        { value: "living_rooms", label: "Living Rooms" },
        { value: "kitchen", label: "Kitchen" },
        { value: "oven", label: "Oven" },
        { value: "windows", label: "Windows" },
    ];

    // Parse existing JSON
    let quantities = {};
    if (hiddenInput.value) {
        try {
            quantities = JSON.parse(hiddenInput.value);
        } catch (e) {
            console.error("Invalid quantities JSON");
        }
    }

    function renderRow(key = "", value = "") {
        const row = document.createElement("div");
        row.classList.add("quantity-row");
        row.style.marginBottom = "5px";

        // Create dropdown
        const select = document.createElement("select");
        KNOWN_ITEMS.forEach(item => {
            const option = document.createElement("option");
            option.value = item.value;
            option.textContent = item.label;
            select.appendChild(option);
        });
        select.value = key;

        // Create number input
        const input = document.createElement("input");
        input.type = "number";
        input.min = 0;
        input.value = value;

        // Remove button
        const remove = document.createElement("button");
        remove.type = "button";
        remove.textContent = "❌";
        remove.style.marginLeft = "5px";

        remove.addEventListener("click", () => {
            row.remove();
            updateHiddenInput();
        });

        // Update hidden JSON on change
        [select, input].forEach(el => el.addEventListener("change", updateHiddenInput));

        row.appendChild(select);
        row.appendChild(input);
        row.appendChild(remove);

        container.appendChild(row);
    }

    function updateHiddenInput() {
        const data = {};
        container.querySelectorAll(".quantity-row").forEach(row => {
            const key = row.querySelector("select").value;
            const value = parseInt(row.querySelector("input").value) || 0;
            if (key) data[key] = value;
        });
        hiddenInput.value = JSON.stringify(data);
    }

    // Render existing quantities
    for (const key in quantities) {
        renderRow(key, quantities[key]);
    }

    // Add new row
    addButton.addEventListener("click", () => renderRow());
});
