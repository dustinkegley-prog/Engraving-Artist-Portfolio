'use client';

import { useState } from 'react';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('submitting');
    setErrorMessage('');

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setState('success');
      form.reset();
    } else {
      const json = await res.json().catch(() => ({}));
      setErrorMessage((json as { error?: string }).error ?? 'Something went wrong. Please try again.');
      setState('error');
    }
  }

  const inputClass = 'w-full bg-zinc-900 border border-zinc-700 px-4 py-3 text-sm text-stone-100 placeholder:text-zinc-600 focus:outline-none focus:border-gold-500 transition-colors duration-300';
  const labelClass = 'block text-[11px] tracking-[0.25em] uppercase text-stone-500 mb-2';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>Name</label>
        <input id="name" name="name" type="text" required placeholder="Your name" className={inputClass} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>Email</label>
        <input id="email" name="email" type="email" required placeholder="your@email.com" className={inputClass} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea id="message" name="message" rows={6} required placeholder="Tell me about your project…" className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={state === 'submitting'}
        className="w-full border border-gold-500 px-6 py-3 text-[11px] tracking-[0.3em] uppercase text-gold-400 hover:bg-gold-500 hover:text-zinc-950 disabled:opacity-40 transition-all duration-300 font-medium"
      >
        {state === 'submitting' ? 'Sending…' : 'Send Message'}
      </button>

      {state === 'success' && (
        <p className="text-[11px] tracking-[0.2em] uppercase text-gold-500 text-center">
          Message sent — I&apos;ll be in touch soon.
        </p>
      )}
      {state === 'error' && (
        <p className="text-[11px] tracking-[0.2em] uppercase text-red-400 text-center">{errorMessage}</p>
      )}
    </form>
  );
}
