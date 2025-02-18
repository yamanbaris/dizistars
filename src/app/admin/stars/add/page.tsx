'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createStar } from '@/lib/database';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { StarProfileImage } from '@/components/admin/forms/StarProfileImage';

interface StarFormData {
  full_name: string;
  profile_image_url: string;
  star_type: 'actor' | 'actress';
  current_project: string | null;
  birth_date: string;
  birth_place: string;
  education: string;
  social_media_handles: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  biography: string;
  notable_works: Array<{
    title: string;
    year: string;
    role: string;
    image?: string;
  }>;
  filmography: Array<{
    type: string;
    projects: Array<{
      name: string;
      year: string | number;
      role: string;
      genre?: string;
    }>;
  }>;
  gallery_images: string[];
  is_featured: boolean;
  is_trending: boolean;
  is_rising: boolean;
  is_influential: boolean;
  slug: string;
  total_ratings: number;
}

// Validation utilities
const validateUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const validateSocialHandle = (handle: string) => {
  return /^@?[a-zA-Z0-9_]{1,30}$/.test(handle);
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export default function AddStarPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState<StarFormData>({
    full_name: '',
    profile_image_url: '',
    star_type: 'actor',
    current_project: null,
    birth_date: '',
    birth_place: '',
    education: '',
    social_media_handles: {},
    biography: '',
    notable_works: [],
    filmography: [],
    gallery_images: [],
    is_featured: false,
    is_trending: false,
    is_rising: false,
    is_influential: false,
    slug: '',
    total_ratings: 0
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setFormData({
      ...formData,
      full_name: newName,
      slug: generateSlug(newName)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate required fields
      if (!formData.full_name) {
        toast.error('Full name is required');
        return;
      }

      if (!formData.star_type) {
        toast.error('Star type is required');
        return;
      }

      // Validate URLs
      if (formData.profile_image_url && !validateUrl(formData.profile_image_url)) {
        toast.error('Invalid profile image URL');
        return;
      }

      for (const image of formData.gallery_images) {
        if (image && !validateUrl(image)) {
          toast.error('Invalid gallery image URL');
          return;
        }
      }

      // Validate social media handles
      for (const [platform, handle] of Object.entries(formData.social_media_handles)) {
        if (handle && !validateSocialHandle(handle)) {
          toast.error(`Invalid ${platform} handle`);
          return;
        }
      }

      // Format the data for submission
      const submissionData = {
        ...formData,
        // Remove the slug as it's auto-generated
        slug: undefined,
        // Remove total_ratings as it's computed
        total_ratings: undefined,
        // Ensure arrays are properly formatted
        filmography: formData.filmography || [],
        gallery_images: formData.gallery_images || [],
        // Ensure social media handles are properly formatted
        social_media_handles: {
          instagram: formData.social_media_handles.instagram || undefined,
          twitter: formData.social_media_handles.twitter || undefined,
          tiktok: formData.social_media_handles.tiktok || undefined
        }
      };

      await createStar(submissionData);
      toast.success('Star added successfully');
      router.push('/admin/stars');
    } catch (error) {
      console.error('Error adding star:', error);
      toast.error('Failed to add star');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-50 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/stars')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Stars
            </button>
            <h1 className="text-xl font-semibold text-white">Add New Star</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/stars')}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              form="star-form"
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Save Star
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="sticky top-24 bg-gray-800 rounded-lg overflow-hidden">
              <StarProfileImage
                starId="new" // This will be replaced with actual ID after creation
                currentImageUrl={formData.profile_image_url}
                onUpdate={(url) => setFormData({...formData, profile_image_url: url})}
                name={formData.full_name}
                type={formData.star_type}
              />
              <nav className="p-2">
                {['basic', 'biography', 'filmography', 'media'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full px-4 py-3 text-sm font-medium rounded-md text-left transition-colors ${
                      activeTab === tab
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <form id="star-form" onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-gray-800 rounded-lg shadow-lg">
                  <div className="p-6 space-y-6">
                    {activeTab === 'basic' && (
                      <div className="space-y-8">
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Basic Information
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Full Name</label>
                              <input
                                type="text"
                                value={formData.full_name}
                                onChange={handleNameChange}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Star Type</label>
                              <select
                                value={formData.star_type}
                                onChange={(e) => setFormData({...formData, star_type: e.target.value as 'actor' | 'actress'})}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              >
                                <option value="actor">Actor</option>
                                <option value="actress">Actress</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Current Project</label>
                              <input
                                type="text"
                                value={formData.current_project || ''}
                                onChange={(e) => setFormData({...formData, current_project: e.target.value})}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>

                            {/* Status Toggles */}
                            <div className="mt-6">
                              <h4 className="text-sm font-medium text-gray-200 mb-4">Star Status</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                                    className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor="is_featured" className="text-sm text-gray-200">Featured Star</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_trending"
                                    checked={formData.is_trending}
                                    onChange={(e) => setFormData({...formData, is_trending: e.target.checked})}
                                    className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor="is_trending" className="text-sm text-gray-200">Trending</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_rising"
                                    checked={formData.is_rising}
                                    onChange={(e) => setFormData({...formData, is_rising: e.target.checked})}
                                    className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor="is_rising" className="text-sm text-gray-200">Rising Star</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id="is_influential"
                                    checked={formData.is_influential}
                                    onChange={(e) => setFormData({...formData, is_influential: e.target.checked})}
                                    className="rounded bg-gray-700 border-gray-600 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label htmlFor="is_influential" className="text-sm text-gray-200">Influential</label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Social Media Handles
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Instagram</label>
                              <input
                                type="text"
                                value={formData.social_media_handles.instagram || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  social_media_handles: {
                                    ...formData.social_media_handles,
                                    instagram: e.target.value
                                  }
                                })}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Twitter</label>
                              <input
                                type="text"
                                value={formData.social_media_handles.twitter || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  social_media_handles: {
                                    ...formData.social_media_handles,
                                    twitter: e.target.value
                                  }
                                })}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200">TikTok</label>
                              <input
                                type="text"
                                value={formData.social_media_handles.tiktok || ''}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  social_media_handles: {
                                    ...formData.social_media_handles,
                                    tiktok: e.target.value
                                  }
                                })}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'biography' && (
                      <div className="space-y-8">
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Biography & Background
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Birth Date</label>
                              <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-200">Birth Place</label>
                              <input
                                type="text"
                                value={formData.birth_place}
                                onChange={(e) => setFormData({...formData, birth_place: e.target.value})}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-200">Education</label>
                              <input
                                type="text"
                                value={formData.education}
                                onChange={(e) => setFormData({...formData, education: e.target.value})}
                                className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-200">Biography</label>
                            <textarea
                              value={formData.biography}
                              onChange={(e) => setFormData({...formData, biography: e.target.value})}
                              rows={6}
                              className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'filmography' && (
                      <div className="space-y-8">
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Notable Works
                          </h3>
                          <div className="space-y-4">
                            {formData.notable_works.map((work, index) => (
                              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-700 rounded-lg">
                                <div>
                                  <label className="block text-xs text-gray-400">Title</label>
                                  <input
                                    type="text"
                                    value={work.title}
                                    onChange={(e) => {
                                      const newWorks = [...formData.notable_works];
                                      newWorks[index] = {...work, title: e.target.value};
                                      setFormData({...formData, notable_works: newWorks});
                                    }}
                                    className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400">Year</label>
                                  <input
                                    type="text"
                                    value={work.year}
                                    onChange={(e) => {
                                      const newWorks = [...formData.notable_works];
                                      newWorks[index] = {...work, year: e.target.value};
                                      setFormData({...formData, notable_works: newWorks});
                                    }}
                                    className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-400">Role</label>
                                  <input
                                    type="text"
                                    value={work.role}
                                    onChange={(e) => {
                                      const newWorks = [...formData.notable_works];
                                      newWorks[index] = {...work, role: e.target.value};
                                      setFormData({...formData, notable_works: newWorks});
                                    }}
                                    className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                                  />
                                </div>
                                <div className="flex items-end">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newWorks = formData.notable_works.filter((_, i) => i !== index);
                                      setFormData({...formData, notable_works: newWorks});
                                    }}
                                    className="px-2 py-1 bg-red-600 text-white rounded-md"
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                notable_works: [...formData.notable_works, { title: '', year: '', role: '' }]
                              })}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                            >
                              Add Notable Work
                            </button>
                          </div>
                        </div>
                        
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Complete Filmography
                          </h3>
                          <div className="space-y-6">
                            {formData.filmography.map((section, sectionIndex) => (
                              <div key={sectionIndex} className="space-y-4 p-4 bg-gray-700 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <label className="block text-xs text-gray-400">Section Type</label>
                                    <input
                                      type="text"
                                      value={section.type}
                                      onChange={(e) => {
                                        const newFilmography = [...formData.filmography];
                                        newFilmography[sectionIndex] = {...section, type: e.target.value};
                                        setFormData({...formData, filmography: newFilmography});
                                      }}
                                      className="mt-1 block w-full rounded-md bg-gray-600 border-gray-500 text-white"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFilmography = formData.filmography.filter((_, i) => i !== sectionIndex);
                                      setFormData({...formData, filmography: newFilmography});
                                    }}
                                    className="px-2 py-1 bg-red-600 text-white rounded-md"
                                  >
                                    Remove Section
                                  </button>
                                </div>

                                <div className="space-y-4">
                                  {section.projects.map((project, projectIndex) => (
                                    <div key={projectIndex} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-600 rounded-lg">
                                      <div>
                                        <label className="block text-xs text-gray-400">Name</label>
                                        <input
                                          type="text"
                                          value={project.name}
                                          onChange={(e) => {
                                            const newFilmography = [...formData.filmography];
                                            newFilmography[sectionIndex].projects[projectIndex] = {
                                              ...project,
                                              name: e.target.value
                                            };
                                            setFormData({...formData, filmography: newFilmography});
                                          }}
                                          className="mt-1 block w-full rounded-md bg-gray-500 border-gray-400 text-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400">Year</label>
                                        <input
                                          type="text"
                                          value={project.year}
                                          onChange={(e) => {
                                            const newFilmography = [...formData.filmography];
                                            newFilmography[sectionIndex].projects[projectIndex] = {
                                              ...project,
                                              year: e.target.value
                                            };
                                            setFormData({...formData, filmography: newFilmography});
                                          }}
                                          className="mt-1 block w-full rounded-md bg-gray-500 border-gray-400 text-white"
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-xs text-gray-400">Role</label>
                                        <input
                                          type="text"
                                          value={project.role}
                                          onChange={(e) => {
                                            const newFilmography = [...formData.filmography];
                                            newFilmography[sectionIndex].projects[projectIndex] = {
                                              ...project,
                                              role: e.target.value
                                            };
                                            setFormData({...formData, filmography: newFilmography});
                                          }}
                                          className="mt-1 block w-full rounded-md bg-gray-500 border-gray-400 text-white"
                                        />
                                      </div>
                                      <div className="flex items-end">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const newFilmography = [...formData.filmography];
                                            newFilmography[sectionIndex].projects = section.projects.filter(
                                              (_, i) => i !== projectIndex
                                            );
                                            setFormData({...formData, filmography: newFilmography});
                                          }}
                                          className="px-2 py-1 bg-red-600 text-white rounded-md"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newFilmography = [...formData.filmography];
                                      newFilmography[sectionIndex].projects.push({
                                        name: '',
                                        year: '',
                                        role: ''
                                      });
                                      setFormData({...formData, filmography: newFilmography});
                                    }}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                                  >
                                    Add Project
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                filmography: [...formData.filmography, { type: '', projects: [] }]
                              })}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                            >
                              Add Filmography Section
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === 'media' && (
                      <div className="space-y-8">
                        <div className="bg-gray-750 rounded-lg p-6 space-y-6">
                          <h3 className="text-lg font-medium text-white border-b border-gray-700 pb-4">
                            Gallery
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {formData.gallery_images.map((image, index) => (
                              <div key={index} className="relative group">
                                {image ? (
                                  <div className="relative aspect-video rounded-lg overflow-hidden">
                                    <Image
                                      src={image.startsWith('/') ? image : `/${image}`}
                                      alt={`Gallery image ${index + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newImages = formData.gallery_images.filter((_, i) => i !== index);
                                          setFormData({...formData, gallery_images: newImages});
                                        }}
                                        className="px-3 py-2 bg-red-600 text-white rounded-md"
                                      >
                                        Remove
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="aspect-video rounded-lg bg-gray-700 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                  </div>
                                )}
                                <input
                                  type="text"
                                  value={image}
                                  onChange={(e) => {
                                    const newImages = [...formData.gallery_images];
                                    newImages[index] = e.target.value;
                                    setFormData({...formData, gallery_images: newImages});
                                  }}
                                  className="mt-2 w-full rounded-md bg-gray-700 border-gray-600 text-white text-sm"
                                  placeholder="Image URL"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => setFormData({
                                ...formData,
                                gallery_images: [...formData.gallery_images, '']
                              })}
                              className="aspect-video rounded-lg border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-colors flex items-center justify-center text-gray-400 hover:text-indigo-500"
                            >
                              Add Image
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
} 