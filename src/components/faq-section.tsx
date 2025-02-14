import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqItems = [
  {
    question: "What is OFFTRADER Academy?",
    answer:
      "OFFTRADER Academy is an online education platform designed to empower digital entrepreneurs with cutting-edge strategies and skills. We offer comprehensive courses in areas such as cryptocurrency trading, dropshipping, e-commerce, stock market strategies, social media marketing, and digital freelancing.",
  },
  {
    question: "How long do I have access to the courses?",
    answer:
      "Once you enroll in a course or subscription plan, you have lifetime access to the course materials. This allows you to learn at your own pace and revisit the content whenever you need a refresher.",
  },
  {
    question: "Are there any prerequisites for joining OFFTRADER Academy?",
    answer:
      "There are no specific prerequisites. Our courses are designed to accommodate learners at various levels, from beginners to advanced. Each course will clearly indicate if any prior knowledge is recommended.",
  },
  {
    question: "Can I interact with instructors and other students?",
    answer:
      "Yes! We have a vibrant community where you can interact with both instructors and fellow students. Depending on your subscription plan, you'll have access to forums, live Q&A sessions, and even one-on-one mentorship opportunities.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer a 30-day money-back guarantee for all our courses. If you're not satisfied with your purchase, you can request a full refund within 30 days of your enrollment.",
  },
  {
    question: "How often is the course content updated?",
    answer:
      "We regularly update our course content to ensure it remains relevant in the fast-paced digital world. Major updates are typically done quarterly, with minor updates and additions happening more frequently.",
  },
]

export function FAQSection() {
  return (
    <section className="container py-24 space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
        <p className="mt-4 text-muted-foreground">
          Got questions? We've got answers. If you don't see your question here, feel free to contact us.
        </p>
      </div>
      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{item.question}</AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}

