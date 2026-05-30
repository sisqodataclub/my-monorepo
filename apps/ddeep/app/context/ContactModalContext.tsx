import { createContext, useContext, useState, type ReactNode } from "react";
import {
  FaClipboardList,
  FaPhoneAlt,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";

const CONTACT_EMAIL = "clean@ddeepcleaningservices.com";
const CONTACT_PHONE = "07459416262";
const CONTACT_WHATSAPP = "447459416262";

// --- Context definition ---
interface ContactModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(
  undefined
);

export function useContactModal() {
  const ctx = useContext(ContactModalContext);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}

// --- Provider (includes the modal itself) ---
export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <ContactModal onClose={closeModal} />}
    </ContactModalContext.Provider>
  );
}

// --- The actual modal UI (kept separate for readability) ---
function ContactModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-xl font-extrabold text-slate-900">Get in Touch</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            aria-label="Close modal"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="px-6 pb-6 grid grid-cols-2 gap-3">
          {/* Instant Quote */}
          <a
            href="https://api.ddeepcleaningservices.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-2 sm:col-span-2 flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <FaClipboardList />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">
                Book Online
              </p>
              <p className="text-sm font-bold text-green-950">Instant Quote</p>
            </div>
          </a>

          {/* Phone */}
          <a
            href={`tel:${CONTACT_PHONE}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <FaPhoneAlt />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">Call</p>
              <p className="text-sm font-bold text-green-950 whitespace-nowrap">{CONTACT_PHONE}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-green-50 border border-green-100 hover:bg-green-100 transition-colors group"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-green-700 shadow-sm group-hover:scale-110 transition-transform shrink-0">
              <FaEnvelope />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider leading-none mb-1">Email</p>
              <p className="text-[11px] font-bold text-green-950 break-all leading-tight">{CONTACT_EMAIL}</p>
            </div>
          </a>

          {/* WhatsApp */}
          <a
            href={`https://wa.me/${CONTACT_WHATSAPP.replace(/\D/g, "")}`}
            className="flex items-center gap-4 p-4 rounded-2xl bg-green-600 hover:bg-green-700 text-white transition-colors group shadow-md shadow-green-900/10"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform shrink-0">
              <FaWhatsapp className="text-xl" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-green-100 uppercase tracking-wider leading-none mb-1">WhatsApp</p>
              <p className="text-sm font-bold">Live Chat</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
