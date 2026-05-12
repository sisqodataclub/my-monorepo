
// ========================
// SERVICES API (Public + Auth)
// ========================

// 1. DEFINE THE BASE URL
export const API_BASE = import.meta.env.VITE_API_URL || "https://core.franciscodes.com";

/**
 * Helper to construct full image URLs.
 * (Same as ecommerce version)
 */
export const getImageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=600&auto=format&fit=crop";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};

// ========================
// SERVICES (Public)
// ========================

/**
 * FETCH ALL SERVICES (Public Access)
 * Returns a list of services with mapped fields.
 */
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

    // Handle paginated response (if any)
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
      // keep original fields if needed
      ...service
    }));
  } catch (error) {
    console.error("API Error (getServices):", error);
    return [];
  }
}

/**
 * FETCH SINGLE SERVICE BY ID (Public)
 */
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

/**
 * GET AVAILABLE TIME SLOTS (Public)
 * @param {number} serviceId
 * @param {string} date - YYYY-MM-DD
 * @param {number|null} providerId - optional staff ID
 */
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
    return await res.json(); // array of { start, end, provider_ids }
  } catch (error) {
    console.error("API Error (getAvailableSlots):", error);
    return [];
  }
}

// ========================
// SERVICE BOOKINGS (Requires Authentication)
// ========================

/**
 * CREATE A SERVICE BOOKING (Private)
 * @param {object} bookingData
 *   - service_id: number
 *   - start_time: ISO datetime string
 *   - customer_email: string
 *   - customer_name: string (optional)
 *   - provider_id: number (optional)
 *   - customer_notes: string (optional)
 */
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

    return await res.json(); // { booking, client_secret }
  } catch (error) {
    console.error("API Error (createServiceBooking):", error);
    throw error;
  }
}

/**
 * FETCH USER'S SERVICE BOOKINGS (Private)
 * Returns bookings for the logged-in user (or all if staff)
 */
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

/**
 * CONFIRM A SERVICE BOOKING (Private – after payment)
 */
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

/**
 * CANCEL A SERVICE BOOKING (Private)
 */
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
