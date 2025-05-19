import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../../hooks/useAuthStore";
import { useGoogleLogin } from "@react-oauth/google";

export default function AuthenticationPage() {
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const loginParam = params.get("login");
    const registerParam = params.get("register");

    if (registerParam === "true") {
      setIsLogin(false);
    } else if (loginParam === "true" || (!loginParam && !registerParam)) {
      setIsLogin(true);
    }
  }, []);

  const toggleView = () => {
    const newState = !isLogin;
    const params = new URLSearchParams(window.location.search);

    if (newState) {
      params.set("login", "true");
      params.delete("register");
    } else {
      params.set("register", "true");
      params.delete("login");
    }

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
    setIsLogin(newState);
  };

  return (
    <div className="font-[Poppins] flex w-full md:w-[96%] mb-2 mt-8 lg:w-[90%] min-h-[93%] md:min-h-[87%] m-auto gap-8 overflow-hidden rounded-lg relative">
      <AnimatePresence mode="wait">
        {isLogin ? (
          <>
            <motion.div
              key="login-form"
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              exit={{ x: -1000 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="font-[Poppins] w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white"
            >
              <LoginForm onToggle={toggleView} />
            </motion.div>
            <motion.div
              key="login-image"
              initial={{ x: 1000 }}
              animate={{ x: 0 }}
              exit={{ x: 1000 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="font-[Poppins] hidden lg:flex lg:w-1/2 items-center justify-center"
            >
              <img
                src="/authentication.png"
                alt="house illustration"
                className="font-[Poppins] w-full h-auto object-cover"
              />
            </motion.div>
          </>
        ) : (
          <>
            <motion.div
              key="register-image"
              initial={{ x: -1000 }}
              animate={{ x: 0 }}
              exit={{ x: -1000 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="font-[Poppins] hidden lg:flex items-center justify-center lg:w-1/2"
            >
              <img
                src="/authentication.png"
                alt="house illustration"
                className="font-[Poppins] w-full h-auto object-cover"
              />
            </motion.div>
            <motion.div
              key="register-form"
              initial={{ x: 1000 }}
              animate={{ x: 0 }}
              exit={{ x: 1000 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="font-[Poppins] w-full lg:w-1/2 p-8 lg:p-12 flex items-center justify-center bg-white"
            >
              <RegisterForm onToggle={toggleView} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoginForm({ onToggle }: { onToggle: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(email, password);
      if (!success) {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");

      try {

        const success = await googleLogin(tokenResponse.access_token);
        if (!success) {
          setError("Google login failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <div className="font-[Poppins] max-w-md w-full">
      <div className="font-[Poppins] form-container">
        <h2 className="font-[Poppins] text-center text-2xl font-semibold mb-2">WELCOME BACK</h2>
        <p className="font-[Poppins] text-gray-600 text-center mb-6">Welcome back! Please enter your details.</p>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form className="font-[Poppins] space-y-2" onSubmit={handleSubmit}>
          <div>
            <label className="font-medium font-[Poppins] block text-md mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div>
            <label className="font-medium font-[Poppins] block text-md mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>

          <div className="font-[Poppins] flex items-center justify-between py-2">
            <div className="font-[Poppins] checkbox-container">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember Me</label>
            </div>

            <button type="button" className="font-[Poppins] text-sm text-amber-700 hover:text-amber-800">
              Forgot password
            </button>
          </div>

          <button
            type="submit"
            className="font-[Poppins] btn-auth w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <button
            type="button"
            className="font-[Poppins] btn-google w-full"
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
          >
            <img
              src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
              alt="Google"
              className="font-[Poppins] w-5 h-5"
            />
            Sign in with Google
          </button>

          <p className="font-[Poppins] text-center text-sm mt-6">
            Don't have an account?{" "}
            <button type="button" onClick={onToggle} className="font-[Poppins] text-amber-700 ml-2 hover:text-amber-800 font-medium">
              Sign up for free!
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function RegisterForm({ onToggle }: { onToggle: () => void }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register, googleRegister } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const name = `${firstName} ${lastName}`;
      const success = await register(name, email, password, "client");

      if (success) {
        console.log("User registered successfully!");
        onToggle();
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError("");

      try {
        
        const success = await googleRegister(tokenResponse.access_token, "client");
        if (!success) {
          setError("Google registration failed. Please try again.");
        }
      } catch (err) {
        setError("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError("Google registration failed. Please try again.");
    },
  });

  return (
    <div className="font-[Poppins] max-w-md w-full px-4 py-8">
      <div className="font-[Poppins] text-center mb-8">
        <h2 className="font-[Poppins] text-2xl font-bold mb-2">WELCOME</h2>
      </div>

      <form className="font-[Poppins] space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="font-[Poppins] block text-md font-medium text-gray-700 mb-1">First Name</label>
          <input
            type="text"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="font-[Poppins] block text-md font-medium text-gray-700 mb-1">Last Name</label>
          <input
            type="text"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="font-[Poppins] block text-md font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        <div>
          <label className="font-[Poppins] block text-md font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className="font-[Poppins] btn-auth w-full"
          disabled={isLoading}
        >
          {isLoading ? "Signing up..." : "Sign up"}
        </button>

        <button
          type="button"
          className="font-[Poppins] w-full mt-2 bg-white hover:bg-gray-50 text-gray-800 font-medium py-2 px-4 rounded-md border border-gray-300 flex items-center justify-center gap-2 transition duration-200"
          onClick={()=>handleGoogleRegister()}
          disabled={isLoading}
        >
          <img
            src="https://lh3.googleusercontent.com/COxitqgJr1sJnIDe8-jiKhxDx1FrYbtRHKJ9z_hELisAlapwE9LUPh6fcXIfb5vwpbMl4xl9H9TRFPc5NOO8Sb3VSgIBrfRYvW6cUA"
            alt="Google"
            className="font-[Poppins] w-5 h-5"
          />
          Sign up with Google
        </button>

        <p className="font-[Poppins] text-center text-sm mt-4">
          You have an account?{" "}
          <button
            type="button"
            onClick={onToggle}
            className="font-[Poppins] text-amber-600 ml-1 hover:text-amber-700 font-medium"
          >
            Sign in!
          </button>
        </p>
      </form>
    </div>
  );
}