import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import './TermsOfService.css';

export default function TermsOfService() {
  return (
    <div className="terms-page">
      <Header />
      <div className="terms-container">
        <div className="terms-content">
          <h1>Terms of Service</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Variance ("the Service"), you accept and agree to be bound by the 
              terms and provision of this agreement. If you do not agree to abide by the above, please 
              do not use this service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Variance is a blackjack training application designed to help users learn and practice 
              card counting strategies. The Service provides educational content, simulations, and 
              tools for training purposes only.
            </p>
          </section>

          <section>
            <h2>3. Use License</h2>
            <p>
              Permission is granted to temporarily use Variance for personal, non-commercial transitory 
              viewing only. This is the grant of a license, not a transfer of title, and under this 
              license you may not:
            </p>
            <ul>
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained in Variance</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </section>

          <section>
            <h2>4. Disclaimer - Gambling and Legal</h2>
            <h3>4.1 Educational Purpose Only</h3>
            <p>
              Variance is provided for educational and training purposes only. The Service is designed 
              to help users understand blackjack strategy and card counting techniques. It is not 
              intended to be used as gambling advice or to guarantee winnings.
            </p>
            
            <h3>4.2 No Gambling Guarantees</h3>
            <p>
              We make no representations or warranties regarding the effectiveness of any strategies, 
              techniques, or information provided through the Service. Gambling involves risk, and 
              past performance does not guarantee future results.
            </p>

            <h3>4.3 Legal Compliance</h3>
            <p>
              Users are responsible for ensuring that their use of the Service complies with all 
              applicable laws and regulations in their jurisdiction. Card counting is legal in most 
              jurisdictions, but casinos may refuse service to individuals they suspect of counting cards.
            </p>

            <h3>4.4 Age Restrictions</h3>
            <p>
              You must be at least 18 years old (or the legal age of majority in your jurisdiction) 
              to use this Service. By using Variance, you represent and warrant that you meet this 
              age requirement.
            </p>
          </section>

          <section>
            <h2>5. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current 
              information. You are responsible for safeguarding the password and for all activities 
              that occur under your account.
            </p>
            <p>
              You agree not to disclose your password to any third party. You must notify us immediately 
              upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2>6. User Content</h2>
            <p>
              You retain ownership of any data you submit to the Service, including session records, 
              practice statistics, and user preferences. By submitting content, you grant us a 
              worldwide, non-exclusive, royalty-free license to use, store, and display your content 
              solely for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2>7. Prohibited Uses</h2>
            <p>You agree not to use the Service:</p>
            <ul>
              <li>In any way that violates any applicable law or regulation</li>
              <li>To transmit any material that is defamatory, offensive, or otherwise objectionable</li>
              <li>To impersonate or attempt to impersonate the company, employees, or other users</li>
              <li>To engage in any unauthorized use of the Service's systems or networks</li>
              <li>To interfere with or disrupt the Service or servers connected to the Service</li>
            </ul>
          </section>

          <section>
            <h2>8. Limitation of Liability</h2>
            <p>
              In no event shall Variance, its directors, employees, partners, or agents be liable for 
              any indirect, incidental, special, consequential, or punitive damages, including without 
              limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting 
              from your use of the Service.
            </p>
            <p>
              Variance is provided "as is" without any warranties, expressed or implied. We do not 
              warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2>9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Variance and its licensees from and 
              against any claims, actions, demands, losses, liabilities, damages, costs, and expenses 
              (including reasonable attorneys' fees) arising out of or relating to your use of the 
              Service or violation of these Terms.
            </p>
          </section>

          <section>
            <h2>10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without 
              prior notice or liability, for any reason whatsoever, including without limitation if 
              you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the Service will cease immediately. You may delete 
              your account at any time through the Settings page.
            </p>
          </section>

          <section>
            <h2>11. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any 
              time. If a revision is material, we will provide at least 30 days notice prior to any 
              new terms taking effect.
            </p>
            <p>
              By continuing to access or use the Service after those revisions become effective, you 
              agree to be bound by the revised terms.
            </p>
          </section>

          <section>
            <h2>12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the 
              jurisdiction in which Variance operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2>13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> legal@variance.app</li>
              <li><strong>Website:</strong> <Link to="/">variance.app</Link></li>
            </ul>
          </section>

          <div className="terms-footer">
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

