import { PolicyTitle, PolicySection, PolicyText } from "@/components/policy-components"

export default function CookiePolicyPage() {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <PolicyTitle>Cookie Policy</PolicyTitle>
      <PolicyText>
        This Cookie Policy explains how OFFTRADER Academy uses cookies and similar technologies to recognize you when
        you visit our website. It explains what these technologies are and why we use them, as well as your rights to
        control our use of them.
      </PolicyText>
      <PolicySection>1. What are cookies?</PolicySection>
      <PolicyText>
        Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies
        are widely used by website owners in order to make their websites work, or to work more efficiently, as well as
        to provide reporting information.
      </PolicyText>
      <PolicySection>2. Why do we use cookies?</PolicySection>
      <PolicyText>
        We use cookies for several reasons. Some cookies are required for technical reasons in order for our website to
        operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track
        and target the interests of our users to enhance the experience on our website.
      </PolicyText>
      <PolicySection>3. Types of cookies we use</PolicySection>
      <PolicyText>
        We use both session and persistent cookies on our website. Session cookies are temporary and are deleted when
        you close your browser. Persistent cookies remain on your device for a set period of time.
      </PolicyText>
      <PolicySection>4. How to control cookies</PolicySection>
      <PolicyText>
        You have the right to decide whether to accept or reject cookies. You can set or amend your web browser controls
        to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access
        to some functionality and areas of our website may be restricted.
      </PolicyText>
      <PolicySection>5. Changes to this Cookie Policy</PolicySection>
      <PolicyText>
        We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we
        use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy
        regularly to stay informed about our use of cookies and related technologies.
      </PolicyText>
      <PolicySection>6. Contact Us</PolicySection>
      <PolicyText>
        If you have any questions about our use of cookies or other technologies, please email us at
        cookies@offtrader.com.
      </PolicyText>
    </div>
  )
}

