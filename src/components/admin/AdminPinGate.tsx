import { ArrowLeft, KeyRound, Lock } from 'lucide-react';
import { useState } from 'react';

interface AdminPinGateProps {
  brandName: string;
  expectedPin: string;
  onUnlock: () => void;
  onBackToMenu: () => void;
}

export function AdminPinGate({
  brandName,
  expectedPin,
  onUnlock,
  onBackToMenu,
}: AdminPinGateProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === expectedPin.trim()) {
      setError('');
      onUnlock();
    } else {
      setError('Code PIN incorrect. Veuillez réessayer.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0D0C] text-[#F8F5F0] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#181614] border border-white/12 p-6 sm:p-8 shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-[#E12D24]/15 border border-[#E12D24]/30 flex items-center justify-center mb-5">
          <Lock className="w-6 h-6 text-[#E12D24]" aria-hidden="true" />
        </div>

        <h1 className="font-display text-2xl font-extrabold text-[#F8F5F0] mb-1">
          Espace Gérant · {brandName}
        </h1>
        <p className="text-sm text-[#B5ACA2] mb-6">
          Saisissez votre code PIN à 4 chiffres pour gérer le menu et les paramètres.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-pin-input"
              className="block text-xs font-semibold text-[#D6CEC5] mb-1.5"
            >
              Code PIN (4 chiffres)
            </label>
            <div className="relative">
              <KeyRound
                className="w-4 h-4 text-[#8A8178] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="admin-pin-input"
                type="password"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) setError('');
                }}
                placeholder="••••"
                className="w-full min-h-[48px] pl-10 pr-4 py-2.5 rounded-xl bg-[#110F0E] border border-white/15 text-base font-price tracking-[0.35em] text-[#F8F5F0] placeholder-[#6B635B] focus:outline-none focus:border-[#F59E0B]"
              />
            </div>
            {error && (
              <p className="text-xs text-[#FF6B63] mt-2 font-medium" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full min-h-[48px] px-5 py-3 rounded-xl bg-[#E12D24] hover:bg-[#C8231B] text-white text-sm font-bold transition-colors cursor-pointer"
          >
            Déverrouiller l’administration
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-xs text-[#8A8178]">PIN démo : 1234</span>
          <button
            type="button"
            onClick={onBackToMenu}
            className="min-h-[40px] px-2.5 rounded-lg text-xs font-semibold text-[#F59E0B] hover:bg-white/5 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Retour au menu public</span>
          </button>
        </div>
      </div>
    </div>
  );
}
