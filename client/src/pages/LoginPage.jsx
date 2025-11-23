import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { logIn, googleSignIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    setLoading(true);
    
    try {
      await logIn(formData.email, formData.password);
      navigate('/feed');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      navigate('/feed');
    } catch (error) {
      console.error('Google login error:', error);
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
            <div className="flex justify-center lg:justify-start">
              <img src="/assets/images/login.png" alt="Login" className="max-w-full h-auto lg:max-w-[633px]" />
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-4/12 px-4">
            <div className="bg-white p-12 rounded-md shadow-sm">
              <div className="mb-7 text-center">
                <img src="/assets/images/logo.svg" alt="Logo" className="mx-auto max-w-[161px]" />
              </div>
              <p className="text-[#2D3748] text-center mb-2 text-base">Welcome back</p>
              <h4 className="text-[28px] font-medium text-center mb-[50px] text-[#312000]">Login to your account</h4>
              
              <button 
                type="button" 
                onClick={handleGoogleLogin}
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

                <div className="flex flex-wrap items-center justify-between mb-10 mt-4">
                  <div className="form-control">
                    <label className="label cursor-pointer justify-start gap-2 p-0">
                      <input type="radio" name="radio-10" className="radio checked:bg-[#1890FF] w-4 h-4 border-[#1890FF]" defaultChecked />
                      <span className="label-text text-[#2D3748] text-sm">Remember me</span>
                    </label>
                  </div>
                  <a href="#" className="text-[#1890FF] text-sm hover:underline">Forgot password?</a>
                </div>

                <div className="mb-[60px]">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-[#1890FF] text-white font-medium text-base py-3 rounded-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Logging in...' : 'Login now'}
                  </button>
                </div>
              </form>

              <div className="text-center">
                <p className="text-sm text-[#767676]">
                  Dont have an account? <Link to="/register" className="text-[#1890FF] hover:underline">Create New Account</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
