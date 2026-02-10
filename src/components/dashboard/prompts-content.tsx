"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MessageSquareText,
  Loader2,
  Tag,
} from "lucide-react";

interface Prompt {
  id: string;
  text: string;
  category: string;
  isCustom: boolean;
  isActive: boolean;
}

const categoryColors: Record<string, string> = {
  recommendation: "bg-blue-100 text-blue-700",
  condition: "bg-purple-100 text-purple-700",
  selection: "bg-amber-100 text-amber-700",
  reputation: "bg-emerald-100 text-emerald-700",
  custom: "bg-surface-100 text-surface-600",
};

export function PromptsContent({
  prompts: initialPrompts,
  businessId,
}: {
  prompts: Prompt[];
  businessId: string;
}) {
  const router = useRouter();
  const [prompts, setPrompts] = useState(initialPrompts);
  const [newPrompt, setNewPrompt] = useState("");
  const [adding, setAdding] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleAddPrompt = async () => {
    if (!newPrompt.trim()) return;
    setAdding(true);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId,
          text: newPrompt.trim(),
          category: "custom",
        }),
      });

      if (res.ok) {
        const prompt = await res.json();
        setPrompts([...prompts, prompt]);
        setNewPrompt("");
      }
    } catch {
      // ignore
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (promptId: string, currentActive: boolean) => {
    setTogglingId(promptId);
    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentActive }),
      });

      if (res.ok) {
        setPrompts(
          prompts.map((p) =>
            p.id === promptId ? { ...p, isActive: !currentActive } : p
          )
        );
      }
    } catch {
      // ignore
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (promptId: string) => {
    try {
      const res = await fetch(`/api/prompts/${promptId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPrompts(prompts.filter((p) => p.id !== promptId));
      }
    } catch {
      // ignore
    }
  };

  const activeCount = prompts.filter((p) => p.isActive).length;

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Search Prompts</h1>
        <p className="text-surface-500 text-sm mt-0.5">
          These are the queries we send to AI engines during each scan.{" "}
          {activeCount} of {prompts.length} prompts active.
        </p>
      </div>

      {/* Add custom prompt */}
      <div className="rounded-xl border border-surface-200 bg-white p-5 mb-6">
        <h2 className="text-sm font-semibold text-surface-700 mb-3">
          Add Custom Prompt
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newPrompt}
            onChange={(e) => setNewPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddPrompt()}
            className="input-field flex-1"
            placeholder='e.g. "Who is the best heart surgeon in downtown Austin?"'
          />
          <button
            onClick={handleAddPrompt}
            disabled={adding || !newPrompt.trim()}
            className="btn-primary flex-shrink-0"
          >
            {adding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            Add
          </button>
        </div>
      </div>

      {/* Prompt list */}
      <div className="space-y-2">
        {prompts.map((prompt) => (
          <div
            key={prompt.id}
            className={`rounded-xl border bg-white p-4 flex items-center gap-3 transition-all ${
              prompt.isActive
                ? "border-surface-200"
                : "border-surface-100 opacity-60"
            }`}
          >
            <MessageSquareText className="w-4 h-4 text-surface-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-surface-800 truncate">
                {prompt.text}
              </div>
            </div>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${
                categoryColors[prompt.category] || categoryColors.custom
              }`}
            >
              <Tag className="w-3 h-3 inline mr-1" />
              {prompt.category}
            </span>
            <button
              onClick={() => handleToggle(prompt.id, prompt.isActive)}
              disabled={togglingId === prompt.id}
              className="flex-shrink-0 text-surface-400 hover:text-surface-600 transition-colors"
              title={prompt.isActive ? "Deactivate" : "Activate"}
            >
              {prompt.isActive ? (
                <ToggleRight className="w-6 h-6 text-brand-500" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>
            {prompt.isCustom && (
              <button
                onClick={() => handleDelete(prompt.id)}
                className="flex-shrink-0 text-surface-300 hover:text-red-500 transition-colors"
                title="Delete prompt"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
