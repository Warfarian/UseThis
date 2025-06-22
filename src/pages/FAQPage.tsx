import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { ArrowLeft, HelpCircle, Shield, CreditCard, Users, Package, MessageSquare, Star } from 'lucide-react'

export const FAQPage: React.FC = () => {
  const navigate = useNavigate()

  const faqs = [
    {
      category: "Getting Started",
      icon: Users,
      questions: [
        {
          question: "How do I create an account?",
          answer: "Click 'ENTER' on the homepage, then select 'NEED ACCOUNT? SIGN UP'. Enter your email, password, and full name to create your account. You'll be able to start browsing and listing items immediately."
        },
        {
          question: "Is UseThis really free to use?",
          answer: "Yes! Creating an account and browsing items is completely free. We only charge a small service fee (10%) when you successfully complete a rental transaction."
        },
        {
          question: "What can I rent or list on UseThis?",
          answer: "You can list almost anything useful to students: electronics, textbooks, furniture, kitchen appliances, sports equipment, tools, and more. Items must be legal, safe, and in good working condition."
        }
      ]
    },
    {
      category: "Renting Items",
      icon: Package,
      questions: [
        {
          question: "How does the booking process work?",
          answer: "Browse items, select your dates, and submit a booking request. The owner will review and either approve or decline your request. If approved, your payment method will be charged and you can arrange pickup."
        },
        {
          question: "What if the owner doesn't respond to my request?",
          answer: "Owners have 48 hours to respond to booking requests. If they don't respond within this time, the request automatically expires and you won't be charged."
        },
        {
          question: "Can I cancel a booking?",
          answer: "Yes, you can cancel bookings up to 24 hours before the start date for a full refund. Cancellations within 24 hours may incur a partial fee depending on the circumstances."
        }
      ]
    },
    {
      category: "Listing Items",
      icon: CreditCard,
      questions: [
        {
          question: "How much should I charge for my item?",
          answer: "Research similar items on the platform to get an idea of market rates. Consider the item's value, condition, and demand. You can always adjust your pricing later."
        },
        {
          question: "When do I get paid?",
          answer: "Payment is released to you 24 hours after the rental period begins, provided there are no disputes. Funds are transferred directly to your linked bank account."
        },
        {
          question: "What if my item gets damaged?",
          answer: "All rentals are covered by our protection policy. Document any damage immediately and contact support. Renters are responsible for returning items in the same condition they received them."
        }
      ]
    },
    {
      category: "Safety & Security",
      icon: Shield,
      questions: [
        {
          question: "How do you verify users?",
          answer: "All users must provide a valid email address and phone number. We also use rating systems and reviews to build trust within the community. In the future, we'll require .edu email addresses for university-specific platforms."
        },
        {
          question: "What if something goes wrong with a rental?",
          answer: "Contact our support team immediately through the messaging system or email. We have dispute resolution processes in place and will work to resolve issues fairly for both parties."
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes, we use industry-standard encryption and secure payment processing. Your payment information is never stored on our servers and all transactions are processed through secure, PCI-compliant systems."
        }
      ]
    },
    {
      category: "Communication",
      icon: MessageSquare,
      questions: [
        {
          question: "How do I contact other users?",
          answer: "Use the built-in messaging system to communicate with other users. You can message item owners directly from item pages or continue conversations in your Messages section."
        },
        {
          question: "Can I share my personal contact information?",
          answer: "For safety reasons, we recommend keeping all communication within the platform initially. You can share contact information for pickup/delivery coordination after a booking is confirmed."
        },
        {
          question: "What should I do if someone is being inappropriate?",
          answer: "Report any inappropriate behavior immediately using the report function or contact support. We have zero tolerance for harassment, spam, or inappropriate content."
        }
      ]
    },
    {
      category: "Reviews & Ratings",
      icon: Star,
      questions: [
        {
          question: "When can I leave a review?",
          answer: "You can leave reviews after a rental is completed (marked as 'returned'). Both renters and owners can review each other to help build trust in the community."
        },
        {
          question: "Can I edit or delete my reviews?",
          answer: "You can edit your reviews within 48 hours of posting them. After that, reviews become permanent to maintain integrity of the rating system."
        },
        {
          question: "What if I receive an unfair review?",
          answer: "If you believe a review violates our guidelines or is unfair, you can report it to our support team. We'll investigate and take appropriate action if necessary."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-pure-black noise py-8 px-6 pt-28">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            className="mb-6 flex items-center space-x-2"
          >
            <ArrowLeft size={18} />
            <span>BACK TO HOME</span>
          </Button>

          <h1 className="text-huge font-black text-pure-white mb-4 font-display">
            FREQUENTLY ASKED <span className="text-primary">QUESTIONS</span>
          </h1>
          <p className="text-xl text-concrete font-display font-bold uppercase tracking-wide">
            GET ANSWERS TO COMMON QUESTIONS ABOUT USETHIS
          </p>
          <div className="divider-brutal mt-6" />
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card key={category.category} className="p-6">
              {/* Category Header */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-primary flex items-center justify-center">
                  <category.icon size={24} className="text-pure-white" />
                </div>
                <h2 className="text-2xl font-black text-pure-white font-display uppercase">
                  {category.category}
                </h2>
              </div>

              {/* Questions */}
              <div className="space-y-6">
                {category.questions.map((faq, questionIndex) => (
                  <div key={questionIndex} className="border-l-4 border-primary pl-6">
                    <h3 className="text-lg font-black text-pure-white mb-3 font-display uppercase">
                      <HelpCircle size={18} className="inline mr-2 text-primary" />
                      {faq.question}
                    </h3>
                    <p className="text-concrete font-display font-medium leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 p-8 text-center">
          <div className="w-16 h-16 bg-accent mx-auto mb-6 flex items-center justify-center">
            <MessageSquare size={32} className="text-pure-white" />
          </div>
          <h2 className="text-2xl font-black text-pure-white mb-4 font-display uppercase">
            STILL HAVE QUESTIONS?
          </h2>
          <p className="text-steel font-display font-bold uppercase tracking-wide mb-6">
            CAN'T FIND WHAT YOU'RE LOOKING FOR? GET IN TOUCH WITH OUR SUPPORT TEAM
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => navigate('/messages')} className="flex items-center space-x-2">
              <MessageSquare size={16} />
              <span>CONTACT SUPPORT</span>
            </Button>
            <Button variant="outline" onClick={() => navigate('/home')}>
              BACK TO HOME
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}