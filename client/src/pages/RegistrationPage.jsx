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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                      className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white text-[#2D3748] focus:outline-none focus:border-[#1890FF] transition-colors"
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
                      className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white text-[#2D3748] focus:outline-none focus:border-[#1890FF] transition-colors"
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
                    className="w-full h-[48px] px-4 border border-[#E8E8E8] rounded-md bg-white text-[#2D3748] focus:outline-none focus:border-[#1890FF] transition-colors"
                  />
                </div>
                <div className="mb-[14px]">
                  <label className="block text-[#4A5568] font-medium text-base mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-4 pr-12 border border-[#E8E8E8] rounded-md bg-white text-[#2D3748] focus:outline-none focus:border-[#1890FF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767676] hover:text-[#2D3748] transition-colors"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="mb-[14px]">
                  <label className="block text-[#4A5568] font-medium text-base mb-2">Repeat Password</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="w-full h-[48px] px-4 pr-12 border border-[#E8E8E8] rounded-md bg-white text-[#2D3748] focus:outline-none focus:border-[#1890FF] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#767676] hover:text-[#2D3748] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between mb-10 mt-4">
                  <div className="form-control w-full">
                    <label className="label cursor-pointer justify-start gap-2 p-0">
                      <input 
                        type="checkbox" 
                        name="agreeToTerms" 
                        required 
                        className="w-4 h-4 accent-[#1890FF] cursor-pointer border border-[#E8E8E8] rounded"
                      />
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
