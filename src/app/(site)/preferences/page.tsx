"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/lib/axiosInstance";
import { ApiResponse } from "@/types/apiResponse";
import { getAuth } from "firebase/auth";
import { toast } from "sonner";

interface Category {
  categoryId: string;
  categoryName: string;
}

export default function UserPreferencesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const getCategories = async () => {
      const response = await api.get("/api/categories/fetch_categories");
      const fetchedCategories = response.data ?? [];
      setCategories(fetchedCategories);
    };
    getCategories();
  }, []);

  const router = useRouter();

  const handleSelectedCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      setSelectedCategories([
        ...selectedCategories.filter((categoryId) => categoryId !== id),
      ]);
    } else {
      setSelectedCategories([...selectedCategories, id]);
    }
  };

  const savePreferences = async () => {
    setLoading(true);

    try {
      if (!user) {
        setLoading(false);
        toast.error("Something went wrong!!");
        return;
      }

      const { data } = await api.patch<ApiResponse>("/api/user/preference", {
        userId: user.uid,
        preference: selectedCategories,
      });

      if (data.success) {
        setLoading(false);
        setActiveStep(2);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!");
    }
  };

  // Step content based on active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <div className="w-full max-full mx-auto">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {categories.map((category) => (
                <div
                  key={category.categoryId}
                  onClick={() => handleSelectedCategory(category.categoryId)}
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105`}
                >
                  <div className="w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] aspect-square transition-opacity rounded-lg duration-200 fade-in hover:opacity-90 border">
                    <Image
                      src={`/${category.categoryName}.jpg`}
                      alt={category.categoryName}
                      width={500}
                      height={300}
                      className="h-full w-full object-cover object-center rounded-lg"
                    />
                  </div>

                  <div className="text-sm font-medium text-center hover:font-semibold">
                    {category.categoryName}
                  </div>

                  {selectedCategories.includes(category.categoryId) && (
                    <div className="absolute top-2 right-4 bg-blue-600 rounded-full p-1">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="py-2 px-[14px] flex items-center gap-2 sm:gap-3 rounded-full border border-blue-600 text-blue-600 font-bold text-xs sm:text-base">
                <div className="w-6 h-6 flex justify-center items-center bg-blue-600 rounded-full p-1">
                  <Check size={12} className="text-white" />
                </div>
                {selectedCategories.length} topics selected
              </div>
              <button
                onClick={savePreferences}
                disabled={loading}
                className="flex items-center px-6 py-2 rounded-xl bg-blue-800 text-white hover:bg-blue-600 font-medium transition-all text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>Save Preferences</>
                )}
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full max-w-md mx-auto text-center">
            <div className="bg-secondary bg-opacity-10 rounded-xl p-8 backdrop-blur-sm border shadow-lg">
              <div className="w-16 h-16 bg-white border rounded-full flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-blue-600" />
              </div>

              <h3 className="text-2xl font-bold text-secondary-foreground mb-3">
                All set!
              </h3>
              <p className="text-secondary-foreground text-opacity-60 mb-6">
                Your news feed has been personalized based on your preferences.
                Enjoy discovering news that matters to you.
              </p>

              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 rounded-full bg-blue-800 text-white hover:bg-blue-600 font-medium transition-all inline-block"
              >
                Go to My Feed
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-5 md:pt-10 bg-background text-foreground">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Tell us what you like
          </h1>
          <p className="text-muted-foreground text-lg">
            Choose any of the categories from below to personalize your news
            feed
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center space-x-2">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  step === activeStep
                    ? "bg-black"
                    : step < activeStep
                    ? "bg-gray-400"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {renderStepContent()}
      </div>
    </div>
  );
}
