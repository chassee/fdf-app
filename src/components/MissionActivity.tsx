import { useState } from 'react';
import { ActivitySchema, ActivityResponse, validateActivityResponses } from '@/lib/activitySchema';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface MissionActivityProps {
  schema: ActivitySchema;
  onSubmit: (responses: ActivityResponse[]) => void;
  isLoading?: boolean;
}

export function MissionActivity({ schema, onSubmit, isLoading = false }: MissionActivityProps) {
  const [responses, setResponses] = useState<ActivityResponse[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const handleInputChange = (questionId: string, inputId: string, value: string | number | boolean | string[]) => {
    setResponses((prev) => {
      const existing = prev.find((r) => r.questionId === questionId && r.inputId === inputId);
      if (existing) {
        return prev.map((r) =>
          r.questionId === questionId && r.inputId === inputId ? { ...r, value } : r
        );
      }
      return [...prev, { questionId, inputId, value }];
    });

    // Mark as touched
    setTouched((prev) => new Set([...prev, `${questionId}-${inputId}`]));
  };

  const handleSubmit = () => {
    const validation = validateActivityResponses(schema, responses);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    onSubmit(responses);
  };

  return (
    <div className="space-y-6">
      {/* Activity Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{schema.title}</h2>
        <p className="text-gray-700 mb-3">{schema.description}</p>
        <p className="text-sm text-gray-600">⏱ Estimated time: {schema.estimatedTime} minutes</p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Please fix the following errors:</h3>
              <ul className="space-y-1">
                {errors.map((error, i) => (
                  <li key={i} className="text-sm text-red-700">
                    • {error}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Questions */}
      <div className="space-y-6">
        {schema.questions.map((question, qIdx) => (
          <Card key={question.id} className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {qIdx + 1}. {question.question}
              </h3>
              {question.hint && (
                <p className="text-sm text-blue-600 mt-2 italic">💡 {question.hint}</p>
              )}
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              {question.inputs.map((input) => {
                const fieldKey = `${question.id}-${input.id}`;
                const isTouched = touched.has(fieldKey);
                const value = responses.find(
                  (r) => r.questionId === question.id && r.inputId === input.id
                )?.value ?? '';

                return (
                  <div key={input.id}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {input.label}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </label>

                    {/* Text Input */}
                    {input.type === 'text' && (
                      <input
                        type="text"
                        value={String(value)}
                        onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                        onBlur={() => setTouched((prev) => new Set([...prev, fieldKey]))}
                        placeholder={input.placeholder}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {/* Textarea */}
                    {input.type === 'textarea' && (
                      <textarea
                        value={String(value)}
                        onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                        onBlur={() => setTouched((prev) => new Set([...prev, fieldKey]))}
                        placeholder={input.placeholder}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {/* Number Input */}
                    {input.type === 'number' && (
                      <input
                        type="number"
                        value={String(value)}
                        onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                        onBlur={() => setTouched((prev) => new Set([...prev, fieldKey]))}
                        placeholder={input.placeholder}
                        min={input.validation?.min}
                        max={input.validation?.max}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {/* Select */}
                    {input.type === 'select' && (
                      <select
                        value={String(value)}
                        onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                        onBlur={() => setTouched((prev) => new Set([...prev, fieldKey]))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select an option...</option>
                        {input.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Date Input */}
                    {input.type === 'date' && (
                      <input
                        type="date"
                        value={String(value)}
                        onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                        onBlur={() => setTouched((prev) => new Set([...prev, fieldKey]))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}

                    {/* Checkbox */}
                    {input.type === 'checkbox' && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(value)}
                          onChange={(e) => handleInputChange(question.id, input.id, e.target.checked)}
                          className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{input.label}</span>
                      </label>
                    )}

                    {/* Radio Buttons */}
                    {input.type === 'radio' && (
                      <div className="space-y-2">
                        {input.options?.map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name={input.id}
                              value={opt.value}
                              checked={String(value) === opt.value}
                              onChange={(e) => handleInputChange(question.id, input.id, e.target.value)}
                              className="w-4 h-4 border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{opt.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg"
      >
        {isLoading ? 'Submitting...' : 'Complete Mission'}
      </Button>
    </div>
  );
}
