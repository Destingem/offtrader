import { PolicyTitle, PolicySection, PolicyText } from "@/components/policy-components"

export default function TermsOfServicePage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PolicyTitle>Terms of Service</PolicyTitle>
      <PolicyText>
        Welcome to OFFTRADER Academy. By using our website and services, you agree to comply with and be bound by the
        following terms and conditions. Please read these terms carefully before using our platform.
      </PolicyText>
      <PolicySection>1. Acceptance of Terms</PolicySection>
      <PolicyText>
        By accessing or using OFFTRADER Academy, you agree to be bound by these Terms of Service and all applicable laws
        and regulations. If you do not agree with any part of these terms, you may not use our services.
      </PolicyText>
      <PolicySection>2. User Accounts</PolicySection>
      <PolicyText>
        To access certain features of OFFTRADER Academy, you may be required to create an account. You are responsible
        for maintaining the confidentiality of your account information and for all activities that occur under your
        account.
      </PolicyText>
      <PolicySection>3. Course Content and Intellectual Property</PolicySection>
      <PolicyText>
        All content provided on OFFTRADER Academy, including courses, materials, and resources, is the property of
        OFFTRADER or its content creators and is protected by copyright and other intellectual property laws.
      </PolicyText>
      <PolicySection>4. User Conduct</PolicySection>
      <PolicyText>
        You agree to use OFFTRADER Academy for lawful purposes only and in a way that does not infringe upon or restrict
        others' use and enjoyment of the platform.
      </PolicyText>
      <PolicySection>5. Payments and Refunds</PolicySection>
      <PolicyText>
        Payments for courses and subscriptions are processed securely. Refunds are subject to our refund policy, which
        is available on our website.
      </PolicyText>
      <PolicySection>6. Limitation of Liability</PolicySection>
      <PolicyText>
        OFFTRADER Academy is provided "as is" without any warranties, expressed or implied. We do not guarantee that our
        services will be uninterrupted or error-free.
      </PolicyText>
      <PolicySection>7. Changes to Terms</PolicySection>
      <PolicyText>
        We reserve the right to modify these Terms of Service at any time. Your continued use of OFFTRADER Academy after
        any changes indicates your acceptance of the new terms.
      </PolicyText>
      <PolicySection>8. Contact Us</PolicySection>
      <PolicyText>
        If you have any questions about these Terms of Service, please contact us at support@offtrader.com.
      </PolicyText>
    </div>
  )
}

