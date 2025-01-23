import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';

interface ImageAnalysisProps {
  projectId: string;
  images: Array<{
    id: string;
    path: string;
    analysis?: any;
  }>;
}

interface AnalysisResult {
  overall_analysis: {
    estimated_cost: number;
    complexity: string;
    duration_estimate: string;
    required_skills: string[];
    material_suggestions: Array<{
      name: string;
      quantity: number;
      estimated_cost: number;
    }>;
    potential_challenges: string[];
  };
  individual_results: Array<{
    image_id: string;
    vision_analysis: any;
    ai_insights: {
      renovation_type: string;
      complexity: string;
      challenges: string[];
      materials: string[];
      timeline: string;
    };
  }>;
}

const ImageAnalysis: React.FC<ImageAnalysisProps> = ({ projectId, images }) => {
  const { data: analysis, isLoading, error } = useQuery<AnalysisResult>({
    queryKey: ['imageAnalysis', projectId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/projects/${projectId}/analyze-images`);
      return data;
    },
    enabled: !!projectId && images.length > 0,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-lg">
        Une erreur est survenue lors de l'analyse des images.
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="space-y-8">
      {/* Analyse globale */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyse Globale</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Estimation</h3>
            <div className="space-y-2">
              <p className="flex justify-between">
                <span className="text-gray-600">Coût estimé:</span>
                <span className="font-medium">{analysis.overall_analysis.estimated_cost}€</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Complexité:</span>
                <span className="font-medium">{analysis.overall_analysis.complexity}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Durée estimée:</span>
                <span className="font-medium">{analysis.overall_analysis.duration_estimate}</span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Compétences requises</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.overall_analysis.required_skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions de matériaux */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Matériaux suggérés</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Matériau
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coût estimé
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analysis.overall_analysis.material_suggestions.map((material, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {material.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                      {material.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {material.estimated_cost}€
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Points d'attention */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Points d'attention</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {analysis.overall_analysis.potential_challenges.map((challenge, index) => (
              <li key={index}>{challenge}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Analyse par image */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Analyse détaillée par image</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {analysis.individual_results.map((result, index) => {
            const image = images.find(img => img.id === result.image_id);
            if (!image) return null;

            return (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={image.path}
                    alt={`Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Type de rénovation: {result.ai_insights.renovation_type}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Complexité:</span>{' '}
                      {result.ai_insights.complexity}
                    </p>
                    
                    <div>
                      <span className="font-medium">Défis potentiels:</span>
                      <ul className="list-disc list-inside ml-2">
                        {result.ai_insights.challenges.map((challenge, i) => (
                          <li key={i}>{challenge}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="font-medium">Matériaux suggérés:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {result.ai_insights.materials.map((material, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {material}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <p>
                      <span className="font-medium">Délai estimé:</span>{' '}
                      {result.ai_insights.timeline}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ImageAnalysis;
