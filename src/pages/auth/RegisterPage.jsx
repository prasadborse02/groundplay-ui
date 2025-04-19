import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { registerValidationSchema } from '../../utils/validation';
import { getErrorMessage, getCountryCodes } from '../../utils/helpers';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Layout from '../../components/Layout';

const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');
  
  // Get country codes once using useMemo to avoid unnecessary recalculations
  const countryCodes = useMemo(() => getCountryCodes(), []);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      phoneNumber: '',
      email: '',
      password: '',
    }
  });

  // Handle phone number input change
  const handlePhoneChange = (e) => {
    setPhoneWithoutCode(e.target.value);
    // Construct full phone number with country code
    const fullPhoneNumber = `${countryCode}${e.target.value}`;
    // Update the form value
    register('phoneNumber').onChange({
      target: { name: 'phoneNumber', value: fullPhoneNumber }
    });
  };

  // Handle country code change
  const handleCountryCodeChange = (e) => {
    const newCountryCode = e.target.value;
    setCountryCode(newCountryCode);
    
    // Update the full phone number with new country code
    const fullPhoneNumber = `${newCountryCode}${phoneWithoutCode}`;
    register('phoneNumber').onChange({
      target: { name: 'phoneNumber', value: fullPhoneNumber }
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Make sure phoneNumber includes the country code
      const phoneNumber = `${countryCode}${phoneWithoutCode}`;
      const submitData = {
        ...data,
        phoneNumber
      };
      
      await registerUser(submitData);
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-2 text-gray-600">Join GroundPlay to find and organize sports games</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                {...register('name', registerValidationSchema.name)}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="flex">
                <select
                  className="input-field rounded-r-none w-24 pr-1 flex-shrink-0"
                  value={countryCode}
                  onChange={handleCountryCodeChange}
                >
                  {countryCodes.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.code}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  id="phoneNumber"
                  placeholder="1234567890"
                  className={`input-field rounded-l-none w-full ${errors.phoneNumber ? 'border-red-500' : ''}`}
                  onChange={handlePhoneChange}
                  value={phoneWithoutCode}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email (optional)
              </label>
              <input
                type="email"
                id="email"
                placeholder="john@example.com"
                className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                {...register('email', registerValidationSchema.email)}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', registerValidationSchema.password)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Must be at least 8 characters long
              </p>
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              disabled={loading}
              fullWidth
            >
              Sign Up
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;