"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { suggestIngredientSubstitutions } from "@/ai/flows/smart-ingredient-substitution";
import { Loader2, Replace } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FormSchema = z.object({
  missingIngredients: z.array(z.string()),
});

interface IngredientSubstitutionProps {
  recipeName: string;
  recipeIngredients: string;
  availableIngredients: string;
}

export function IngredientSubstitution({ recipeName, recipeIngredients, availableIngredients }: IngredientSubstitutionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [substitutions, setSubstitutions] = useState<Record<string, string> | null>(null);
  const { toast } = useToast();

  const ingredientsList = recipeIngredients.split(',').map(item => item.trim()).filter(Boolean);
  const availableIngredientsList = availableIngredients.split(',').map(item => item.trim()).filter(Boolean);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      missingIngredients: [],
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (data.missingIngredients.length === 0) {
      toast({
        title: "لم يتم تحديد أي مكونات",
        description: "يرجى تحديد المكونات التي تنقصك.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setSubstitutions(null);
    try {
      const result = await suggestIngredientSubstitutions({
        recipeName,
        missingIngredients: data.missingIngredients,
        availableIngredients: availableIngredientsList,
      });
      setSubstitutions(result.substitutions);
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "فشل في الحصول على اقتراحات الاستبدال. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>البحث عن بدائل للمكونات</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">المكونات المفقودة</FormLabel>
                  <p className="text-sm text-muted-foreground">حدد المكونات التي لا تملكها.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {ingredientsList.map((item) => (
                    <FormField
                      key={item}
                      control={form.control}
                      name="missingIngredients"
                      render={({ field }) => (
                        <FormItem
                          key={item}
                          className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...(field.value || []), item])
                                  : field.onChange(
                                      (field.value || []).filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{item}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Replace className="mr-2 h-4 w-4" />
                )}
                البحث عن بدائل
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      {substitutions && (
        <Card>
          <CardHeader>
            <CardTitle>اقتراحات البدائل</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(substitutions).length > 0 ? (
              <ul className="space-y-4">
                {Object.entries(substitutions).map(([missing, suggestions]) => (
                  <li key={missing} className="p-3 bg-secondary rounded-md">
                    <p className="font-semibold">{missing}:</p>
                    {suggestions.length > 0 ? (
                      <p className="text-accent-foreground">{suggestions}</p>
                    ) : (
                      <p className="text-muted-foreground">لم يتم العثور على بدائل مناسبة من المكونات المتاحة لديك.</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
               <p className="text-muted-foreground">لم يتم العثور على بدائل.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
