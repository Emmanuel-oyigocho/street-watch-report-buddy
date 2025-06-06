
import React, { useState } from 'react';
import { ReportFormData } from '../types';

interface ReportFormProps {
  onSubmit: (report: Omit<ReportFormData, 'submittedBy'>) => void;
  onCancel: () => void;
}

const hazardTypes = [
  'Pothole',
  'Broken Street Light',
  'Damaged Sidewalk',
  'Road Debris',
  'Missing Sign',
  'Flooding',
  'Other'
];

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    location: '',
    hazardType: '',
    description: '',
    imageUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.location && formData.hazardType && formData.description) {
      onSubmit({
        location: formData.location,
        hazardType: formData.hazardType,
        description: formData.description,
        imageUrl: formData.imageUrl || undefined
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="border-t pt-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Main St & 1st Ave"
              required
            />
          </div>

          <div>
            <label htmlFor="hazardType" className="block text-sm font-medium text-gray-700 mb-1">
              Hazard Type *
            </label>
            <select
              id="hazardType"
              name="hazardType"
              value={formData.hazardType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select hazard type</option>
              {hazardTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe the hazard in detail..."
            required
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Submit Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
