import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface TutorialStep {
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface TutorialOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function TutorialOverlay({ isOpen, onClose, onComplete }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const steps: TutorialStep[] = [
    {
      title: 'Welcome to G.O.D.I!',
      description: 'Let\'s take a quick tour of your inventory management system. This tutorial will help you get started.',
      position: 'center'
    },
    {
      title: 'Dashboard Overview',
      description: 'This is your main dashboard where you can see quick stats, recent activity, and top-selling products.',
      position: 'center'
    },
    {
      title: 'Navigation Menu',
      description: 'Use the sidebar to navigate between different sections: Inventory, POS, Users, Reports, and Settings.',
      target: 'nav',
      position: 'right'
    },
    {
      title: 'Inventory Management',
      description: 'Click on "Inventory" to manage your products, add new items, and track stock levels.',
      position: 'center'
    },
    {
      title: 'Point of Sale',
      description: 'The POS system allows you to process sales quickly and generate receipts for customers.',
      position: 'center'
    },
    {
      title: 'Settings & Profile',
      description: 'You can customize your experience, set maximum product limits, and toggle notification sounds in your profile.',
      position: 'center'
    },
    {
      title: 'You\'re Ready!',
      description: 'That\'s it! You can always restart this tutorial from the Settings page if you need a refresher.',
      position: 'center'
    }
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTutorialStep = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const nextStep = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const skipTutorial = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-card border-0 animate-in fade-in-0 zoom-in-95">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{currentTutorialStep.title}</CardTitle>
            <Button variant="ghost" size="sm" onClick={skipTutorial}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{currentTutorialStep.description}</p>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex gap-2">
              <Button variant="ghost" onClick={skipTutorial}>
                Skip Tutorial
              </Button>
              <Button onClick={nextStep}>
                {isLastStep ? 'Complete' : 'Next'}
                {!isLastStep && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}