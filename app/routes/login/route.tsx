import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "~/features/auth/redux";
import { authService } from "~/features/auth/service";
import { mlService } from "~/features/marketplace/ml/service";
import type { RootState } from "~/store/root-reducer";
export default function Login() {
  const [email, setEmail] = useState("teste@gmail.com");
  const [password, setPassword] = useState("123456Ab!");
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const handleLogout = async () => {
    dispatch(logout());
  };
  const handleLogin = async () => {
    const response = await authService.login(email, password);
    if (response.success) {
      dispatch(login(response.data));
    }
  };

  return (
    <>
      <h1>Login</h1>
      <p>User: {user?.name}</p>
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="flex gap-2">
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <button onClick={() => mlService.getIntegrationData()}>
        Get Integration Data
      </button>
    </>
  );
}
