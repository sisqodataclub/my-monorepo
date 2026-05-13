// src/lib/api.js
// ========================
// SERVICES API (Public + Auth)
// ========================

// 1. HARDCODED BASE URL FOR TESTING NEW BACKEND
// This bypasses all Docker/Vite environment variables.
export const API_BASE = "https://core.franciscodes.com";

/**
 * Helper to construct full image URLs.
 */
export const getImageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&auto=format&fit=crop";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// ========================
// SERVICES (Public)
// ========================

export async function getServices() {
  try {
    const res = await fetch(`${API_BASE}/api/services/`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Tenant": "DDEEP"
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch services: ${res.status}`);
    }

    const data = await res.json();

    let rawResults = [];
    if (data.results && Array.isArray(data.results)) {
      rawResults = data.results;
    } else if (Array.isArray(data)) {
      rawResults = data;
    }

    return rawResults.map(service => ({
      id: service.id,
      name: service.name,
      description: service.description,
      priceFixed: service.price_fixed,
      pricePerHour: service.price_per_hour,
      durationMinutes: service.duration_minutes,
      requiresStaff: service.requires_assigned_staff,
      anyStaffCanServe: service.any_staff_can_serve,
      isRemote: service.is_remote,
      image: getImageUrl(service.image_url),
      ...service
    }));
  } catch (error) {
    console.error("API Error (getServices):", error);
    return [];
  }
}

export async function getServiceById(id) {
  try {
    const res = await fetch(`${API_BASE}/api/services/${id}/`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Tenant": "DDEEP"
      }
    });

    if (!res.ok) throw new Error(`Service ${id} not found`);

    const service = await res.json();
    return {
      ...service,
      image: getImageUrl(service.image_url),
    };
  } catch (error) {
    console.error("API Error (getServiceById):", error);
    return null;
  }
}

export async function getAvailableSlots(serviceId, date, providerId = null) {
  try {
    let url = `${API_BASE}/api/services/${serviceId}/available_slots/?date=${date}`;
    if (providerId) url += `&provider_id=${providerId}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-Tenant": "DDEEP"
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch slots: ${res.status}`);
    return await res.json(); 
  } catch (error) {
    console.error("API Error (getAvailableSlots):", error);
    return [];
  }
}

// ========================
// SERVICE BOOKINGS (Requires Authentication)
// ========================

export async function createServiceBooking(bookingData) {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("You must be logged in to book a service.");

    const res = await fetch(`${API_BASE}/api/service-bookings/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Tenant": "DDEEP"
      },
      body: JSON.stringify(bookingData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Booking creation failed");
    }

    return await res.json(); 
  } catch (error) {
    console.error("API Error (createServiceBooking):", error);
    throw error;
  }
}

export async function getUserServiceBookings() {
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return [];

    const res = await fetch(`${API_BASE}/api/service-bookings/`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Tenant": "DDEEP"
      }
    });

    if (!res.ok) throw new Error(`Failed to fetch bookings: ${res.status}`);

    const data = await res.json();
    return data.results || data || [];
  } catch (error) {
    console.error("API Error (getUserServiceBookings):", error);
    return [];
  }
}

export async function confirmServiceBooking(bookingId) {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/api/service-bookings/${bookingId}/confirm/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Tenant": "DDEEP"
      }
    });
    if (!res.ok) throw new Error("Confirmation failed");
    return await res.json();
  } catch (error) {
    console.error("API Error (confirmServiceBooking):", error);
    throw error;
  }
}

export async function cancelServiceBooking(bookingId) {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch(`${API_BASE}/api/service-bookings/${bookingId}/cancel/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Tenant": "DDEEP"
      }
    });
    if (!res.ok) throw new Error("Cancellation failed");
    return await res.json();
  } catch (error) {
    console.error("API Error (cancelServiceBooking):", error);
    throw error;
  }
}
