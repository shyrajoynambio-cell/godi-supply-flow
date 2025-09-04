import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface TutorialOverlayProps {
  onClose: () => void;
}

const tutorialSteps = [
  {
    title: "WELCOME TO GODI!",
    content: "I am your assistant, Neko! Would you like to experience a tutorial phase?",
    showButtons: true,
  },
  {
    title: "Overview Section",
    content: "In the overview section, you can see your stock alerts, total stocks, sales information, and welcome message.",
    showButtons: false,
  },
  {
    title: "Inventory Management",
    content: "In the inventory section, click the box with a plus icon to input a product.",
    showButtons: false,
  },
  {
    title: "Product Form",
    content: "STEPS:\n• Click on input image to add image of product.\n• Rename the product to its brand and type of product.\n• Add the amount you paid for the product to be sold for.\n• Add the maximum stock that can fit in your physical inventory.\n• Add minimum stock that can notify you to stock up your inventory.",
    showButtons: false,
  },
  {
    title: "Stats Section",
    content: "View your sales trends, top categories, and business analytics in the Stats section.",
    showButtons: false,
  },
];

export default function TutorialOverlay({ onClose }: TutorialOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);

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
                  YES
                </Button>
                <Button
                  onClick={onClose}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8"
                >
                  NO
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
                    Previous
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
                >
                  {currentStep === tutorialSteps.length - 1 ? "Finish" : "Next"}
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