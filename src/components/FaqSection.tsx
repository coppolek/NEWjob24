import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "Come posso cercare lavoro efficacemente sul portale?",
    answer: "Usa la barra di ricerca principale inserendo parole chiave specifiche (es. 'Sviluppatore React', 'Marketing') e specifica la località. Il nostro motore aggrega le migliori opportunità per mostrarti risultati altamente pertinenti."
  },
  {
    question: "Come funzionano gli avvisi di lavoro (Job Alerts)?",
    answer: "Una volta registrato, puoi accedere alla scheda 'Avvisi' nel menu in alto. Lì potrai inserire le tue preferenze di ruolo e località, scegliendo di ricevere notifiche giornaliere o settimanali per non perdere le nuove posizioni aperte."
  },
  {
    question: "Il servizio è completamente gratuito per i candidati?",
    answer: "Sì, assolutamente! La ricerca, la consultazione degli annunci e l'impostazione degli avvisi personalizzati sono servizi offerti al 100% gratuitamente a tutti coloro che cercano lavoro."
  },
  {
    question: "Cosa succede quando clicco su un annuncio?",
    answer: "Verrai reindirizzato direttamente alla pagina ufficiale dell'azienda o dell'agenzia che ha pubblicato l'offerta, dove potrai completare la tua candidatura in modo sicuro."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-24 w-full max-w-3xl mx-auto border-t border-slate-100 pt-16">
      <div className="text-center mb-12">
        <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
          Domande Frequenti
        </h3>
        <p className="text-slate-600">
          Tutto quello che ti serve sapere per sfruttare al meglio CareerPortal.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-2xl transition-colors ${isOpen ? 'border-[#003399] bg-blue-50/30' : 'border-slate-200 bg-white hover:border-slate-300'}`}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                onClick={() => toggleAccordion(index)}
              >
                <span className={`font-semibold text-lg ${isOpen ? 'text-[#003399]' : 'text-slate-800'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ml-4 ${isOpen ? 'rotate-180 text-[#003399]' : 'text-slate-400'}`} 
                />
              </button>
              
              <div 
                className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-6 pb-6 text-slate-600 leading-relaxed text-sm md:text-base">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
