import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '../ui/Button.jsx'

export default function MultilineWizard({ steps, onComplete, defaultValues }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(defaultValues || {})
  const formRef = useRef(null)

  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      )
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const StepComponent = steps[currentStep].component

const processFormData = (e) => {
      e.preventDefault()
      const form = e.target
      const data = {}
      const elements = form.elements

      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        if (el.name) {
          // Skip read-only calculated fields like age
          if (el.name === 'age' && el.readOnly) {
            continue
          }
          // Handle checkboxes - use checked property
          if (el.type === 'checkbox') {
            data[el.name] = el.checked
          } else {
            data[el.name] = el.value
          }
        }
      }

      const mergedData = { ...formData, ...data }
      setFormData(mergedData)

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete(mergedData)
      }
    }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-700">
            Step {currentStep + 1} of {steps.length}
          </span>
          <span className="text-sm text-gray-500">{steps[currentStep].title}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-orange-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold text-navy-900 mb-2">{steps[currentStep].title}</h2>
        <p className="text-gray-600">{steps[currentStep].description}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <form ref={formRef} onSubmit={processFormData} className="space-y-4">
            <StepComponent data={formData} />
          </form>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>
        <Button
          variant="primary"
          onClick={handleNext}
        >
          {currentStep === steps.length - 1 ? 'Submit' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}