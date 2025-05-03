"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function UserPreferencesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Technology", icon: "💻", selected: false },
    { id: 2, name: "Business", icon: "💼", selected: false },
    { id: 3, name: "Politics", icon: "🏛️", selected: false },
    { id: 4, name: "Health", icon: "🩺", selected: false },
    { id: 5, name: "Science", icon: "🔬", selected: false },
    { id: 6, name: "Sports", icon: "🏆", selected: false },
    { id: 7, name: "Entertainment", icon: "🎬", selected: false },
    { id: 8, name: "World News", icon: "🌎", selected: false },
    { id: 9, name: "Finance", icon: "💰", selected: false },
    { id: 10, name: "Travel", icon: "✈️", selected: false },
    { id: 11, name: "Food", icon: "🍽️", selected: false },
    { id: 12, name: "Fashion", icon: "👗", selected: false },
    { id: 13, name: "Culture", icon: "🎭", selected: false },
    { id: 14, name: "Education", icon: "🎓", selected: false },
    { id: 15, name: "Environment", icon: "🌱", selected: false },
  ]);

  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  console.log(saveStatus);

  const router = useRouter();

  const toggleCategorySelection = (id: number) => {
    setCategories(
      categories.map((category) =>
        category.id === id
          ? { ...category, selected: !category.selected }
          : category
      )
    );
  };

  const savePreferences = () => {
    setLoading(true);

    // Simulate API call with a delay
    setTimeout(() => {
      const selectedCategories = categories
        .filter((category) => category.selected)
        .map(({ id, name }) => ({ id, name }));

      console.log("Saving preferences:", selectedCategories);

      // In a real app, you would send this data to your API
      // Example: await fetch('/api/user/preferences', { method: 'POST', body: JSON.stringify(selectedCategories) })

      setSaveStatus("success");
      setLoading(false);
      setActiveStep(2);

      // Clear status message after 3 seconds
      setTimeout(() => setSaveStatus(""), 3000);
    }, 1500);
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
                  key={category.id}
                  onClick={() => toggleCategorySelection(category.id)}
                  className={`relative flex flex-col items-center justify-center gap-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105`}
                >
                  <div className="aspect-square transition-opacity duration-200 fade-in hover:opacity-90">
                    <Image
                      src={"/news.jpg"}
                      alt="Category"
                      width={500}
                      height={300}
                      className="h-full w-full object-cover object-center rounded-lg"
                    />
                  </div>

                  <div className="text-sm font-medium text-center hover:font-semibold">
                    {category.name}
                  </div>

                  {category.selected && (
                    <div className="absolute top-2 right-2 bg-blue-600 rounded-full p-1">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-between items-center">
              <div className="text-black font-medium">
                {categories.filter((c) => c.selected).length} topics selected
              </div>
              <button
                onClick={savePreferences}
                disabled={loading}
                className="flex items-center px-6 py-2 rounded-full bg-blue-800 text-white hover:bg-blue-600 text-sm font-medium transition-all"
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
