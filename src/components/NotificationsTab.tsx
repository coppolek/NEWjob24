import { Bell, Briefcase, Eye, CheckCircle2 } from 'lucide-react';
import { Notification } from '../types';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Nuova corrispondenza: Sviluppatore React Senior',
    company: 'TechFlow Solutions',
    location: 'Milano, IT (Ibrido)',
    time: '2 ore fa',
    read: false,
    type: 'match'
  },
  {
    id: '2',
    title: 'Il tuo profilo è comparso in 12 ricerche',
    company: 'Varie aziende',
    location: 'Italia',
    time: '5 ore fa',
    read: false,
    type: 'view'
  },
  {
    id: '3',
    title: 'Alert: 5 nuove posizioni per "Frontend Developer"',
    company: 'Careerjet',
    location: 'Lombardia',
    time: '1 giorno fa',
    read: true,
    type: 'alert'
  },
  {
    id: '4',
    title: 'Candidatura visualizzata: Full Stack Engineer',
    company: 'Innovatech SpA',
    location: 'Roma, IT',
    time: '2 giorni fa',
    read: true,
    type: 'view'
  }
];

const getIcon = (type: Notification['type']) => {
  switch (type) {
    case 'match':
      return <Briefcase className="w-5 h-5 text-blue-600" />;
    case 'alert':
      return <Bell className="w-5 h-5 text-amber-500" />;
    case 'view':
      return <Eye className="w-5 h-5 text-emerald-500" />;
  }
};

export default function NotificationsTab() {
  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Le tue Notifiche</h2>
          <p className="text-sm text-slate-500 mt-1">Rimani aggiornato sulle tue candidature e nuovi alert.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
          <CheckCircle2 className="w-4 h-4" />
          Segna tutte come lette
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id} 
            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all ${
              notif.read 
                ? 'bg-white border-slate-200' 
                : 'bg-blue-50/50 border-blue-100 shadow-sm'
            }`}
          >
            <div className={`p-3 rounded-full shrink-0 ${notif.read ? 'bg-slate-100' : 'bg-white shadow-sm'}`}>
              {getIcon(notif.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                <h4 className={`text-base font-medium truncate ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                  {notif.title}
                </h4>
                <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                  {notif.time}
                </span>
              </div>
              <p className="text-sm text-slate-500 flex items-center gap-2 truncate">
                <span className="font-medium text-slate-600">{notif.company}</span>
                <span>•</span>
                <span>{notif.location}</span>
              </p>
            </div>
            
            {!notif.read && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
