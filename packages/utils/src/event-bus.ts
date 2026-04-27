import type { BusEvent, EventPayload } from "@healthcare/types";

type EventHandler<T = EventPayload> = (event: BusEvent<T>) => void;

/**
 * Cross Micro-Frontend Event Bus
 * Uses the CustomEvent API for loose coupling between MFEs.
 */
class EventBus {
  private prefix = "healthcare:";

  /**
   * Emit an event to all listeners
   */
  emit<T = EventPayload>(type: string, payload: T, source: string = "unknown"): void {
    const event: BusEvent<T> = {
      type,
      payload,
      source,
      timestamp: Date.now(),
    };

    window.dispatchEvent(
      new CustomEvent(this.prefix + type, { detail: event })
    );
  }

  /**
   * Subscribe to an event
   */
  on<T = EventPayload>(type: string, handler: EventHandler<T>): () => void {
    const wrappedHandler = (e: Event) => {
      handler((e as CustomEvent).detail as BusEvent<T>);
    };

    window.addEventListener(this.prefix + type, wrappedHandler);

    // Return unsubscribe function
    return () => {
      window.removeEventListener(this.prefix + type, wrappedHandler);
    };
  }

  /**
   * Subscribe to an event once
   */
  once<T = EventPayload>(type: string, handler: EventHandler<T>): void {
    const wrappedHandler = (e: Event) => {
      handler((e as CustomEvent).detail as BusEvent<T>);
      window.removeEventListener(this.prefix + type, wrappedHandler);
    };

    window.addEventListener(this.prefix + type, wrappedHandler);
  }
}

// Singleton instance
export const eventBus = new EventBus();

// Well-known event types
export const EventTypes = {
  // Navigation
  NAVIGATE: "navigate",

  // Patient
  PATIENT_SELECTED: "patient:selected",
  PATIENT_UPDATED: "patient:updated",
  PATIENT_CREATED: "patient:created",

  // Appointment
  APPOINTMENT_CREATED: "appointment:created",
  APPOINTMENT_UPDATED: "appointment:updated",
  APPOINTMENT_CANCELLED: "appointment:cancelled",

  // Billing
  INVOICE_CREATED: "invoice:created",
  PAYMENT_RECEIVED: "payment:received",

  // Notification
  NOTIFICATION_NEW: "notification:new",
  NOTIFICATION_READ: "notification:read",

  // Auth
  AUTH_LOGIN: "auth:login",
  AUTH_LOGOUT: "auth:logout",
  AUTH_TOKEN_REFRESH: "auth:token_refresh",

  // Theme
  THEME_CHANGED: "theme:changed",

  // Organization
  ORG_SWITCHED: "org:switched",
} as const;
