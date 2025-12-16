import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { FiUpload, FiTrash2, FiEdit2, FiSave, FiX, FiImage, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function HeroSliderManagement() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/admin/login');
      return;
    }
    fetchSlides();
  }, [isAuthenticated, user, router]);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/hero-slides');
      setSlides(data.slides || []);
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Default slides if API fails
      setSlides([
        {
          _id: '1',
          image: '/images/hero-1.jpeg',
          title: 'Advanced Diagnostic Services',
          subtitle: 'State-of-the-art medical testing with quick and accurate results',
          ctaText: 'Book Test',
          ctaLink: '/tests',
          order: 1,
          isActive: true
        },
        {
          _id: '2',
          image: '/images/hero-2.jpeg',
          title: 'Expert Medical Consultation',
          subtitle: 'Consult with experienced doctors for comprehensive healthcare',
          ctaText: 'Book Appointment',
          ctaLink: '/doctors',
          order: 2,
          isActive: true
        },
        {
          _id: '3',
          image: '/images/hero-3.jpeg',
          title: 'Home Sample Collection',
          subtitle: 'Convenient doorstep sample collection service available',
          ctaText: 'Book Now',
          ctaLink: '/tests',
          order: 3,
          isActive: true
        },
        {
          _id: '4',
          image: '/images/ambu.jpeg',
          title: '24/7 Emergency Ambulance',
          subtitle: 'Round-the-clock emergency medical transport service',
          ctaText: 'Call Now',
          ctaLink: 'tel:+919830016600',
          order: 4,
          isActive: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (slideId, file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploadingImage(true);
      const { data } = await api.post(`/hero-slides/${slideId}/upload-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Image uploaded successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. You can manually place images in /public/images/');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateSlide = async (slideId, updates) => {
    try {
      await api.put(`/hero-slides/${slideId}`, updates);
      toast.success('Slide updated successfully');
      setEditingSlide(null);
      fetchSlides();
    } catch (error) {
      console.error('Error updating slide:', error);
      toast.error('Failed to update slide');
    }
  };

  const handleDeleteSlide = async (slideId) => {
    if (!confirm('Are you sure you want to delete this slide?')) return;

    try {
      await api.delete(`/hero-slides/${slideId}`);
      toast.success('Slide deleted successfully');
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const handleToggleActive = async (slideId, isActive) => {
    try {
      await api.patch(`/hero-slides/${slideId}/toggle`, { isActive: !isActive });
      toast.success(`Slide ${!isActive ? 'activated' : 'deactivated'}`);
      fetchSlides();
    } catch (error) {
      console.error('Error toggling slide:', error);
      toast.error('Failed to toggle slide status');
    }
  };

  const handleAddSlide = async () => {
    try {
      const newSlide = {
        title: 'New Slide',
        subtitle: 'Add your description here',
        ctaText: 'Learn More',
        ctaLink: '/',
        image: '/images/hero-1.jpeg',
        order: slides.length + 1,
        isActive: true
      };
      
      const { data } = await api.post('/hero-slides', newSlide);
      toast.success('New slide added');
      fetchSlides();
    } catch (error) {
      console.error('Error adding slide:', error);
      toast.error('Failed to add slide');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Hero Slider Management</h1>
                <p className="text-slate-600">Manage homepage hero slider images and content</p>
              </div>
              <button
                onClick={handleAddSlide}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-medium transition-all duration-200"
              >
                <FiPlus className="mr-2" />
                Add New Slide
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">📝 Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Upload images to <code className="bg-blue-100 px-2 py-0.5 rounded">/frontend/public/images/</code> folder</li>
              <li>• Recommended image size: 1920x600px for best quality</li>
              <li>• Image path format: <code className="bg-blue-100 px-2 py-0.5 rounded">/images/your-image.jpg</code></li>
              <li>• Slides are displayed in order (drag to reorder - coming soon)</li>
            </ul>
          </div>

          {/* Slides Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {slides.map((slide) => (
              <div
                key={slide._id}
                className={`bg-white rounded-2xl shadow-soft border-2 overflow-hidden transition-all duration-200 ${
                  slide.isActive ? 'border-primary-200' : 'border-slate-200 opacity-60'
                }`}
              >
                {/* Image Preview */}
                <div className="relative h-48 bg-slate-100">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => handleToggleActive(slide._id, slide.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        slide.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}
                    >
                      {slide.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>

                  {/* Upload Button */}
                  <div className="absolute bottom-3 right-3">
                    <label className="cursor-pointer inline-flex items-center px-3 py-2 bg-white text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-all">
                      <FiUpload className="mr-1" size={14} />
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(slide._id, e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {editingSlide === slide._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        defaultValue={slide.title}
                        placeholder="Slide Title"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        id={`title-${slide._id}`}
                      />
                      <textarea
                        defaultValue={slide.subtitle}
                        placeholder="Slide Subtitle"
                        rows="2"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        id={`subtitle-${slide._id}`}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          defaultValue={slide.ctaText}
                          placeholder="Button Text"
                          className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          id={`cta-text-${slide._id}`}
                        />
                        <input
                          type="text"
                          defaultValue={slide.ctaLink}
                          placeholder="Button Link"
                          className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          id={`cta-link-${slide._id}`}
                        />
                      </div>
                      <input
                        type="text"
                        defaultValue={slide.image}
                        placeholder="Image Path (e.g., /images/hero-1.jpeg)"
                        className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        id={`image-${slide._id}`}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const updates = {
                              title: document.getElementById(`title-${slide._id}`).value,
                              subtitle: document.getElementById(`subtitle-${slide._id}`).value,
                              ctaText: document.getElementById(`cta-text-${slide._id}`).value,
                              ctaLink: document.getElementById(`cta-link-${slide._id}`).value,
                              image: document.getElementById(`image-${slide._id}`).value
                            };
                            handleUpdateSlide(slide._id, updates);
                          }}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                        >
                          <FiSave className="mr-2" />
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSlide(null)}
                          className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                        >
                          <FiX />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{slide.title}</h3>
                      <p className="text-sm text-slate-600 mb-3">{slide.subtitle}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <span className="px-2 py-1 bg-slate-100 rounded">
                          {slide.ctaText} → {slide.ctaLink}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mb-4 font-mono bg-slate-50 p-2 rounded">
                        {slide.image}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditingSlide(slide._id)}
                          className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200"
                        >
                          <FiEdit2 className="mr-2" size={16} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSlide(slide._id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {slides.length === 0 && (
            <div className="text-center py-12">
              <FiImage className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No slides yet</h3>
              <p className="text-slate-600 mb-4">Add your first hero slider image</p>
              <button
                onClick={handleAddSlide}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700"
              >
                <FiPlus className="mr-2" />
                Add Slide
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
