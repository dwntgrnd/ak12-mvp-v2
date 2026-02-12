'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/services/types/product';
import { GRADE_RANGES, SUBJECT_AREAS } from '@/services/types/controlled-vocabulary';

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData?: {
    name: string;
    description: string;
    gradeRange: string;
    subjectArea: string;
    keyFeatures: string[];
    targetChallenges: string[];
    competitiveDifferentiators: string[];
    approvedMessaging: string[];
  };
  productId?: string; // required for edit mode
  onSuccess?: (product: Product) => void;
}

export function ProductForm({ mode, initialData, productId, onSuccess }: ProductFormProps) {
  const router = useRouter();

  // Form state
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [gradeRange, setGradeRange] = useState(initialData?.gradeRange || '');
  const [subjectArea, setSubjectArea] = useState(initialData?.subjectArea || '');
  const [keyFeatures, setKeyFeatures] = useState<string[]>(initialData?.keyFeatures || []);
  const [targetChallenges, setTargetChallenges] = useState<string[]>(initialData?.targetChallenges || []);
  const [competitiveDifferentiators, setCompetitiveDifferentiators] = useState<string[]>(initialData?.competitiveDifferentiators || []);
  const [approvedMessaging, setApprovedMessaging] = useState<string[]>(initialData?.approvedMessaging || []);

  // Temporary input values for string arrays
  const [keyFeatureInput, setKeyFeatureInput] = useState('');
  const [targetChallengeInput, setTargetChallengeInput] = useState('');
  const [competitiveDifferentiatorInput, setCompetitiveDifferentiatorInput] = useState('');
  const [approvedMessagingInput, setApprovedMessagingInput] = useState('');

  // Form status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add item to string array
  const addItem = (items: string[], setItems: (items: string[]) => void, input: string, setInput: (value: string) => void) => {
    const trimmed = input.trim();
    if (trimmed) {
      setItems([...items, trimmed]);
      setInput('');
    }
  };

  // Remove item from string array
  const removeItem = (items: string[], setItems: (items: string[]) => void, index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const body = {
        name,
        description,
        gradeRange,
        subjectArea,
        keyFeatures,
        targetChallenges,
        competitiveDifferentiators,
        approvedMessaging,
      };

      const url = mode === 'create' ? '/api/products' : `/api/products/${productId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || 'Failed to save product');
      }

      const product = await response.json();

      if (onSuccess) {
        onSuccess(product);
      }

      // Redirect to product detail page
      const targetProductId = mode === 'create' ? product.productId : productId;
      router.push(`/solutions/${targetProductId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (mode === 'create') {
      router.push('/solutions');
    } else {
      router.push(`/solutions/${productId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Product Name <span className="text-destructive">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Grade Range */}
      <div>
        <label htmlFor="gradeRange" className="block text-sm font-medium mb-1">
          Grade Range <span className="text-destructive">*</span>
        </label>
        <select
          id="gradeRange"
          value={gradeRange}
          onChange={(e) => setGradeRange(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a grade range</option>
          {GRADE_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Subject Area */}
      <div>
        <label htmlFor="subjectArea" className="block text-sm font-medium mb-1">
          Subject Area <span className="text-destructive">*</span>
        </label>
        <select
          id="subjectArea"
          value={subjectArea}
          onChange={(e) => setSubjectArea(e.target.value)}
          required
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Select a subject area</option>
          {SUBJECT_AREAS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Key Features */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Key Features
        </label>
        {keyFeatures.length > 0 && (
          <ul className="space-y-1 mb-2">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/10 px-3 py-1.5 rounded-md text-sm">
                <span>{feature}</span>
                <button
                  type="button"
                  onClick={() => removeItem(keyFeatures, setKeyFeatures, index)}
                  className="text-destructive hover:text-destructive/80 text-xs font-medium ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={keyFeatureInput}
            onChange={(e) => setKeyFeatureInput(e.target.value)}
            placeholder="Add a key feature"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addItem(keyFeatures, setKeyFeatures, keyFeatureInput, setKeyFeatureInput)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Add
          </button>
        </div>
      </div>

      {/* Target Challenges */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Target Challenges
        </label>
        {targetChallenges.length > 0 && (
          <ul className="space-y-1 mb-2">
            {targetChallenges.map((challenge, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/10 px-3 py-1.5 rounded-md text-sm">
                <span>{challenge}</span>
                <button
                  type="button"
                  onClick={() => removeItem(targetChallenges, setTargetChallenges, index)}
                  className="text-destructive hover:text-destructive/80 text-xs font-medium ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={targetChallengeInput}
            onChange={(e) => setTargetChallengeInput(e.target.value)}
            placeholder="Add a target challenge"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addItem(targetChallenges, setTargetChallenges, targetChallengeInput, setTargetChallengeInput)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Add
          </button>
        </div>
      </div>

      {/* Competitive Differentiators */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Competitive Differentiators
        </label>
        {competitiveDifferentiators.length > 0 && (
          <ul className="space-y-1 mb-2">
            {competitiveDifferentiators.map((diff, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/10 px-3 py-1.5 rounded-md text-sm">
                <span>{diff}</span>
                <button
                  type="button"
                  onClick={() => removeItem(competitiveDifferentiators, setCompetitiveDifferentiators, index)}
                  className="text-destructive hover:text-destructive/80 text-xs font-medium ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={competitiveDifferentiatorInput}
            onChange={(e) => setCompetitiveDifferentiatorInput(e.target.value)}
            placeholder="Add a competitive differentiator"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addItem(competitiveDifferentiators, setCompetitiveDifferentiators, competitiveDifferentiatorInput, setCompetitiveDifferentiatorInput)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Add
          </button>
        </div>
      </div>

      {/* Approved Messaging */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Approved Messaging
        </label>
        {approvedMessaging.length > 0 && (
          <ul className="space-y-1 mb-2">
            {approvedMessaging.map((message, index) => (
              <li key={index} className="flex items-center justify-between bg-secondary/10 px-3 py-1.5 rounded-md text-sm">
                <span>{message}</span>
                <button
                  type="button"
                  onClick={() => removeItem(approvedMessaging, setApprovedMessaging, index)}
                  className="text-destructive hover:text-destructive/80 text-xs font-medium ml-2"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={approvedMessagingInput}
            onChange={(e) => setApprovedMessagingInput(e.target.value)}
            placeholder="Add an approved message"
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => addItem(approvedMessaging, setApprovedMessaging, approvedMessagingInput, setApprovedMessagingInput)}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80"
          >
            Add
          </button>
        </div>
      </div>

      {/* Form actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
