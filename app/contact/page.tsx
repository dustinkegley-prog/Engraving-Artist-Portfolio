// app/contact/page.tsx
import ContactForm from '@/components/contact/ContactForm';

export const metadata = {
  title: 'Contact',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20">
      <div className="mb-14 text-center">
        <div className="mx-auto mb-6 h-px w-12 bg-gold-500 opacity-60" />
        <h1 className="font-serif text-5xl font-light tracking-[0.15em] text-stone-100">
          Contact
        </h1>
<div className="mx-auto mt-6 h-px w-12 bg-gold-500 opacity-60" />
      </div>
      <ContactForm />
    </div>
  );
}
