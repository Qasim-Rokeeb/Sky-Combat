
"use client";

import React, { useState } from "react";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Move, Crosshair, Zap, Shield, ChevronsRight, ChevronsLeft } from "lucide-react";

interface TutorialDialogProps {
    isOpen: boolean;
    onFinish: () => void;
}

const tutorialSteps = [
    {
        icon: <Move className="w-12 h-12 text-primary" />,
        title: "Welcome to Sky Combat!",
        description: "This quick tutorial will guide you through the basics of aerial warfare."
    },
    {
        icon: <Move className="w-12 h-12 text-primary" />,
        title: "Moving Your Aircraft",
        description: "Select one of your aircraft by clicking on it. Then, click the 'Move' button. The grid will highlight possible destinations in blue. Click a highlighted tile to move."
    },
    {
        icon: <Crosshair className="w-12 h-12 text-destructive" />,
        title: "Attacking the Enemy",
        description: "After selecting an aircraft, click 'Attack'. Enemy aircraft within range will be highlighted. Click a highlighted enemy to attack. Both moving and attacking consume one Action Point (AP)."
    },
    {
        icon: <Zap className="w-12 h-12 text-purple-400" />,
        title: "Special Abilities",
        description: "Some aircraft have special abilities. For example, Support aircraft can revive fallen allies. These cost Energy and have cooldowns. Check the 'Actions' panel for details."
    },
    {
        icon: <Shield className="w-12 h-12 text-green-500" />,
        title: "End Your Turn",
        description: "Once you have used all your AP or are finished with your moves, click 'End Turn' to let the opponent play. Good luck, commander!"
    },
];


const TutorialDialog: React.FC<TutorialDialogProps> = ({ isOpen, onFinish }) => {
    const [step, setStep] = useState(0);

    const handleNext = () => {
        if (step < tutorialSteps.length - 1) {
            setStep(step + 1);
        } else {
            onFinish();
        }
    }

    const handlePrev = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    }

    const currentStep = tutorialSteps[step];
    
    return (
        <AlertDialog open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader className="text-center items-center">
                    <div className="p-3 bg-primary/10 rounded-full mb-4">
                        {currentStep.icon}
                    </div>
                    <AlertDialogTitle className="text-2xl font-headline">{currentStep.title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-base">
                        {currentStep.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="sm:justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        Step {step + 1} of {tutorialSteps.length}
                    </div>
                    <div className="flex gap-2">
                        {step > 0 && (
                            <Button variant="outline" onClick={handlePrev}>
                                <ChevronsLeft className="mr-2" />
                                Previous
                            </Button>
                        )}
                        <Button onClick={handleNext}>
                            {step === tutorialSteps.length - 1 ? "Finish" : "Next"}
                            <ChevronsRight className="ml-2" />
                        </Button>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default TutorialDialog;
