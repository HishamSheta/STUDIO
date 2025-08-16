"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { Recipe } from "@/lib/types";
import { IngredientSubstitution } from "./ingredient-substitution";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Flame, Loader2, Sparkles, Volume2, Share2, HelpCircle } from "lucide-react";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { calculateMacros } from "@/ai/flows/calculate-macros";
import type { CalculateMacrosOutput } from "@/ai/flows/types";
import { Card, CardContent } from "./ui/card";
import { toPng } from 'html-to-image';
import { ShareableRecipeImage } from "./shareable-recipe-image";


interface RecipeViewProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  availableIngredients: string;
}

export function RecipeView({ recipe, isOpen, onClose, availableIngredients }: RecipeViewProps) {
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [isMacrosLoading, setIsMacrosLoading] = useState(false);
  const [macros, setMacros] = useState<CalculateMacrosOutput | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const shareableImageRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const resetState = () => {
    setAudioSrc(null);
    setMacros(null);
    setIsAudioLoading(false);
    setIsMacrosLoading(false);
    setIsSharing(false);
  }

  if (!recipe) {
    return null;
  }
  
  const handlePlayAudio = async () => {
    if (!recipe) return;

    setIsAudioLoading(true);
    setAudioSrc(null);

    try {
      const result = await textToSpeech(recipe.instructions);
      setAudioSrc(result.audioDataUri);
    } catch (error) {
      console.error("Failed to generate audio:", error);
      toast({
        title: "خطأ في إنشاء الصوت",
        description: "تعذر إنشاء الصوت للوصفة. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleCalculateMacros = async () => {
    if (!recipe || macros) return; // Don't re-calculate if already present

    setIsMacrosLoading(true);
    try {
      const result = await calculateMacros({
        recipeName: recipe.name,
        ingredients: recipe.ingredients,
      });
      setMacros(result);
    } catch (error) {
      console.error("Failed to calculate macros:", error);
      toast({
        title: "خطأ في حساب السعرات",
        description: "تعذر تقدير المعلومات الغذائية. حاول مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsMacrosLoading(false);
    }
  };
  
  const handleShare = async () => {
    if (!shareableImageRef.current || !recipe) return;
    setIsSharing(true);
    try {
      // Give browser time to render fonts and images
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(shareableImageRef.current, { 
          cacheBust: true,
          pixelRatio: 2, // Higher pixel ratio for better quality
       });
      const link = document.createElement('a');
      link.download = `${recipe.name.replace(/\s+/g, '-')}-recipe.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
      toast({
          title: "خطأ في إنشاء الصورة",
          description: "لم نتمكن من إنشاء صورة المشاركة. حاول مرة أخرى.",
          variant: "destructive"
      });
    } finally {
      setIsSharing(false);
    }
  };


  return (
    <>
    {/* This component is hidden and only used for generating the shareable image */}
    <div className="fixed -left-[9999px] -top-[9999px]">
      <div ref={shareableImageRef}>
        {recipe && <ShareableRecipeImage recipe={recipe} />}
      </div>
    </div>

    <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          resetState();
        }
        onClose();
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-0 text-right">
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4">
            <img
              src={recipe.imageUrl || `https://placehold.co/800x600.png`}
              alt={recipe.name}
              className="w-full h-full object-cover"
              data-ai-hint="delicious food"
            />
          </div>
          <DialogTitle className="font-headline text-3xl text-primary">{recipe.name}</DialogTitle>
          <DialogDescription>
            وصفة شهية لـ {recipe.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-4 space-y-6">
           <Accordion type="multiple" defaultValue={["ingredients", "instructions"]} className="w-full">
            <AccordionItem value="ingredients">
                <AccordionTrigger>
                    <h3 className="font-headline text-xl font-semibold">المكونات</h3>
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 text-right">
                        {recipe.ingredients.split(',').map((ing, i) => <li key={i}>{ing.trim()}</li>)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="instructions">
                <AccordionTrigger>
                    <div className="flex justify-between items-center w-full">
                         <h3 className="font-headline text-xl font-semibold">التعليمات</h3>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="mb-4 flex flex-col items-center gap-4">
                        <Button onClick={handlePlayAudio} disabled={isAudioLoading} size="sm" variant="outline" className="w-full">
                            {isAudioLoading ? (
                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                               <Volume2 className="mr-2 h-4 w-4" />
                            )}
                            تشغيل التعليمات الصوتية
                        </Button>
                        {audioSrc && (
                            <audio controls autoPlay src={audioSrc} className="w-full">
                                متصفحك لا يدعم عنصر الصوت.
                            </audio>
                        )}
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground space-y-2 text-right">
                        {recipe.instructions.split('\n').filter(line => line.trim() !== '').map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="macros">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  <span className="font-semibold">السعرات الحرارية والماكروز (تقديري)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                 {macros ? (
                     <Card>
                       <CardContent className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="font-bold text-lg">{macros.calories}</p>
                            <p className="text-sm text-muted-foreground">سعرة حرارية</p>
                          </div>
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="font-bold text-lg">{macros.protein}g</p>
                            <p className="text-sm text-muted-foreground">بروتين</p>
                          </div>
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="font-bold text-lg">{macros.carbs}g</p>
                            <p className="text-sm text-muted-foreground">كربوهيدرات</p>
                          </div>
                          <div className="p-2 bg-secondary/50 rounded-lg">
                            <p className="font-bold text-lg">{macros.fat}g</p>
                            <p className="text-sm text-muted-foreground">دهون</p>
                          </div>
                       </CardContent>
                     </Card>
                  ) : (
                    <Button onClick={handleCalculateMacros} disabled={isMacrosLoading} className="w-full">
                       {isMacrosLoading ? (
                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                       ) : (
                         <HelpCircle className="mr-2 h-4 w-4" />
                       )}
                       حساب القيم الغذائية
                    </Button>
                  )}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="substitutions">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="font-semibold">استبدال المكونات الذكي</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <IngredientSubstitution 
                  recipeName={recipe.name}
                  recipeIngredients={recipe.ingredients}
                  availableIngredients={availableIngredients}
                />
              </AccordionContent>
            </AccordionItem>
           </Accordion>
        </div>
        <DialogFooter className="pt-4 pr-4 border-t">
          <Button onClick={handleShare} disabled={isSharing} className="w-full sm:w-auto">
            {isSharing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
            شارك وصفتك
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}
