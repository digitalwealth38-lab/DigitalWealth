import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function verifyemail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (!token || !email) return;
    
    axios.get(`${process.env.REACT_APP_API}/auth/verify-email?token=${token}&email=${email}`)
      .then(res => {
        toast.success(res.data.message);
        navigate("/login");
      })
      .catch(err => {
        toast.error(err.response?.data?.message || "Verification failed");
      });
  }, []);

  return <div className="min-h-screen flex items-center justify-center">Verifying...</div>;
}
