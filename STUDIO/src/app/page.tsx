"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateRecipes } from "@/ai/flows/ingredient-recipe-generator";
import type { Recipe } from "@/lib/types";
import { RecipeCard } from "@/components/recipe-card";
import { RecipeView } from "@/components/recipe-view";
import { Loader2, Sparkles, Soup, Mic, Square } from "lucide-react";
import { useSubscription } from "@/hooks/use-subscription";
import { cn } from "@/lib/utils";
import { detectIngredientsFromAudio } from "@/ai/flows/detect-ingredients-audio";


const formSchema = z.object({
  ingredients: z.string().min(10, { message: "الرجاء إدخال بعض المكونات على الأقل." }),
  dietaryRestrictions: z.string().optional(),
  preferences: z.string().optional(),
});

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isRecipeViewOpen, setIsRecipeViewOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { toast } = useToast();
  const { addFavorite, removeFavorite, isFavorite } = useSubscription();
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ingredients: "",
      dietaryRestrictions: "",
      preferences: "",
    },
  });
  
  const availableIngredients = form.watch("ingredients");
  
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsLoading(true);
          try {
             const result = await detectIngredientsFromAudio({ audioDataUri: base64Audio });
             form.setValue("ingredients", result.ingredients);
          } catch(e) {
              toast({
                title: "خطأ",
                description: "لم نتمكن من معالجة الصوت. حاول مرة أخرى.",
                variant: "destructive",
              });
          } finally {
             setIsLoading(false);
          }
        };
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      toast({
        title: "مطلوب إذن ميكروفون",
        description: "يرجى تمكين الوصول إلى الميكروفون في متصفحك لاستخدام الإدخال الصوتي.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecipes([]);
    try {
      const result = await generateRecipes(values);
      setRecipes(result.recipes);
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "فشل في إنشاء الوصفات. يرجى المحاولة مرة أخرى في وقت لاحق.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeViewOpen(true);
  };
  
  const handleToggleFavorite = (recipe: Recipe) => {
    if (isFavorite(recipe)) {
      removeFavorite(recipe);
      toast({ title: "تمت الإزالة من المفضلة!" });
    } else {
      addFavorite(recipe);
      toast({ title: "تمت الإضافة إلى المفضلة!" });
    }
  };


  return (
    <>
      <div className="container mx-auto p-4 md:p-8">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">
            ماذا يوجد في مطبخك؟
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            أدخل المكونات التي لديك، أو استخدم الميكروفون، ودع طاهينا الذكي يعد لك شيئًا لذيذًا.
          </p>
        </section>

        <Card className="max-w-4xl mx-auto mb-12 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Soup className="h-6 w-6" />
              مولد الوصفات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">المكونات المتوفرة</FormLabel>
                       <div className="relative">
                        <FormControl>
                          <Textarea
                            placeholder="مثال: صدر دجاج، طماطم، أرز، بصل، ثوم..."
                            className="min-h-[100px] pl-12"
                            {...field}
                          />
                        </FormControl>
                        <div className="absolute top-1/2 -translate-y-1/2 left-3">
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              onClick={isRecording ? handleStopRecording : handleStartRecording}
                              className={cn(
                                "rounded-full h-8 w-8",
                                isRecording && "bg-red-500/20 text-red-500"
                              )}
                            >
                              {isRecording ? (
                                <Square className="h-4 w-4 animate-pulse" />
                              ) : (
                                <Mic className="h-4 w-4" />
                              )}
                              <span className="sr-only">{isRecording ? "إيقاف التسجيل" : "بدء التسجيل"}</span>
                            </Button>
                        </div>
                      </div>
                      <FormDescription>
                        افصل بين المكونات بفاصلة أو استخدم الإدخال الصوتي.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>قيود غذائية (اختياري)</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: نباتي، خالي من الغلوتين" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="preferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تفضيلات المطبخ (اختياري)</FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: إيطالي، مكسيكي، حار" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" disabled={isLoading} size="lg" className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold">
                  {isLoading ? (
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="ml-2 h-4 w-4" />
                  )}
                  إنشاء وصفات
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">جاري إنشاء وصفاتك المخصصة...</p>
          </div>
        )}

        {recipes.length > 0 && (
          <section>
             <h2 className="text-3xl font-bold font-headline text-center mb-8">اقتراحات الوصفات الخاصة بك</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe) => (
                    <RecipeCard 
                        key={recipe.name} 
                        recipe={recipe} 
                        onView={handleViewRecipe}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite(recipe)}
                    />
                ))}
            </div>
          </section>
        )}
      </div>
      <RecipeView 
        recipe={selectedRecipe}
        isOpen={isRecipeViewOpen}
        onClose={() => setIsRecipeViewOpen(false)}
        availableIngredients={availableIngredients}
      />
    </>
  );
}
