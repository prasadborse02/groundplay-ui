import { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { loginValidationSchema } from '../../utils/validation';
import { getErrorMessage, getCountryCodes } from '../../utils/helpers';
import Button from '../../components/Button';
import Alert from '../../components/Alert';
import Layout from '../../components/Layout';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneWithoutCode, setPhoneWithoutCode] = useState('');
  
  // Get country codes once using useMemo to avoid unnecessary recalculations
  const countryCodes = useMemo(() => getCountryCodes(), []);

  const from = location.state?.from?.pathname || '/';

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      phoneNumber: '',
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
      
      await login(submitData);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-gray-600">Sign in to your GroundPlay account</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                {...register('password', loginValidationSchema.password)}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              loading={loading} 
              disabled={loading}
              fullWidth
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;