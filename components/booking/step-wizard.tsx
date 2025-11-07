'use client'

// import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface Step {
  id: string
  title: string
  description: string
  status: 'completed' | 'current' | 'upcoming'
}

interface StepWizardProps {
  steps: Step[]
  currentStep: number
}

export function StepWizard({ steps, currentStep }: StepWizardProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                  ${step.status === 'completed' 
                    ? 'bg-secondary border-secondary text-primary' 
                    : step.status === 'current'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-white border-gray-300 text-gray-500'
                  }
                `}
              >
                {step.status === 'completed' ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                  step.status === 'current' ? 'text-primary' : 'text-gray-500'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-4">
                <div
                  className={`h-full bg-secondary transition-all duration-500 ${
                    step.status === 'completed' ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
