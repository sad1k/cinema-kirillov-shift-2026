import { useCallback, useState } from 'react'

interface UseStepperOptions {
  totalSteps: number
}

interface UseStepperReturn {
  currentStep: number
  totalSteps: number
  progress: number
  isFirstStep: boolean
  isLastStep: boolean
  goNext: () => void
  goBack: () => boolean
  goTo: (step: number) => void
}

export function useStepper({ totalSteps }: UseStepperOptions): UseStepperReturn {
  const [currentStep, setCurrentStep] = useState(1)

  const goNext = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, totalSteps))
  }, [totalSteps])

  const goBack = useCallback((): boolean => {
    if (currentStep === 1) {
      return true
    }
    setCurrentStep(prev => prev - 1)
    return false
  }, [currentStep])

  const goTo = useCallback((step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step)
    }
  }, [totalSteps])

  return {
    currentStep,
    totalSteps,
    progress: (currentStep / totalSteps) * 100,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    goNext,
    goBack,
    goTo,
  }
}
