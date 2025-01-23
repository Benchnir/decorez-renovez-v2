import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';

const CreateProject = () => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      return response.json();
    },
    onSuccess: (data) => {
      router.push(`/projects/${data.id}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('type', type);
    
    if (files) {
      Array.from(files).forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });
    }

    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Créer un nouveau projet</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Titre du projet
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Type de projet
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Sélectionnez un type</option>
            <option value="renovation">Rénovation</option>
            <option value="decoration">Décoration</option>
            <option value="construction">Construction</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Photos du projet
          </label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(e.target.files)}
            accept="image/*"
            className="mt-1 block w-full"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {mutation.isLoading ? 'Création...' : 'Créer le projet'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;
