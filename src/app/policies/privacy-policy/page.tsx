import { PolicyTitle, PolicySection, PolicyText } from "@/components/policy-components"

export default function PrivacyPolicyPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PolicyTitle>Privacy Policy</PolicyTitle>
      <PolicyText>
        At OFFTRADER Academy, we are committed to protecting your privacy and ensuring the security of your personal
        information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website
        and services.
      </PolicyText>
      <PolicySection>1. Information We Collect</PolicySection>
      <PolicyText>
        We collect personal information that you provide to us, such as your name, email address, and payment
        information when you register for an account or purchase a course.
      </PolicyText>
      <PolicySection>2. How We Use Your Information</PolicySection>
      <PolicyText>
        We use your personal information to provide and improve our services, process payments, and communicate with you
        about your account and our offerings.
      </PolicyText>
      <PolicySection>3. Data Security</PolicySection>
      <PolicyText>
        We implement a variety of security measures to protect your personal information from unauthorized access, use,
        or disclosure.
      </PolicyText>
      <PolicySection>4. Cookies and Tracking Technologies</PolicySection>
      <PolicyText>
        We use cookies and similar tracking technologies to enhance your experience on our website. You can manage your
        cookie preferences through your browser settings.
      </PolicyText>
      <PolicySection>5. Third-Party Services</PolicySection>
      <PolicyText>
        We may use third-party services to process payments, analyze website traffic, and provide other functionalities.
        These services have their own privacy policies.
      </PolicyText>
      <PolicySection>6. Your Rights</PolicySection>
      <PolicyText>
        You have the right to access, correct, or delete your personal information. You can manage your account settings
        or contact us to exercise these rights.
      </PolicyText>
      <PolicySection>7. Changes to This Policy</PolicySection>
      <PolicyText>
        We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting a
        notice on our website.
      </PolicyText>
      <PolicySection>8. Contact Us</PolicySection>
      <PolicyText>
        If you have any questions about this Privacy Policy, please contact us at privacy@offtrader.com.
      </PolicyText>
    </div>
  )
}

