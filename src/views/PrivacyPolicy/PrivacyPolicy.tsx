import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import './PrivacyPolicy.css';

export default function PrivacyPolicy() {
  return (
    <div className="privacy-policy-page">
      <Header />
      <div className="privacy-policy-container">
        <div className="privacy-policy-content">
          <h1>Privacy Policy</h1>
          <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>

          <section>
            <h2>1. Introduction</h2>
            <p>
              Welcome to Variance ("we," "our," or "us"). We are committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you use our mobile application and website.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>
            
            <h3>2.1 Information You Provide</h3>
            <p>We collect information that you provide directly to us, including:</p>
            <ul>
              <li><strong>Account Information:</strong> Email address, password, and display name when you create an account</li>
              <li><strong>Session Data:</strong> Casino session details, practice session records, and performance statistics</li>
              <li><strong>User Preferences:</strong> Settings and preferences you configure in the app</li>
            </ul>

            <h3>2.2 Automatically Collected Information</h3>
            <p>When you use our services, we automatically collect certain information:</p>
            <ul>
              <li><strong>Usage Data:</strong> How you interact with the app, features used, and time spent</li>
              <li><strong>Device Information:</strong> Device type, operating system, and unique device identifiers</li>
              <li><strong>Analytics Data:</strong> Performance metrics and error reports to improve our services</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process your transactions and manage your account</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Storage and Security</h2>
            <p>
              Your data is stored securely using Firebase, a service provided by Google. We implement 
              appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <p>
              However, no method of transmission over the internet or electronic storage is 100% secure. 
              While we strive to use commercially acceptable means to protect your information, we cannot 
              guarantee absolute security.
            </p>
          </section>

          <section>
            <h2>5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Firebase:</strong> Authentication, database storage, and analytics (Google)</li>
              <li><strong>Firebase Analytics:</strong> Usage analytics and performance monitoring</li>
            </ul>
            <p>
              These services have their own privacy policies governing the collection and use of your information. 
              We encourage you to review their privacy policies.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>
              We retain your personal information for as long as necessary to provide our services and 
              fulfill the purposes outlined in this Privacy Policy. You may delete your account at any time, 
              which will remove your personal information from our systems, except where we are required to 
              retain it for legal compliance.
            </p>
          </section>

          <section>
            <h2>7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete personal data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to processing of your personal data</li>
              <li>Request restriction of processing your personal data</li>
              <li>Data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us using the information provided in the Contact section below.
            </p>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect 
              personal information from children. If you are a parent or guardian and believe your child has 
              provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section>
            <h2>9. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last Updated" date. You are 
              advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section>
            <h2>10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li><strong>Email:</strong> privacy@variance.app</li>
              <li><strong>Website:</strong> <Link to="/">variance.app</Link></li>
            </ul>
          </section>

          <div className="privacy-policy-footer">
            <Link to="/" className="back-link">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

