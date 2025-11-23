import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const RegistrationPage = () => {
  const navigate = useNavigate();
  const { createUser, googleSignIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    setLoading(true);
    
    try {
      await createUser(formData.firstName, formData.lastName, formData.email, formData.password);
      navigate('/feed');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await googleSignIn();
      navigate('/feed');
    } catch (error) {
      console.error('Google signup error:', error);
    }
  };

  return (
    <section className="relative min-h-screen bg-[#F0F2F5] py-[100px] overflow-hidden flex items-center justify-center">
      {/* Shapes */}
      <div className="absolute top-0 left-0 -z-10">
        <img src="/assets/images/shape1.svg" alt="" />
        <img src="/assets/images/dark_shape.svg" alt="" className="hidden" />
      </div>
      <div className="absolute top-0 right-[20px] -z-10">
        <img src="/assets/images/shape2.svg" alt="" />
        <img src="/assets/images/dark_shape1.svg" alt="" className="hidden" />
      </div>
      <div className="absolute bottom-0 right-[327px] -z-10">
        <img src="/assets/images/shape3.svg" alt="" />
        <img src="/assets/images/dark_shape2.svg" alt="" className="hidden" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          {/* Left Side Image */}
          <div className="w-full lg:w-8/12 px-4 mb-10 lg:mb-0">
            <div className="flex justify-center lg:justify-start relative">
              <img src="/assets/images/registration.png" alt="Registration" className="max-w-full h-auto" />
              <img src="/assets/images/registration1.png" alt="Registration Dark" className="hidden absolute top-0 left-0" />
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="bg-white p-12 rounded-md shadow-sm">
              <div className="mb-7 text-center">
                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto max-w-[161px]" />
              </div>
              <p className="text-[#2D3748] text-center mb-2 text-base">Get Started Now</p>
              <h4 className="text-[28px] font-medium text-center mb-[50px] text-[#312000]">Registration</h4>
              
              <button 
                type="button" 
                onClick={handleGoogleSignup}
                className="w-full border border-[#F0F2F5] bg-white rounded-md py-3 flex items-center justify-center mb-10 hover:shadow-lg transition-all duration-300"
              >
                <img src="/assets/images/google.svg" alt="Google" className="mr-2 w-5" />
                <span className="font-medium text-base text-[#312000]">Or sign-in with google</span>
              </button>

              <div className="relative text-center mb-10">
                <div className="absolute left-0 bottom-[11px] w-[108px] h-[2px] border-t border-[#DFDFDF] rounded-md"></div>
                <span className="text-[#C4C4C4] text-sm bg-white px-2">Or</span>
                <div className="absolute right-0 bottom-[11px] w-[108px] h-[2px] border-t border-[#DFDFDF] rounded-md"></div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-[14px]">
                  <div className="w-1/2">
                    <label className="block text-[#4A5568] font-medium text-base mb-2">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white focus:outline-none focus:border-[#1890FF] transition-colors"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-[#4A5568] font-medium text-base mb-2">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white focus:outline-none focus:border-[#1890FF] transition-colors"
                    />
                  </div>
                </div>
                <div className="mb-[14px]">
                  <label className="block text-[#4A5568] font-medium text-base mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white focus:outline-none focus:border-[#1890FF] transition-colors"
                  />
                </div>
                <div className="mb-[14px]">
                  <label className="block text-[#4A5568] font-medium text-base mb-2">Password</label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white focus:outline-none focus:border-[#1890FF] transition-colors"
                  />
                </div>
                <div className="mb-[14px]">
                  <label className="block text-[#4A5568] font-medium text-base mb-2">Repeat Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white focus:outline-none focus:border-[#1890FF] transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between mb-10 mt-4">
                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-2 p-0">
                      <input type="checkbox" required className="checkbox checkbox-primary w-4 h-4" />
                      <span className="label-text text-[#2D3748] text-sm">I agree to terms & conditions</span>
                    </label>
                  </div>
                </div>

                <div className="mb-[60px]">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#1890FF] text-white font-medium text-base py-3 rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registering...' : 'Register now'}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-sm text-[#767676]">
                  Already have an account? <Link to="/login" className="text-[#1890FF] hover:underline">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationPage;
