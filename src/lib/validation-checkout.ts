import { z } from 'zod'

// Shipping address schema
export const shippingAddressSchema = z.object({
  firstName: z.string()
    .min(2, 'Il nome deve avere almeno 2 caratteri')
    .max(50, 'Il nome non può superare i 50 caratteri')
    .regex(/^[a-zA-ZÀ-ÿ\s'.-]+$/, 'Il nome contiene caratteri non validi'),
  
  lastName: z.string()
    .min(2, 'Il cognome deve avere almeno 2 caratteri')
    .max(50, 'Il cognome non può superare i 50 caratteri')
    .regex(/^[a-zA-ZÀ-ÿ\s'.-]+$/, 'Il cognome contiene caratteri non validi'),
  
  street: z.string()
    .min(5, 'L\'indirizzo deve avere almeno 5 caratteri')
    .max(100, 'L\'indirizzo non può superare i 100 caratteri'),
  
  city: z.string()
    .min(2, 'La città deve avere almeno 2 caratteri')
    .max(50, 'La città non può superare i 50 caratteri')
    .regex(/^[a-zA-ZÀ-ÿ\s'.-]+$/, 'La città contiene caratteri non validi'),
  
  postalCode: z.string()
    .min(5, 'Il CAP deve avere 5 cifre')
    .max(5, 'Il CAP deve avere 5 cifre')
    .regex(/^\d{5}$/, 'Il CAP deve contenere solo 5 cifre'),
  
  country: z.string()
    .min(2, 'Seleziona un paese'),
  
  phone: z.string()
    .optional()
    .refine((phone) => {
      if (!phone) return true // Optional field
      return /^(\+39)?[\s]?[0-9]{9,10}$/.test(phone.replace(/[\s-]/g, ''))
    }, 'Inserisci un numero di telefono valido (es. 123456789 o +39 123456789)')
})

// Checkout form schema
export const checkoutFormSchema = z.object({
  email: z.string()
    .email('Inserisci un indirizzo email valido')
    .max(100, 'L\'email non può superare i 100 caratteri'),
  
  shipping: shippingAddressSchema,
  
  notes: z.string()
    .max(500, 'Le note non possono superare i 500 caratteri')
    .optional(),
  
  // Privacy and terms acceptance
  acceptTerms: z.boolean()
    .refine(val => val === true, 'Devi accettare i termini e condizioni'),
  
  acceptPrivacy: z.boolean()
    .refine(val => val === true, 'Devi accettare la privacy policy'),

  // Age confirmation
  confirmAge: z.boolean()
    .refine(val => val === true, 'Devi confermare di essere maggiorenne'),

  // Newsletter subscription (optional)
  subscribeNewsletter: z.boolean()
})

// Type definitions
export type ShippingAddressData = z.infer<typeof shippingAddressSchema>
export type CheckoutFormData = z.infer<typeof checkoutFormSchema>

// Default values for form
export const defaultShippingAddress: ShippingAddressData = {
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  postalCode: '',
  country: 'Italia'
}

export const defaultCheckoutForm: CheckoutFormData = {
  email: '',
  shipping: defaultShippingAddress,
  notes: '',
  acceptTerms: false,
  acceptPrivacy: false,
  confirmAge: false,
  subscribeNewsletter: false
}

// Italian provinces for validation (optional enhancement)
export const italianProvinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno', 'Asti',
  'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento', 'Bergamo',
  'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta',
  'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza',
  'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara', 'Firenze', 'Foggia',
  'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia', 'Grosseto', 'Imperia', 'Isernia',
  'La Spezia', 'L\'Aquila', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca',
  'Macerata', 'Mantova', 'Massa-Carrara', 'Matera', 'Milano', 'Modena', 'Monza e Brianza',
  'Napoli', 'Novara', 'Nuoro', 'Olbia-Tempio', 'Oristano', 'Padova', 'Palermo', 'Parma',
  'Pavia', 'Perugia', 'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia',
  'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia',
  'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa',
  'Sondrio', 'Taranto', 'Teramo', 'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso',
  'Trieste', 'Udine', 'Varese', 'Venezia', 'Verbano-Cusio-Ossola', 'Vercelli', 'Verona',
  'Vibo Valentia', 'Vicenza', 'Viterbo'
]

// Countries for shipping (can be expanded)
export const shippingCountries = [
  { value: 'Italia', label: 'Italia' },
  { value: 'San Marino', label: 'San Marino' },
  { value: 'Vaticano', label: 'Vaticano' }
]