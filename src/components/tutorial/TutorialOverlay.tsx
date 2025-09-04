import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface TutorialOverlayProps {
  onClose: () => void;
}


export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useLanguage();

  const tutorialSteps = [
    {
      title: t('tutorialWelcome'),
      content: t('tutorialIntro'),
      showButtons: true,
    },
    {
      title: t('tutorialOverview'),
      content: t('tutorialOverviewDesc'),
      showButtons: false,
    },
    {
      title: t('tutorialInventory'),
      content: t('tutorialInventoryDesc'),
      showButtons: false,
    },
    {
      title: t('tutorialProductForm'),
      content: t('tutorialProductFormDesc'),
      showButtons: false,
    },
    {
      title: t('tutorialStats'),
      content: t('tutorialStatsDesc'),
      showButtons: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStart = () => {
    setCurrentStep(1);
  };

  const currentTutorial = tutorialSteps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-lg w-full bg-white shadow-xl">
        <CardContent className="p-6">
          {/* Close button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Tutorial Content */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-primary mb-4">
              {currentTutorial.title}
            </h2>
            <div className="text-muted-foreground whitespace-pre-line">
              {currentTutorial.content}
            </div>
          </div>

          {/* Neko Cat */}
          <div className="flex justify-center mb-6">
            <div className="text-6xl">🐱</div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4">
            {currentTutorial.showButtons ? (
              <>
                <Button
                  onClick={handleStart}
                  className="bg-success hover:bg-success/90 text-success-foreground px-8"
                >
                  {t('yes')}
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8"
                >
                  {t('no')}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                {currentStep > 1 && (
                    <Button
                      onClick={handlePrevious}
                      variant="outline"
                      className="px-6"
                    >
                      {t('previous')}
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                  >
                    {currentStep === tutorialSteps.length - 1 ? t('finish') : t('next')}
                  </Button>
              </div>
            )}
          </div>

          {/* Step indicator */}
          {!currentTutorial.showButtons && (
            <div className="flex justify-center mt-4 gap-2">
              {tutorialSteps.slice(1).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index + 1 === currentStep ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}