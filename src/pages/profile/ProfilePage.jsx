import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { User, Phone, Mail, Edit, Save, X } from 'lucide-react';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import { useAuth } from '../../context/AuthContext';
import { validateName } from '../../utils/validation';
import { getErrorMessage } from '../../utils/helpers';

const ProfilePage = () => {
  const { currentUser, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: currentUser?.name || '',
    }
  });

  // Reset form when currentUser changes or edit mode is toggled
  useEffect(() => {
    if (currentUser) {
      reset({ name: currentUser.name });
    }
  }, [currentUser, reset, isEditing]);
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError('');
    setSuccessMessage('');
    
    // If cancelling edit, reset form
    if (isEditing) {
      reset({ name: currentUser.name });
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      await updateProfile(data);
      setSuccessMessage('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto pt-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {successMessage && (
          <Alert type="success" message={successMessage} onClose={() => setSuccessMessage('')} />
        )}

        <div className="bg-white rounded-xl shadow-md overflow-hidden mt-4">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-6">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-primary text-3xl font-bold shrink-0">
                {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-semibold">{currentUser?.name}</h2>
                <p className="opacity-90">Player</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                    {...register('name', {
                      required: 'Name is required',
                      validate: (value) => validateName(value) || 'Please enter a valid name',
                    })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleEditToggle}
                    className="flex items-center"
                  >
                    <X size={16} className="mr-1" /> Cancel
                  </Button>
                  <Button
                    type="submit"
                    loading={isLoading}
                    disabled={isLoading}
                    className="flex items-center"
                  >
                    <Save size={16} className="mr-1" /> Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div>
                <div className="flex justify-end mb-4">
                  <Button
                    variant="outline"
                    onClick={handleEditToggle}
                    className="flex items-center"
                  >
                    <Edit size={16} className="mr-1" /> Edit Profile
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <User size={18} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-lg font-medium text-gray-800">{currentUser?.name}</p>
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="flex items-start">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Phone size={18} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium text-gray-800">{currentUser?.phoneNumber}</p>
                    </div>
                  </div>

                  {/* Email */}
                  {currentUser?.email && (
                    <div className="flex items-start">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Mail size={18} />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-lg font-medium text-gray-800">{currentUser.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;