import React from 'react';
import { colors, fonts } from '../styles/theme.js';

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h2 style={{ fontSize: '16px', fontWeight: 700, color: colors.blue, marginBottom: '10px' }}>
      {title}
    </h2>
    <div style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.8 }}>
      {children}
    </div>
  </div>
);

export default function TermsAndConditions() {
  return (
    <div
      style={{
        fontFamily:  fonts.sans,
        background:  colors.bg,
        minHeight:   '100vh',
        padding:     '60px 20px',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: colors.text, marginBottom: '8px' }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ fontSize: '13px', color: colors.textFaint, marginBottom: '40px' }}>
          Last updated: April 2026
        </p>

        <Section title="1. Overview">
          By purchasing or downloading any product from Deb Insights ("we", "us"), you agree to
          these terms. If you do not agree, please do not complete your purchase.
        </Section>

        <Section title="2. Digital Products">
          All products sold on this site are digital downloads (guides, reference documents, etc.).
          Because of the instant nature of digital delivery, all sales are final once the download
          link has been issued.
        </Section>

        <Section title="3. Payment &amp; Billing">
          Payments are processed securely by{' '}
          <a
            href="https://www.lemonsqueezy.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.blue, textDecoration: 'none' }}
          >
            Lemon Squeezy
          </a>
          , our merchant of record. Lemon Squeezy handles all billing, taxes, and payment disputes
          on our behalf. By purchasing, you also agree to{' '}
          <a
            href="https://www.lemonsqueezy.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.blue, textDecoration: 'none' }}
          >
            Lemon Squeezy's Terms of Service
          </a>
          .
        </Section>

        <Section title="4. Refund Policy">
          Due to the digital nature of our products, refunds are generally not offered after
          download. If you experience a technical issue preventing access to your purchase, contact
          us within 7 days at{' '}
          <a href="mailto:debkiitian@gmail.com" style={{ color: colors.blue, textDecoration: 'none' }}>
            debkiitian@gmail.com
          </a>{' '}
          and we will do our best to resolve it.
        </Section>

        <Section title="5. License &amp; Intellectual Property">
          Purchasing a product grants you a personal, non-transferable license for your own
          professional use. You may not resell, redistribute, republish, or share the content
          publicly without written permission. All content remains the intellectual property of
          Deb Insights.
        </Section>

        <Section title="6. Disclaimer">
          All guides and materials are provided for informational purposes only. We make no
          guarantees regarding the accuracy or completeness of the content, and accept no liability
          for decisions made based on it.
        </Section>

        <Section title="7. Changes to These Terms">
          We reserve the right to update these terms at any time. Continued use of the site after
          changes are posted constitutes acceptance of the new terms.
        </Section>

        <Section title="8. Contact">
          Questions? Reach us at{' '}
          <a href="mailto:debkiitian@gmail.com" style={{ color: colors.blue, textDecoration: 'none' }}>
            debkiitian@gmail.com
          </a>
          .
        </Section>
      </div>
    </div>
  );
}
