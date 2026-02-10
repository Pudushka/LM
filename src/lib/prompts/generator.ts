/**
 * Generates search prompts tailored to a medical practice's specialty and location.
 * These are the queries we'll send to AI engines to check if the business gets mentioned.
 */

interface PromptTemplate {
  text: string;
  category: string;
}

export function generatePrompts(
  businessName: string,
  location: string,
  specialty: string
): PromptTemplate[] {
  const city = location.split(",")[0]?.trim() || location;
  const state = location.split(",")[1]?.trim() || "";
  const fullLocation = state ? `${city}, ${state}` : city;

  // Map specialty to common search terms
  const specialtyTerms = getSpecialtyTerms(specialty);

  const prompts: PromptTemplate[] = [];

  // Direct recommendation queries
  prompts.push({
    text: `What is the best ${specialtyTerms.primary} in ${fullLocation}?`,
    category: "recommendation",
  });
  prompts.push({
    text: `Can you recommend a good ${specialtyTerms.primary} near ${city}?`,
    category: "recommendation",
  });
  prompts.push({
    text: `Who are the top rated ${specialtyTerms.plural} in ${fullLocation}?`,
    category: "recommendation",
  });

  // Specific need queries
  if (specialtyTerms.conditions.length > 0) {
    prompts.push({
      text: `I need a doctor for ${specialtyTerms.conditions[0]} in ${fullLocation}. Who should I see?`,
      category: "condition",
    });
    if (specialtyTerms.conditions.length > 1) {
      prompts.push({
        text: `Best ${specialtyTerms.primary} for ${specialtyTerms.conditions[1]} in ${city}?`,
        category: "condition",
      });
    }
  }

  // Comparison / selection queries
  prompts.push({
    text: `I'm looking for a ${specialtyTerms.primary} in ${fullLocation} that accepts new patients. Any recommendations?`,
    category: "selection",
  });
  prompts.push({
    text: `What should I look for when choosing a ${specialtyTerms.primary} in ${city}? Any specific practices you'd recommend?`,
    category: "selection",
  });

  // Reputation queries
  prompts.push({
    text: `What do people say about ${specialtyTerms.plural} in ${fullLocation}? Which ones have the best reviews?`,
    category: "reputation",
  });

  return prompts;
}

interface SpecialtyTerms {
  primary: string;
  plural: string;
  conditions: string[];
}

function getSpecialtyTerms(specialty: string): SpecialtyTerms {
  const mapping: Record<string, SpecialtyTerms> = {
    "General Practice / Family Medicine": {
      primary: "family doctor",
      plural: "family doctors",
      conditions: ["annual physicals", "chronic disease management"],
    },
    "Internal Medicine": {
      primary: "internist",
      plural: "internal medicine doctors",
      conditions: ["diabetes management", "hypertension"],
    },
    Pediatrics: {
      primary: "pediatrician",
      plural: "pediatricians",
      conditions: ["childhood vaccinations", "ADHD in children"],
    },
    Dermatology: {
      primary: "dermatologist",
      plural: "dermatologists",
      conditions: ["acne treatment", "skin cancer screening"],
    },
    Cardiology: {
      primary: "cardiologist",
      plural: "cardiologists",
      conditions: ["heart disease", "high cholesterol"],
    },
    Orthopedics: {
      primary: "orthopedic doctor",
      plural: "orthopedic doctors",
      conditions: ["knee pain", "sports injuries"],
    },
    Psychiatry: {
      primary: "psychiatrist",
      plural: "psychiatrists",
      conditions: ["anxiety treatment", "depression"],
    },
    Dentistry: {
      primary: "dentist",
      plural: "dentists",
      conditions: ["dental implants", "teeth whitening"],
    },
    Ophthalmology: {
      primary: "eye doctor",
      plural: "ophthalmologists",
      conditions: ["LASIK surgery", "cataract treatment"],
    },
    "OB/GYN": {
      primary: "OB/GYN",
      plural: "OB/GYN doctors",
      conditions: ["prenatal care", "women's health screening"],
    },
    Neurology: {
      primary: "neurologist",
      plural: "neurologists",
      conditions: ["migraine treatment", "epilepsy management"],
    },
    "Plastic Surgery": {
      primary: "plastic surgeon",
      plural: "plastic surgeons",
      conditions: ["rhinoplasty", "breast augmentation"],
    },
    "Urgent Care": {
      primary: "urgent care clinic",
      plural: "urgent care clinics",
      conditions: ["walk-in medical care", "after-hours doctor visits"],
    },
    Chiropractic: {
      primary: "chiropractor",
      plural: "chiropractors",
      conditions: ["back pain", "spinal adjustment"],
    },
    "Physical Therapy": {
      primary: "physical therapist",
      plural: "physical therapists",
      conditions: ["post-surgery rehab", "chronic pain management"],
    },
  };

  // Fallback for "Other" or unmapped specialties
  const defaultTerms: SpecialtyTerms = {
    primary: "medical practice",
    plural: "medical practices",
    conditions: ["general health consultation"],
  };

  // Try exact match first, then partial match
  if (mapping[specialty]) return mapping[specialty];
  for (const [key, value] of Object.entries(mapping)) {
    if (specialty.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return defaultTerms;
}
