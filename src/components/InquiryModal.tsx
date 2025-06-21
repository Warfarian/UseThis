import React, { useState } from 'react'
import { supabase, Item } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Input } from './ui/Input'
import { X } from 'lucide-react'

interface InquiryModalProps {
  item: Item
  onClose: () => void
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ item, onClose }) => {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.subject.trim() || !formData.message.trim()) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert({
          item_id: item.id,
          inquirer_id: user.id,
          owner_id: item.owner_id,
          subject: formData.subject.trim(),
          message: formData.message.trim()
        })

      if (error) throw error

      alert('Inquiry sent successfully!')
      onClose()
    } catch (error) {
      console.error('Error sending inquiry:', error)
      alert('Failed to send inquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-pure-black/80 flex items-center justify-center z-50 p-6">
      <Card className="w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-steel hover:text-primary transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-pure-white mb-6 font-display uppercase">
          ASK ABOUT THIS ITEM
        </h2>

        <div className="mb-6 p-4 bg-charcoal border-l-4 border-primary">
          <h3 className="text-lg font-black text-pure-white mb-2 font-display uppercase">
            {item.title}
          </h3>
          <p className="text-steel font-display font-bold uppercase tracking-wide text-sm">
            OWNED BY {item.owner?.name}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="SUBJECT"
            value={formData.subject}
            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
            placeholder="WHAT DO YOU WANT TO KNOW?"
            required
          />

          <div>
            <label className="block text-sm font-bold text-primary uppercase tracking-wider font-display mb-2">
              MESSAGE
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              placeholder="ASK YOUR QUESTION OR SHARE DETAILS..."
              rows={4}
              className="input-brutal w-full resize-none"
              required
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading || !formData.subject.trim() || !formData.message.trim()}
              className="flex-1"
            >
              {loading ? 'SENDING...' : 'SEND INQUIRY'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              CANCEL
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}